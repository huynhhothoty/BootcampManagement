import {  Button, Col, Form, Input, InputNumber, Progress, Radio, Row, } from 'antd';
import { useState } from 'react';
import { CaculatePercent } from '../../util/CaculatePercent/caculatePercent';
import Semester from '../../components/CreateBootcamp/Semester/Semester';
import SubjectModal from '../../components/CreateBootcamp/SubjectModal/SubjectModal';
import ImportBootcampModal from '../../components/CreateBootcamp/ImportBootcampModal/ImportBootcampModal';
import { Collapse } from 'antd';
import AllocateField from '../../components/CreateBootcamp/AllocateField/AllocateField';
import { useDispatch, useSelector } from 'react-redux';
import { updateTotalCredits } from '../../redux/CreateBootcamp/createBootCamp';
import ContentOfProgram from './../../components/CreateBootcamp/ContentOfProgram/ContentOfProgram';
import SemesterList from '../../components/CreateBootcamp/Semester/SemesterList';

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;


const CreateBootcamp = () => {
  const dispatch = useDispatch()
  const [specialistCredits, setSpecialistCredits] = useState({ total: 0, complete: 0 })
  const [generalCredits, setGeneralCredits] = useState({ total: 0, complete: 0 })

  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [subjectModalData, setSubjestModalData] = useState({
    type:"",
    fieldIndex: "",
    modalName: "",
    sujectType: ""
  })

  const [isImportBootcampModalOpen, setIsImportBootcampModalOpen] = useState(false)
  const {totalCredits,completeTotalCredits,allowcateFields} = useSelector(store => store.createBootCamp)

  const items = [
    {
      key: '1',
      label: 'Allocate of Credits',
      children: <AllocateField/>,
    },
    {
      key: '2',
      label: 'Add Composory Subjects',
      children: <ContentOfProgram type={"Compulsory"} setIsSubjectModalOpen={setIsSubjectModalOpen} setSubjestModalData={setSubjestModalData}/>,
    },
    {
      key: '3',
      label: 'Add Elective Subjects',
      children: <ContentOfProgram type={"Elective"} setIsSubjectModalOpen={setIsSubjectModalOpen} setSubjestModalData={setSubjestModalData}/>,
    },
    {
      key: '4',
      label: 'Semester Planning',
      children: <SemesterList/>
    },
  ];

  const handleTotalCreditChange = (a) => {
    dispatch(updateTotalCredits(a.totalCredits))
  }
  const onChange = (key) => {
    console.log(key);
  };
  return (
    <div>

      <SubjectModal subjectModalData={subjectModalData} isModalOpen={isSubjectModalOpen} setIsModalOpen={setIsSubjectModalOpen}/>
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
            <Col span={8} className='staticColum'>
              <Form.Item
                name="totalCredits"
                label="Total Program Credits"
                style={{ justifyContent: "center" }}
                rules={[
                  {
                    required: true,
                    message: 'Please enter total Program Credits',
                  },
                ]}
              >

                <InputNumber min={1} max={300} style={{ width: "100%" }} placeholder="Please enter total credits" />


              </Form.Item>
              <Progress status={completeTotalCredits > totalCredits ? "exception" : ""} percent={CaculatePercent(completeTotalCredits, totalCredits)} format={() => `${completeTotalCredits}/${totalCredits}`} />
            </Col>
          </Row>
    
          <Row style={{marginTop:30}}>
      
            <Col span={24}>
            <Form.Item>
            <Collapse items={items} defaultActiveKey={['1']} onChange={onChange} />
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