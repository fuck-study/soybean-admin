<script setup lang="tsx">
import {onMounted, ref, watch, h} from 'vue';
import {useRouterPush} from '@/hooks/common/router';
import {useTabStore} from '@/store/modules/tab';
import {ipList, tagsList} from '@/utils/common';

import {fetchPlat, fetchUserInfo, getCourse, submitCourse,fetchCitys} from "@/service/api";
import {NButton, NCard, NAvatar, NText, NImage, NInput} from 'naive-ui';
import {useNotification} from "naive-ui";

const tabStore = useTabStore();
const {routerPushByKey} = useRouterPush();
const notification = useNotification();
const platList = ref([])
const selectCourses = ref([]);
// 用户的所有课程树状
const accountCourses = ref([]);
const filterAccountCourses = ref([])
const setOther = ref(false)
// 保存用户所有的账号信息
const pattern = ref('')
const face = ref('')
const account = ref('');
const tagName = ref(null)
const remark = ref(null)
const cityName = ref(null)
const platValue = ref(null);
const childSchool = ref(null);
const schoolList = ref([]);
const remarksList = ref([]);
const tagList = ref([])
const cityList = ref([])

const disableds = ref(false)
const checkedRowKeys = ref([]);


onMounted(async () => {
  const res = await fetchPlat()
  const tags = await fetchUserInfo()
  try {
    tagList.value = JSON.parse(tags.data.tags)
  } catch (e) {
  }
  cityList.value = (await fetchCitys()).data
  platList.value = res.data.map(i => {
    return {
      remarks: i.remarks,
      label: i.name,
      value: i.plat,
      school: i.school,
      price: i.price,
      msg: i.description,
      tip: i.tip,
    }
  })
})

watch(platValue, newValue => {
  if (newValue) {
    childSchool.value = null
    const item = platList.value.find(i => i.value === newValue);
    schoolList.value = item.school ? item.school.filter(i => i) : [];
    remarksList.value = item.remarks || []
    if (item.tip) {
      let markAsRead = false;
      const n = notification.create({
        trpe: 'warning',
        title: item.label,
        content: item.tip.replace('{sms}',`支持验证码登录,地址: ${window.location.origin}/api/code.html?plat=${item.value}&name=${item.label}`).replace('{face}',`支持自助传人脸视频,地址: ${window.location.origin}/api/face.html?plat=${item.value}&name=${item.label}`),
        meta: "龙龙提醒您注意事项",
        action: () => h(
          NButton,
          {
            text: true,
            type: "primary",
            onClick: () => {
              markAsRead = true;
              n.destroy();
            }
          },
          {
            default: () => "已读"
          }
        ),
        onClose: () => {
          if (!markAsRead) {
            window.$message?.warning("请设为已读");
            return false;
          }
        }
      });
    }
  }
});

function handleFinish(obj) {
  face.value = obj.event.target.response
  window.$message?.success("视频上传成功");
}

async function query() {
  // 清除用户输入框，清除用户搜索框，清楚用户课程列表，清楚用户选择的课程
  accountCourses.value = [];
  selectCourses.value = [];
  filterAccountCourses.value = []
  disableds.value = true;
  face.value = ''
  // 一定会取消禁用
  setTimeout(() => {
    disableds.value = false;
  }, 60000);

  // 检查用户输入的账号信息
  if (!account.value) {
    window.$message?.error('账号信息有误，请检查重新输入');
    disableds.value = false;
    return;
  }

  //  更改用户的输入为标准格式
  const accountInfo = account.value
    .trim()
    .split(/\n/)
    // eslint-disable-next-line array-callback-return,consistent-return
    .map(i => {
      const item = i.trim().split(/\s+/);
      if (item.length === 3) {
        return {
          school: schoolList.value.length ? childSchool.value : item[0],
          username: item[1],
          password: item[2]
        };
      } else if (item.length === 2) {
        return {
          school: schoolList.value.length ? childSchool.value : undefined,
          username: item[0],
          password: item[1]
        };
      }
    })
    .filter(i => i);

  accountInfo.forEach(item => {
    getCourse(item, platValue.value).then(res => {
      disableds.value = false;
      // 登录成功的
      if (res.data && res.data.status) {
        const data = res.data;
        const dataBody = {
          key: data.username,
          label: `${data.name} ${data.username} ${data.password}`,
          children: data.courses.map((i, y) => {
            return {
              ...data,
              label: i.name,
              courseImg: i.img,
              courseId: i.id,
              courses: i.hash,
              score: i.score,
            };
          })
        };
        accountCourses.value.push(dataBody);
      } else {
        // 登录失败的
        if (res.data && !res.data.status!) {
          window.$message?.error(`${item.username}---${res.data.msg}`);
        }
        const body = {
          key: item.username,
          label: `${item!.username} ${item!.password} ${res.data.msg}`,
          disabled: true,
          children: []
        };
        accountCourses.value.push(body);
      }
    })
    filterAccountCourses.value = accountCourses.value
  });
}


