<script setup lang="ts">
import {computed, onMounted, ref} from 'vue';
import {useAppStore} from '@/store/modules/app';
import HeaderBanner from './modules/header-banner.vue';
import CardData from './modules/card-data.vue';
import LineChart from './modules/line-chart.vue';
import PieChart from './modules/pie-chart.vue';
import ProjectNews from './modules/project-news.vue';
import CreativityBanner from './modules/creativity-banner.vue';
import {fetchFreeList, fetchFreePlat, fetchLogList, fetchPlat, getUserData} from "@/service/api";

const logsList = ref({})
const appStore = useAppStore()
const freeList = ref({})
const userData = ref({})
const freeData = ref({})
const gap = computed(() => (appStore.isMobile ? 0 : 16));

onMounted(async () => {
  const plats = await fetchPlat()
  const user = await getUserData()
  const free = await  fetchFreeList()
  const freeTitle = await fetchFreePlat()
  const logs = await fetchLogList({
    pageNo: 1,
    pageSize: 10,
  })
  userData.value = user.data
  logsList.value = logs.data
  freeData.value = plats.data.filter(i=>i.plat === freeTitle.data)[0] ? '【' + plats.data.filter(i=>i.plat === freeTitle.data)[0]['name']  + '】免费下单哦': '暂时无平台可以免费下单'
  freeList.value = free.data.records.map( item=> {
    return {
      createTime:item.createTime,
      name:plats.data.filter(i=>i.plat === item.plat)[0] ? plats.data.filter(i=>i.plat === item.plat)[0]['name'] : '未知平台'
    }
  })
})
</script>

<template>
  <NSpace vertical :size="16">
    <HeaderBanner :freeName="freeData"/>
    <CardData :userData="userData" />
    <NGrid :x-gap="gap" :y-gap="16" responsive="screen" item-responsive>
      <NGi span="24 s:24 m:14">
        <NCard :bordered="false" class="card-wrapper">
          <LineChart :userData="userData"/>
        </NCard>
      </NGi>
      <NGi span="24 s:24 m:10">
        <NCard :bordered="false" class="card-wrapper">
          <PieChart :userData="userData"/>
        </NCard>
      </NGi>
    </NGrid>
    <NGrid :x-gap="gap" :y-gap="16" responsive="screen" item-responsive>
      <NGi span="24 s:24 m:14">
        <ProjectNews :logs="logsList"/>
      </NGi>
      <NGi span="24 s:24 m:10">
        <CreativityBanner :logs="freeList"/>
      </NGi>
    </NGrid>
  </NSpace>
</template>

<style scoped></style>
