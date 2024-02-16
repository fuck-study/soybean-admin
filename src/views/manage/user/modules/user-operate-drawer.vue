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
  // request
  if (!model.status){
    let obj = {
      username: model.username,
      password: model.password,
      nickname: model.nickname
    }
    await fetchCreateUser(obj)
  }else {
    await updateUser(model.id,model)
  }

  window.$message?.success($t('common.updateSuccess'));
  closeDrawer();
  emit('submitted');
}

async function save(item){
  const obj = { plat: item.plat, value: '', price: String(item.price) };
  if ((item.enable && platOptions.value.filter(i => i.plat !== obj.plat).length) || platOptions.value.length === 0) {
    checkArr.value = model.price && JSON.parse(model.price) && Array.isArray(JSON.parse(model.price)) ? JSON.parse(model.price) : []
    checkArr.value.push(obj);
  } else {
    checkArr.value = model.price && JSON.parse(model.price) && Array.isArray(JSON.parse(model.price)) ? JSON.parse(model.price) : []
    checkArr.value = checkArr.value.filter(i => i.plat !== obj.plat);
  }
  model.price = JSON.stringify(checkArr.value);
  const res = await updateUser(model.id,model);
  if (res) {
    window.$message?.success('修改成功!');
    // await getTableData();
  } else {
    window.$message?.error('请补全账号信息!');
  }

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
  <NDrawer v-model:show="visible" :title="title" display-directive="show" :width="360">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <n-card>
        <NForm ref="formRef" :model="model" :rules="rules">

          <NFormItem :label="$t('page.manage.user.nickname')" path="nickName">
            <NInput v-model:value="model.nickname" :placeholder="$t('page.manage.user.form.nickname')"/>
          </NFormItem>
          <NFormItem label="余额" path="money" v-if="showStatus">
            <NInput v-model:value="model.money" placeholder="请输入余额"  />
          </NFormItem>
          <NFormItem :label="$t('page.manage.user.username')" path="username">
            <NInput v-model:value="model.username" :placeholder="$t('page.manage.user.form.username')" :disabled="showStatus"  @input="validateInput"/>
          </NFormItem>
          <NFormItem :label="$t('page.manage.user.password')" path="password">
            <NInput v-model:value="model.password" placeholder="请输入密码" @input="psd" />
          </NFormItem>
          <n-form-item  :span="12" label="平台" path="plat" v-if="showStatus">
            <n-collapse>
              <n-collapse-item title="查看详情" name="1">
                <div v-for="item in platOptions">
                  <n-space class="w-full" :size="24" justify="start">
                    <NFormItem :label="item.name" path="plat">
                      <n-input-number
                          v-model:value="item.price"
                          style="width: 180px;margin:0px 5px"
                          placeholder="输入价格"
                          min="0"
                      />
                      <n-switch v-model:value="item.enable" @click="save(item)" />

                    </NFormItem>
                  </n-space>
                </div>
              </n-collapse-item>
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