async function submit() {
  // if ([88].includes(platValue.value) && !face.value) {
  //   window.$message?.error('请点击高级上传人脸');
  //   return;
  // }
  const outputJson = [];
  const processedUsernames = {};

  for (const item of checkedRowKeys.value) {
    const {username, password, school, name, courses} = JSON.parse(item);
    if (!processedUsernames[username]) {
      processedUsernames[username] = {
        face: face.value,
        city: cityName.value,
        tag: tagName.value,
        name: name || '',
        remark: remark.value,
        school: school || '',
        username,
        password,
        courses: []
      }
      outputJson.push(processedUsernames[username]);
    }
    if (courses && courses.length > 0) {
      processedUsernames[username].courses.push(courses);
    }
  }
  // 根据username将一纬数组升纬
  for (const i of outputJson) {
    if (i.courses.length === 0) {
      continue
    }
    // eslint-disable-next-line no-await-in-loop
    const {data: msg, error} = await submitCourse(i, platValue.value);
    if (!error) {
      window.$message?.success(i.name + msg);
    } else {
      window.$message?.error(msg);
    }
  }
  account.value = '';
  checkedRowKeys.value = [];
  accountCourses.value = [];
}

const columns = ref([
  {
    type: 'selection'
  },
  {
    title(column) {
      return h(
        NInput,
        {
          onInput: (e) => {
            filterAccountCourses.value = []
            for (let valueElement of accountCourses.value) {
              const newElement = {
                ...valueElement,
                children: valueElement.children.map(i => {
                  if (i.label.includes(e)) {
                    return i
                  }
                }).filter(i => i)
              }
              filterAccountCourses.value.push(newElement)
            }
          },
          placeholder: '请过滤课程'
        }
      )
    },
    key: 'label',
    render: row => {
      if (row.score) {
        return (
          <div style="margin-top: -24px;">
            <div class="n-data-table-indent" style="width: 16px"></div>
            <div class="n-data-table-expand-placeholder"></div>
            <span>{row.label}</span>
            <span style="font-size: 14px;color: #888;margin-left: 26px;transform: translateY(-2px)">{row.score}</span>
          </div>
        );
      } else {
        return row.label
      }
    }
  }
]);


const renderSingleSelectTag = ({option}) => {
  return h(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "center"
      }
    },
    [
      h(NAvatar, {
        src: "/" + option.value + ".png",
        round: true,
        size: 24,
        style: {
          marginRight: "12px"
        }
      }),
      option.label
    ]
  );
};
const renderLabel = (option) => {
  return h(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "center"
      }
    },
    [

      h(NAvatar, {
        src: "/" + option.value + ".png",
        round: true,
        size: "small"
      }),
      h(
        "div",
        {
          style: {
            marginLeft: "12px",
            padding: "4px 0"
          }
        },
        [
          h("div", null, [option.label + ' (' + option.price + '龙币)']),
          h(
            NText,
            {depth: 3, tag: "div"},
            {
              default: () => option.msg
            }
          )
        ]
      )
    ]
  );
};


</script>
<template>
  <NSpace vertical :size="16">
    <n-card title="查询课程" :bordered="false" size="small" class="rounded-8px shadow-sm">
      <n-form-item label="请选择平台">
        <n-select v-model:value="platValue" placeholder="请选择平台" :options="platList" :filterable="true"
                  :render-label="renderLabel" :render-tag="renderSingleSelectTag" :disabled="accountCourses.length"/>
      </n-form-item>
      <n-form-item v-if="schoolList.length" label="学校" path="childNum">
        <n-select v-model:value="childSchool" :options="schoolList" :filterable="true" placeholder="请选择学校"/>
      </n-form-item>
      <n-space :vertical="true" :size="10">
        <n-input-group>
          <n-input
            v-model:value="account"
            type="textarea"
            placeholder="请填入 账号 密码,提交多个账号以回车换行分割"
            :disabled="disableds"
          />
        </n-input-group>
        <n-card v-if="setOther">
          <n-form-item label="标记订单">
            <n-select
              v-model:value="tagName"
              default-expand-all="true"
              :options="tagsList(tagList)"
              placeholder="如有需要请选择标记"
              :filterable="true"
              clearable
            />
          </n-form-item>
          <n-form-item label="代理IP">
            <n-select
              v-model:value="cityName"
              default-expand-all="true"
              :options="ipList(cityList)"
              placeholder="如有需要请选择归属地"
              clearable
            />
          </n-form-item>
          <n-form-item label="备注">
            <n-select
              v-model:value="remark"
              default-expand-all="true"
              :options="tagsList(remarksList)"
              placeholder="如有需要请备注"
              clearable
            />
          </n-form-item>

          <n-form-item label="人脸">
            <n-upload
              multiple
              directory-dnd
              action="/api/file?parentDir=face"
              @finish="handleFinish"
            >
              <n-upload-dragger>
                <n-text style="font-size: 16px">
                  点击或者拖动文件到该区域来上传
                </n-text>
                <n-p depth="3" style="margin: 8px 0 0 0">
                  仅支持mp4或zip,大小不要超过10MB
                </n-p>
              </n-upload-dragger>
            </n-upload>
          </n-form-item>


        </n-card>

        <div style="margin: 0 15px">
          <n-button v-if="!checkedRowKeys.length" type="primary" :disabled="disableds" @click="query">查询</n-button>
          <n-button v-if="checkedRowKeys.length" type="warning" :disabled="disableds" @click="submit">提交</n-button>

          <n-button v-if="accountCourses.length" style="margin-left: 10px" type="warning" @click='setOther = !setOther'
                    :disabled="disableds">高级
          </n-button>
        </div>
      </n-space>
    </n-card>
    <n-card v-if="accountCourses.length">
      <n-data-table
        :default-expand-all="true"
        v-model:checked-row-keys="checkedRowKeys"
        :data="filterAccountCourses"
        :expanded-row-keys="filterAccountCourses.map(i=>JSON.stringify(i))"
        :columns="columns"
        class="sm:h-full"
        :row-key="o => JSON.stringify(o)"
      />
    </n-card>
  </NSpace>
</template>

<style scoped>

</style>
