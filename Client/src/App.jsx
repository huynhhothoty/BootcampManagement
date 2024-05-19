import Login from './page/Login/Login'
import './sass/main.scss'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Main from './template/Main/Main'
import Home from './page/Home/Home'
import CreateBootcamp from './page/CreateBootcamp/CreateBootcamp'

import { Modal, Spin, notification } from 'antd'
import {useSelector } from 'react-redux'
import { createContext } from 'react'
import UserBootcamp from './page/UserBootcamp/UserBootcamp'
import AllBootcampTable from './components/UserBootcamp/AllBootcampTable'
import BootcampDetail from './components/UserBootcamp/BootcampDetail'
import AllSubject from './page/Subject/AllSubject'
import AllDepartment from './page/Department/AllDepartment'
import AllMajor from './page/Major/AllMajor'
import UserList from './page/UserList/UserList'


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
          <Route path="/createbootcamp" element={<CreateBootcamp  openNotification={openNotification} confirmModal={modal}/>} />
          <Route path="/subject" element={<AllSubject  openNotification={openNotification} confirmModal={modal}/>} />
          <Route path="/department" element={<AllDepartment  openNotification={openNotification} confirmModal={modal}/>} />
          <Route path="/major" element={<AllMajor  openNotification={openNotification} confirmModal={modal}/>} />
          <Route path="/user" element={<UserList  openNotification={openNotification} confirmModal={modal}/>} />
          <Route path="/userbootcamp" element={<UserBootcamp  openNotification={openNotification} confirmModal={modal}/>} >
            <Route path="" element={<AllBootcampTable/>}/>
            <Route path="viewbootcamp" element={<BootcampDetail openNotification={openNotification} confirmModal={modal}/>}/>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
    </Spin>
    </ReachableContext.Provider>
    </>
  )
}

export default App
