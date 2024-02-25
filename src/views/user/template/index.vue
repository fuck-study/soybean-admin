<script setup lang="tsx">
import {onMounted, reactive, ref, watch} from 'vue';
import { NPopconfirm,NTags } from 'naive-ui';
// import { useBoolean } from '@sa/hooks';
// import { useAppStore } from '@/store/modules/app';
import {addTemplet, delTemplet, fetchDeleteUser, fetchPlat, getTemplet, updateTemplet} from "@/service/api";
import {NButton} from "naive-ui";
import {useTable} from "@/hooks/common/table";
import {$t} from "@/locales";
import OperateDrawer, { type OperateType } from '@/views/user/template/modules/operate-drawer.vue';
import {useBoolean} from "~/packages/hooks";



const operateType = ref<OperateType>('add');
const editingData = ref(null);
const {bool: drawerVisible, setTrue: openDrawer} = useBoolean();


function handleEdit(id: number) {
  operateType.value = 'edit';
  editingData.value = data.value.find(item => item.id === id) || null;
  openDrawer();
}

function handleAdd() {
  operateType.value = 'add';
  openDrawer();
}
const platList = ref([])
onMounted(async () => {
  const data = await fetchPlat()
  platList.value = data.data


  // for (const itemElement of tempterList.value) {
  //  let arr = data.data.map(i=>{
  //     if (JSON.parse(itemElement.template).find(item => item.plat === i.plat)){
  //       let obj = JSON.parse(itemElement.template).find(item => item.plat === i.plat)
  //       return {
  //         id:itemElement.id,
  //         cost: i.price,
  //         plat: i.plat,
  //         price: obj.price,
  //         name: i.name,
  //         enable: true
  //       }
  //     }else {
  //       return {
  //         id:itemElement.id,
  //         cost: i.price,
  //         plat: i.plat,
  //         price: i.price,
  //         name: i.name,
  //         enable: false
  //       }
  //     }
  //   })
  //   platList.value.push(arr)
  //
  //   }
})


const model = reactive( {
  overId:'',
  template: '[]',
  name: ''
});
const checkedRowKeys = ref<string[]>([]);


// async function save(body){
//   model.template = JSON.stringify(body.filter(i => i.enable).map(item=>{
//     return {
//       name: item.name,
//       plat: item.plat,
//       price: item.price
//     }
//   }))
//   await updateTemplet(model,body[0].id)
//   console.log(model)
// }


async function add(){
  model.template = JSON.stringify(platList.value.filter(i => i.enable).map(item=>{
    return {
      name: item.name,
      plat: item.plat,
      price: item.price
    }
  }))
  await addTemplet(model)
  getData();


}
async function handleBatchDelete() {
  // request
  for (let string of checkedRowKeys.value) {
    await delTemplet(parseInt(string))
  }
  window.$message?.success($t('common.deleteSuccess'));

  checkedRowKeys.value = [];

  getData();
}
async function handleDelete(id: number) {
  await delTemplet(id)
  window.$message?.success($t('common.deleteSuccess'));
  getData();
}
watch(drawerVisible,  item => {
  if (!item) {
    getData();
  }
});
const {columns, filteredColumns, data, loading, pagination, getData, searchParams, resetSearchParams} = useTable<
    Api.SystemManage.User,
    typeof getTemplet,
    'index' | 'operate'
>({
  apiFn: getTemplet,
  transformer: res => {
    console.log(res.data)
    const {records, current = 1, size = 10, total = 0} = res.data || {};
    return {
      data: res.data,
      pageNum: current,
      pageSize: size,
      total
    };
  },
  columns: () => [
    {
      type: 'selection',
      align: 'center',
      width: 48
    },
    {
      key: 'name',
      title: '名称',
      align: 'center',
      width: 150
    },
    {
      key: 'template',
      title: '平台',
      align: 'center',
      render: row => {
        try {
          row.platList = platList.value.map(item => {
            for (let parseElement of JSON.parse(row.template)) {
              if (parseElement.plat === item.plat) {
                return {
                  cost: item.price,
                  plat: item.plat,
                  price: parseElement.price,
                  name: item.name,
                  enable: true
                }
              }
            }
            return {
              cost: item.price,
              plat: item.plat,
              price: item.price,
              name: item.name,
              enable: false
            }
          })
          return row.platList.filter(i => i.enable).map(item => {
            return <NTag type="info" style="margin:3px">{item.name}</NTag>;
          })
        } catch (e) {
        }
        return <p></p>
      }
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 130,
      render: row => (
          <div class="flex-center gap-8px">
            <NButton type="primary" ghost size="small"  onClick={() => handleEdit(row.id)}>
              {$t('common.edit')}
            </NButton>
            <NPopconfirm onPositiveClick={() => handleDelete(row.id)}>
              {{
                default: () => $t('common.confirmDelete'),
                trigger: () => (
                    <NButton type="error" ghost size="small">
                      {$t('common.delete')}
                    </NButton>
                )
              }}
            </NPopconfirm>
          </div>
      )
    }
  ]
});

</script>

<template>



  <div class="flex-vertical-stretch gap-16px <sm:overflow-auto">
    <NCard title="模版列表" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
      <template #header-extra>
        <TableHeaderOperation
            v-model:columns="filteredColumns"
            :disabled-delete="checkedRowKeys.length === 0"
            :loading="loading"
            :allow="['add']"
            @add="handleAdd"
            @delete="handleBatchDelete"
            @refresh="getData"
        />
      </template>
      <NDataTable
          v-model:checked-row-keys="checkedRowKeys"
          :columns="columns"
          remote
          :data="data"
          size="small"
          :scroll-x="640"
          :loading="loading"
          :pagination="pagination"
          :row-key="item => item.id"
          class="sm:h-full"
      />
      <OperateDrawer
          v-model:visible="drawerVisible"
          :operate-type="operateType"
          :row-data="editingData"
          @submitted="getData"
      />
    </NCard>
<!--    <NCard title="模版列表" :bordered="false" size="small" >-->
<!--      <n-collapse>-->

<!--        <n-collapse-item title="模版"  v-for="body in platList" >-->
<!--          <div v-for="item in body">-->
<!--            <n-space class="w-full" :size="24" justify="start">-->
<!--              <NFormItem :label="`${item.name}(成本${item.cost})`" path="plat">-->
<!--                <n-input-number-->
<!--                    v-model:value="item.price"-->
<!--                    style="width: 180px;margin:0 5px"-->
<!--                    placeholder="输入价格"-->
<!--                    min="0"-->
<!--                />-->
<!--                <n-switch v-model:value="item.enable" @click="save(body)" />-->
<!--              </NFormItem>-->
<!--            </n-space>-->
<!--          </div>-->
<!--        </n-collapse-item>-->

<!--      </n-collapse>-->



<!--    </NCard>-->

  </div>
</template>

<style scoped></style>
