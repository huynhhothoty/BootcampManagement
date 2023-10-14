import {  Button, Col, Form, Input, InputNumber, Progress, Radio, Row, } from 'antd';
import { useState } from 'react';
import SubjectModal from '../SubjectModal/SubjectModal';
import { CaculatePercent } from '../../../util/CaculatePercent/caculatePercent';
import Semester from '../Semester/Semester';
import { useDispatch, useSelector } from 'react-redux';
import { addBigField, updateTotalCredits } from '../../../redux/CreateBootcamp/createBootCamp';
import Field from './Field';

const AllocateField = () => {
  const dispatch = useDispatch()
  const {allowcateFields, totalCredits} = useSelector(store => store.createBootCamp)
 
  const renderAllowcateField = () => {
    return allowcateFields.map((field,index) => {
      return <Field bigFieldIndex={index} key={index} fieldData={field}/>
    })
  }
  const countTotalCompulsoryCredits = () => {
    let totalCompulsoryCredits = 0
    allowcateFields.forEach((field) => {
      totalCompulsoryCredits += field.compulsoryCredits

    })
    return totalCompulsoryCredits

  }
  const countTotalElectiveCredits = () => {
    let totalElectiveCredits = 0
    allowcateFields.forEach((field) => {

      totalElectiveCredits += field.electiveCredits
    })
    return totalElectiveCredits

  }
  const countTotalAll =  () => {
    return countTotalCompulsoryCredits() + countTotalElectiveCredits()
  }
  return (
   <div>
     
      
      
      <div>

          <Row >
            <Col span={24} style={{display:"flex", justifyContent:"space-between"}}>
              
              <Button onClick={() => dispatch(addBigField())} type='primary'>+ Add Field</Button>
              <div>
              <span style={{marginRight:50}}>
                  Total Proram Credits: 
                  <span style={{color: (countTotalAll() > totalCredits || countTotalAll() < totalCredits) ? "red" : "#5cb85c"}}> {countTotalAll()} \ {totalCredits} </span>
                </span>
                <span style={{marginRight:50}}>
                  Total Compolsory Credits: {countTotalCompulsoryCredits()}
                </span>
                <span>
                  Total Elective Credits: {countTotalElectiveCredits()}
                </span>
              </div>
            </Col>
            <Col span={24}>
            <Form.Item
         
            >
              {renderAllowcateField()}
              </Form.Item>
           
            </Col>
            
          </Row>
          
       

      </div>

    </div>
  )
}

export default AllocateField