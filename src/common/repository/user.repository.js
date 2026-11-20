import * as base from './base.repository.js'
import { UserModel } from './../../DB/model/user.model.js';

export const create = async ({
    date = [], 
    options = {} 
} = {}) => {
  return await base.create({date, options, model : UserModel});
};

export const createOne = async ({    
    date, 
    options = {} 
} = {}) => {
  return await base.createOne({date, options, model : UserModel});
};

export const find = async ({
  filter = {},
  options = {},
  
} = {}) => {
  
  return await base.find({filter, options, model : UserModel});
};
export const paginate = async ({
  filter = {},
  options = {},
  model,
  page=1,
  limit=5
} = {}) => {
    return await base.paginate({filter, options, model : UserModel, page, limit});
};

export const countDocuments = async ({
  filter = {},
  
} = {}) => {
  return await base.countDocuments({filter, model : UserModel});
};

export const findById = async ({ 
    id, 
    options = {},   
}) => {
  
  return  await base.findById({id, options, model : UserModel});
};

export const findOne = async ({
  filter = {},
  options = {},
} = {}) => {
  return await base.findOne({filter,options,model : UserModel}) ;
};

export const insertMany = async ({ 
    data,  
}) => {
  return await base.insertMany({data,  model : UserModel});
};

export const updateOne = async ({ 
    filter, 
    update, 
    options, 
     
} = {}) => {
  return await base.updateOne({filter, update, options, model : UserModel});
};

export const findOneAndUpdate = async ({
  filter,
  update,
  options,
} = {}) => {
  return await base.findOneAndUpdate({filter, update, options, model : UserModel})
};

export const findByIdAndUpdate = async ({
  id,
  update,
  options = { new: true }, 
}) => {
  return await base.findByIdAndUpdate({id, update, options, model : UserModel});
  
};

export const deleteOne = async ({ 
    filter, 
  
}) => {
  return await base.deleteOne({filter, model : UserModel});
};

export const deleteMany = async ({ 
    filter, 
  }) => {
  return await base.deleteMany({filter, model : UserModel});
};

export const findOneAndDelete = async ({ 
    filter, 
  } = {}) => {
  return await base.findOneAndDelete({filter, model : UserModel});
};
