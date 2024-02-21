<script setup lang="ts">
import {computed, onMounted, ref} from 'vue';
import {useAppStore} from '@/store/modules/app';
import HeaderBanner from './modules/header-banner.vue';
import CardData from './modules/card-data.vue';
import LineChart from './modules/line-chart.vue';
import PieChart from './modules/pie-chart.vue';
import ProjectNews from './modules/project-news.vue';
import CreativityBanner from './modules/creativity-banner.vue';
import {fetchLogList, getUserData} from "@/service/api";

const logsList = ref({})
const appStore = useAppStore();
const userData = ref({})
const gap = computed(() => (appStore.isMobile ? 0 : 16));

onMounted(async () => {
  const user = await getUserData()
  const logs = await fetchLogList({
    pageNo: 1,
    pageSize: 10,
  })
  userData.value = user.data
  logsList.value = logs.data
})
</script>

<template>
  <NSpace vertical :size="16">
    <HeaderBanner />
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
        <CreativityBanner/>
      </NGi>
    </NGrid>
  </NSpace>
</template>

<style scoped></style>
