<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {fetchUserInfo, updateUser, fetchUserDev, fetchPlat} from "@/service/api";
import {NButton} from "naive-ui";
const tagsValue = ref([])
const userContent = ref({})
const devList = ref({})
const platList = ref([])

onMounted(async ()=>{
  const info = await fetchUserInfo()
  const dev = await fetchUserDev()
  const list = await fetchPlat()
  platList.value = list.data
  devList.value = dev.data
  for (const listElement of platList.value) {
    for (const dev of devList.value) {
      if (listElement.plat === dev.id){
        dev.name = listElement.name
      }
    }
  }
  userContent.value = info.data


  tagsValue.value = userContent.value.tags ? JSON.parse(userContent.value.tags) : []

})

async function submitUid() {
  userContent.value.tags = JSON.stringify(tagsValue.value)
  await updateUser(userContent.value.id,userContent.value)
}


const card = ref(true)
const text = ref("-")
function changeCard(){
  console.log('changeCard')
  card.value = !card.value
  if (card.value) {
    text.value = "-"
  }else {
    text.value = "+"
  }
}


</script>

<template>

  <div class="flex-vertical-stretch gap-16px <sm:overflow-auto">

        <NCard title="个人信息" v-if="card" :bordered="false" size="small" >
          <n-card>
            <n-space vertical>
              <n-form
                  :model="userContent"
                  label-placement="top"
                  require-mark-placement="right-hanging"
              >
                <n-form-item label="账号" path="username" >
                  <n-input placeholder="账号" v-model:value="userContent.username" :disabled="true"/>
                </n-form-item>
                <n-form-item label="密码" path="password">
                  <n-input placeholder="默认为 123456，修改请输入8位" v-model:value="userContent.password"/>
                </n-form-item>


                <n-form-item label="我的标签">
                  <n-scrollbar >
                    <n-card>
                      <n-dynamic-input
                          v-model:value="tagsValue"
                          show-sort-button
                          placeholder="请输入"
                      >
                        <template #create-button-default>
                          添加标签信息
                        </template>
                      </n-dynamic-input>
                    </n-card>
                  </n-scrollbar>

                </n-form-item>
                <n-button type="info" @click="submitUid">
                  确定
                </n-button>
              </n-form>
            </n-space>

          </n-card>




        </NCard>


    <NCard :bordered="false" size="small" class="" style="height: 5px;background-color: rgba(100, 108, 255, 0.1);" @click="changeCard"  >
      <n-button type="info"  size="small" circle style="position:relative;left: 50%;top:-23px;border:none">
        {{ text }}
      </n-button>
    </NCard>

    <NCard title="" :bordered="false" size="small" >
      <n-card>
        <n-space  vertical :size="12" >
          <n-table :bordered="true" :single-line="false">
            <thead>
            <tr>
              <th>平台</th>
              <th>金额</th>
              <th>当前</th>
              <th>状态</th>
            </tr>
            </thead>
            <tbody  v-for="(item,index) in devList" :key =index>
            <tr>
              <td>{{item.name || "暂无"}}</td>
              <td>{{item.money || "暂无"}}</td>
              <td>{{item.income || "暂无"}}</td>
              <td>{{item.status === '1' ? '已返现' : '等待返现'}}</td>
            </tr>
            </tbody>
          </n-table>
        </n-space>
      </n-card>

    </NCard>

  </div>



</template>

<style scoped></style>
