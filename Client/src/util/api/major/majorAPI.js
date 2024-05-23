import { host } from "../host";

export const getMajorByIdAPI = (majorId) => (`${host}/major/${majorId}`)
export const getAllMajorAPI = () => (`${host}/major?isActive=true`)
export const queryAllMajorAPI = (query) => (`${host}/major?${query}`)
export const updateMajorAPI = (majorId) => (`${host}/major/${majorId}`)
export const updateBranchMajorAPI = (branchId) => (`${host}/branch/${branchId}`)
export const getDepartmentByIdAPI = (departmentId) => (`${host}/department/${departmentId}`)
export const getBranchMajorByIdAPI = (branchId) => (`${host}/branch/${branchId}`)
export const addBranchMajorAPI = () => (`${host}/branch`)
export const queryAllDepartmentAPI = (query) => (`${host}/department?isActive=true&${query}`)
export const updateDepartmentAPI = (departmentId) =>  (`${host}/department/${departmentId}`)
export const createDepartmentAPI = () =>  (`${host}/department`)
export const createMajorAPI = () => (`${host}/major`)