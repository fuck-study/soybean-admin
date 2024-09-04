<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import {fetchCreateUser, fetchPlat, resetOrder, updateUser} from '@/service/api';
import { $t } from '@/locales';
// import { enableStatusOptions, userGenderOptions } from '@/constants/business';

defineOptions({
  name: 'UserOperateDrawer'
});

/**
 * the type of operation
 *
 * - add: add user
 * - edit: edit user
 */
export type OperateType = 'add' | 'edit';

interface Props {
  /** the type of operation */
  operateType: OperateType;
  /** the edit row data */
  rowData?: Api.SystemManage.User | null;
}

const props = defineProps<Props>();
const checkArr = ref([])
const showStatus = ref(false)
interface Emits {
  (e: 'submitted'): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', {
  default: false
});

const {formRef, validate, restoreValidation} = useNaiveForm();
const {defaultRequiredRule} = useFormRules();

const title = computed(() => {
  const titles: Record<OperateType, string> = {
    add: $t('page.manage.user.addUser'),
    edit: $t('page.manage.user.editUser')
  };
  return titles[props.operateType];
});

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

/** the enabled role options */
const platOptions = ref([]);

async function getPlatOptions() {
  const data = await fetchPlat();
  platOptions.value = data.data.map(item => {
    if (model.price && JSON.parse(model.price) && Array.isArray(JSON.parse(model.price))){
      if (JSON.parse(model.price).filter(i => i.plat === item.plat).length) {
        item.price = JSON.parse(model.price).filter(i => i.plat === item.plat)[0].price
        item.enable = true;
      } else {
        item.enable = false;
      }
      return item;
    }
    return item;
  });

}

function handleUpdateModelWhenEdit() {
  if (props.operateType === 'add') {
    Object.assign(model, createDefaultModel());
    return;
  }

  if (props.operateType === 'edit' && props.rowData) {
    Object.assign(model, props.rowData);
  }
}

function closeDrawer() {
  visible.value = false;
}

async function handleSubmit() {
  await validate();
  await resetOrder(model.uuid,{
      password: model.password
  })
  window.$message?.success($t('common.updateSuccess'));
  closeDrawer();

  emit('submitted');
}

watch(visible, item => {
  if (item){
    handleUpdateModelWhenEdit();
    restoreValidation();
    getPlatOptions();
  }
  if (model.username.length) {
    showStatus.value = true
    model.status = 1
  }else {
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
</script>

<template>
  <NDrawer v-model:show="visible" :title="title" display-directive="show" :width="380">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <n-card>
        <NForm ref="formRef" :model="model" :rules="rules">
          <NFormItem label="订单ID" path="ID">
            <NInput v-model:value="model.uuid" :disabled="showStatus" />
          </NFormItem>
          <NFormItem label="姓名" path="realName">
            <NInput v-model:value="model.realName" :placeholder="$t('page.manage.user.form.nickname')" :disabled="showStatus" />
          </NFormItem>
          <NFormItem label="科目" path="money" >
            <NInput v-model:value="model.courseName"  :disabled="showStatus" />
          </NFormItem>
          <NFormItem label="创建时间" path="createdAt" >
            <NInput v-model:value="model.createdAt"  :disabled="showStatus" />
          </NFormItem>
          <NFormItem label="更新时间" path="updatedAt" >
            <NInput v-model:value="model.updatedAt"  :disabled="showStatus" />
          </NFormItem>
          <NFormItem label="学校" path="school">
            <NInput v-model:value="model.school" :disabled="showStatus"  />
          </NFormItem>
          <NFormItem :label="$t('page.manage.user.username')" path="username">
            <NInput v-model:value="model.username" :placeholder="$t('page.manage.user.form.username')" :disabled="showStatus"  @input="validateInput"/>
          </NFormItem>
          <NFormItem :label="$t('page.manage.user.password')" path="password">
            <NInput v-model:value="model.password" placeholder="请输入密码" />
          </NFormItem>


          <n-collapse arrow-placement="right" style="margin-bottom: 20px">
            <n-collapse-item title="查看详细信息">
              <n-table :bordered="false" :single-line="false">
                <thead>
                <tr>
                  <th>课程名称</th>
                  <th>成绩</th>
                  <th>开始时间</th>
                  <th>结束时间</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item,index) in scoreAbout" :key="index">
                  <td>{{  item.name || '暂无' }}</td>
                  <td>{{  item.score  || '暂无'}}</td>
                  <td>{{  item.startTime || '暂无' }}</td>
                  <td>{{  item.endTime || '暂无' }}</td>
                </tr>
                </tbody>
              </n-table>

            </n-collapse-item>
          </n-collapse>


<!--                  <NFormItem :label="$t('page.manage.user.userPhone')" path="userPhone">-->
<!--                    <NInput v-model:value="model.userPhone" :placeholder="$t('page.manage.user.form.userPhone')" />-->
<!--                  </NFormItem>-->
<!--                  <NFormItem :label="$t('page.manage.user.userEmail')" path="email">-->
<!--                    <NInput v-model:value="model.userEmail" :placeholder="$t('page.manage.user.form.userEmail')" />-->
<!--                  </NFormItem>-->
<!--                  <NFormItem :label="$t('page.manage.user.userStatus')" path="status">-->
<!--                    <NRadioGroup v-model:value="model.status">-->
<!--                      <NRadio v-for="item in enableStatusOptions" :key="item.value" :value="item.value" :label="$t(item.label)" />-->
<!--                    </NRadioGroup>-->
<!--                  </NFormItem>-->
<!--                  <NFormItem :label="$t('page.manage.user.userRole')" path="roles">-->
<!--                    <NSelect-->
<!--                      v-model:value="model.userRoles"-->
<!--                      multiple-->
<!--                      :options="roleOptions"-->
<!--                      :placeholder="$t('page.manage.user.form.userRole')"-->
<!--                    />-->
<!--                  </NFormItem>-->
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
