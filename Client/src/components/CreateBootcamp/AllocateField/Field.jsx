import { Button, Card, Col, Input, InputNumber, Row,Modal } from "antd"
import SmallField from "./SmallField"
import { useDispatch } from "react-redux"
import { addSmallField, deleteBigField, updateBigFieldsName } from "../../../redux/CreateBootcamp/createBootCamp"
import {DeleteOutlined} from  '@ant-design/icons'

const Field = ({fieldData, bigFieldIndex}) => {
    const [modal, contextHolder] = Modal.useModal();
    const dispatch = useDispatch()
    const renderSmallField = () => {
        return fieldData?.smallField.map((field,index) => {
            return ( <div style={{marginTop: 16}} key={index}>
                <Row>
                    <Col span={6}></Col>
                    <Col span={18}>
                        <SmallField bigFieldIndex={bigFieldIndex} index={index} fieldData={field}/>
                    </Col>
                </Row>
                </div> )
        })
    }
    const handleDeleteBigFeild = async () => {
        
    }
    const handleFieldUpdateName = (data) => {
        dispatch(updateBigFieldsName({
            fieldIndex: bigFieldIndex,
            fieldName: data.target.value
        }))
    }
  return (
    <Card
        hoverable
        style={{marginTop: 16}}
        size="small"
    >
        <Row>
            <Col span={6}>
                <Input placeholder="Field Name" value={fieldData.fieldName} onChange={handleFieldUpdateName}/>
            </Col>
            <Col span={14} style={{display:"flex", justifyContent:"space-evenly"}}>
                <div>
                    <span style={{marginRight:10}}>Compulsory Credits</span>
                    <InputNumber placeholder="Compulsory Credits" value={fieldData.compulsoryCredits} disabled/>
                </div>
                <div>
                    <span  style={{marginRight:10}}>Elective Credits</span>
                    <InputNumber placeholder="Elective Credits" value={fieldData.electiveCredits} disabled/>
                </div>
            </Col>
            <Col span={4} style={{display:"flex"}}>
                <Button type="primary" style={{marginRight:10}} onClick={() => dispatch(addSmallField(bigFieldIndex))}>Add Child Field</Button>
                <Button danger onClick={() => dispatch(deleteBigField(bigFieldIndex))}><DeleteOutlined /></Button>
            </Col>
        </Row>
        {renderSmallField()}
    </Card>
  )
}

export default Field