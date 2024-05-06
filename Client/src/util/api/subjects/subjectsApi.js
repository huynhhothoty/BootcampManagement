import { host } from "../host";

export const createSubjectAPI = `${host}/subject`
export const getAllSubjectAPI = (param,data) => (`${host}/subject?${param}=${data}`)
export const updateSubjectAPI = (subjectID) => (`${host}/subject/${subjectID}`)
export const querySubjectAPI = (query) => (`${host}/subject?${query}`)
export const deleteSubjectAPI = (subjectID) => (`${host}/subject/${subjectID}`)