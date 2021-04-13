/*
 * @Author: your name
 * @Date: 2021-04-11 19:35:45
 * @LastEditTime: 2021-04-13 16:03:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \zhihu\zheye\src\helper.ts
 */
import { ColumnProps, ImageProps, UserProps } from './store'
import createMessage from './components/createMessage'

export function generateFitUrl(data: ImageProps, width: number, height: number, format = ['m_pad']) {
  if (data && data.url) {
    const formatStr = format.reduce((prev, current) => {
      return current + ',' + prev
    }, '')
    data.fitUrl = data.url + `?x-oss-process=image/resize,${formatStr}h_${height},w_${width}`
  }
}

export function addColumnAvatar(data: ColumnProps | UserProps, width: number, height: number) {
  if (data.avatar) {
    generateFitUrl(data.avatar, width, height)
  } else {
    const parseCol = data as ColumnProps
    data.avatar = {
      fitUrl: require(parseCol.title ? '@/assets/column.jpg' : '@/assets/avatar.jpg')
    }
  }
}

// 文件验证函数
interface CheckCondition {
  format?: string[];
  size?: number;
}
type ErrorType = 'size' | 'format' | null;

/**
 * @description: 
 * @param {File} file 文件
 * @param {CheckCondition} condition 过滤/检查条件
 * @return {boolean & ErrorType} 是否通过 & 错误类型
 */
export function beforeUploadCheck(file: File, condition: CheckCondition) {
  // 目前暂时验证两种错误
  const { format, size } = condition
  // 是否包含该类型
  const isValidFormat = format ? format.includes(file.type) : true
  //                            Byte为单位  转换为 MB  
  const isValidSize = size ? (file.size / 1024 / 1024 < size) : true
  let error: ErrorType = null
  // 只显示最先出现的错误
  if (!isValidFormat) {
    error = 'format'
  }
  else if (!isValidSize) {
    error = 'size'
  }
  return {
    passed: isValidFormat && isValidSize,
    error
  }
}

// 再次封装检查函数，通用的检查
/**
 * @description: 
 * @param {File} file 文件类型
 * @return {boolean} 是否通过验证
 */
export const commonUploadCheck = (file: File) => {
  const result = beforeUploadCheck(file, {
    format: ['image/jpeg', 'image/png'],
    size: 5
  })
  const { passed, error } = result

  switch (error) {
    case 'format':
      createMessage('上传图片只能是 JPG/PNG 格式!', 'error');
      break;
    case 'size':
      createMessage('上传图片大小不能超过 5Mb', 'error');
      break;
    default:
      createMessage('格式正确', 'success');
  }

  return passed; // 返回验证结果
}



interface TestProps {
  _id: string;
  name: string;
}

const testData: TestProps[] = [{ _id: '1', name: 'a' }, { _id: '2', name: 'b' }];

/**
 * @description: 
 * @param {Array<T>}          数组
 * @return {[key: strng]: T}  键值对
 */
//                          泛型约束成可能有 _id属性
export const arrToObj = <T extends { _id?: string }>(arr: Array<T>) => {
  // 这里归并相当于给初始为空的obj添加键值对
  // 归并      之前的结果（其实一直都是同一个结果对象） 当前值
  return arr.reduce((prev, current) => {
    console.log(prev, current);
    if (current._id) {
      prev[current._id] = current
    }
    return prev
  }, {} as { [key: string]: T })  // 初始数据，类型断言成我们想要的数据类型
}

const result = arrToObj(testData);
console.log(result);


const testData2: { [key: string]: TestProps } = {
  1: { _id: '1', name: 'a' },
  2: { _id: '2', name: 'b' }
}
//                                方括号里的类型可变
export const objToArr = <V>(obj: { [key: string]: V }) => {
  return Object.keys(obj).map(key => obj[key])
}

console.log(objToArr(testData2));




