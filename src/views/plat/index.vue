<script setup lang="tsx">
import {onMounted, ref, h, computed} from 'vue'
import {fetchUserInfo, updateUser, fetchUserDev, fetchPlat, fetchAllPlat} from "@/service/api";
import {NButton, NTag} from "naive-ui";
const platList = ref([])
const type = ref('1')
import html2canvas from 'html2canvas';
const noPlats = ref([])
const disabled2 = ref(false)
onMounted(async ()=>{
  const allPlats = await fetchAllPlat()
  const plats = await fetchPlat()
  platList.value = plats.data
  for (let dataKey of allPlats.data) {
    if (!plats.data.find(i=>i.plat == dataKey.plat)){
      noPlats.value.push(dataKey)
    }
  }
})

const columns = [
  {
    title: 'ID',
    key: 'plat',
    width: 10,
  },

  {
    title: '名称',
    key: 'name',
    width: 70,
  },
  {
    title: '状态',
    key: 'zt',
    width: 20,
    render(row) {
      if (type.value === '1'){
        return <p style="color: #18a058">已开通</p>
      }else {
        return <p style="color: #d03050">未开通</p>
      }
    }
  },
  {
    title: '价格',
    key: 'price',
    width: 30,
    render(row) {
      if (type.value === '1' && disabled2){
        return row.price
      }else {
        return  '-'
      }
    }
  },
  {
    title: '描述',
    key: 'description',
    width: 150
  },
  {
    title: '提示',
    key: 'tip',
    width: 150,
    render(row) {
      if (row.tip){
        return row.tip.replace('{sms}',`支持验证码登录`).replace('{face}',`支持自助传人脸视频`)
      }
    }
  }
]


const captureScreenshot = () => {
  const screenshotArea = document.getElementById('screenshot-area');
  if (screenshotArea) {
    html2canvas(screenshotArea, { logging: true, useCORS: true })
      .then((canvas) => {


        // 创建URL并触发下载
        const url = canvas.toDataURL('image/png')
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', '平台明细.png');
        document.body.appendChild(link);
        link.click();
        // 清理URL对象
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);



      }).catch((error) => {
      console.log('截图失败:', error);
    });
  }
};

// 动态计算 visibleColumns，过滤掉需要隐藏的列
const visibleColumns = computed(() => {
  if (disabled2.value){
    return columns.filter(column => column.key !== 'price');
  }else {
    return columns
  }

});


</script>

<template>
  <div class="flex-vertical-stretch gap-16px <sm:overflow-auto">
    <n-radio-group
      v-model:value="type"
      name="left-size"
      style="margin-bottom: 12px">
      <n-radio-button value="1">
        已开通
      </n-radio-button>
      <n-radio-button value="2">
        未开通
      </n-radio-button>
    </n-radio-group>

    <NCard title="平台明细" :bordered="false" size="small" >
      <template #header-extra>

        <p style="color: red;margin-right: 12px">未开通平台可联系上级免费开通</p>


        <n-checkbox v-model:checked="disabled2" style="margin-right: 12px">
          隐藏价格
        </n-checkbox>

        <n-button  @click="captureScreenshot">长截图</n-button>
      </template>
        <n-space  vertical :size="12" id="screenshot-area">
          <n-data-table :columns="visibleColumns" :data="type === '1' ? platList : noPlats"  />
        </n-space>
    </NCard>
  </div>
</template>

<style scoped></style>
