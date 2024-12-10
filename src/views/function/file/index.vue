<script setup lang="tsx">
import { ref, h, onMounted, watch } from 'vue';
import { NButton, NPopover, NProgress, NTag, NText } from 'naive-ui';
import { fetchCreateFile, fetchDeleteFile, fetchFilesList, fetchPlat, fetchUserInfo, putReport } from '@/service/api';
import { useAppStore } from '@/store/modules/app';
import { useTable } from '@/hooks/common/table';
import { $t } from "@/locales";
import { ipList, orderStatus, tagsList, translatePlatList } from "@/utils/common";

const cityList = ref(["重庆", "安徽", "福建", "广东", "广西", "河北", "河南", "湖北", "湖南", "海南", "黑龙江", "江苏", "江西", "辽宁", "山东", "四川", "陕西", "浙江", "上海", "内蒙古", "北京"])

const rawData = ref({})
const appStore = useAppStore();
const type = ref("-1")
const active = ref(false)
const raw = ref({})
const config = ref({})
const {columns, data, loading, pagination, getData} = useTable<
  Api.SystemManage.Log,
  typeof fetchFilesList,
  'index' | 'operate'
>({
  apiFn: fetchFilesList,
  apiParams: {
    pageNo: 1,
    pageSize: 10,
    type: type,
  },
  transformer: res => {
    const {records = [], current = 1, size = 10, total = 0} = res.data || {};
    return {
      data: records,
      pageNum: current,
      pageSize: size,
      total
    };
  },
  columns: () => [
    {
      key: 'status',
      title: '状态',
      align: 'center',
      width: 70,
      render(row) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {tag, label} = getStatusTypeByStatus(row.status);
        return h(
          NTag,
          {
            style: {
              marginRight: '6px'
            },
            type: tag,
            bordered: false
          },
          {
            default: () => label
          }
        );
      }
    },
    {
      key: 'act',
      title: '类型',
      align: 'center',
      width: 70
    },
    {
      key: 'file',
      title: '源文件',
      align: 'center',
      width: 230,
      render: row => {
        if (row.file) {
          const file = row.file

          const end = file.split('/').pop() //把后缀找到

          const url = 'http://' + location.host + '/api/file/get?name=' + row.file.replace('face/', '').replace(end, encodeURIComponent(end))
          return <n-button
            text
            tag="a"
            href={url}
            target="_blank"
            type="primary">
            {end}
          </n-button>
        }
      }
    },
    {
      key: 'config',
      title: '配置信息',
      align: 'center',
      width: 200
    },
    {
      key: 'finish',
      title: "进度",
      width: 90,
      render: row => {
        const percentage = row.progress
        return h(
          NProgress,
          {
            style: {
              // width:'130px'
              // marginRight: '6px'
            },
            bordered: false,
            type: 'line',
            indicatorPlacement: 'inside',
            processing: percentage < 100,
            percentage
          }
        );
      },
      align: 'center'
    },
    {
      key: 'result',
      title: '产出物',
      align: 'center',
      width: 260,
      render: row => {
        try {
          const file = row.result

          return JSON.parse(row.result).map(i => {
            const end = i.split('/').pop() //把后缀找到
            const url = 'http://' + location.host + '/api/file/get?name=' +i.replace('face/', '').replace(end, encodeURIComponent(end))
            return <n-button
              text
              tag="a"
              href={url}
              target="_blank"
              type="primary">
              {end}
            </n-button>
          })
        } catch (e) {
          return row.result
        }
      }
    },
    {
      key: 'tip',
      title: '提示',
      align: 'center',
      width: 200
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 180,
      render: row => {
        if (row.act === '查课' && row.status === 1) {
          return <div class="flex-center gap-8px">
            <NPopconfirm v-if="false" onPositiveClick={() => handleSubmit(row)}>
              {{
                default: () => '确定要将产出物直接下单吗',
                trigger: () => (
                  <NButton v-if="row.type===1" type="warning" ghost size="small">
                    下单
                  </NButton>
                )
              }}
            </NPopconfirm>
            <NButton type="error" ghost size="small" onClick={() => deleteFile(row.id)}>
              删除
            </NButton>
          </div>
        } else {
          return <NButton type="error" ghost size="small" onClick={() => deleteFile(row.id)}>
            删除
          </NButton>
        }
      }
    }
  ]
})

function getStatusTypeByStatus(status) {
  for (const i of orderStatus) {
    if (i.value === status) {
      return i;
    }
  }
  return {
    label: '未知',
    tag: 'warning'
  };
}

const platList = ref([])

const act = ref([{label: "查课", value: "查课"}, {label: "下单", value: "下单"}])
const tagList = ref([])
onMounted(async () => {
  const data = await fetchPlat()
  const res = await fetchUserInfo()
  try {
    tagList.value = JSON.parse(res.data.tags)
  } catch (e) {

  }

  platList.value = data.data
})

