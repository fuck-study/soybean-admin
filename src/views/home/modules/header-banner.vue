<script setup lang="ts">
import { computed } from 'vue';
import { $t } from '@/locales';
import { useAppStore } from '@/store/modules/app';
import { useAuthStore } from '@/store/modules/auth';

defineOptions({
  name: 'HeaderBanner'
});
interface Props {
  freeName: any;
}
const props = defineProps<Props>();

const appStore = useAppStore();
const authStore = useAuthStore();

const gap = computed(() => (appStore.isMobile ? 0 : 16));

interface StatisticData {
  id: number;
  label: string;
  value: string;
}

function getTime(status) {
  let now = new Date();
  let year = now.getFullYear();
  let month = String(now.getMonth() + 1).padStart(2, '0'); // 月份是从0开始的，所以加1
  let day = String(now.getDate()).padStart(2, '0');
  let hour = String(now.getHours()).padStart(2, '0'); // 小时可能是单个数字，所以使用padStart填充
  let Minutes = String(now.getMinutes()).padStart(2, '0'); // 小时可能是单个数字，所以使用padStart填充

  if (status){
    return `${year}-${month}-${day} ${hour}:00` + ' ~ ' +`${year}-${month}-${day} ${Number(hour) + 1}:00`; // 这里我们假设分钟和秒都是0
  }
  return `${year}-${month}-${day} ${hour}:${Minutes}`
}

const statisticData = computed<StatisticData[]>(() => [
  {
    id: 0,
    label: $t('page.home.projectCount'),
    value: '25'
  },
  {
    id: 1,
    label: $t('page.home.todo'),
    value: '4/16'
  },
  {
    id: 2,
    label: $t('page.home.message'),
    value: '12'
  }
]);
</script>

<template>
  <NCard :bordered="false" class="card-wrapper">
    <NGrid :x-gap="gap" :y-gap="16" responsive="screen" item-responsive>
      <NGi span="24 s:24 m:18">
        <div class="flex-y-center">
          <div class="shrink-0 size-72px rd-1/2 overflow-hidden">
            <img src="@/assets/imgs/konglong.jpeg" class="size-full" />
          </div>
          <div class="pl-12px">
            <h3 class="text-18px font-semibold">
             {{getTime()}} {{ `${props.freeName}`}}
            </h3>
            <p class="leading-30px text-#999">{{ getTime(true)}} {{ `【${props.freeName}】` !== '【暂时无平台可以免费下单】' ? '在此时间段内' +`${props.freeName}` : '暂时无平台可以免费下单' }}</p>
          </div>
        </div>
      </NGi>
<!--      <NGi span="24 s:24 m:6">-->
<!--        <NSpace :size="24" justify="end">-->
<!--          <NStatistic v-for="item in statisticData" :key="item.id" class="whitespace-nowrap" v-bind="item" />-->
<!--        </NSpace>-->
<!--      </NGi>-->
    </NGrid>
  </NCard>
</template>

<style scoped></style>
