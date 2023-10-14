import { configureStore } from '@reduxjs/toolkit'
import createBootCamp from './CreateBootcamp/createBootCamp'


export const store = configureStore({
  reducer: {
    createBootCamp
  },
})