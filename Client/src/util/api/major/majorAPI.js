import { host } from "../host";

export const getMajorByIdAPI = (majorId) => (`${host}/major/${majorId}`)
export const getAllMajorAPI = () => (`${host}/major`)
export const updateMajorAPI = (majorId) => (`${host}/major/${majorId}`)
export const getDepartmentByIdAPI = (departmentId) => (`${host}/department/${departmentId}`)
export const queryAllDepartmentAPI = (query) => (`${host}/department?${query}`)
export const updateDepartmentAPI = (departmentId) =>  (`${host}/department/${departmentId}`)
export const createDepartmentAPI = () =>  (`${host}/department`)