function handleFinish(obj) {
  rawData.value.file = obj.event.target.response
}

//将产出物品直接下单
const handleSubmit = async (row) => {
  const rowData = {
    act: '下单',
    config: row.config,
    file: JSON.parse(row.result)[0]
  }
  await fetchCreateFile(rowData)
  window.$message?.success('下单成功');
  await getData()
}
const update = (val, idx) => {
  getData()
}

const deleteFile = (id) => {
  fetchDeleteFile(id).then(res => {
    if (res.data) {
      window.$message?.success('删除成功');
      getData()
    } else {
      window.$message?.error('删除失败');
    }
  })
}

const platValue = ref(null)
const remarksList = ref([])

watch(platValue, newValue => {
  if (newValue) {
    remarksList.value = platList.value.find(i => i.plat === newValue).remarks || []
  }
});

const checkedRowKeys = ref<string[]>([]);

const handleOpenDrawer = (row) => {
  active.value = true
  raw.value = row
}

const submit = async () => {
  if (!rawData.value.file){
    window.$message?.success('文件未上传成功,请重新上传');
  }
  config.value['平台_编号'] = platValue.value
  rawData.value.config = JSON.stringify(config.value)
  await fetchCreateFile(rawData.value)
  active.value = false
  window.$message?.success('操作成功');
  await getData()
}
</script>

<template>
  <div class="flex-vertical-stretch gap-16px overflow-hidden <sm:overflow-auto">
    <NCard title="任务队列" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
      <template #header-extra>
        <NSpace wrap justify="end" class="<sm:w-200px">
          <NButton size="small" @click="getData">
            <template #icon>
              <icon-mdi-refresh class="text-icon" :class="{ 'animate-spin': loading }" />
            </template>
            刷新
          </NButton>
          <NButton size="small" ghost type="primary" @click="active = true">
            新增任务
          </NButton>
        </NSpace>
      </template>
      <NDataTable
        remote
        v-model:checked-row-keys="checkedRowKeys"
        :columns="columns"
        :data="data"
        size="small"
        :flex-height="!appStore.isMobile"
        :scroll-x="640"
        :loading="loading"
        :pagination="pagination"
        :row-key="item => item.id"
        class="sm:h-full"/>
    </NCard>
    <n-drawer v-model:show="active" :width="380">
      <NDrawerContent title="新增任务" :native-scrollbar="false" closable>
        <n-card>
          <n-form-item label="操作">
            <NSelect
              v-model:value="rawData.act"
              placeholder="请选择"
              :options="act"
              clearable
              :filterable="true"/>
          </n-form-item>
          <n-form-item label="平台">
            <NSelect
              label="选择平台"
              v-model:value="platValue"
              placeholder="请选择平台"
              :options="translatePlatList(platList)"
              clearable
              :filterable="true"/>
          </n-form-item>

          <n-form-item label="标记订单">
            <n-select
              v-model:value="config['平台_标签']"
              default-expand-all="true"
              :options="tagsList(tagList)"
              placeholder="如有需要请选择标记"
              :filterable="true"
              clearable
            />
          </n-form-item>
          <n-form-item label="代理IP">
            <n-select
              v-model:value="config['平台_代理IP']"
              default-expand-all="true"
              :options="ipList(cityList)"
              placeholder="如有需要请选择归属地"
              clearable
            />
          </n-form-item>

          <n-form-item label="备注">
            <n-select
              v-model:value="config['备注']"
              default-expand-all="true"
              :options="tagsList(remarksList)"
              placeholder="如有需要请备注"
              clearable
            />
          </n-form-item>

          <n-form-item label="文件">
            <n-upload
              multiple
              directory-dnd
              action="/api/file?parentDir=face"
              @finish="handleFinish"
            >
              <n-upload-dragger>
                <n-text style="font-size: 16px">
                  点击或者拖动文件到该区域
                </n-text>
                <n-p depth="3" style="margin: 8px 0 0 0">
                  文件格式仅支持xlsx
                </n-p>
              </n-upload-dragger>
            </n-upload>
          </n-form-item>
          <n-form-item label="注意">
            <div>
              列的顺序或者有冗余列都不会影响程序的运行，你拿到你的文件之后，只需要更改成正确的表头，程序就会自动读取相关信息
              查课读取:学校(可选),账号,密码；下单读取:学校(可选),账号,密码,课程,结果
            </div>
          </n-form-item>
          <n-form-item label="例子">
            <n-image
              width="100"
              src="/table.png"
            />
          </n-form-item>
        </n-card>


        <template #footer>
          <NSpace :size="16">
            <NButton @click="active = false">{{ $t('common.cancel') }}</NButton>
            <NButton type="primary" @click="submit">提交</NButton>
          </NSpace>
        </template>
      </NDrawerContent>
    </n-drawer>
  </div>
</template>

<style scoped></style>
