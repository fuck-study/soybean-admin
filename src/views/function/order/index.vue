<script setup lang="tsx">
import {h, onMounted, ref, watch} from 'vue';
import { NButton, NPopconfirm, NTag, NProgress } from 'naive-ui';
import { useBoolean } from '@sa/hooks';
import { delOrder, fetchGetOrder, fetchPlat, fetchPostOrder } from '@/service/api';
import { useAppStore } from '@/store/modules/app';
import { useTable } from '@/hooks/common/table';
import { $t } from '@/locales';
// import { enableStatusRecord } from '@/constants/business';
import RoleOperateDrawer, {type OperateType} from './modules/order-operate-drawer.vue';

import OrderSearch from './modules/order-search.vue';
import { orderStatus } from "@/utils/common";
const appStore = useAppStore();
const { bool: drawerVisible, setTrue: openDrawer } = useBoolean()
const platList = ref([])

onMounted(async ()=>{
  const data  = await fetchPlat()
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

const { columns, filteredColumns, data, loading, pagination, getData, searchParams, resetSearchParams } = useTable<
    Api.SystemManage.Order,
    typeof fetchPostOrder,
    'index' | 'operate'
>({
  apiFn: fetchPostOrder,
  apiParams: {
    // if you want to use the searchParams in Form, you need to define the following properties, and the value is null
    // the value can not be undefined, otherwise the property in Form will not be reactive
    status: null,
    username: null,
    nickname: null,
    plat: null
  },
  transformer:  res => {
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
        console.log(row)
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
      width: 110,
      align: 'center'
    },
    {
      key: 'nextCheckTime',
      title: "更新时间",
      render: row=>{
        return row.nextCheckTime
      },
      width: 110,
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
    <OrderSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getData" :plat-list="platList" />
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
