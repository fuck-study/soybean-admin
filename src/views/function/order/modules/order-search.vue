<script setup lang="ts">
import { computed } from 'vue';
import { $t } from '@/locales';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { orderStatus, translatePlatList ,tagsList} from '@/utils/common';

defineOptions({
  name: 'UserSearch'
});

interface Emits {
  (e: 'reset'): void;
  (e: 'search'): void;
}

interface Props {
  platList: any;
  tags:any;
}

const props = defineProps<Props>();

const emit = defineEmits<Emits>();

const { formRef, validate, restoreValidation } = useNaiveForm();

const model = defineModel('model', { required: true });

type RuleKey = Extract<keyof Api.SystemManage.UserSearchParams, 'userEmail' | 'userPhone'>;

const rules = computed<Record<RuleKey, App.Global.FormRule>>(() => {
  const { patternRules } = useFormRules(); // inside computed to make locale reactive

  return {
    userEmail: patternRules.email,
    userPhone: patternRules.phone
  };
});

async function reset() {
  await restoreValidation();
  emit('reset');
}

async function search() {
  await validate();
  emit('search');
}
</script>

<template>
  <NCard :title="$t('common.search')" :bordered="false" size="small" class="card-wrapper">
    <NForm ref="formRef" :model="model" :rules="rules" label-placement="left">
      <NGrid responsive="screen" item-responsive>
        <NFormItemGi span="24 s:12 m:6" label="平台" path="userStatus" class="pr-24px">
          <NSelect
            v-model:value="model.plat"
            placeholder="请选择平台"
            :options="translatePlatList(platList)"
            clearable
          />
        </NFormItemGi>
        <NFormItemGi span="24 s:12 m:6" label="订单状态" path="userStatus" class="pr-24px">
          <NSelect
            v-model:value="model.status"
            placeholder="请选择状态"
            :options="orderStatus"
            clearable
          />
        </NFormItemGi>

        <NFormItemGi span="24 s:12 m:6" label="账号" class="pr-24px">
          <NInput v-model:value="model.username" placeholder="请输入账号" />
        </NFormItemGi>
        <NFormItemGi span="24 s:12 m:6" label="密码" class="pr-24px">
          <NInput v-model:value="model.password" placeholder="请输入密码" />
        </NFormItemGi>
        <NFormItemGi span="24 s:12 m:6" label="请输入姓名" class="pr-24px">
          <NInput v-model:value="model.name" placeholder="请输入姓名" />
        </NFormItemGi>
        <NFormItemGi span="24 s:12 m:6" label="学校"  class="pr-24px">
          <NInput v-model:value="model.school" placeholder="请输入学校" />
        </NFormItemGi>
        <NFormItemGi span="24 s:12 m:6" label="课程名"  class="pr-24px">
          <NInput v-model:value="model.courseName" placeholder="请输入课程名称" />
        </NFormItemGi>
        <NFormItemGi span="24 s:12 m:6" label="归属标记"  class="pr-24px">
          <NSelect
              v-model:value="model.tag"
              placeholder="请选归属标记"
              :options="tagsList(tags)"
              clearable
          />        </NFormItemGi>
<!--        <NFormItemGi span="24 s:12 m:6" label="平台" class="pr-24px">-->
<!--          <NInput v-model:value="model.plat" placeholder="请输入平台" />-->
<!--        </NFormItemGi>-->
<!--        <NFormItemGi span="24 s:12 m:6" :label="$t('page.manage.user.nickname')" path="nickname" class="pr-24px">-->
<!--          <NInput v-model:value="model.nickname" :placeholder="$t('page.manage.user.form.nickname')" />-->
<!--        </NFormItemGi>-->

        <NFormItemGi span="24 s:12" class="pr-24px">
          <NSpace class="w-full" justify="end">
            <NButton @click="reset">
              <template #icon>
                <icon-ic-round-refresh class="text-icon" />
              </template>
              {{ $t('common.reset') }}
            </NButton>
            <NButton type="primary" ghost @click="search">
              <template #icon>
                <icon-ic-round-search class="text-icon" />
              </template>
              {{ $t('common.search') }}
            </NButton>
          </NSpace>
        </NFormItemGi>

      </NGrid>
    </NForm>
  </NCard>
</template>

<style scoped></style>
