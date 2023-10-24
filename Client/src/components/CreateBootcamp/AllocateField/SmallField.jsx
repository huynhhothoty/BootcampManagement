import { Button, Card, Col, Input, InputNumber, Row } from 'antd'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { deleteSmallField, updateCompulsoryCredit, updateElectiveCredit, updateSmallFieldsName } from '../../../redux/CreateBootcamp/createBootCamp'
import {DeleteOutlined} from  '@ant-design/icons'
import { MISSING_FIELD_NAME } from '../../../util/constants/errorMessage'
import { deleteConfirmConfig } from '../../../util/ConfirmModal/confirmConfig'

const SmallField = ({fieldData,bigFieldIndex,index, isError, confirmModal}) => {
    const dispatch = useDispatch()
    const handleChangeCompulsoryCredit = (data) => {
            dispatch(updateCompulsoryCredit({
                bigFieldIndex,
                smallFieldIndex: index,
                credits: data !== null ? data : 0
            }))
     
    }

    const handleChangeElectiveCredit = (data) => {
    
        dispatch(updateElectiveCredit({
            bigFieldIndex,
            smallFieldIndex: index,
            credits: data !== null ? data : 0
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
                <Input status={(isError && fieldData.fieldName === "") ? "error" : ""} placeholder="Field Name" value={fieldData.fieldName} onChange={handleFieldChange}/>
                { (isError && fieldData.fieldName === "") ? <span style={{color:"red"}}>{MISSING_FIELD_NAME}</span> : ""}
            </Col>
            <Col span={16} style={{display:"flex", justifyContent:"space-evenly"}}>
                <div>
                    <span style={{ marginRight: 10 }}>Compulsory Credits</span>
                    <InputNumber min={0} 
                    // max={20} 
                    placeholder="Compulsory Credits" value={fieldData.compulsoryCredits} onChange={handleChangeCompulsoryCredit}/>
                </div>
                <div>
                    <span style={{ marginRight: 10 }}>Elective Credits</span>
                    <InputNumber  min={0} 
                    // max={20} 
                    placeholder="Elective Credits" value={fieldData.electiveCredits} onChange={handleChangeElectiveCredit}/>
                </div>
                <div>
                    <Button danger onClick={async () => {
                        const confirmed = await confirmModal.confirm(deleteConfirmConfig)
                        if(confirmed)
                        dispatch(deleteSmallField({bigFieldIndex,smallFieldIndex: index}))
                    }}><DeleteOutlined /></Button>
                    
                </div>
            </Col>
        </Row>
        </Card>
    )
}

export default SmallField