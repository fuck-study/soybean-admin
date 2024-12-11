<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import {
  fetchBatchEditOrders,
  reportQuestion,
  resetOrder,
} from '@/service/api';
import { $t } from '@/locales';
import { NButton } from "naive-ui";
import { ipList, tagsList } from "@/utils/common";

defineOptions({
  name: 'UserOperateDrawer'
});

/**
 * the type of operation
 *
 * - add: add user
 * - edit: edit user
 */
export type OperateType = 'add' | 'edit' | 'report' | 'BatchRemark';

interface Props {
  /** the type of operation */
  operateType: OperateType;
  /** the edit row data */
  rowData?: any | null;
}

const props = defineProps<Props>();
const showStatus = ref(false)

const scoreAbout = ref([])
const reportForm = ref({
  id: 1
})

const batchEditData = ref({})

interface Emits {
  (e: 'submitted'): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', {
  default: false
});

const {formRef, validate, restoreValidation} = useNaiveForm();
const {defaultRequiredRule} = useFormRules();

type Model = Pick<
  Api.SystemManage.User,
  'userName' | 'userGender' | 'nickName' | 'price' | 'userEmail' | 'userRoles' | 'status'
>;

const model: Model = reactive(createDefaultModel());

function createDefaultModel(): Model {
  return {
    nickname: '',
    username: '',
    password: '',
    price: '',
    status: 0,
  };
}

type RuleKey = Extract<keyof Model, 'userName' | 'status'>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  userName: defaultRequiredRule,
  status: defaultRequiredRule
};


function handleUpdateModelWhenEdit() {
  if (props.operateType === 'edit' && props.rowData) {
    Object.assign(model, props.rowData)
    scoreAbout.value = []
    try {
      scoreAbout.value.push(...JSON.parse(props.rowData.work))
    } catch (e) {
    }
    try {
      scoreAbout.value.push(...JSON.parse(props.rowData.exam))
    } catch (e) {
    }
  } else if (props.operateType === 'report' && props.rowData) {
    reportForm.value = {
      orderId: props.rowData.uuid
    }
  }
}

function closeDrawer() {
  visible.value = false;
}

async function reportSubmit() {
  await reportQuestion(reportForm.value)
  window.$message?.success('反馈成功');
  closeDrawer();
  emit('submitted');

}

async function handleSubmit() {
  await validate();
  await resetOrder(model.uuid, {
    password: model.password
  })
  window.$message?.success($t('common.updateSuccess'));
  closeDrawer();
  emit('submitted');
}

watch(visible, item => {
  if (item) {
    handleUpdateModelWhenEdit();
    restoreValidation();
    // getPlatOptions();
  }
  if (model.username.length) {
    showStatus.value = true
    model.status = 1
  } else {
    model.status = 0
    showStatus.value = false
  }
});

function validateInput() {
  model.username = model.username.replace(/[^\w\s]/gi, '').trim();
}

function psd() {
  model.password = model.password.replace(/[^\w\s]/gi, '').trim();
}

const cityList = ref(["重庆", "安徽", "福建", "广东", "广西", "河北", "河南", "湖北", "湖南", "海南", "黑龙江", "江苏", "江西", "辽宁", "山东", "四川", "陕西", "浙江", "上海", "内蒙古", "北京"])

function BatchRemark() {

  fetchBatchEditOrders({
    remarks: batchEditData.value.remarks,
    city: batchEditData.value.city,
    ids: props.rowData
  }).then(res=>{
    emit('submitted');
  })
  window.$message?.success('修改成功');
  closeDrawer();
}
</script>

