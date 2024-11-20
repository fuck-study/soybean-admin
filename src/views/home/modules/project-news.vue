<script setup lang="ts">


interface Props {
  logs: any;
}
const props = defineProps<Props>();

defineOptions({
  name: 'ProjectNews'
});

// interface NewsItem {
//   id: number;
//   content: string;
//   time: string;
// }

</script>

<template>
  <NCard title="日志" :bordered="false" size="small" segmented class="card-wrapper">
    <NList>
      <NListItem v-for="item in props.logs.records" :key="item.id">
        <NThing :title="item.log" :title-extra="item.createTime" />
      </NListItem>
    </NList>
  </NCard>
</template>

<style scoped></style>
