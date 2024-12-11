<script setup lang="ts">
import {computed} from 'vue';
import { createReusableTemplate } from '@vueuse/core';

interface Props {
  userData: any;
}

const props = defineProps<Props>();

defineOptions({
  name: 'CardData'
});

interface CardData {
  key: string;
  title: string;
  value: number;
  unit: string;
  color: {
    start: string;
    end: string;
  };
  icon: string;
}

console.log(props)
const cardData = computed<CardData[]>(() => [
  {
    key: 'dealCount',
    title: '订单数量',
    value: props.userData.orderCount,
    unit: '',
    color: {
      start: '#fcbc25',
      end: '#f68057'
    },
    icon: 'carbon:document-download'
  },

  {
    key: 'turnover',
    title: '余额',
    value: props.userData.money,
    unit: '¥',
    color: {
      start: '#865ec0',
      end: '#5144b4'
    },
    icon: 'ant-design:money-collect-outlined'
  },
  {
    key: 'visitCount',
    title: "平台数量",
    value:  props.userData.platCount,
    unit: '',
    color: {
      start: '#ec4786',
      end: '#b955a4'
    },
    icon: 'ant-design:bar-chart-outlined'
  },

  {
    key: 'downloadCount',
    title: '用户数',
    value: props.userData.userCount,
    unit: '',
    color: {
      start: '#56cdf3',
      end: '#719de3'
    },
    icon: 'ant-design:trademark-circle-outlined'
  },

]);

interface GradientBgProps {
  gradientColor: string;
}

const [DefineGradientBg, GradientBg] = createReusableTemplate<GradientBgProps>();

function getGradientColor(color: CardData['color']) {
  return `linear-gradient(to bottom right, ${color.start}, ${color.end})`;
}
</script>

<template>
  <NCard :bordered="false" size="small" class="card-wrapper">
    <!-- define component start: GradientBg -->
    <DefineGradientBg v-slot="{ $slots, gradientColor }">
      <div class="px-16px pt-8px pb-4px rd-8px text-white" :style="{ backgroundImage: gradientColor }">
        <component :is="$slots.default" />
      </div>
    </DefineGradientBg>
    <!-- define component end: GradientBg -->

    <NGrid cols="s:1 m:2 l:4" responsive="screen" :x-gap="16" :y-gap="16">
      <NGi v-for="item in cardData" :key="item.key">
        <GradientBg :gradient-color="getGradientColor(item.color)" class="flex-1">
          <h3 class="text-16px">{{ item.title }}</h3>
          <div class="flex justify-between pt-12px">
            <SvgIcon :icon="item.icon" class="text-32px" />
            <CountTo
              :prefix="item.unit"
              :start-value="1"
              :end-value="item.value"
              class="text-30px text-white dark:text-dark"
            />
          </div>
        </GradientBg>
      </NGi>
    </NGrid>
  </NCard>
</template>

<style scoped></style>
