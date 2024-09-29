<script setup lang="ts">

interface Props {
  logs: any;
}

const props = defineProps<Props>();
defineOptions({
  name: 'CreativityBanner'
});
</script>

<template>
  <NCard title="免单列表" :bordered="false" size="small" class="card-wrapper h-full">
    <NList>
      <NListItem v-for="item in props.logs" >
        <NThing :title="item.name" :description="item.createTime"/>
      </NListItem>
    </NList>
  </NCard>
</template>

<style scoped></style>
