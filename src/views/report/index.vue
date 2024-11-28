<script setup lang="tsx">
import { ref } from 'vue';
import { NButton, NTag } from 'naive-ui';
import { avtTime, fetchDeleteReport, fetchReportList, putReport } from '@/service/api';
import { useAppStore } from '@/store/modules/app';
import { useTable } from '@/hooks/common/table';
import { $t } from "@/locales";

const appStore = useAppStore();
const type = ref("-1")
const active = ref(false)
const raw = ref({})
const {columns, data, loading, pagination, getData} = useTable<
  Api.SystemManage.Log,
  typeof fetchReportList,
  'index' | 'operate'
>({
  apiFn: fetchReportList,
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
      render: row => {
        if (row.status === 1) {
          return <NTag type="success">处理完成</NTag>
        } else if (row.status === 0) {
          return <NTag type="default">待处理</NTag>
        } else if (row.status === 3) {
          return <NTag type="warning">暂时搁置</NTag>
        }else if (row.status === 4) {
          return <NTag type="info">处理中</NTag>
        }
      }
    },
    {
      key: 'orderInfo',
      title: '订单信息',
      align: 'center',
      width: 300,
    },
    {
      key: 'question',
      title: '问题详情',
      align: 'center',
      width: 250,
    },
    {
      key: 'answer',
      title: '处理答复',
      align: 'center',
      width: 250,
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 180,
      render: row => (
        <div class="flex-center gap-8px">
          <NButton type="primary" ghost size="small" onClick={() => handleOpenDrawer(row)}>
            处理
          </NButton>
          <NButton type="error" ghost size="small" onClick={() => deleteReport(row.id)}>
            删除
          </NButton>
        </div>
      )
    }
  ]
})


const update = (val, idx) => {
  getData()
}

const deleteReport = (id)=>{
  fetchDeleteReport(id).then(res=>{
    if (res.data){
      window.$message?.success('删除成功');
      getData()
    }else {
      window.$message?.error('删除失败');
    }
  })
}
const useTime = ref(0)
avtTime().then(res=>{
  function secToTime(alltime) {
    var hh = parseInt(alltime / 3600);
    if (hh < 10) hh = "0" + hh;
    var mm = parseInt((alltime - parseInt(hh) * 3600) / 60);
    if (mm < 10) mm = "0" + mm;
    var ss = parseInt((alltime - parseInt(hh) * 3600) % 60);
    if (ss < 10) ss = "0" + ss;
    var alltm = hh + ":" + mm + ":" + ss;
    return alltm
  }
   useTime.value = secToTime(res.data)
})

const checkedRowKeys = ref<string[]>([]);

const handleOpenDrawer = (row)=>{
  active.value = true
  raw.value = row
}

const submit =  async ()=>{
  await putReport(raw.value)
  active.value = false
  window.$message?.success('处理成功');
}
</script>

<template>
  <div class="flex-vertical-stretch gap-16px overflow-hidden <sm:overflow-auto">
    <n-radio-group
      @change="update"
      v-model:value="type"
      name="left-size"
      style="margin-bottom: 12px">
      <n-radio-button value="-1">
        全部
      </n-radio-button>
      <n-radio-button value="0">
        待处理
      </n-radio-button>
      <n-radio-button value="4">
        处理中
      </n-radio-button>
      <n-radio-button value="3">
        暂时搁置
      </n-radio-button>
      <n-radio-button value="1">
        处理完成
      </n-radio-button>
    </n-radio-group>
    <NCard title="问题列表" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
      <template #header-extra>
        <p style="color: red">平均响应时间 {{useTime}}</p>
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
        class="sm:h-full"
      />
    </NCard>
    <n-drawer v-model:show="active" :width="380">
      <NDrawerContent title="处理问题" :native-scrollbar="false" closable>
        <n-card>
          <NForm ref="formRef" :model="row">
            <NFormItem label="订单ID" path="ID">
              <NInput v-model:value="raw.orderId" disabled />
            </NFormItem>
            <NFormItem label="问题" >
              <n-input
                v-model:value="raw.question"
                type="textarea"
                disabled
              />
            </NFormItem>
            <NFormItem label="回复" >
              <n-input
                v-model:value="raw.answer"
                type="textarea"
              />
            </NFormItem>

            <NFormItem label="状态" >
              <n-radio-group v-model:value="raw.status" name="radiogroup">
                <n-space>
                  <n-radio key="1" :value="1" label="处理完成"/>
                  <n-radio key="0" :value="0" label="待处理"/>
                  <n-radio key="3" :value="3" label="暂时搁置"/>
                  <n-radio key="4" :value="4" label="处理中"/>
                </n-space>
              </n-radio-group>
            </NFormItem>
          </NForm>
        </n-card>
        <template #footer>
          <NSpace :size="16">
            <NButton @click="active = false">{{ $t('common.cancel') }}</NButton>
            <NButton type="primary" @click="submit">解决</NButton>
          </NSpace>
        </template>
      </NDrawerContent>
    </n-drawer>
  </div>
</template>

<style scoped></style>
