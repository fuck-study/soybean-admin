<script setup lang="ts">
import {computed, reactive, ref, watch} from 'vue';
import {useFormRules, useNaiveForm} from '@/hooks/common/form';
import {addTemplet, updateTemplet} from '@/service/api';
import {$t} from '@/locales';

defineOptions({
  name: 'OperateDrawer'
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
  rowData?: Api.SystemManage.Tempter | null;

  allData?: Api.SystemManage.Tempter[];
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

const model = reactive({
  name: '',
  template: '[]',
});


type RuleKey = Extract<keyof Model, 'userName' | 'status'>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  userName: defaultRequiredRule,
  status: defaultRequiredRule
};

function createDefaultModel(): Model {
  return {
    name: '',
    template: '[]'
  };
}

function handleUpdateModelWhenEdit() {
  if (props.operateType === 'add') {
    Object.assign(model, createDefaultModel());
    options.value = props.allData.map(i => {
      return {
        label: i.name,
        key: i.id
      }
    })
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
  if (props.operateType === 'add') {
    await addTemplet(model)
  } else {
    await save()
  }
  window.$message?.success($t('common.updateSuccess'));
  closeDrawer();
  emit('submitted');
}

async function save() {
  model.template = JSON.stringify(platList.value.filter(i => i.enable).map(item => {
    return {
      name: item.name,
      plat: item.plat,
      price: item.price
    }
  }))
  await updateTemplet(model, model.id)
}

watch(visible, () => {
  if (visible.value) {
    if (props.operateType === 'edit') {
      platList.value = JSON.parse(JSON.stringify(props.rowData.platList)).sort((a,b)=>a.enable ? -1 : 1)
    }
    handleUpdateModelWhenEdit();
    restoreValidation();
  }
});

const options = ref([])

const handleSelect = (key) => {
  const copy = props.allData.filter(i => i.id == key)[0]
  model.template = copy.template
  window.$message?.success('已经成功复制' + copy.name + '模版,请点击保存')
}
</script>

<template>
  <NDrawer v-model:show="visible" title="新增模版" display-directive="show" :width="380">
    <NDrawerContent title="新增模版" :native-scrollbar="false" closable>
      <n-card>
        <NForm ref="formRef" :model="model" :rules="rules">
          <NFormItem label="模版名称">
            <NInput v-model:value="model.name" placeholder="请输入模版名称"/>
            <n-space v-if="operateType === 'add'">
              <n-dropdown trigger="hover" :options="options" @select="handleSelect">
                <n-button>复制</n-button>
              </n-dropdown>
            </n-space>
          </NFormItem>

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

        </NForm>

      </n-card>
      <template #footer>
        <NSpace :size="16">
          <NButton @click="closeDrawer">取消</NButton>
          <NButton type="primary" @click="handleSubmit">保存</NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped></style>
