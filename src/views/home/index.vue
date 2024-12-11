<script setup lang="ts">
import {computed, onMounted, ref} from 'vue';
import {useAppStore} from '@/store/modules/app';
import HeaderBanner from './modules/header-banner.vue';
import CardData from './modules/card-data.vue';
import LineChart from './modules/line-chart.vue';
import PieChart from './modules/pie-chart.vue';
import ProjectNews from './modules/project-news.vue';
import CreativityBanner from './modules/creativity-banner.vue';
import {
  fetchAddNotice,
  fetchFreeList,
  fetchFreePlat,
  fetchLogList,
  fetchNoticeList,
  fetchPlat,
  getUserData
} from "@/service/api";
import {ipList} from "@/utils/common";
import {$t} from "@/locales";
import {NButton} from "naive-ui";

const visible = ref(false)
const logsList = ref({})
const appStore = useAppStore()
const notices = ref([])
const userData = ref({})

const noticeData = ref({})
const gap = computed(() => (appStore.isMobile ? 0 : 16));

onMounted(async () => {
  const plats = await fetchPlat()
  const user = await getUserData()
  const logs = await fetchLogList()
  userData.value = user.data
  logsList.value = logs.data.records

  const noticeList = await fetchNoticeList()
  notices.value = noticeList.data.records
})

async function addNotice() {
  await fetchAddNotice(noticeData.value)
  window.$message?.success("发布成功")
  visible.value = false
  const noticeList = await fetchNoticeList()
  notices.value = noticeList.data.records
}


</script>

<template>
  <NSpace vertical :size="16">l
    <CardData :userData="userData"/>
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
        <NCard title="日志" :bordered="false" size="small" segmented class="card-wrapper">
          <NList>
            <NListItem v-for="item in logsList" :key="item.id">
              <NThing :title="item.log" :title-extra="item.createTime"/>
            </NListItem>
          </NList>
        </NCard>
      </NGi>
      <NGi span="24 s:24 m:10">
        <NCard title="公告列表" :bordered="false" size="small" class="card-wrapper h-full">
          <template #header-extra>
            <NButton size="small" ghost type="primary" @click="visible = true">
              发布公告
            </NButton>
          </template>
          <NList>
            <NListItem v-for="item in notices">
              <NThing :description="item.content">
                <template #header-extra>
                  {{ item.createTime }}
                </template>
                <template #header>
                  <p v-if="item.overId === 0" style="color: red">作者发布:{{ item.title }}</p>
                  <p v-if="item.overId > 0">{{ item.title }}</p>
                </template>
              </NThing>
            </NListItem>
          </NList>
        </NCard>
      </NGi>
    </NGrid>
    <NDrawer v-model:show="visible" title="发布新公告" display-directive="show" :width="380">
      <NDrawerContent title="发布新公告" :native-scrollbar="false" closable>
        <n-card>
          <NForm ref="formRef" :model="noticeData">
            <NFormItem label="标题">
              <NInput v-model:value="noticeData.title"/>
            </NFormItem>
            <NFormItem label="内容">
              <n-input
                v-model:value="noticeData.content"
                type="textarea"
              />
            </NFormItem>
          </NForm>
        </n-card>
        <template #footer>
          <NSpace :size="16">
            <NButton @click="visible=false">{{ $t('common.cancel') }}</NButton>
            <NButton type="primary" @click="addNotice">确认</NButton>
          </NSpace>
        </template>
      </NDrawerContent>
    </NDrawer>
  </NSpace>
</template>

<style scoped></style>
