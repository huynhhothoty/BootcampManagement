import { Card, Col, Row } from "antd"
import BootcampProgressCard from "../../components/Home/BootcampProgressCard/BootcampProgressCard";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBootcampsByUserID, getBootcampsForTrackingByUserID } from "../../redux/bootcamp/bootcamp";

import { getMajorById } from "../../redux/major/major";
import { updateLoading } from "../../redux/loading/Loading";
import BootcampSemesterDrawer from "../../components/Home/BootcampSemesterDrawer";
import TestComp from "../../components/TestComp";
import { USER_DATA } from "../../util/constants/sectionStorageKey";
import { queryAllTeacher } from "../../redux/teacher/teacher";
const Home = () => {
  const dispatch = useDispatch()
  const {userTrackingBootcampList} = useSelector(store => store.bootcamp)
  const [openDrawer, setOpenDrawer] = useState(false);
  const [bootcampCardList,setBootcampCardList] = useState([])
  const [teacherList, setTeacherList] = useState([])
  const onClose = () => {
    setOpenDrawer(false);
  };
  const [drawerData,setDrawerData] = useState({
    semesterList: [],
    allocation: {},
    bootcampId: '',
    branchMajorSemester: 0
  })
  const showDrawer = (bootcamp) => {
    setOpenDrawer(true);
    drawerData.semesterList = bootcamp.detail
    drawerData.allocation = bootcamp.allocation
    drawerData.bootcampId = bootcamp._id
    drawerData.branchMajorSemester = bootcamp.branchMajorSemester
    setDrawerData(drawerData)
  };
  const resetDrawerData = () => {
    setDrawerData({
      semesterList: [],
      allocation: {},
      bootcampId: ''
    })
  }
  const renderBootcampStatic = () => {
    return userTrackingBootcampList.map((bootcamp) => {
      return (<Col
        xxl={8}
        xl={8}
        lg={12}
        md={12}
        sm={24}
        key={bootcamp.id}
      >
        <Card
          hoverable
          style={{
            width: "100%",
          }}
          onClick={() => {showDrawer(bootcamp)}}
        >
          <BootcampProgressCard bootcamp={bootcamp} />
        </Card>
      </Col>)
    })
  }

  const getTeacherList = async () => {
    let res = await dispatch(queryAllTeacher(''))
    setTeacherList(res.payload.data)
  }

  useEffect(() => {
    (async () => {
      let userData = sessionStorage.getItem(USER_DATA);
      if(userData){
        await dispatch(getBootcampsForTrackingByUserID())
        await dispatch(getMajorById('651ea4fac9a4c12da715528f'))
      }
    

    })()
    
  },[])

  useEffect(() => {
    if(userTrackingBootcampList){
      setBootcampCardList(renderBootcampStatic())
    }
    
  },[userTrackingBootcampList])

  useEffect(() => {
    getTeacherList()
  },[])

  return (
    <div className="bootcamp-progress">
      <BootcampSemesterDrawer open={openDrawer} onClose={onClose} data={drawerData} resetDrawerData={resetDrawerData} teacherList={teacherList}/>
      <Row gutter={[16, 16]}>
       {bootcampCardList}
      </Row>
    </div>
  )
}

export default Home