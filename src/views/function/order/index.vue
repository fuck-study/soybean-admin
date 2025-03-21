<script setup lang="tsx">
import {h, nextTick, onMounted, ref} from 'vue';
import {NButton, NPopconfirm, NTag, NProgress} from 'naive-ui';
import {useBoolean} from '@sa/hooks';
import {
  delOrder,
  editOrder,
  fetchEnableLogPlats,
  fetchPlat,
  fetchPostExportOrder,
  fetchPostOrder,
  fetchUserInfo
} from '@/service/api';
import {useAppStore} from '@/store/modules/app';
import {useTable} from '@/hooks/common/table';
import {$t} from '@/locales';
// import { enableStatusRecord } from '@/constants/business';
import RoleOperateDrawer, {type OperateType} from './modules/order-operate-drawer.vue';

import OrderSearch from './modules/order-search.vue';
import {orderStatus} from "@/utils/common";
import axios from "axios";

const appStore = useAppStore();
const {bool: drawerVisible, setTrue: openDrawer} = useBoolean()
const platList = ref([])
const tags = ref([])

const EnableLogPlats = ref([])
onMounted(async () => {
  const data = await fetchPlat()
  EnableLogPlats.value = (await fetchEnableLogPlats()).data
  const res = await fetchUserInfo()
  try {
    tags.value = JSON.parse(res.data.tags)
  } catch (e) {

  }

  platList.value = data.data
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

function downloadFile() {
  fetchPostExportOrder(searchParams).then(response => {
    // 创建URL并触发下载
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', '导出订单数据.xlsx');
    document.body.appendChild(link);
    link.click();
    // 清理URL对象
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
  })
    .catch(error => {
      console.error('Error downloading file:', error);
    });
}

const {columns, filteredColumns, data, loading, pagination, getData, searchParams, resetSearchParams} = useTable<
  Api.SystemManage.Order,
  typeof fetchPostOrder,
  'index' | 'operate'
>({
  apiFn: fetchPostOrder,
  apiParams: {
    // if you want to use the searchParams in Form, you need to define the following properties, and the value is null
    // the value can not be undefined, otherwise the property in Form will not be reactive
    plat: null,
    status: null,
    username: null,
    nickname: null,
    password: null,
    name: null,
    school: null,
    courseName: null,
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
      type: 'selection',
      align: 'center',
      width: 30
    },

    {
      key: 'plat',
      title: "平台",
      render: row => {
        for (const item of platList.value) {
          if (item.plat === row.plat) {
            return <NTag type="info">{item.name}</NTag>
          }
        }
      },
      width: 150,
      align: 'center'
    },
    {
      key: 'order',
      title: "科目",
      render: row => {
        return (<span>{row.courseName}</span>)
      },
      width: 220,
      align: 'center'
    },
    {
      key: 'content',
      title: "账号信息",
      render: row => {
        return (
          <p>{row.realName + " " + row.school + ' ' + row.username + ' ' + row.password}</p>
        );
      },
      width: 270,
      align: 'center'
    },
    {
      title: '状态',
      key: 'status',
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
      key: 'result',
      title: "结果",
      render: row => {
        if (row.status === -2) {// 已知异常直接展示出来异常原因
          return (
            <p style="color:red">{row.result}</p>
          )
        }
        //没有明确的totalScore
        if (!row.totalScore) {
          return (
            <p>{row.result}</p>
          )
        }

        //如果有明确的score，那么在上方显示
        const style = {
          color: 'rgba(0, 128, 0, 0.7)',
          fontSize: 'smaller',
          fontWeight: 'bold'
        };
        return (
          <div>
            <div style={style}>{row.totalScore}</div>
            <div>{row.result}</div>
          </div>
        )
      },
      width: 430,
      align: 'center'
    },
    {
      key: 'finish',
      title: "进度",
      width: 90,

      render: row => {
        let status = 'info';
        let percentage = Math.min(Math.round((row.finish / row.total) * 100), 100);
        percentage = isNaN(percentage) ? 0 : percentage;
        if (percentage === 100) {
          status = 'success';
        }
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
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 220,
      render: row => (
        <div class="flex-center gap-8px">
          <NButton type="primary" ghost size="small" onClick={() => handleOpenDrawer(row, 'edit')}>
            详情
          </NButton>

          {EnableLogPlats.value.includes(row.plat) && ( // 这里可以根据条件动态渲染，例如：someCondition && (
            <NButton v-show="console.log(EnableLogPlats.includes(row.plat))" type="success"  ghost size="small" onClick={() => openLog(row.uuid)}>
              日志
            </NButton>
          )}

          <NButton type="warning" ghost size="small" onClick={() => handleOpenDrawer(row, 'report')}>
            反馈
          </NButton>

          <NPopconfirm onPositiveClick={() => handleDelete(row.uuid)}>
            {{
              default: () => $t('common.confirmDelete'),
              trigger: () => (
                <NButton type="error" ghost size="small">
                  删除
                </NButton>
              )
            }}
          </NPopconfirm>
        </div>
      )
    },
    {
      key: 'updatedAt',
      title: "更新时间",
      render: row => {
        return row.updatedAt
      },
      width: 180,
      align: 'center'
    },

    {
      key: 'createdAt',
      title: "创建时间",
      render: row => {
        return row.createdAt
      },
      width: 180,
      align: 'center'
    },
    {
      key: 'tag',
      title: "归属标记",
      render: row => {
        return row.tag
      },
      width: 150,
      align: 'center'
    },
    {
      key: 'remarks',
      title: "备注",
      render: row => {
        return row.remarks
      },
      width: 200,
      align: 'center'
    },
    {
      key: 'face',
      title: "人脸视频",
      render: row => {
        return row.face ? row.face.split('/').pop() : ''
      },
      width: 200,
      align: 'center'
    },
    {
      key: 'ip',
      title: "代理IP",
      render: row => {
        return row.city
      },
      width: 90,
      align: 'center'
    },


    {
      key: 'examStartTime',
      title: "开考时间",
      render: row => {
        return row.examStartTime
      },
      width: 180,
      align: 'center'
    },
    {
      key: 'examEndTime',
      title: "结考时间",
      render: row => {
        return row.examEndTime
      },
      width: 180,
      align: 'center'
    },


    {
      key: 'courseStartTime',
      title: "开课时间",
      render: row => {
        return row.courseStartTime
      },
      width: 180,
      align: 'center'
    },
    {
      key: 'courseEndTime',
      title: "结课时间",
      render: row => {
        return row.courseEndTime
      },
      width: 180,
      align: 'center'
    }
  ]
});

const operateType = ref<OperateType>('add');

const checkedRowKeys = ref<string[]>([]);

async function handleBatchEdit() {
  await editOrder(checkedRowKeys.value)
  window.$message?.success('补单成功');
  checkedRowKeys.value = [];
  getData();
}

async function handleBatchRemark() {
  operateType.value = 'BatchRemark';
  editingData.value = checkedRowKeys.value
  openDrawer();
}

async function logshow(show) {
  if (!show) {
    evRef.value.close()
    active.value = false
  } else {
    active.value = true
  }
}

const evRef = ref(null)
const openLog = (uuid) => {
  active.value = true

  logRef.value = []
  evRef.value = new EventSource("/api/sse?id=" + uuid)
  evRef.value.onmessage = function (event) {
    if (!event.data) {
      return
    }

    if (String(event.data).includes('level=INFO')) {
      logRef.value.push({
        level: 'info',
        message: event.data.replace(/\[\d\dm/, '').replace(/\[39m$/, '')
      })
    } else if (String(event.data).includes('level=DEBUG')) {
      logRef.value.push({
        level: 'debug',
        message: event.data.replace(/\[\d\dm/, '').replace(/\[39m$/, '')
      })
    } else if (String(event.data).includes('level=WARN')) {
      logRef.value.push({
        level: 'warn',
        message: event.data.replace(/\[\d\dm/, '').replace(/\[39m$/, '')
      })
    } else if (String(event.data).includes('level=ERROR')) {
      logRef.value.push({
        level: 'error',
        message: event.data.replace(/\[\d\dm/, '').replace(/\[39m$/, '')
      })
    }
    _jumpToBottom()
  }
}

const _jumpToBottom = () => {
  if (!autoJump.value) {
    return
  }
  nextTick(() => {
    let box = terminalWindowRef.value
    if (box != null) {
      document.getElementsByClassName('n-drawer-body-content-wrapper')[0].scrollTo({
        top: box.scrollHeight,
        behavior: 'smooth'
      })
    }
  })
}


async function handleBatchDelete() {
  // request
  await delOrder(checkedRowKeys.value)
  window.$message?.success($t('common.deleteSuccess'));
  checkedRowKeys.value = [];
  getData();
}

/** the editing row data */
const editingData = ref<Api.SystemManage.Role | null>(null);

function handleOpenDrawer(row, type) {
  operateType.value = type;
  editingData.value = row
  openDrawer();
}

async function handleDelete(id: number) {
  // request
  await delOrder([id])
  window.$message?.success($t('common.deleteSuccess'));
  getData();
}

async function searchData() {
  pagination.page = 1
  await getData()
}

const logRef = ref([])

const active = ref(false)

const card = ref(true)
const text = ref("-")
const terminalWindowRef = ref(null)

function changeCard() {
  card.value = !card.value
  if (card.value) {
    text.value = "-"
  } else {
    text.value = "+"
  }
}
function handleChange(jump) {
  autoJump.value = jump
}
const logStyle = {
  info: {
    level: 'info-level',
    style: 'color: rgb(0, 204, 0);'
  },
  debug: {
    level: 'debug-level',
    style: 'color: rgb(0, 153, 255);'
  },
  warn: {
    style: 'color: rgb(204, 102, 0);',
    level: 'css-1yop90d-logs-row__level',
  },
  error: {
    style: 'color: rgb(255, 51, 0);',
    level: 'css-pakh9b-logs-row__level',
  }
}
const autoJump = ref(true)
</script>

<template>


  <div class="flex-vertical-stretch gap-16px  <sm:overflow-auto">
    <OrderSearch v-model:model="searchParams" @reset="resetSearchParams" @search="searchData" :plat-list="platList"
                 :tags="tags" v-if="card"/>
    <!--    <NCard :bordered="false" size="small" class="" style="height: 5px;background-color: rgba(100, 108, 255, 0.1);"-->
    <!--           @click="changeCard">-->
    <!--      <n-button type="info" size="small" circle style="position:relative;left: 50%;top:-23px;border:none">-->
    <!--        {{ text }}-->
    <!--      </n-button>-->
    <!--    </NCard>-->
    <NCard title="订单列表" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="filteredColumns"
          :disabled-delete="checkedRowKeys.length === 0"
          :loading="loading"
          :allow="['batchEdit','export','batchRemark']"
          @batch-edit="handleBatchEdit"
          @batch-remark="handleBatchRemark"
          @export-orders="downloadFile"
          @delete="handleBatchDelete"

          @refresh="getData"
        />
      </template>
      <NDataTable
        remote
        v-model:checked-row-keys="checkedRowKeys"
        :columns="columns"
        :data="data"
        size="small"
        :scroll-x="3000"
        :flex-height="!appStore.isMobile"
        :loading="loading"
        :pagination="pagination"
        :row-key="item => item.uuid"
        class="sm:h-full"
      />
      <RoleOperateDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        @submitted="getData"
      />
    </NCard>

    <n-drawer
      default-height="500"
      style="border-radius: 15px 15px 0 0;"
      v-model:show="active"
      placement="bottom"
      :on-update:show="logshow"
      resizable>

      <n-card class="floating-card" size="small" style="background-color: #191b1f;border-color: #191b1f;border-radius: 15px 15px 0 0;">
        <div style="display: flex;justify-content: space-between;">
          <p style="color: #efeded">实时日志</p>
          <n-switch @update:value="handleChange"  v-model:value="autoJump">
            <template #checked>
              日志滚动开启
            </template>
            <template #unchecked>
              日志滚动关闭
            </template>
          </n-switch>
        </div>
      </n-card>
      <n-drawer-content style="background-color: #191b1f;">
        <div ref="terminalWindowRef" style="overflow-y: auto">
          <table class="css-i24vli-logs-rows">
            <tbody>
            <tr class="css-1yyr5lc-logs-row" v-for=" log in logRef">
              <td :class="logStyle[log.level].level"></td>
              <td title="See log details" class="css-x180el-logs-row-toggle-details__level">
                <div class="css-1vzus6i-Icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"

                       class="css-eio55b-topVerticalAlign">
                    <path
                      fill="#ccccdb"
                      d="M14.83,11.29,10.59,7.05a1,1,0,0,0-1.42,0,1,1,0,0,0,0,1.41L12.71,12,9.17,15.54a1,1,0,0,0,0,1.41,1,1,0,0,0,.71.29,1,1,0,0,0,.71-.29l4.24-4.24A1,1,0,0,0,14.83,11.29Z"></path>
                  </svg>
                </div>
              </td>
              <td class="css-1xvy5ie-logs-jumprow__message">
                <div class="css-as6nqd-verticalScroll"><span class="css-1wx8bl8-positionRelative"><span
                  :style="logStyle[log.level].style" data-testid="ansiLogLine">{{ log.message }}</span>
</span></div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<style>


.floating-card {
  position: sticky;
  top: 0;
  z-index: 100000;
  margin: 0;
}


table {
  line-height: 1.5; /* 1 */
  background-color: initial;
  border-collapse: collapse;
  border-spacing: 0;
}

.css-1yyr5lc-logs-row {
  width: 100%;
  vertical-align: top;
}

.debug-level::after {
  content: "";
  display: block;
  position: absolute;
  top: 1px;
  bottom: 1px;
  width: 3px;
  left: 4px;
  background-color: rgb(31, 120, 193);
}


.css-1yyr5lc-logs-row > td {
  padding-right: 8px;
  border-top: 1px solid transparent;
  border-bottom: 1px solid transparent;
  height: 100%;
}


.debug-level {
  position: relative;
  max-width: 10px;
  cursor: default;
}


.css-x180el-logs-row-toggle-details__level {
  position: relative;
  font-size: 9px;
  padding-top: 5px;
  max-width: 15px;
}


.css-1vzus6i-Icon {
  display: inline-block;
  font-size: 9px;
}


.css-1yyr5lc-logs-row > td {
  padding-right: 8px;
  border-top: 1px solid transparent;
  border-bottom: 1px solid transparent;
  height: 100%;
}

.css-eio55b-topVerticalAlign {
  display: inline-block;
  margin-bottom: 2px;
  fill: currentcolor;
  vertical-align: top;
  margin-top: -4px;
  margin-left: -2px;
}

.css-1yyr5lc-logs-row td:last-child {
  width: 100%;
}

.css-1yyr5lc-logs-row > td {
  padding-right: 8px;
  border-top: 1px solid transparent;
  border-bottom: 1px solid transparent;
  height: 100%;
}

.css-1xvy5ie-logs-row__message {
  white-space: pre-wrap;
  word-break: break-all;
}

td, th {
  padding: 0;
  padding-right: 0px;
}

.css-1yyr5lc-logs-row {
  width: 100%;
  vertical-align: top;
}


.info-level::after {
  content: "";
  display: block;
  position: absolute;
  top: 1px;
  bottom: 1px;
  width: 3px;
  left: 4px;
  background-color: rgb(126, 178, 109);
}

.css-1yyr5lc-logs-row > td {
  padding-right: 8px;
  border-top: 1px solid transparent;
  border-bottom: 1px solid transparent;
  height: 100%;
}

.info-level {
  position: relative;
  max-width: 10px;
  cursor: default;
}

.css-i24vli-logs-rows {
  font-family: "Roboto Mono", monospace;
  font-size: 0.8rem;
}


.css-1yop90d-logs-row__level::after {
  content: "";
  display: block;
  position: absolute;
  top: 1px;
  bottom: 1px;
  width: 3px;
  left: 4px;
  background-color: rgb(245, 183, 61);
}

.css-1yyr5lc-logs-row > td {
  padding-right: 8px;
  border-top: 1px solid transparent;
  border-bottom: 1px solid transparent;
  height: 100%;
}

.css-1yop90d-logs-row__level {
  position: relative;
  max-width: 10px;
  cursor: default;
}


.css-pakh9b-logs-row__level::after {
  content: "";
  display: block;
  position: absolute;
  top: 1px;
  bottom: 1px;
  width: 3px;
  left: 4px;
  background-color: rgb(226, 77, 66);
}


.css-1yyr5lc-logs-row > td {
  padding-right: 8px;
  border-top: 1px solid transparent;
  border-bottom: 1px solid transparent;
  height: 100%;
}


.css-pakh9b-logs-row__level {
  position: relative;
  max-width: 10px;
  cursor: default;
}
</style>
