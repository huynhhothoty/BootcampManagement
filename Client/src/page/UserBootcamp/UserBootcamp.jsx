import { useState } from 'react'
import { useDispatch } from 'react-redux';

import AllBootcampTable from '../../components/UserBootcamp/AllBootcampTable';
import BootcampDetail from '../../components/UserBootcamp/BootcampDetail';
import { Breadcrumb } from 'antd';
import { Outlet } from 'react-router-dom';


const UserBootcamp = () => {
    const dispatch = useDispatch()
    const [viewState, setViewState] = useState("all")
    const [breadCrumbList, setBreadCrumbList] = useState([
        {
            title: "All Curriculum",
        }
    ])
   
  return (
    <>
        <Breadcrumb style={{marginBottom:10}} items={breadCrumbList} />
         
       
        
        <Outlet context={{setBreadCrumbList}}/>
    </>
  )
}

export default UserBootcamp