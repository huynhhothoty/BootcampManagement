import { Card, Col, Row } from "antd"
import BootcampProgressCard from "../../components/Home/BootcampProgressCard/BootcampProgressCard";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBootcampsByUserID, getBootcampsForTrackingByUserID } from "../../redux/bootcamp/bootcamp";

import { getMajorById } from "../../redux/major/major";
import { updateLoading } from "../../redux/loading/Loading";
import BootcampSemesterDrawer from "../../components/Home/BootcampSemesterDrawer";
import TestComp from "../../components/TestComp";
const Home = () => {
  const dispatch = useDispatch()
  const {userTrackingBootcampList} = useSelector(store => store.bootcamp)
  const [renderBootcampData, setRenderBootcampData] = useState([])
  const [openDrawer, setOpenDrawer] = useState(false);
  const onClose = () => {
    setOpenDrawer(false);
  };
  const [drawerData,setDrawerData] = useState({
    semesterList: [],
    allocation: {},
    bootcampId: ''
  })
  const showDrawer = (bootcamp) => {
    setOpenDrawer(true);
    drawerData.semesterList = bootcamp.detail
    drawerData.allocation = bootcamp.allocation
    drawerData.bootcampId = bootcamp._id
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
      console.log(bootcamp)
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
  useEffect(() => {
    (async () => {
 
      await dispatch(getBootcampsForTrackingByUserID())
      await dispatch(getMajorById('651ea4fac9a4c12da715528f'))

    })()
    
  },[])

  return (
    <div className="bootcamp-progress">
      <TestComp/>
      <BootcampSemesterDrawer open={openDrawer} onClose={onClose} data={drawerData} resetDrawerData={resetDrawerData}/>
      <Row gutter={[16, 16]}>
       {renderBootcampStatic()}
      </Row>
    </div>
  )
}

export default Home