<script setup lang="tsx">
import {h, ref, watch} from 'vue';
import { NButton, NPopconfirm, NTag, NProgress } from 'naive-ui';
import { useBoolean } from '@sa/hooks';
import {delOrder, fetchGetOrder, fetchPlat} from '@/service/api';
import { useAppStore } from '@/store/modules/app';
import { useTable } from '@/hooks/common/table';
import { $t } from '@/locales';
// import { enableStatusRecord } from '@/constants/business';
import RoleOperateDrawer, {type OperateType} from './modules/user-operate-drawer.vue';

import RoleSearch from './modules/user-search.vue';
const appStore = useAppStore();
const change = ref(false)
const { bool: drawerVisible, setTrue: openDrawer } = useBoolean()
const orderBody = ref({"plat":null,"status":null,"course_name":null,"username":null,"school":null,"name":null,"pageNo":1,"pageSize":10})
const platList = ref([])
const ordersData = ref({})
const orderStatus = [
  {
    value: -1,
    label: '异常',
    tag: 'error'
  },
  {
    value: -10,
    label: '密码错误',
    tag: 'error'
  },
  {
    value: -11,
    label: '已结课',
    tag: 'error'
  },
  {
    value: 1,
    label: '已完成',
    tag: 'success'
  },
  {
    value: 0,
    label: '待处理',
    tag: 'default'
  },
  {
    value: 2,
    label: '进行中',
    tag: 'info'
  },
  {
    value: 3,
    label: '待考试',
    tag: 'warning'
  },
  {
    value: 4,
    label: '习惯分',
    tag: 'info'
  },
  {
    value: 5,
    label: '见面课',
    tag: 'warning'
  }
];

async function getOrders(){
  const body = await fetchGetOrder(orderBody.value)
  const arr =await fetchPlat()
  platList.value = arr.data
  ordersData.value = body.data
  return data.data
}
watch(orderBody.value,async item=>{
  console.log('这里变化',orderBody.value)
  await getOrders()
  getData()
  console.log(ordersData.value)
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

const { columns, filteredColumns, data, loading, pagination, getData, searchParams, resetSearchParams } = useTable<
    Api.SystemManage.Order,
    typeof getOrders,
    'index' | 'operate'
>({
  apiFn: getOrders,
  transformer:  res => {
    console.log(searchParams)


    orderBody.value.pageNo = searchParams.pageNo ? searchParams.pageNo : orderBody.pageNo
    orderBody.value.pageSize = searchParams.pageSize ? searchParams.pageSize : orderBody.value.pageSize

    const data =  fetchGetOrder(orderBody.value)

    data.then(i=>{
      const { records = [], current = 1, size = 10, total = 0 } = i.data || {};

      ordersData.value = {
        data:  records,
        pageNum:  current,
        pageSize:  size,
        total: total
      };
      return  {
        data:  records,
        pageNum:  current,
        pageSize:  size,
        total: total
      };
    })
    console.log(ordersData.value)


    return {
      data:  ordersData.value.records,
      pageNum:  ordersData.value.current,
      pageSize:  ordersData.value.size,
      total: ordersData.value.total
    };

  },
  columns: () => [
    {
      type: 'selection',
      align: 'center',
      width: 30
    },
    {
      key: 'order',
      title: "科目",
      render: row=>{
        return row.courseName
      },
      width: 120,
      align: 'center'
    },
    {
      key: 'realName',
      title: "姓名",
      render: row=>{
        return row.realName
      },
      width: 60,
      align: 'center'
    },
    {
      key: 'content',
      title: "账号信息",
      render: row=>{
        return row.school + ' ' +  row.username + ' ' + row.password
      },
      width: 150,
      align: 'center'
    },

    {
      key: 'plat',
      title: "平台",
      render: row=>{
        for (const item of platList.value) {
          if (item.plat === row.plat){
            return <NTag type="info">{item.name}</NTag>
          }
        }
      },
      width: 64,
      align: 'center'
    },
    {
      title: '状态',
      key: 'status',
      width: 50,
      render(row) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { tag, label } = getStatusTypeByStatus(row.status);
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
              default: () =>  label
            }
        );
      }
    },
    {
      key: 'createdAt',
      title: "创建时间",
      render: row=>{
        return row.createdAt
      },
      width: 100,
      align: 'center'
    },
    {
      key: 'nextCheckTime',
      title: "更新时间",
      render: row=>{
        return row.nextCheckTime
      },
      width: 100,
      align: 'center'
    },

    {
      key: 'finish',
      title: "进度",
      width: 80,

      render: row=>{
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
      width: 100,
      render: row => (
          <div class="flex-center gap-8px">
            <NButton type="primary" ghost size="small" onClick={() => handleEdit(row.uuid)}>
              查看详情
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
    }
  ]
});

const operateType = ref<OperateType>('add');

function handleAdd() {
  operateType.value = 'add';
  openDrawer();
}

const checkedRowKeys = ref<string[]>([]);

async function handleBatchDelete() {
  // request
  await delOrder(checkedRowKeys.value)
  window.$message?.success($t('common.deleteSuccess'));

  checkedRowKeys.value = [];

  getData();
}

/** the editing row data */
const editingData = ref<Api.SystemManage.Role | null>(null);

function handleEdit(uuid: string) {
  console.log(uuid)
  operateType.value = 'edit';
  editingData.value = data.value.find(item => item.uuid === uuid) || null;
  console.log(editingData.value )
  openDrawer();
}

async function handleDelete(id: number) {
  // request
  await delOrder([id])
  window.$message?.success($t('common.deleteSuccess'));

  getData();
}




function getIndex(index: number) {
  const { page = 0, pageSize = 10 } = pagination;
  console.log(pagination)
  return String((page - 1) * pageSize + index + 1);
}
</script>

<template>
  <div class="flex-vertical-stretch gap-16px  <sm:overflow-auto">
    <RoleSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getData" />
    <NCard :title="$t('page.manage.role.title')" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
      <template #header-extra>
        <TableHeaderOperation
            v-model:columns="filteredColumns"
            :disabled-delete="checkedRowKeys.length === 0"
            :loading="loading"
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
          :flex-height="!appStore.isMobile"
          :scroll-x="800"
          :loading="loading"
          :pagination="pagination"
          :row-key="item => item.uuid"
          :min-height="440"
      />
      <RoleOperateDrawer
          v-model:visible="drawerVisible"
          :operate-type="operateType"
          :row-data="editingData"
          @submitted="getData"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
