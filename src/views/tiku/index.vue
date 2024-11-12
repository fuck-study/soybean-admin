<script setup lang="tsx">
import { ref } from 'vue';
import { fetchBuDan, fetchDeleteReport, fetchNoAnswerList, putReport } from '@/service/api';
import { useAppStore } from '@/store/modules/app';
import { useTable } from '@/hooks/common/table';
import { $t } from "@/locales";

const appStore = useAppStore();
const type = ref("43")
const active = ref(false)
const raw = ref({})
const {columns, data, loading, pagination, getData} = useTable<
  Api.SystemManage.Log,
  typeof fetchNoAnswerList,
  'index' | 'operate'
>({
  apiFn: fetchNoAnswerList,
  apiParams: {
    pageNo: 1,
    pageSize: 10,
    plat: type,
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
      key: 'courseName',
      title: '课程名称',
    },
    {
      key: 'id',
      title: '权重',
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 180,
      render: row => (
        <div class="flex-center gap-8px">
          <NButton type="primary" ghost size="small" onClick={() => budan(row)}>
            补单
          </NButton>
        </div>
      )
    }
  ]
})


const budan = (row) => {
  fetchBuDan({
    plat: type.value,
    courseName: row.courseName
  })
  window.$message?.success('补单成功');
}
const update = (val, idx) => {
  getData()
}

const checkedRowKeys = ref<string[]>([]);

</script>

<template>
  <div class="flex-vertical-stretch gap-16px overflow-hidden <sm:overflow-auto">
    <n-radio-group
      @change="update"
      v-model:value="type"
      name="left-size"
      style="margin-bottom: 12px">
      <n-radio-button value="43">
        国开
      </n-radio-button>
      <n-radio-button value="1">
        广开
      </n-radio-button>
      <n-radio-button value="-47">
        实验学院
      </n-radio-button>
    </n-radio-group>
    <NCard title="科目明细" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
      <NDataTable
        remote
        v-model:checked-row-keys="checkedRowKeys"
        :columns="columns"
        :data="data"
        size="small"
        :flex-height="!appStore.isMobile"
        :loading="loading"
        :pagination="pagination"
        :row-key="item => item.id"
        class="sm:h-full"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
