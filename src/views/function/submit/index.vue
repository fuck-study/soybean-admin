<script setup lang="ts">
import { onMounted, ref, watch, h } from 'vue';
import { useRouterPush } from '@/hooks/common/router';
import { useTabStore } from '@/store/modules/tab';
import { fetchPlat, getCourse, submitCourse } from "@/service/api";
import {NButton, NTag, NAvatar, NText} from 'naive-ui';

const tabStore = useTabStore();
const {routerPushByKey} = useRouterPush();

const platList = ref([])
const selectCourses = ref([]);
// 用户的所有课程树状
const accountCourses = ref([]);
// 保存用户所有的账号信息
const account = ref('');
const platValue = ref(null);
const childSchool = ref(null);
const schoolList = ref([]);
const disableds = ref(false)
const checkedRowKeys = ref([]);
const outputJson = ref([]);


onMounted(async () => {
  const res = await fetchPlat()
  if (Array.isArray(res.data)) {
    platList.value = res.data.map(i => {
      return {
        label: i.name,
        value: i.plat,
        school: i.school,
        price: i.price,
        msg: i.description
      }
    })
  }
})

watch(platValue, newValue => {
  if (newValue) {
    const arr = platList.value.filter(i => i.value === newValue);
    schoolList.value = platList.value ? arr.flatMap(item => item.school).filter(i => i) : [];
    window.$message?.info(arr[0].msg + ' ' + arr[0].price + '龙币');
  }
});

async function query() {
  // 清除用户输入框，清除用户搜索框，清楚用户课程列表，清楚用户选择的课程
  accountCourses.value = [];
  selectCourses.value = [];
  disableds.value = true;
  // 一定会取消禁用
  setTimeout(() => {
    disableds.value = false;
  }, 10000);

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
      let data;
      // 登录成功的
      if (res.data && res.data.status) {
        data = res.data;
        const dataBody = {
          key: data.username,
          label: `${data.name} ${data.username} ${data.password}`,
          children: data.courses.map((i, y) => {
            return {
              ...data,
              type: 0, // 这里有全包啥的，先写死
              label: i.name,
              key: data.username + i.name + i.id + y,
              courses: i.hash
            };
          })
        };
        accountCourses.value.push(dataBody);
      } else {
        // 登录失败的
        if (res.data && !res.data.status!) {
          window.$message?.error(`${item.username}---账号或密码错误,${res.data.msg!}`);
        }
        const body = {
          key: item.username,
          label: `${item!.username} ${item!.password} ${res.data.msg}`,
          disabled: true,
          children: []
        };
        accountCourses.value.push(body);
      }
    });
  });
}

watch(checkedRowKeys, newValue => {
  if (newValue) {
    const courses = JSON.parse(JSON.stringify(newValue))
      .map(i => {
        return {
          type: 0,
          city: null,
          tag: null,
          school: JSON.parse(i).school,
          name: JSON.parse(i).name,
          username: JSON.parse(i).username,
          password: JSON.parse(i).password,
          courses: JSON.parse(i).courses ? JSON.parse(i).courses : []
        };
      }).filter(i => i.name);

    const processedUsernames = {};
    outputJson.value = [];
    for (const item of courses) {
      const {username, password, school, city, type, name, courses, tag} = item;

      if (!processedUsernames[username]) {
        processedUsernames[username] = {
          type,
          city,
          tag,
          name,
          school,
          username,
          password,
          courses: []
        };
        outputJson.value.push(processedUsernames[username]);
      }
      if (courses && courses.length > 0) {
        processedUsernames[username].courses.push(courses);
      }
    }
  }
});

async function submit() {
  // 根据username将一纬数组升纬
  for (const i of outputJson.value) {
    // eslint-disable-next-line no-await-in-loop
    const {data: msg, error} = await submitCourse(i, platValue.value);
    if (!error) {
      window.$message?.success(i.name + msg);
    } else {
      window.$message?.error(msg);
    }
  }
  account.value = '';
  outputJson.value = [];
  checkedRowKeys.value = [];
  accountCourses.value = [];
}

const columns = ref([
  {
    type: 'selection'
  },
  {
    title: '信息',
    key: 'label'
  }
]);

const renderMultipleSelectTag = ({
                                   platList,
                                   handleClose
                                 }) => {
  return h(
      NTag,
      {
        style: {
          padding: "0 6px 0 4px"
        },
        round: true,
        closable: true,
        onClose: (e) => {
          e.stopPropagation();
          handleClose();
        }
      },
      {
        default: () => h(
            "div",
            {
              style: {
                display: "flex",
                alignItems: "center"
              }
            },
            [
              h(NAvatar, {
                src: "https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg",
                round: true,
                size: 22,
                style: {
                  marginRight: "4px"
                }
              }),
              platList.label
            ]
        )
      }
  );
};
const renderSingleSelectTag = ({ option }) => {
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
          src: "/"+ option.value +".png",
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
          src: "/"+ option.value +".png",
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
              h("div", null, [option.label +' (' + option.price + '龙币)']),
              h(
                  NText,
                  { depth: 3, tag: "div" },
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
        <n-select v-model:value="platValue" placeholder="请选择平台" :options="platList" filterable  :render-label="renderLabel" :render-tag="renderSingleSelectTag" />
      </n-form-item>
      <n-form-item v-if="schoolList.length" label="学校" path="childNum">
        <n-select v-model:value="childSchool" :options="schoolList" placeholder="请选择学校"/>
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
        <n-button v-if="!checkedRowKeys.length" type="primary" :disabled="disableds" @click="query">查询</n-button>
        <n-button v-if="checkedRowKeys.length" type="warning" :disabled="disableds" @click="submit">提交</n-button>
      </n-space>
    </n-card>
    <n-card v-if="accountCourses.length">
      <n-data-table
        :default-expand-all="true"
        v-model:checked-row-keys="checkedRowKeys"
        :data="accountCourses"
        :max-height="500"
        :columns="columns"
        :row-key="o => JSON.stringify(o)"
      />
    </n-card>
  </NSpace>
</template>

<style scoped></style>
