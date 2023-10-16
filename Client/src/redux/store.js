import { configureStore } from '@reduxjs/toolkit'
import createBootCamp from './CreateBootcamp/createBootCamp'
import Loading from './loading/Loading'
import bootcamp from './bootcamp/bootcamp'
import allowcate from './allocate/allowcate'
import subject from './subject/subject'

subject
export const store = configureStore({
  reducer: {
    createBootCamp,
    Loading,
    bootcamp,
    allowcate,
    subject
  },
})