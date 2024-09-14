<script setup lang="tsx">
import { ref } from 'vue';
import { NTag } from 'naive-ui';
import { fetchReportList, putReport } from '@/service/api';
import { useAppStore } from '@/store/modules/app';
import { useTable } from '@/hooks/common/table';
import { $t } from "@/locales";

const appStore = useAppStore();
const type = ref("0")
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
          return <NTag type="info">待处理</NTag>
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
        </div>
      )
    }
  ]
});

const checkedRowKeys = ref<string[]>([]);

const update = (val, idx) => {
  getData()
}

const handleOpenDrawer = (row)=>{
  active.value = true
  raw.value = row
  // raw.
}

const submit =  async ()=>{
  await putReport(raw.value)
  active.value = false
  window.$message?.success('处理成功');
}
</script>

<template>
  <div class="flex-vertical-stretch gap-16px overflow-hidden <sm:overflow-auto">
    <NCard title="问题列表" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
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
    <n-drawer v-model:show="active" :width="502">
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
