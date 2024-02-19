<script setup lang="ts">
import {computed, onMounted, ref} from 'vue';
import { useAppStore } from '@/store/modules/app';
import HeaderBanner from './modules/header-banner.vue';
import CardData from './modules/card-data.vue';
import LineChart from './modules/line-chart.vue';
import PieChart from './modules/pie-chart.vue';
import ProjectNews from './modules/project-news.vue';
import CreativityBanner from './modules/creativity-banner.vue';
import {fetchLogList, fetchUserInfo} from "@/service/api";
const userInfo = ref({})
const logsList = ref({})
const appStore = useAppStore();

const gap = computed(() => (appStore.isMobile ? 0 : 16));

onMounted(async ()=>{
 const data = await fetchUserInfo()
  const logs = await fetchLogList( {
    pageNo: 1,
    pageSize: 10,
  })
  logsList.value = logs.data
    userInfo.value = data.data
})
</script>

<template>
  <NSpace vertical :size="16">
    <HeaderBanner :userInfo="userInfo" />
    <CardData :userInfo="userInfo" :logsList = "logsList"/>
    <NGrid :x-gap="gap" :y-gap="16" responsive="screen" item-responsive>
      <NGi span="24 s:24 m:14">
        <NCard :bordered="false" class="card-wrapper">
          <LineChart />
        </NCard>
      </NGi>
      <NGi span="24 s:24 m:10">
        <NCard :bordered="false" class="card-wrapper">
          <PieChart />
        </NCard>
      </NGi>
    </NGrid>
    <NGrid :x-gap="gap" :y-gap="16" responsive="screen" item-responsive>
      <NGi span="24 s:24 m:14">
        <ProjectNews :logs="logsList"/>
      </NGi>
      <NGi span="24 s:24 m:10">
        <CreativityBanner />
      </NGi>
    </NGrid>
  </NSpace>
</template>

<style scoped></style>
