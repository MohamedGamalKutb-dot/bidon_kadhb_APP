import { client } from "../../DB/redis.connection.js";

export const set = async ({ Key, value, ttl = undefined } = {}) => {
  if (typeof value == "object") {
    value = JSON.stringify(value);
  }
  return await client.set(Key, value, { EX: ttl });
};

export const get = async ({ Key } = {}) => {
  let value = await client.get(Key);
  try {
    return JSON.parse(value);
  } catch (error) {
    return value;
  }
};

export const exist = async ({ Key } = {}) => {
  return await client.exists(Key);
};

export const update = async ({ Key, value, ttl = undefined } = {}) => {
  if (!(await exist({ Key }))) {
    return 0;
  }
  return await set(Key, value, ttl);
};

export const del = async ({ Key } = {}) => {
  return await client.del(Key);
};

export const Keys = async ({ prefix } = {}) => {
  return await client.keys(`${prefix}*`);
};
export const ttl = async ({ Key } = {}) => {
  return await client.ttl(Key);
};
export const expire = async ({ Key, ttl} = {}) => {
  return await client.expire(Key,ttl);
};
export const incrBy = async ({ Key, value=1} = {}) => {
  return await client.incrBy(Key,value);
};
