import { Card, Col, Row } from "antd"
import BootcampProgressCard from "../../components/Home/BootcampProgressCard/BootcampProgressCard";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBootcampsByUserID, getBootcampsForTrackingByUserID } from "../../redux/bootcamp/bootcamp";
import SemesterCheckList from "../../components/Home/SemesterCheckList";
import { getMajorById } from "../../redux/major/major";
const Home = () => {
  const dispatch = useDispatch()
  const {userTrackingBootcampList} = useSelector(store => store.bootcamp)
  const [renderBootcampData, setRenderBootcampData] = useState([])
  const [open, setOpen] = useState(false);
  const [drawerData,setDrawerData] = useState({
    semesterList: [],
    allocation: []
  })
  const showDrawer = (bootcamp) => {
    setOpen(true);
    drawerData.semesterList = bootcamp.detail
    drawerData.allocation = bootcamp.allocation.detail
    setDrawerData(drawerData)
  };
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
          <BootcampProgressCard bootcamp={bootcamp}/>
        </Card>
      </Col>)
    })
  }
  useEffect(() => {
    dispatch(getBootcampsForTrackingByUserID())
    dispatch(getMajorById('651ea4fac9a4c12da715528f'))
  },[])

  return (
    <div className="bootcamp-progress">
      <SemesterCheckList open={open} setOpen={setOpen} drawerData={drawerData}/>
      <Row gutter={[16, 16]}>
       {renderBootcampStatic()}
      </Row>
    </div>
  )
}

export default Home