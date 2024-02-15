<script setup lang="tsx">
import { ref } from 'vue';
import { NTag } from 'naive-ui';
import { useBoolean } from '@sa/hooks';
import { fetchLogList } from '@/service/api';
import { useAppStore } from '@/store/modules/app';
import { useTable } from '@/hooks/common/table';

const appStore = useAppStore();
const {bool: drawerVisible, setTrue: openDrawer} = useBoolean();


const {columns, data, loading, pagination, getData, searchParams, resetSearchParams} = useTable<
  Api.SystemManage.Log,
  typeof fetchLogList,
  'index' | 'operate'
>({
  apiFn: fetchLogList,
  apiParams: {
    pageNo: 1,
    pageSize: 10,
  },
  transformer: res => {
    const {records = [], current = 1, size = 10, total = 0} = res.data || {};
    console.log(current, size, total)
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
      width: 50,
      render: row => {
        return <NTag type="success">下单</NTag>
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
const editingData = ref<Api.SystemManage.User | null>(null);

</script>

<template>
  <div class="flex-vertical-stretch gap-16px overflow-hidden <sm:overflow-auto">
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
