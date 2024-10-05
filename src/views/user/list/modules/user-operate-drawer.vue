<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { fetchCreateUser, updateIntegral, updateUser } from '@/service/api';
import { $t } from '@/locales';

defineOptions({
  name: 'UserOperateDrawer'
});

/**
 * the type of operation
 *
 * - add: add user
 * - edit: edit user
 */
export type OperateType = 'add' | 'edit' | 'token';

interface Props {
  /** the type of operation */
  operateType: OperateType;
  templateList: templateList;
  /** the edit row data */
  rowData?: Api.SystemManage.User | null;

}

const props = defineProps<Props>();
const platList = ref([])
const template = ref(null)
const selectValue = ref("模版")

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

const token = ref(0)


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
    return;
  }

  if (props.operateType === 'token') {
    Object.assign(model, props.rowData);
  }
}

function closeDrawer() {
  visible.value = false;
  token.value = 0

}

async function handleSubmit() {
  await validate();
  if (props.operateType === 'add') {
    await fetchCreateUser(model)
  } else if (props.operateType === 'token') {
    await updateIntegral(model.id, token.value, model)
  } else {
    await save()
  }
  window.$message?.success($t('common.updateSuccess'));
  closeDrawer();
  emit('submitted');
}

async function save() {
  if (selectValue.value === "模版") {
    model.price = template.value
  } else {
    model.price = JSON.stringify(platList.value.filter(i => i.enable).map(item => {
      return {
        name: item.name,
        plat: item.plat,
        price: item.price
      }
    }))
  }
  await updateUser(model.id, model)
}

watch(visible, () => {
  if (visible.value) {
    template.value = props.rowData.templateId
    if (props.operateType === 'edit') {
      platList.value = JSON.parse(JSON.stringify(props.rowData.platList))
    }
    handleUpdateModelWhenEdit();
    restoreValidation();
  }
});

function validateInput() {
  model.username = model.username.replace(/[^\w\s]/gi, '').trim();
}

</script>

<template>
  <NDrawer v-model:show="visible" :title="title" display-directive="show" :width="360">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <n-card v-if="operateType !=='token'">
        <NForm ref="formRef" :model="model" :rules="rules">
          <NFormItem label="用户名" path="username">
            <NInput v-model:value="model.username" placeholder="请输入用户名" :disabled="operateType==='edit'"
                    @input="validateInput"/>
          </NFormItem>
          <NFormItem label="昵称" path="nickName">
            <NInput v-model:value="model.nickname" placeholder="请输入昵称"/>
          </NFormItem>
          <NFormItem label="密码" path="password">
            <NInput v-model:value="model.password" placeholder="请输入密码"/>
          </NFormItem>
          <NFormItem label="余额" path="money">
            <NInput v-model:value="model.money" placeholder="请输入余额"/>
          </NFormItem>

          <n-tabs type="line" animated :value="selectValue" :on-update:value="(v)=>{selectValue = v}">
            <n-tab-pane name="模版" tab="模版">
              <n-select v-model:value="template" :options="templateList"/>
            </n-tab-pane>
            <n-tab-pane name="自选" tab="自选">
              <n-form-item :span="12" path="plat" v-if="operateType==='edit'">
                <n-collapse>
                  <div v-for="item in platList">
                    <n-space class="w-full" :size="24" justify="start">
                      <NFormItem :label="`${item.name}(成本${item.cost})`" path="plat">
                        <n-input-number
                          v-model:value="item.price"
                          style="width: 180px;margin:0 5px"
                          placeholder="输入价格"
                          min="0"
                        />
                        <n-switch v-model:value="item.enable" @click="save"/>
                      </NFormItem>
                    </n-space>
                  </div>
                </n-collapse>
              </n-form-item>
            </n-tab-pane>
          </n-tabs>


        </NForm>

      </n-card>

      <n-card v-else>
        <NForm ref="formRef" :model="model" :rules="rules">
          <NFormItem label="用户名" path="username">
            <NInput v-model:value="model.username" placeholder="请输入用户名" :disabled="operateType !=='add'"
                    @input="validateInput"/>
          </NFormItem>
          <NFormItem label="充值金额" path="money">
            <NInput v-model:value="token" placeholder="请输入金额"/>
          </NFormItem>
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
