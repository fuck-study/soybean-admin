<script setup lang="ts">
import {watch} from 'vue';
import {$t} from '@/locales';
import {useAppStore} from '@/store/modules/app';
import {useEcharts} from '@/hooks/chart/use-echarts';

const props = defineProps<Props>();

interface Props {
  userData: any;
}

defineOptions({
  name: 'PieChart'
});

const appStore = useAppStore();

const {domRef, updateOptions} = useEcharts(() => ({
  tooltip: {
    trigger: 'item'
  },
  legend: {
    bottom: '1%',
    left: 'center',
    itemStyle: {
      borderWidth: 0
    }
  },
  series: [
    {
      color: [
        '#5da8ff',
        '#8e9dff',
        '#fedc69',
        '#26deca',
        "#AC7BD9",
        "#5D8CE6",
        "#45D9B8",
        "#E6C84D",
        "#E65F4D",
        "#E65091",
        "#AAAAAA",
        "#996E4F",
        "#4FA8E6",
        "#E65050",
        "#5C92C6",
        "#E6506E",
        "#E6E675",
        "#AC7BD9",
        "#65CC4F",
        "#7EDB81"
      ]


      ,
      name: '订单分布',
      type: 'pie',
      radius: ['45%', '75%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 1
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '12'
        }
      },
      labelLine: {
        show: false
      },
      data: [] as { name: string; value: number }[]
    }
  ]
}));

async function mockData() {
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });
  updateOptions(opts => {
    opts.series[0].data = Object.keys(props.userData.graph).map(item => {
      return {name: item, value: props.userData.graph[item]}
    }).filter(i => i.name != 'order_count' && i.value >0)
    return opts;
  });
}

function updateLocale() {
  updateOptions((opts, factory) => {
    const originOpts = factory();

    opts.series[0].name = originOpts.series[0].name;

    opts.series[0].data = [
      {name: $t('page.home.study'), value: 20},
      {name: $t('page.home.entertainment'), value: 10},
      {name: $t('page.home.work'), value: 40},
      {name: $t('page.home.rest'), value: 30}
    ];

    return opts;
  });
}

async function init() {
  mockData();
}

watch(
  () => appStore.locale,
  () => {
    updateLocale();
  }
);

// init
init();
</script>

<template>
  <NCard :bordered="false" class="card-wrapper">
    <div ref="domRef" class="h-360px overflow-hidden"></div>
  </NCard>
</template>

<style scoped></style>
