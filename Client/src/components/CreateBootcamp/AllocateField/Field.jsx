import { Button, Card, Col, Input, InputNumber, Row, Modal, Dropdown } from "antd"
import SmallField from "./SmallField"
import { useDispatch } from "react-redux"
import { addSmallField, deleteBigField, updateBigFieldsName } from "../../../redux/CreateBootcamp/createBootCamp"
import { DeleteOutlined } from '@ant-design/icons'
import { MISSING_FIELD_NAME, MISSING_SMALL_FIELD } from "../../../util/constants/errorMessage"
import { deleteConfirmConfig } from "../../../util/ConfirmModal/confirmConfig"



const Field = ({ openContentModal, fieldData, bigFieldIndex, errorMess, errorData, confirmModal, fieldIndex, isLastField }) => {
    const [modal, contextHolder] = Modal.useModal();

    const items = [
        {
            key: '1',
            label: (
                <a target="_blank" rel="noopener noreferrer" onClick={() => {
                    openContentModal(fieldIndex, "Compulsory")
                }}>
                    Compulsory
                </a>
            ),
        },
        {
            key: '2',
            label: (
                <a target="_blank" rel="noopener noreferrer" onClick={() => {
                    openContentModal(fieldIndex, "Elective")
                }}>
                    Elective
                </a>
            ),
        },

    ];
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
                        <SmallField confirmModal={confirmModal} isError={isError} bigFieldIndex={bigFieldIndex} index={index} fieldData={field} isLastField={isLastField} />
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
                    <Input status={errorData === undefined ? "" : (errorData.missFieldName && fieldData.fieldName === "") ? "error" : ""} placeholder="Field Name" value={fieldData.fieldName} onChange={handleFieldUpdateName} disabled={isLastField} />
                    {errorData === undefined ? "" : (errorData.missFieldName && fieldData.fieldName === "") ? <span style={{ color: "red" }}>{MISSING_FIELD_NAME}</span> : ""}

                </Col>
                <Col span={12} style={{ display: "flex", justifyContent: "space-evenly" }}>
                    <div>
                        <span style={{ marginRight: 10 }}>Compulsory Credits</span>
                        <InputNumber placeholder="Compulsory Credits" value={fieldData.compulsoryCredits} disabled />
                    </div>
                    <div>
                        <span style={{ marginRight: 10 }}>Elective Credits</span>
                        <InputNumber placeholder="Elective Credits" value={fieldData.electiveCredits} disabled />
                    </div>
                </Col>
                <Col span={6} style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button type="primary" style={{ marginRight: 10 }} onClick={() => dispatch(addSmallField(bigFieldIndex))} disabled={isLastField}>Add Child Field</Button>
                    {
                        isLastField ? <Button type="default" style={{ marginRight: 10 }} onClick={() => {openContentModal(fieldIndex, "Compulsory")}}>Subject List</Button> :
                            <Dropdown
                                menu={{
                                    items,
                                }}
                                placement="bottomLeft"

                            >
                                <Button type="default" style={{ marginRight: 10 }} >Subject List</Button>
                            </Dropdown>
                    }

                    <Button danger onClick={async () => {
                        const confirmed = await confirmModal.confirm(deleteConfirmConfig);
                        if (confirmed) {
                            dispatch(deleteBigField(bigFieldIndex))
                        }
                    }}
                        disabled={isLastField}
                    ><DeleteOutlined /></Button>
                </Col>
            </Row>
            <Row style={{ marginTop: 30 }}>
                <Col span={6}></Col>
                <Col span={18}>
                    <Row>
                        <Col span={8}>

                        </Col>
                        <Col span={16} style={{ display: "flex", justifyContent: "space-evenly" }}>
                            <span style={{ width: "20%", display: "flex", justifyContent: "center", fontWeight: "bold" }}>Compulsory Credits</span>
                            <span style={{ width: "20%", display: "flex", justifyContent: "center", fontWeight: "bold" }}>Elective Credits</span>
                            <span style={{ width: "10%" }}></span>
                        </Col>
                    </Row>

                </Col>
            </Row>
            {renderSmallField()}
            {errorData === undefined ? "" : (errorData.missSmallField && fieldData.smallField.length === 0) ? <div style={{ color: "red", marginTop: 10, textAlign: "center" }}>{MISSING_SMALL_FIELD}</div> : ""}
        </Card>
    )
}

export default Field
