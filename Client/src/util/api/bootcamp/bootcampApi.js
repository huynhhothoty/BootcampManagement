import { host } from "../host";

export const createBootcampAPI = `${host}/bootcamp`

export const getAllBootcampAPI = (year) => (`${host}/bootcamp?year=${year}`)
export const getBootcampByUserIDAPI = (userID) => (`${host}/bootcamp?author=${userID}`)