<template>

  <NDrawer v-model:show="visible" title="批量修改订单" display-directive="show" :width="380" v-if="operateType == 'BatchRemark'">
    <NDrawerContent title="批量修改订单" :native-scrollbar="false" closable>
      <n-card>
        <NForm ref="formRef" :model="batchEditData">
          <NFormItem label="备注">
            <NInput v-model:value="batchEditData.remarks"/>
          </NFormItem>
          <NFormItem label="代理IP">
            <n-select
              v-model:value="batchEditData.city"
              default-expand-all="true"
              :options="ipList(cityList)"
              placeholder="如有需要请选择归属地"
              clearable
            />
          </NFormItem>

        </NForm>
      </n-card>
      <template #footer>
        <NSpace :size="16">
          <NButton @click="closeDrawer">{{ $t('common.cancel') }}</NButton>
          <NButton type="primary" @click="BatchRemark">确认</NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>


  <NDrawer v-model:show="visible" title="反馈问题" display-directive="show" :width="380" v-if="operateType == 'report'">
    <NDrawerContent title="反馈问题" :native-scrollbar="false" closable>
      <n-card>
        <NForm ref="formRef" :model="reportForm">
          <NFormItem label="订单ID" path="ID">
            <NInput v-model:value="reportForm.orderId" disabled/>
          </NFormItem>
          <NFormItem label="问题" path="realName">
            <n-input
              v-model:value="reportForm.question"
              type="textarea"
              placeholder="请详细的描述你遇到的问题,同一类问题仅需要反馈一次即可"
            />
          </NFormItem>
        </NForm>
      </n-card>
      <template #footer>
        <NSpace :size="16">
          <NButton @click="closeDrawer">{{ $t('common.cancel') }}</NButton>
          <NButton type="primary" @click="reportSubmit">反馈</NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>


  <NDrawer v-model:show="visible" title="订单详情" display-directive="show" :width="380" v-if="operateType == 'edit'">
    <NDrawerContent title="订单详情" :native-scrollbar="false" closable>
      <n-card>
        <NForm ref="formRef" :model="model" :rules="rules">
          <NFormItem label="订单ID" path="ID">
            <NInput v-model:value="model.uuid" :disabled="showStatus"/>
          </NFormItem>
          <NFormItem label="姓名" path="realName">
            <NInput v-model:value="model.realName" :placeholder="$t('page.manage.user.form.nickname')"
                    :disabled="showStatus"/>
          </NFormItem>
          <NFormItem label="科目" path="money">
            <NInput v-model:value="model.courseName" :disabled="showStatus"/>
          </NFormItem>
          <NFormItem label="创建时间" path="createdAt">
            <NInput v-model:value="model.createdAt" :disabled="showStatus"/>
          </NFormItem>
          <NFormItem label="更新时间" path="updatedAt">
            <NInput v-model:value="model.updatedAt" :disabled="showStatus"/>
          </NFormItem>
          <NFormItem label="学校" path="school">
            <NInput v-model:value="model.school" :disabled="showStatus"/>
          </NFormItem>
          <NFormItem :label="$t('page.manage.user.username')" path="username">
            <NInput v-model:value="model.username" :placeholder="$t('page.manage.user.form.username')"
                    :disabled="showStatus" @input="validateInput"/>
          </NFormItem>
          <NFormItem :label="$t('page.manage.user.password')" path="password">
            <NInput v-model:value="model.password" placeholder="请输入密码"/>
          </NFormItem>
          <n-collapse arrow-placement="right" style="margin-bottom: 20px">
            <n-table :bordered="false" :single-line="false">
              <thead>
              <tr>
                <th>名称</th>
                <th>成绩</th>
                <!--                <th>开始时间</th>-->
                <!--                <th>结束时间</th>-->
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item,index) in scoreAbout" :key="index">
                <td>{{ item.name || '暂无' }}</td>
                <td>{{ item.score || '暂无' }}</td>
                <!--                <td>{{  item.startTime || '暂无' }}</td>-->
                <!--                <td>{{  item.endTime || '暂无' }}</td>-->
              </tr>
              </tbody>
            </n-table>
          </n-collapse>
        </NForm>
      </n-card>
      <template #footer>
        <NSpace :size="16">
          <NButton @click="closeDrawer">{{ $t('common.cancel') }}</NButton>
          <NButton type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped></style>
