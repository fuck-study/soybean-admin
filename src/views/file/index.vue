<script setup lang="tsx">
import {ref} from 'vue';
import {NTag} from 'naive-ui';
// import { useBoolean } from '@sa/hooks';
import {fetchFileList, fetchLogList} from '@/service/api';
import {useAppStore} from '@/store/modules/app';
import {useTable} from '@/hooks/common/table';

const appStore = useAppStore();
// const {bool: drawerVisible, setTrue: openDrawer} = useBoolean();
const fileName = ref("")

const {columns, data, loading, pagination, getData} = useTable({
  apiFn: fetchFileList,
  apiParams: {
    pageNo: 1,
    pageSize: 10,
    fileName,
  },
  transformer: res => {
    const {records = [], current = 1, size = 10, total = 0} = res.data || {};
    return {
      data: records,
      pageNum: current,
      pageSize: size,
      total
    };
  },
  columns: () => [
    {
      key: 'fileHash',
      title: '文件ID',
      align: 'center',
      width: 150,
    },
    {
      key: 'fileName',
      title: '文件名',
      align: 'center',
      width: 170,
    },
    {
      key: 'createTime',
      title: '时间',
      align: 'center',
      width: 175,
    },
  ]
});

const checkedRowKeys = ref<string[]>([]);

/** the editing row data */
// const editingData = ref<Api.SystemManage.User | null>(null);
// watch(searchParams.value,item=>{
//   console.log(item)
// })

const update = (val, idx) => {
  getData()
}

</script>

<template>
  <div class="flex-vertical-stretch gap-16px overflow-hidden <sm:overflow-auto">
    <n-upload
      multiple
      directory-dnd
      @finish="getData"
      action="/api/file/v2"
      :max="1000">
      <n-upload-dragger>
<!--        <div style="margin-bottom: 12px">-->
<!--          <n-icon size="48" :depth="3">-->
<!--            <ArchiveIcon />-->
<!--          </n-icon>-->
<!--        </div>-->
        <n-text style="font-size: 16px">
          点击或者拖动文件到该区域来上传
        </n-text>
        <n-p depth="3" style="margin: 8px 0 0 0">
          上传人脸视频仅支持mp4格式,命名格式为: 账号.mp4
        </n-p>
      </n-upload-dragger>
    </n-upload>

    <NCard title="文件列表" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
      <template #header-extra>
        <n-input v-model:value="fileName" placeholder="请输文件名" />
        <n-button  type="primary" ghost @click="getData">
          搜索
        </n-button>
      </template>
      <NDataTable
        remote
        v-model:checked-row-keys="checkedRowKeys"
        :columns="columns"
        :data="data"
        size="small"
        :flex-height="!appStore.isMobile"
        :scroll-x="640"
        :loading="loading"
        :pagination="pagination"
        :row-key="item => item.id"
        class="sm:h-full"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
