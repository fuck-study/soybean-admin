<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import {fetchCreateUser, fetchPlat, updateUser} from '@/service/api';
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
const platList = ref([])
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
    price: '[]',
    money: 0,
  };
}

type RuleKey = Extract<keyof Model, 'userName' | 'status'>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  userName: defaultRequiredRule,
  status: defaultRequiredRule
};


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
  if (props.operateType ==='add'){
    await fetchCreateUser(model)
  }else {
   await save()
  }
  window.$message?.success($t('common.updateSuccess'));
  closeDrawer();
  emit('submitted');
}

async function save(){
  model.price = JSON.stringify(platList.value.filter(i => i.enable).map(item=>{
    return {
      name: item.name,
      plat: item.plat,
      price: item.price
    }
  }))
  await updateUser(model.id,model)
}

watch(visible, () => {
  if (visible.value) {
    platList.value = JSON.parse(JSON.stringify(props.rowData.platList))
    handleUpdateModelWhenEdit();
    restoreValidation();
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
  <NDrawer v-model:show="visible" :title="title" display-directive="show" :width="360">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <n-card>
        <NForm ref="formRef" :model="model" :rules="rules">
          <NFormItem label="用户名" path="username">
            <NInput v-model:value="model.username" placeholder="请输入用户名" :disabled="operateType==='edit'"  @input="validateInput"/>
          </NFormItem>
          <NFormItem label="昵称" path="nickName">
            <NInput v-model:value="model.nickname" placeholder="请输入昵称"/>
          </NFormItem>
          <NFormItem label="密码" path="password">
            <NInput v-model:value="model.password" placeholder="请输入密码" @input="psd" />
          </NFormItem>
          <NFormItem label="余额" path="money">
            <NInput v-model:value="model.money" placeholder="请输入余额"  />
          </NFormItem>
          <n-form-item  :span="12" path="plat" v-if="operateType==='edit'">
            <n-collapse>
                <div v-for="item in platList">
                  <n-space class="w-full" :size="24" justify="start">
                    <NFormItem :label="item.name" path="plat">
                      <n-input-number
                          v-model:value="item.price"
                          style="width: 180px;margin:0 5px"
                          placeholder="输入价格"
                          min="0"
                      />
                      <n-switch v-model:value="item.enable" @click="save" />
                    </NFormItem>
                  </n-space>
                </div>
            </n-collapse>
          </n-form-item>


          <!--        <NFormItem :label="$t('page.manage.user.userPhone')" path="userPhone">-->
          <!--          <NInput v-model:value="model.userPhone" :placeholder="$t('page.manage.user.form.userPhone')" />-->
          <!--        </NFormItem>-->
          <!--        <NFormItem :label="$t('page.manage.user.userEmail')" path="email">-->
          <!--          <NInput v-model:value="model.userEmail" :placeholder="$t('page.manage.user.form.userEmail')" />-->
          <!--        </NFormItem>-->
          <!--        <NFormItem :label="$t('page.manage.user.userStatus')" path="status">-->
          <!--          <NRadioGroup v-model:value="model.status">-->
          <!--            <NRadio v-for="item in enableStatusOptions" :key="item.value" :value="item.value" :label="$t(item.label)" />-->
          <!--          </NRadioGroup>-->
          <!--        </NFormItem>-->
          <!--        <NFormItem :label="$t('page.manage.user.userRole')" path="roles">-->
          <!--          <NSelect-->
          <!--            v-model:value="model.userRoles"-->
          <!--            multiple-->
          <!--            :options="roleOptions"-->
          <!--            :placeholder="$t('page.manage.user.form.userRole')"-->
          <!--          />-->
          <!--        </NFormItem>-->
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
