import { Button, Card, Col, Input, InputNumber, Row } from 'antd'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { deleteSmallField, updateCompulsoryCredit, updateElectiveCredit, updateSmallFieldsName } from '../../../redux/CreateBootcamp/createBootCamp'
import {DeleteOutlined} from  '@ant-design/icons'

const SmallField = ({fieldData,bigFieldIndex,index}) => {
    const dispatch = useDispatch()
    const handleChangeCompulsoryCredit = (data) => {
            dispatch(updateCompulsoryCredit({
                bigFieldIndex,
                smallFieldIndex: index,
                credits: data
            }))
     
    }

    const handleChangeElectiveCredit = (data) => {

        dispatch(updateElectiveCredit({
            bigFieldIndex,
            smallFieldIndex: index,
            credits: data
        }))
 
    }

    const handleFieldChange = (e) => {

        dispatch(updateSmallFieldsName({
            bigFieldIndex,
            smallFieldIndex: index,
            fieldName: e.target.value
        }))
 
    }
    return (
        <Card size='small' hoverable style={{borderColor:"#1677ff"}}>
        <Row>
            <Col span={8}>
                <Input placeholder="Field Name" value={fieldData.fieldName} onChange={handleFieldChange}/>
            </Col>
            <Col span={16} style={{display:"flex", justifyContent:"space-evenly"}}>
                <div>
                    <span style={{ marginRight: 10 }}>Compulsory Credits</span>
                    <InputNumber placeholder="Compulsory Credits" value={fieldData.compulsoryTotalCredits} onChange={handleChangeCompulsoryCredit}/>
                </div>
                <div>
                    <span style={{ marginRight: 10 }}>Elective Credits</span>
                    <InputNumber placeholder="Elective Credits" value={fieldData.electiveCredits} onChange={handleChangeElectiveCredit}/>
                </div>
                <div>
                    <Button danger onClick={() => {dispatch(deleteSmallField({bigFieldIndex,smallFieldIndex: index}))}}><DeleteOutlined /></Button>
                    
                </div>
            </Col>
        </Row>
        </Card>
    )
}

export default SmallField