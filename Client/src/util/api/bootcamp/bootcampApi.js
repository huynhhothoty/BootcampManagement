import { host } from "../host";

export const createBootcampAPI = `${host}/bootcamp`
export const createTemplateBootcampAPI = `${host}/bootcamp/template`
export const importBootcampFromExcelFile = (majorId) => `${host}/import?majorId=${majorId}`

export const getAllBootcampAPI = (year) => (`${host}/bootcamp?year=${year}&isActive=true`)
export const getBootcampsForTrackingByUserIDAPI = (userID) => (`${host}/bootcamp/detail?author=${userID}&isActive=true`)
export const getBootcampByUserIDAPI = (userID) => (`${host}/bootcamp?author=${userID}&isActive=true`)
export const updateBootcampAPI = (bootcampID) => (`${host}/bootcamp/${bootcampID}`)
export const getBootcampByIdAPI = (bootcampID) => (`${host}/bootcamp/${bootcampID}`)
export const queryAllBootcampAPI = (queryString,userId) => (`${host}/bootcamp?${queryString}&${userId ? `author=${userId}` : ''}`)

export const exportBootcampAPI = (bootcampID) => (`${host}/bootcamp/${bootcampID}/export`)