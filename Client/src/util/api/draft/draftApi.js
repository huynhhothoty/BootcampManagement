import { host } from "../host";

export const createDraftAPI = `${host}/draft`
export const updateDraftAPI = (draftID) => (`${host}/draft/${draftID}`)
export const getDraftByUserAPI = (userID) => (`${host}/draft?author=${userID}`)
export const deleteDraftAPI = (draftID) => (`${host}/draft/${draftID}`)