import { Button, Card, Col, Input, InputNumber, Row, Modal } from "antd"
import SmallField from "./SmallField"
import { useDispatch } from "react-redux"
import { addSmallField, deleteBigField, updateBigFieldsName } from "../../../redux/CreateBootcamp/createBootCamp"
import { DeleteOutlined } from '@ant-design/icons'
import { MISSING_FIELD_NAME, MISSING_SMALL_FIELD } from "../../../util/constants/errorMessage"
import { deleteConfirmConfig } from "../../../util/ConfirmModal/confirmConfig"

const Field = ({ fieldData, bigFieldIndex, errorMess, errorData, confirmModal }) => {
    const [modal, contextHolder] = Modal.useModal();

    const dispatch = useDispatch()
    const renderSmallField = () => {
        return fieldData?.smallField.map((field, index) => {
            let isError = false
            if (errorData) {
                if (errorData.smallFieldError.includes(index)) isError = true
            }

            return (<div style={{ marginTop: 16 }} key={index}>
                <Row>
                    <Col span={6}></Col>
                    <Col span={18}>
                        <SmallField confirmModal={confirmModal} isError={isError} bigFieldIndex={bigFieldIndex} index={index} fieldData={field} />
                    </Col>
                </Row>
            </div>)
        })
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
            style={{ marginTop: 16 }}
            size="small"
        >
            <Row>
                <Col span={6}>
                    <Input status={errorData === undefined ? "" : (errorData.missFieldName && fieldData.fieldName === "") ? "error" : ""} placeholder="Field Name" value={fieldData.fieldName} onChange={handleFieldUpdateName} />
                    {errorData === undefined ? "" : (errorData.missFieldName && fieldData.fieldName === "") ? <span style={{ color: "red" }}>{MISSING_FIELD_NAME}</span> : ""}

                </Col>
                <Col span={14} style={{ display: "flex", justifyContent: "space-evenly" }}>
                    <div>
                        <span style={{ marginRight: 10 }}>Compulsory Credits</span>
                        <InputNumber placeholder="Compulsory Credits" value={fieldData.compulsoryCredits} disabled />
                    </div>
                    <div>
                        <span style={{ marginRight: 10 }}>Elective Credits</span>
                        <InputNumber placeholder="Elective Credits" value={fieldData.electiveCredits} disabled />
                    </div>
                </Col>
                <Col span={4} style={{ display: "flex" }}>
                    <Button type="primary" style={{ marginRight: 10 }} onClick={() => dispatch(addSmallField(bigFieldIndex))}>Add Child Field</Button>
                    <Button danger onClick={async () => {
                        const confirmed = await confirmModal.confirm(deleteConfirmConfig);
                        if(confirmed){
                            dispatch(deleteBigField(bigFieldIndex))
                        }
                    }}><DeleteOutlined /></Button>
                </Col>
            </Row>
            {renderSmallField()}
            {errorData === undefined ? "" : (errorData.missSmallField && fieldData.smallField.length === 0) ? <div style={{ color: "red", marginTop: 10, textAlign: "center" }}>{MISSING_SMALL_FIELD}</div> : ""}
        </Card>
    )
}

export default Field
