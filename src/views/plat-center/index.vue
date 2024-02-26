<script setup lang="ts">
import {computed,onMounted, ref} from 'vue'
import {fetchPlat} from "@/service/api";
import {useAppStore} from "@/store/modules/app";
const appStore = useAppStore();

const platList = ref([])
onMounted(async () => {
  const list = await fetchPlat()
  platList.value = list.data
})
const gap = computed(() => (appStore.isMobile ? 0 : 16));

const show = ref(false)
const code = `
 {
"code": 0,
"data"：“下单成功，扣费40龙币"
"msg"：“下单成功"
}`
const queryCourseCode = `
{
  "code": 1,
  "data": [
    {
      "name"："创造性思维与创新方法"，
      "id": 1000006163,
      "hash": "1//jXTVcLjK×swUpN8S+LogEdK1xxTeIzvc3W9Uc1je5k41qmYSofivVgmbMEqS6R+G+€...
    }
  ]
}
`
const budanCode = `
 {
"code": 1,
"msg"：“补单成功"
}`


const queryCode = `
 {
  "code": 1,
  "data": [
     {
            "examStartTime": "-",
            "id": "06113d0208989870bd1e83c74cde569b9",
            "kcname": "服务礼仪",
            "order": {
                "courseName": "服务礼仪",
                "createdAt": "2024-02-26 20:17:28",
                "finish": 0,
                "nextCheckTime": "2024-02-26 20:17:28",
                "password": "sadas",
                "plat": 62,
                "realName": "***",
                "result": "考试完成",
                "school": "职业大学",
                "status": 1,
                "total": 0,
                "updatedAt": "2024-02-26 20:17:34",
                "username": "152****7687",
                "uuid": "06113d0208989870bd1e83c74cde569b9"
            },
            "process": "0/0",
            "remarks": "-",
            "status": "已完成"
     },
  ]

}`
</script>

