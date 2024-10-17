import { $t } from '@/locales';

/**
 * Transform record to option
 *
 * @example
 *   ```ts
 *   const record = {
 *     key1: 'label1',
 *     key2: 'label2'
 *   };
 *   const options = transformRecordToOption(record);
 *   // [
 *   //   { value: 'key1', label: 'label1' },
 *   //   { value: 'key2', label: 'label2' }
 *   // ]
 *   ```;
 *
 * @param record
 */
export function transformRecordToOption<T extends Record<string, string>>(record: T) {
  return Object.entries(record).map(([value, label]) => ({
    value,
    label
  })) as CommonType.Option<keyof T>[];
}

/**
 * Translate options
 *
 * @param options
 */
export function translateOptions(options: CommonType.Option<string>[]) {
  return options.map(option => ({
    ...option,
    label: $t(option.label as App.I18n.I18nKey)
  }));
}

/**
 * Translate options
 *
 * @param options
 */
export function translatePlatList(options: any[]) {
  return options.map(option => ({
    value: option.plat,
    label: option.name
  }));
}

export function tagsList(options: any) {
  return options.map(option => ({
    value: option,
    label: option
  }));

}

export function ipList(options: any) {
  return options.map(option => ({
    value: option,
    label: option
  }));

}


export const orderStatus = [
  {
    value: -2,
    label: '已知异常',
    tag: 'error'
  },
  {
    value: -1,
    label: '未知异常',
    tag: 'error'
  },
  {
    value: -10,
    label: '密码错误',
    tag: 'error'
  },
  {
    value: -20,
    label: '课程异常',
    tag: 'error'
  },
  {
    value: -30,
    label: '暂无人脸',
    tag: 'error'
  },
  {
    value: -31,
    label: '人脸未通过',
    tag: 'error'
  },
  {
    value: -32,
    label: '视频解析失败',
    tag: 'error'
  },
  {
    value: -11,
    label: '已结课',
    tag: 'error'
  },
  {
    value: 1,
    label: '已完成',
    tag: 'success'
  },
  {
    value: 0,
    label: '队列中',
    tag: 'default'
  },
  {
    value: -99,
    label: '队列中',
    tag: 'default'
  },
  {
    value: 2,
    label: '进行中',
    tag: 'info'
  },
  {
    value: 3,
    label: '待考试',
    tag: 'warning'
  },
  {
    value: 4,
    label: '讨论中',
    tag: 'info'
  },
  {
    value: 5,
    label: '见面课',
    tag: 'warning'
  }
];
