<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {fetchUserInfo, updateUser} from "@/service/api";
const tagsValue = ref([])
const userContent = ref({})
onMounted(async ()=>{
  const info = await fetchUserInfo()
  console.log(info.data)
  userContent.value = info.data
  tagsValue.value = userContent.value.tags ? JSON.parse(userContent.value.tags) : []

})

async function submitUid() {
  userContent.value.tags = JSON.stringify(tagsValue.value)
  await updateUser(userContent.value.id,userContent.value)
}

</script>

<template>

  <div class="flex-vertical-stretch gap-16px <sm:overflow-auto">

        <NCard title="个人信息" :bordered="false" size="small" >
          <n-card>
            <n-space vertical>
              <n-form
                  :model="userContent"
                  label-placement="top"
                  require-mark-placement="right-hanging"
              >
                <n-form-item label="昵称" path="nickname">
                  <n-input placeholder="昵称" v-model:value="userContent.nickname" :disabled="true"/>
                </n-form-item>
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


  </div>



</template>

<style scoped></style>