<template>
  <div class="flex-vertical-stretch gap-16px <sm:overflow-auto">
    <n-card title="接口文档" style="margin-bottom: 16px">
      <n-tabs default-value="查询课程" justify-content="space-evenly" type="line" animated>
        <n-tab-pane name="查询课程" tab="查询课程">
          <NGrid :x-gap="gap"  responsive="screen" item-responsive :cols="3">
            <NGi span="24 s:24 m:1">
              <n-card title="基本信息">
                <n-card title="URL">
                  <p >
                    <n-gradient-text type="info">
                      http://localhost:8080/api.php?act=get
                    </n-gradient-text>
                  </p>
                </n-card>
                <n-card title="请求类型">
                  <n-gradient-text type="info">
                    POST
                  </n-gradient-text>

                </n-card>
                <n-card title="请求格式">
                  <n-gradient-text type="info">
                    x-www-form-urlencoded
                  </n-gradient-text>

                </n-card>

                <n-card title="返回类型">
                  <p >
                    <n-gradient-text type="info">
                      JSON
                    </n-gradient-text>
                  </p>
                </n-card>
              </n-card>

            </NGi>
            <NGi span="24 s:24 m:1">
              <n-card title="请求参数及实例-">
                <n-table>
                  <thead>
                  <tr>
                    <th>名称</th>
                    <th>值</th>
                    <th>说明</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td>user</td>
                    <td>152****7687</td>
                    <td>学生账号</td>
                  </tr>
                  <tr>
                    <td>pass</td>
                    <td>sasdas@1133</td>
                    <td>学生密码</td>
                  </tr>
                  <tr>
                    <td>school</td>
                    <td>职业技术学院</td>
                    <td>学校信息</td>
                  </tr>
                  <tr>
                    <td>platform</td>
                    <td>60</td>
                    <td>平台编号</td>
                  </tr>
                  <tr>
                    <td>uid</td>
                    <td>666666666</td>
                    <td>平台用户名</td>
                  </tr>
                  <tr>
                    <td>key</td>
                    <td>123456</td>
                    <td>平台密码</td>
                  </tr>

                  </tbody>
                </n-table>

              </n-card>
              <div style="margin: 5px">
                <n-button type="info" @click="show = !show">
                  点此查看平台名单
                </n-button>
              </div>
            </NGi>
            <NGi span="24 s:24 m:1">
              <n-card title="返回成功结果">
                <div style="overflow: auto">
                  <n-code :code="queryCourseCode" language="cpp" show-line-numbers/>
                </div>
              </n-card>
              <n-card title="说明">
                <div style="overflow: auto;color: blueviolet ">
                  如遇到平台需要区分对应院校时，(例如学起等多院校平台)请务必将上述school字段中内容替换为我们所提供的学校内容
                </div>
                <n-collapse arrow-placement="right"  style="margin-bottom: 20px">
                  <n-collapse-item title="查看实例">
                    <n-table>
                      <thead>
                      <tr>
                        <th>名称</th>
                        <th>值</th>
                        <th>说明</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr>
                        <td>user</td>
                        <td>152****7687</td>
                        <td>学生账号</td>
                      </tr>
                      <tr>
                        <td>pass</td>
                        <td>sasdas@1133</td>
                        <td>学生密码</td>
                      </tr>
                      <tr>
                        <td>school</td>
                        <td>qnji.web2.superchutou.com</td>
                        <td>学校信息</td>
                      </tr>

                      <tr>
                        <td>platform</td>
                        <td>40</td>
                        <td>平台编号</td>
                      </tr>
                      <tr>
                        <td>uid</td>
                        <td>666666666</td>
                        <td>平台用户名</td>
                      </tr>
                      <tr>
                        <td>key</td>
                        <td>123456</td>
                        <td>平台密码</td>
                      </tr>

                      </tbody>
                    </n-table>
                  </n-collapse-item>
                </n-collapse>
              </n-card>
            </NGi>
          </NGrid>
        </n-tab-pane>
        <n-tab-pane name="下单" tab="下单">
          <NGrid :x-gap="gap"  responsive="screen" item-responsive :cols="3">
            <NGi span="24 s:24 m:1">
              <n-card title="基本信息">
                <n-card title="URL">
                  <p >
                    <n-gradient-text type="info">
                      http://localhost:8080/api.php?act=add
                    </n-gradient-text>
                  </p>
                </n-card>
                <n-card title="请求类型">
                  <n-gradient-text type="info">
                    POST
                  </n-gradient-text>
                </n-card>
                <n-card title="请求格式">
                  <n-gradient-text type="info">
                    x-www-form-urlencoded
                  </n-gradient-text>

                </n-card>
                <n-card title="返回类型">
                  <p >
                    <n-gradient-text type="info">
                      JSON
                    </n-gradient-text>
                  </p>
                </n-card>

              </n-card>
            </NGi>
            <NGi span="24 s:24 m:1">
              <n-card title="请求参数及实例">
                <n-table>
                  <thead>
                  <tr>
                    <th>名称</th>
                    <th>值</th>
                    <th>说明</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td>user</td>
                    <td>152****7687</td>
                    <td>学生账号</td>
                  </tr>
                  <tr>
                    <td>pass</td>
                    <td>sasdas@1133</td>
                    <td>学生密码</td>
                  </tr>
                  <tr>
                    <td>school</td>
                    <td>职业技术学院</td>
                    <td>学校名</td>
                  </tr>
                  <tr>
                    <td>kcname</td>
                    <td>创造性思维与创新方法</td>
                    <td>课程名称</td>
                  </tr>
                  <tr>
                    <td>platform</td>
                    <td>60</td>
                    <td>平台编号</td>
                  </tr>
                  <tr>
                    <td>uid</td>
                    <td>666666666</td>
                    <td>平台用户名</td>
                  </tr>
                  <tr>
                    <td>key</td>
                    <td>123456</td>
                    <td>平台密码</td>
                  </tr>

                  </tbody>
                </n-table>
              </n-card>
            </NGi>
            <NGi span="24 s:24 m:1">
              <n-card title="返回成功结果">
                <div style="overflow: auto">
                  <n-code :code="code" language="cpp" show-line-numbers/>
                </div>
              </n-card>
            </NGi>
          </NGrid>
        </n-tab-pane>
        <n-tab-pane name="获取订单" tab="获取订单">
          <NGrid :x-gap="gap"  responsive="screen" item-responsive :cols="3">
            <NGi span="24 s:24 m:1">
              <n-card title="基本信息">
                <n-card title="URL">
                  <p >
                    <n-gradient-text type="info">
                      http://localhost:8080/api.php?act=chadan
                    </n-gradient-text>
                  </p>
                </n-card>
                <n-card title="请求类型">
                  <n-gradient-text type="info">
                    POST
                  </n-gradient-text>
                </n-card>
                <n-card title="请求格式">
                  <n-gradient-text type="info">
                    x-www-form-urlencoded
                  </n-gradient-text>

                </n-card>
                <n-card title="返回类型">
                  <p >
                    <n-gradient-text type="info">
                      JSON
                    </n-gradient-text>
                  </p>
                </n-card>

              </n-card>
            </NGi>
            <NGi span="24 s:24 m:1">
              <n-card title="请求参数及实例">
                <n-table>
                  <thead>
                  <tr>
                    <th>名称</th>
                    <th>值</th>
                    <th>说明</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td>user</td>
                    <td>152****7687</td>
                    <td>学生账号</td>
                  </tr>
                  <tr>
                    <td>pass</td>
                    <td>sasdas@1133</td>
                    <td>学生密码</td>
                  </tr>

                  <tr>
                    <td>uid</td>
                    <td>666666666</td>
                    <td>平台用户名</td>
                  </tr>
                  <tr>
                    <td>key</td>
                    <td>123456</td>
                    <td>平台密码</td>
                  </tr>
                  <tr>
                    <td>usernam</td>
                    <td>152****7687</td>
                    <td>待查询的账号</td>
                  </tr>
                  </tbody>
                </n-table>
              </n-card>
            </NGi>
            <NGi span="24 s:24 m:1">
              <n-card title="返回成功结果">
                <div style="overflow: auto">
                  <n-code :code="queryCode" language="cpp" show-line-numbers/>
                </div>
              </n-card>
            </NGi>
          </NGrid>
        </n-tab-pane>
        <n-tab-pane name="补单" tab="补单">
          <NGrid :x-gap="gap"  responsive="screen" item-responsive :cols="3">
            <NGi span="24 s:24 m:1">
              <n-card title="基本信息">
                <n-card title="URL">
                  <p >
                    <n-gradient-text type="info">
                      http://localhost:8080/api.php?act=budan
                    </n-gradient-text>
                  </p>
                </n-card>
                <n-card title="请求类型">
                  <n-gradient-text type="info">
                    POST
                  </n-gradient-text>
                </n-card>
                <n-card title="请求格式">
                  <n-gradient-text type="info">
                    x-www-form-urlencoded
                  </n-gradient-text>

                </n-card>
                <n-card title="返回类型">
                  <p >
                    <n-gradient-text type="info">
                      JSON
                    </n-gradient-text>
                  </p>
                </n-card>

              </n-card>

            </NGi>
            <NGi span="24 s:24 m:1">
              <n-card title="请求参数及实例">
                <n-table>
                  <thead>
                  <tr>
                    <th>名称</th>
                    <th>值</th>
                    <th>说明</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td>user</td>
                    <td>152****7687</td>
                    <td>学生账号</td>
                  </tr>
                  <tr>
                    <td>pass</td>
                    <td>sasdas@1133</td>
                    <td>学生密码</td>
                  </tr>

                  <tr>
                    <td>uid</td>
                    <td>666666666</td>
                    <td>平台用户名</td>
                  </tr>
                  <tr>
                    <td>key</td>
                    <td>123456</td>
                    <td>平台密码</td>
                  </tr>
                  <tr>
                    <td>id</td>
                    <td>4cjsdiuiadcd6b6274f04b00779</td>
                    <td>订单id</td>
                  </tr>
                  </tbody>
                </n-table>
              </n-card>

            </NGi>
            <NGi span="24 s:24 m:1">
              <n-card title="返回成功结果">
                <div style="overflow: auto">
                  <n-code :code="budanCode" language="cpp" show-line-numbers/>
                </div>
              </n-card>

            </NGi>
          </NGrid>


        </n-tab-pane>
      </n-tabs>

    </n-card>

    <n-drawer v-model:show="show" :width="400">
      <n-drawer-content title="平台列表" closable>
        <n-list bordered>


          <n-list-item v-for="(item,index) in platList" :key="index">
            <n-thing :title="item.name" :title-extra="item.plat">
              <n-collapse arrow-placement="right" v-if="item.school" style="margin-bottom: 20px">
                <n-collapse-item title="查看学校信息">
                  <n-table :bordered="false" :single-line="false">
                    <thead>
                    <tr>
                      <th>网址</th>
                      <th>学校</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item,index) in item.school" :key="index">
                      <td>{{  item.value || '暂无' }}</td>
                      <td>{{  item.label || '暂无' }}</td>
                    </tr>
                    </tbody>
                  </n-table>
                </n-collapse-item>
              </n-collapse>
            </n-thing>
          </n-list-item>

        </n-list>
      </n-drawer-content>
    </n-drawer>

  </div>
</template>

<style scoped></style>
