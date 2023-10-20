import Login from './page/Login/Login'
import './sass/main.scss'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Main from './template/Main/Main'
import Home from './page/Home/Home'
import CreateBootcamp from './page/CreateBootcamp/CreateBootcamp'

import { Modal, Spin, notification } from 'antd'
import {useSelector } from 'react-redux'
import { createContext } from 'react'


const ReachableContext = createContext(null);



function App() {
  const {loading} = useSelector(store => store.Loading)
  const [api, contextHolder] = notification.useNotification();
  const [modal, modalContextHolder] = Modal.useModal();
  const openNotification = (type,title,description) => {
    api[type]({
      message: title,
      description:description,
    });
  };



  return (
    <>
    <ReachableContext.Provider value="Light">
    {/* <ConfirmModal/> */}
    {contextHolder}
    {modalContextHolder}
    <Spin tip="Loading..." size='large' spinning={loading}>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Main />}>
          <Route path="" element={<Home />} />
          <Route path="/createBootcamp" element={<CreateBootcamp  openNotification={openNotification} confirmModal={modal}/>} />
        </Route>
      </Routes>
    </BrowserRouter>
    </Spin>
    </ReachableContext.Provider>
    </>
  )
}

export default App
