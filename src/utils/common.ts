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


export const orderStatus = [
  {
    value: -1,
    label: '异常',
    tag: 'error'
  },
  {
    value: -10,
    label: '密码错误',
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
    label: '习惯分',
    tag: 'info'
  },
  {
    value: 5,
    label: '见面课',
    tag: 'warning'
  }
];
