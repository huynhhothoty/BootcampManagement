import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import {Provider} from 'react-redux'
import { store } from './redux/store.js'
import en_US from 'antd/locale/en_US.js'
import { ConfigProvider } from 'antd'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
    <ConfigProvider locale={en_US}>
    <App />
    </ConfigProvider>
    </Provider>
  </React.StrictMode>,
)
