import { isValidObjectId } from 'mongoose';

export const isValidStringParam = (param: any, checkType: 'id' | 'slug' | 'epSlug' | 'seSlug'): param is string => {
  if (typeof param !== 'string') {
    return false;
  }
  if (checkType === 'id') {
    return isValidObjectId(param);
  }
  if (checkType === 'slug') {
    return param.trim() !== '';
  }
  //dummy check slug của ep và se
  if (checkType === 'epSlug') {
    return param.trim() !== '';
  }
  if (checkType === 'seSlug') {
    return param.trim() !== '';
  }
  return false;
};