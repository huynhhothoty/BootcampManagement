import { Card, Col, Row } from "antd"
import BootcampProgressCard from "../../components/Home/BootcampProgressCard/BootcampProgressCard";
import fakeBootcamp from '../../util/FakeData/FakeBootcampStatic.json'
const Home = () => {
  const renderBootcampStatic = () => {
    return fakeBootcamp.map((bootcamp) => {
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

        >
          <BootcampProgressCard bootcamp={bootcamp}/>
        </Card>
      </Col>)
    })
  }
  return (
    <div className="bootcamp-progress">

      <Row gutter={[16, 16]}>
       {renderBootcampStatic()}
      </Row>
    </div>
  )
}

export default Home