import { host } from "../host";

export const queryAllTeacherAPI = (query) => (`${host}/teacher?${query}`)
export const updateTeacherAPI = (teacherId) => (`${host}/teacher/${teacherId}`)
export const addTeacherAPI = () => (`${host}/teacher`)