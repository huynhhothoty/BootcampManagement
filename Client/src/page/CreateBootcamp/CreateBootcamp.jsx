import {  Button, Col, Form, Input, InputNumber, Progress, Radio, Row, } from 'antd';
import { useState } from 'react';
import { CaculatePercent } from '../../util/CaculatePercent/caculatePercent';
import Semester from '../../components/CreateBootcamp/Semester/Semester';
import SubjectModal from '../../components/CreateBootcamp/SubjectModal/SubjectModal';
import ImportBootcampModal from '../../components/CreateBootcamp/ImportBootcampModal/ImportBootcampModal';


const CreateBootcamp = () => {
  const [specialistCredits, setSpecialistCredits] = useState({ total: 0, complete: 0 })
  const [generalCredits, setGeneralCredits] = useState({ total: 0, complete: 0 })
  const [totalCredits,setTotalCredit] = useState(generalCredits.total + specialistCredits.total)
  const a = 10
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isImportBootcampModalOpen, setIsImportBootcampModalOpen] = useState(false)



  const handleTotalCreditChange = (a) => {
    if (a.specialistSubject) {
      setSpecialistCredits({ total: a.specialistSubject, complete: specialistCredits.complete })
    } else if (a.generalSubject) {
      setGeneralCredits({ total: a.generalSubject, complete: generalCredits.complete })
    }
    setTotalCredit(generalCredits.total + specialistCredits.total)
  }

  return (
    <div>
      <SubjectModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}/>
      <ImportBootcampModal isModalOpen={isImportBootcampModalOpen} setIsModalOpen={setIsImportBootcampModalOpen}/>
      <Button onClick={() => setIsImportBootcampModalOpen(true)} type='dashed'>Import Bootcamp</Button>
      <div className='createFormContainer'>
        <Form onFinish={(a) => {console.log(a)}} layout="vertical" onValuesChange={handleTotalCreditChange}>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="bootCampName"
                label="Bootcamp Name"
                rules={[
                  {
                    required: true,
                    message: 'Please enter user name',
                  },
                ]}
              >
                <Input placeholder="Please enter user name" />
              </Form.Item>
            </Col>

          </Row>
          <Row gutter={45}>
            <Col span={8} className='staticColum'>
              <Form.Item
                name="specialistSubject"
                label="Total Specialist Subject Credits"
                style={{ justifyContent: "center" }}
                rules={[
                  {
                    required: true,
                    message: 'Please enter total Specialist Subject Credits',
                  },
                ]}
              >

                <InputNumber min={1} max={300} style={{ width: "100%" }} placeholder="Please enter total credits" />


              </Form.Item>
              <Progress status={specialistCredits.complete > specialistCredits.total ? "exception" : ""} percent={CaculatePercent(specialistCredits.complete, specialistCredits.total)} format={() => `${specialistCredits.complete}/${specialistCredits.total}`} />
            </Col>
            <Col span={8} className='staticColum'>
              <Form.Item
                name="generalSubject"
                label="Total General Subject Credits"
                style={{ justifyContent: "center" }}
                rules={[
                  {
                    required: true,
                    message: 'Please enter total general subject credits',
                  },
                ]}
              >

                <InputNumber min={1} max={300} style={{ width: "100%" }} placeholder="Please enter total credits" />


              </Form.Item>
              <Progress status={generalCredits.complete > generalCredits.total ? "exception" : ""} percent={CaculatePercent(generalCredits.complete, generalCredits.total)} format={() => `${generalCredits.complete}/${generalCredits.total}`} />
            </Col>
            <Col span={8} className='staticColum'>
              <Form.Item
                name="totalCredits"
                label="Total Credits"
                style={{ justifyContent: "center" }}

              >

                <InputNumber value={10} min={1} max={300} style={{ width: "100%" }}  disabled/>


              </Form.Item>
              <Progress percent={CaculatePercent(generalCredits.complete + specialistCredits.complete, generalCredits.total + specialistCredits.total)} format={() => `${generalCredits.complete + specialistCredits.complete}/${generalCredits.total + specialistCredits.total}`} />
            </Col>
          </Row>
          <Row style={{marginTop:30}}>
      
            <Col span={24}>
            <Form.Item>
              <Semester setIsModalOpen={setIsModalOpen}/>
              </Form.Item>
            </Col>
            
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item style={{display:"flex", justifyContent:"flex-end"}}>
                <Button type='primary' htmlType='submit'>Create</Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>

      </div>

    </div>
  )
}

export default CreateBootcamp