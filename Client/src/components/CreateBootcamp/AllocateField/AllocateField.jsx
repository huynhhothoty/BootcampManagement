import { Button, Col, Form, Input, InputNumber, Progress, Radio, Row, } from 'antd';
import { useEffect, useState } from 'react';
import { CaculatePercent } from '../../../util/CaculatePercent/caculatePercent';
import Semester from '../Semester/Semester';
import { useDispatch, useSelector } from 'react-redux';
import { addBigField, updateTotalCredits } from '../../../redux/CreateBootcamp/createBootCamp';
import Field from './Field';
import { NOT_CORRECT_CREDITS } from '../../../util/constants/errorMessage';

const AllocateField = ({ openContentModal, errorMessage, confirmModal }) => {

  const dispatch = useDispatch()
  const { allowcateFields, totalCredits } = useSelector(store => store.createBootCamp)

  const renderAllowcateField = () => {

    return allowcateFields.map((field, index) => {
      let isLastField = allowcateFields.length - 1 === index
      if (errorMessage.length > 0) {
        if (errorMessage[0].data)
          if (errorMessage[0].data.errorFieldIndex.includes(index))
            return <Field fieldIndex={index} openContentModal={openContentModal} confirmModal={confirmModal} errorMess={errorMessage[0].message} errorData={errorMessage[0].data.errorField[index]} bigFieldIndex={index} key={index} fieldData={field} isLastField={isLastField}/>
      }
      return <Field fieldIndex={index} openContentModal={openContentModal} confirmModal={confirmModal} bigFieldIndex={index} key={index} fieldData={field} isLastField={isLastField}/>

    })
  }
  const countTotalCompulsoryCredits = () => {
    let totalCompulsoryCredits = 0
    allowcateFields.forEach((field,index) => {
      if(index < allowcateFields.length - 1)
      totalCompulsoryCredits += field.compulsoryCredits

    })
    return totalCompulsoryCredits

  }
  const countTotalElectiveCredits = () => {
    let totalElectiveCredits = 0
    allowcateFields.forEach((field,index) => {
      if(index < allowcateFields.length - 1)
      totalElectiveCredits += field.electiveCredits
    })
    return totalElectiveCredits

  }
  const countTotalAll = () => {
    return countTotalCompulsoryCredits() + countTotalElectiveCredits()
  }

  return (
    <div>



      <div>

        <Row >
          <Col span={24} style={{ display: "flex", justifyContent: "space-between" }}>
            <Button onClick={() => dispatch(addBigField())} type='primary'>+ Add Field</Button>
            <div>
             
              <span style={{ marginRight: 50 }}>
                Total Proram Credits:
                <span style={{ color: (countTotalAll() > totalCredits || countTotalAll() < totalCredits) ? "red" : "#5cb85c" }}> {countTotalAll()} \ {totalCredits} </span>
              </span>
              <span style={{ marginRight: 50 }}>
                Total Compulsory Credits: {countTotalCompulsoryCredits()}
              </span>
              <span>
                Total Elective Credits: {countTotalElectiveCredits()}
              </span>
            </div>
          </Col>
          {errorMessage.length === 0 ? "" : errorMessage[0].data === null ? "" : errorMessage[0].data.isEqualTotalCredits ? "": <div style={{ color: "red", marginTop: 10 }}>**{NOT_CORRECT_CREDITS}</div>}
          <Col span={24}>
            <Form.Item

            >
              {renderAllowcateField()}
              {errorMessage.length === 0 ? "" : (errorMessage[0].data === null && allowcateFields.length === 0) ? <div style={{ color: "red", marginTop: 10, textAlign: "center" }}>{errorMessage[0].message}</div> : ""}
            </Form.Item>

          </Col>

        </Row>



      </div>

    </div>
  )
}

export default AllocateField