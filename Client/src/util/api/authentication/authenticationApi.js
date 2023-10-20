import { host } from "../host";

export const loginApi = `${host}/user/login`
export const getUserByIdAPI = (userId) => (`${host}/user/${userId}`)