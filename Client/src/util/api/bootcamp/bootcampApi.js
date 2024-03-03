import { host } from "../host";

export const createBootcampAPI = `${host}/bootcamp`
export const createTemplateBootcampAPI = `${host}/bootcamp/template`
export const importBootcampFromExcelFile = `${host}/import`

export const getAllBootcampAPI = (year) => (`${host}/bootcamp?year=${year}`)
export const getBootcampsForTrackingByUserIDAPI = (userID) => (`${host}/bootcamp/detail?author=${userID}`)
export const getBootcampByUserIDAPI = (userID) => (`${host}/bootcamp?author=${userID}`)
export const updateBootcampAPI = (bootcampID) => (`${host}/bootcamp/${bootcampID}`)
export const getBootcampByIdAPI = (bootcampID) => (`${host}/bootcamp/${bootcampID}`)

export const exportBootcampAPI = (bootcampID) => (`${host}/bootcamp/${bootcampID}/export`)