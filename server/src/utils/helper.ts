import { isValidObjectId } from 'mongoose';

export const isValidStringParam = (param: any, checkType: 'id' | 'slug'): param is string => {
  if (typeof param !== 'string') {
    return false;
  }
  if (checkType === 'id') {
    return isValidObjectId(param);
  }
  if (checkType === 'slug') {
    return param.trim() !== '';
  }
  return false;
};