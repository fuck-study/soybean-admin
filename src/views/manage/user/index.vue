<script setup lang="tsx">
import { onMounted, ref, watch } from 'vue';
import { NButton, NPopconfirm, NTag } from 'naive-ui';
import { useBoolean } from '@sa/hooks';
import { fetchDeleteUser, fetchGetUserList, fetchPlat } from '@/service/api';
import { useAppStore } from '@/store/modules/app';
import { useTable } from '@/hooks/common/table';
import { $t } from '@/locales';
// import {enableStatusRecord, userGenderRecord} from '@/constants/business';
import UserOperateDrawer, { type OperateType } from './modules/user-operate-drawer.vue';
import UserSearch from './modules/user-search.vue';

const appStore = useAppStore();
const platList = ref([])
const {bool: drawerVisible, setTrue: openDrawer} = useBoolean();

const {columns, filteredColumns, data, loading, pagination, getData, searchParams, resetSearchParams} = useTable<
  Api.SystemManage.User,
  typeof fetchGetUserList,
  'index' | 'operate'
>({
  apiFn: fetchGetUserList,
  apiParams: {
    // if you want to use the searchParams in Form, you need to define the following properties, and the value is null
    // the value can not be undefined, otherwise the property in Form will not be reactive
    status: null,
    username: null,
    nickname: null
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
      width: 48
    },
    // {
    //   key: 'index',
    //   title: $t('common.index'),
    //   render: (_, index): string => getIndex(index),
    //   align: 'center',
    //   width: 64
    // },
    {
      key: 'nickname',
      title: $t('page.manage.user.nickname'),
      align: 'center',
      width: 100

    },
    {
      key: 'username',
      title: $t('page.manage.user.username'),
      align: 'center',
      width: 150


    },
    {
      key: 'password',
      title: $t('page.manage.user.password'),
      align: 'center',
      width: 150


    },
    {
      key: 'money',
      title: $t('page.manage.user.money'),
      align: 'center',
      width: 100

    },
    {
      key: 'status',
      title: '平台',
      align: 'center',
      render: row => {
        try {
          row.platList = platList.value.map(item=>{
            for (let parseElement of JSON.parse(row.price)) {
              if (parseElement.plat === item.plat) {
                return {
                  cost: item.price,
                  plat: item.plat,
                  price: parseElement.price,
                  name: item.name,
                  enable: true
                }
              }
            }
            return {
              cost: item.price,
              plat: item.plat,
              price: item.price,
              name: item.name,
              enable: false
            }
          })
          return row.platList.filter(i=>i.enable).map(item=>{
            return <NTag type="info" style="margin:3px">{item.name}</NTag>;
          })
        } catch (e) {
        }
        return <p></p>
      }
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 130,
      render: row => (
        <div class="flex-center gap-8px">
          <NButton type="primary" ghost size="small" onClick={() => handleEdit(row.id)}>
            {$t('common.edit')}
          </NButton>
          <NPopconfirm onPositiveClick={() => handleDelete(row.id)}>
            {{
              default: () => $t('common.confirmDelete'),
              trigger: () => (
                <NButton type="error" ghost size="small">
                  {$t('common.delete')}
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
  for (let string of checkedRowKeys.value) {
    await fetchDeleteUser(parseInt(string))
  }
  window.$message?.success($t('common.deleteSuccess'));

  checkedRowKeys.value = [];

  getData();
}

/** the editing row data */
const editingData = ref<Api.SystemManage.User | null>(null);

function handleEdit(id: number) {
  operateType.value = 'edit';
  editingData.value = data.value.find(item => item.id === id) || null;
  openDrawer();
}

async function handleDelete(id: number) {
  await fetchDeleteUser(id)
  window.$message?.success($t('common.deleteSuccess'));
  getData();
}

watch(drawerVisible, async item => {
  if (!item) {
    getData();
  }
});
onMounted(async () => {
  const data = await fetchPlat()
  platList.value = data.data
})


// function getIndex(index: number) {
//   const { page = 0, pageSize = 10 } = pagination;
//
//   return String((page - 1) * pageSize + index + 1);
// }
</script>

<template>
  <div class="flex-vertical-stretch gap-16px overflow-hidden <sm:overflow-auto">
    <UserSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getData"/>
    <NCard :title="$t('page.manage.user.title')" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="filteredColumns"
          :disabled-delete="checkedRowKeys.length === 0"
          :loading="loading"
          @add="handleAdd"
          @delete="handleBatchDelete"
          @refresh="getData"
        />
      </template>
      <NDataTable
        v-model:checked-row-keys="checkedRowKeys"
        :columns="columns"
        remote
        :data="data"
        size="small"
        :flex-height="!appStore.isMobile"
        :scroll-x="640"
        :loading="loading"
        :pagination="pagination"
        :row-key="item => item.id"
        class="sm:h-full"
      />
      <UserOperateDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        @submitted="getData"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
