<script setup lang="ts">
import type { FilteredColumn } from '@/hooks/common/table';

defineOptions({
  name: 'TableHeaderOperation'
});

interface Props {
  disabledDelete?: boolean;
  loading?: boolean;
  allow?:string[]
}

defineProps<Props>();

interface Emits {
  (e: 'add'): void;
  (e: 'delete'): void;
  (e: 'refresh'): void;
  (e: 'batchEdit'): void;
  (e: 'batchRemark'): void;
  (e: 'exportOrders'): void;
}

const emit = defineEmits<Emits>();

const columns = defineModel<FilteredColumn[]>('columns', {
  default: () => []
});

function add() {
  emit('add');
}

function batchDelete() {
  emit('delete');
}

function batchEdit() {
  emit('batchEdit');
}

function exportOrders(){
  emit('exportOrders')
}

function refresh() {
  emit('refresh');
}

function batchRemark() {
  emit('batchRemark');
}

</script>

<template>
  <NSpace wrap justify="end" class="<sm:w-200px">

    <NButton size="small" ghost type="warning" @click="batchRemark" v-if="allow?.includes('batchRemark')">
<!--      <template #icon>-->
<!--        <icon-ant-design-reload-outlined class="text-icon" />-->
<!--      </template>-->
      批量修改
    </NButton>

    <NButton size="small" ghost type="primary" @click="batchEdit" v-if="allow?.includes('batchEdit')">
      <template #icon>
        <icon-mdi-refresh class="text-icon" />
      </template>
      批量补单
    </NButton>

    <NButton size="small" ghost type="primary" @click="add" v-if="allow?.includes('add')">
      <template #icon>
        <icon-ic-round-plus class="text-icon" />
      </template>
      新增
    </NButton>
    <NPopconfirm @positive-click="batchDelete">
      <template #trigger>
        <NButton size="small" ghost type="error" :disabled="disabledDelete">
          <template #icon>
            <icon-ic-round-delete class="text-icon" />
          </template>
           批量删除
        </NButton>
      </template>
      {{ $t('common.confirmDelete') }}
    </NPopconfirm>
    <NButton size="small" @click="refresh">
      <template #icon>
        <icon-mdi-refresh class="text-icon" :class="{ 'animate-spin': loading }" />
      </template>
      刷新
    </NButton>
    <NButton size="small" @click="exportOrders" v-if="allow?.includes('export')">
      <template #icon>
        <icon-mdi-refresh class="text-icon" :class="{ 'animate-spin': loading }" />
      </template>
      导出订单
    </NButton>
    <TableColumnSetting v-model:columns="columns" />
  </NSpace>
</template>

<style scoped></style>
