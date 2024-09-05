<script setup lang="tsx">
import {ref} from 'vue';
import {NTag} from 'naive-ui';
// import { useBoolean } from '@sa/hooks';
import {fetchLogList} from '@/service/api';
import {useAppStore} from '@/store/modules/app';
import {useTable} from '@/hooks/common/table';

const appStore = useAppStore();
// const {bool: drawerVisible, setTrue: openDrawer} = useBoolean();
const type = ref("0")

const {columns, data, loading, pagination, getData} = useTable<
    Api.SystemManage.Log,
    typeof fetchLogList,
    'index' | 'operate'
>({
  apiFn: fetchLogList,
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
      key: 'createTime',
      title: '时间',
      align: 'center',
      width: 175,
    },
    {
      key: 'type',
      title: '类型',
      align: 'center',
      width: 100,
      render: row => {
        if (row.type === 3){
          return <NTag type="success">充值/修改余额</NTag>
        }else if (row.type === 1){
          return <NTag type="success">自行下单</NTag>
        }else if (row.type === 2){
          return <NTag type="success">代理下单</NTag>
        }
      }
    },
    {
      key: 'oldMoney',
      title: '原余额',
      align: 'center',
      width: 100,
    },
    {
      key: 'newMoney',
      title: '现余额',
      align: 'center',
      width: 100,
    },
    {
      key: 'costMoney',
      title: '变动',
      align: 'center',
      width: 100,
      render: row => {
        if (row.costMoney < 0){
          return <NTag type="error">{row.costMoney}</NTag>
        }else {
          return <NTag type="success">{row.costMoney}</NTag>
        }
      }
    },
    {
      key: 'log',
      title: '内容',
      align: 'center',
    }
  ]
});

const checkedRowKeys = ref<string[]>([]);

/** the editing row data */
// const editingData = ref<Api.SystemManage.User | null>(null);
// watch(searchParams.value,item=>{
//   console.log(item)
// })

const update = (val, idx) => {
  getData()
}

</script>

<template>
  <div class="flex-vertical-stretch gap-16px overflow-hidden <sm:overflow-auto">
    <n-radio-group
        @change="update"
        v-model:value="type"
        name="left-size"
        style="margin-bottom: 12px"
    >
      <n-radio-button value="0">
        全部
      </n-radio-button>
      <n-radio-button value="3">
        充值/修改余额
      </n-radio-button>
      <n-radio-button value="1">
        自行下单
      </n-radio-button>
      <n-radio-button value="2">
        代理下单
      </n-radio-button>
    </n-radio-group>

    <NCard title="日志列表" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
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
  </div>
</template>

<style scoped></style>
