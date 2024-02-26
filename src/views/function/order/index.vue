<script setup lang="tsx">
import {h, onMounted, ref} from 'vue';
import { NButton, NPopconfirm, NTag, NProgress } from 'naive-ui';
import { useBoolean } from '@sa/hooks';
import {delOrder, editOrder, fetchPlat, fetchPostOrder, fetchUserInfo} from '@/service/api';
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
const tags = ref([])
onMounted(async ()=>{
  const data  = await fetchPlat()
  const res = await fetchUserInfo()
  tags.value = res.data.tags
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
    plat: null,
    status: null,
    username: null,
    nickname: null,
    password: null,
    name: null,
    school: null,
    courseName: null,
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
      key: 'plat',
      title: "平台",
      render: row=>{
        for (const item of platList.value) {
          if (item.plat === row.plat){
            return <NTag type="info">{item.name}</NTag>
          }
        }
      },
      width: 100,
      align: 'center'
    },
    {
      key: 'order',
      title: "科目",
      render: row=>{
        return row.courseName
      },
      width: 200,
      align: 'center'
    },
    {
      key: 'content',
      title: "账号信息",
      render: row=>{
        const style = {
          // color: 'rgba(0, 128, 0, 0.7)',
          // fontSize: 'smaller',
          // fontWeight: 'bold'
        };

        return (
          <p>{row.realName + " " +row.school + ' ' +  row.username + ' ' + row.password}</p>
        );

      },
      width: 300,
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
      key: 'result',
      title: "结果",
      render: row=>{
        const style = {
          // color: 'rgba(0, 128, 0, 0.7)',
          fontSize: 'smaller',
          // fontWeight: 'bold'
        };

        return (
          <p style={style}>{row.result}</p>
        );

      },
      width: 300,
      align: 'center'
    },
    {
      key: 'finish',
      title: "进度",
      width: 130,

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
      width: 130,
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
    },
    {
      key: 'updatedAt',
      title: "更新时间",
      render: row=>{
        return row.updatedAt
      },
      width: 180,
      align: 'center'
    },
    {
      key: 'createdAt',
      title: "创建时间",
      render: row=>{
        return row.createdAt
      },
      width: 180,
      align: 'center'
    },


    {
      key: 'examStartTime',
      title: "开考时间",
      render: row=>{
        return row.examStartTime
      },
      width: 180,
      align: 'center'
    },
    {
      key: 'examEndTime',
      title: "结考时间",
      render: row=>{
        return row.examEndTime
      },
      width: 180,
      align: 'center'
    },


    {
      key: 'courseStartTime',
      title: "开课时间",
      render: row=>{
        return row.courseStartTime
      },
      width: 180,
      align: 'center'
    },
    {
      key: 'courseEndTime',
      title: "结课时间",
      render: row=>{
        return row.courseEndTime
      },
      width: 180,
      align: 'center'
    },




  ]
});

const operateType = ref<OperateType>('add');

function handleAdd() {
  operateType.value = 'add';
  openDrawer();
}

const checkedRowKeys = ref<string[]>([]);

async function handleBatchEdit() {
  // request
  await editOrder(checkedRowKeys.value)
  window.$message?.success('补单成功');
  checkedRowKeys.value = [];
  getData();
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

function handleEdit(uuid: string) {
  operateType.value = 'edit';
  editingData.value = data.value.find(item => item.uuid === uuid) || null;
  openDrawer();
}

async function handleDelete(id: number) {
  // request
  await delOrder([id])
  window.$message?.success($t('common.deleteSuccess'));
  getData();
}

const card = ref(true)
const text = ref("-")
function changeCard(){
  console.log('changeCard')
  card.value = !card.value
  if (card.value) {
    text.value = "-"
  }else {
    text.value = "+"
  }
}

</script>

<template>
  <div class="flex-vertical-stretch gap-16px  <sm:overflow-auto">
    <OrderSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getData" :plat-list="platList" :tags="tags" v-if="card" />
    <NCard :bordered="false" size="small" class="" style="height: 5px;background-color: rgba(100, 108, 255, 0.1);" @click="changeCard"  >
      <n-button type="info"  size="small" circle style="position:relative;left: 50%;top:-23px;border:none">
        {{ text }}
      </n-button>
    </NCard>
    <NCard title="订单列表" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
      <template #header-extra>
        <TableHeaderOperation
            v-model:columns="filteredColumns"
            :disabled-delete="checkedRowKeys.length === 0"
            :loading="loading"
            :allow="['batchEdit']"
            @batch-edit="handleBatchEdit"
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
          :scroll-x="2800"
          :flex-height="!appStore.isMobile"
          :loading="loading"
          :pagination="pagination"
          :row-key="item => item.uuid"
          :min-height="500"
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
