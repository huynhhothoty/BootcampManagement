import { Button, Card, Col, Input, InputNumber, Row } from 'antd'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { deleteSmallField, updateCompulsoryCredit, updateElectiveCredit, updateSmallFieldsName } from '../../../redux/CreateBootcamp/createBootCamp'
import {DeleteOutlined} from  '@ant-design/icons'
import { MISSING_FIELD_NAME } from '../../../util/constants/errorMessage'
import { deleteConfirmConfig } from '../../../util/ConfirmModal/confirmConfig'

const SmallField = ({fieldData,bigFieldIndex,index, isError, confirmModal,isLastField}) => {
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

        <Row>
            <Col span={8}>
                <Input status={(isError && fieldData?.fieldName === "") ? "error" : ""} placeholder="Field Name" value={fieldData?.fieldName} onChange={handleFieldChange} disabled={isLastField}/>
                { (isError && fieldData?.fieldName === "") ? <span style={{color:"red"}}>{MISSING_FIELD_NAME}</span> : ""}
            </Col>
            <Col span={16} style={{display:"flex", justifyContent:"space-evenly"}}>
                <div style={{width:"20%",display:"flex", justifyContent:"center"}}>
                 
                    <InputNumber min={0} 
                    // max={20} 
                    placeholder="Compulsory Credits" value={fieldData?.compulsoryCredits}  disabled/>
                </div>
                <div style={{width:"20%",display:"flex", justifyContent:"center"}}>
                    
                    <InputNumber  min={0} 
                    // max={20} 
                    placeholder="Elective Credits" value={fieldData?.electiveCredits}   disabled/>
                </div>
                <div style={{width:"10%"}}>
                    <Button danger onClick={async () => {
                        const confirmed = await confirmModal.confirm(deleteConfirmConfig)
                        if(confirmed)
                        dispatch(deleteSmallField({bigFieldIndex,smallFieldIndex: index}))
                    }} disabled={isLastField}><DeleteOutlined /></Button>
                    
                </div>
            </Col>
        </Row>
    )
}

export default SmallField