import { host } from "../host";

export const createFieldAPI = `${host}/allocation`
export const getAllowcateByIdAPI = (allowcateId) => (`${host}/allocation/${allowcateId}`)
export const updateAllowcateAPI = (allowcateId) => (`${host}/allocation/${allowcateId}`)