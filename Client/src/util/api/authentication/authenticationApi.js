import { host } from "../host";

export const loginApi = `${host}/user/login`
export const getUserByIdAPI = (userId) => (`${host}/user/${userId}`)
export const createUserAPI = () => (`${host}/user/register`)
export const updateUserAPI = () => (`${host}/user/changeinfo`)
export const changeUserPasswordAPI = () => (`${host}/user/changepassword`)
export const resetPasswordAPI = () => (`${host}/user/changepasswordadmin`)
export const queryAllUserAPI = (query) => (`${host}/user?role=teacher&${query}`)
export const getUserDataAPI = () => (`${host}/user/me`)
