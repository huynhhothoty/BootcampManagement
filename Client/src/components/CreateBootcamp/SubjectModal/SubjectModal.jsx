import { Button, Col, DatePicker, Form, Input, InputNumber, Modal, Row, Select } from 'antd'
import ImportSubjectModal from '../ImportSubjectModal/ImportSubjectModal';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addSubject, editSubject } from '../../../redux/CreateBootcamp/createBootCamp';
import dayjs from 'dayjs';
import { getAllSubject, updateWithNormalImportSubject } from '../../../redux/subject/subject';
const { Option } = Select;
const SubjectModal = ({ isModalOpen, setIsModalOpen, subjectModalData }) => {
    const dispatch = useDispatch()
    const [form] = Form.useForm()
    const [isImportSubjectModalOpen, setIsImportSubjectModalOpen] = useState(false)
    const [autoIDYear, setAutoIDYear] = useState(dayjs(`${new Date().getFullYear()}/01/01`))
    const [autoID, setAutoID] = useState("")
    const [importedSubject, setImportedSubject] = useState(null)

    const handleCancel = () => {
        setAutoID("")
        setAutoIDYear(dayjs(`${new Date().getFullYear()}/01/01`))
        form.resetFields()
        setIsModalOpen(false);
    };


    const handleOpenImportModal = () => {
        setIsImportSubjectModalOpen(true)
        dispatch(getAllSubject(subjectModalData.sujectType === "Compulsory" ? true : false))
    }

    const handleSubmit = (a) => {
        
        if(subjectModalData.type === "edit"){
            const {subjectData} = subjectModalData
            let newSubject = {}
            if(importedSubject){
                newSubject = {
                    ...subjectData,
                    name: a.name,
                    subjectCode: a.subjectCode,
                    credits: a.credits,
                    description: a.description,
                    _id: subjectData._id ? (importedSubject._id === subjectData._id ? subjectData._id : importedSubject._id) : importedSubject._id
                }
            }
            else newSubject = {
                ...subjectData,
                name: a.name,
                subjectCode: a.subjectCode,
                credits: a.credits,
                description: a.description
            }
            dispatch(editSubject({
                fieldIndex: subjectModalData.fieldIndex,
                subjectIndex: subjectModalData.subjectData.index,
                subject: newSubject
            }))
        }else if(subjectModalData.type === "add"){
            const newSubject = {
                ...a,
                isCompulsory: subjectModalData.sujectType === "Compulsory" ? true : false,
                _id:importedSubject ? importedSubject._id : null
            }
            dispatch(addSubject({
                fieldIndex: subjectModalData.fieldIndex,
                subject: newSubject,
                type: subjectModalData.sujectType
            }))
        }
        if(importedSubject) dispatch(updateWithNormalImportSubject(importedSubject))
        setImportedSubject(null)
        form.resetFields()
        setAutoID("")
        setAutoIDYear(dayjs(`${new Date().getFullYear()}/01/01`))
        setIsModalOpen(false)
   
    }
    const handleAutoCreateSubjectCode = () => {
        form.setFieldValue("subjectCode", `${autoID}${autoIDYear.$y}`)
    }
   
    useEffect(() => {
        if(subjectModalData.type === "edit"){
            const {
                subjectCode,
                name,
                credits,
                description,
            } = subjectModalData.subjectData
            form.setFieldsValue({
                subjectCode,
                name,
                credits,
                description,
            })
        }
    },[subjectModalData])
    useEffect(() => {
     
        form.setFieldsValue({
            subjectCode: importedSubject?.subjectCode,
            name: importedSubject?.name,
            credits: importedSubject?.credit,
            description: importedSubject?.description,
        })
    },[importedSubject])
    return (
        <>
            <Modal footer={false} title={subjectModalData.modalName} open={isModalOpen} onCancel={handleCancel}>
                <ImportSubjectModal setImportedSubject={setImportedSubject} isModalOpen={isImportSubjectModalOpen} setIsModalOpen={setIsImportSubjectModalOpen}/>
                <Button onClick={handleOpenImportModal} style={{marginBottom: 16,marginTop:5}} type='dashed'>Import Subject</Button>
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="subjectCode"
                                label="Subject Code"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter a Subject ID',
                                    },
                                ]}
                            >
                                <Input placeholder="Please enter a Subject ID" />
                            </Form.Item>
                            <Row style={{ marginBlock: 16 }}>
                                <Col span={6}> <Button onClick={handleAutoCreateSubjectCode}>Auto Create</Button></Col>
                                <Col span={9}><DatePicker onChange={(value) => setAutoIDYear(value)} value={autoIDYear} style={{ marginInline: 16 }} placeholder='Year' picker="year" /></Col>
                                <Col span={9}><Input onChange={(e) => {setAutoID(e.target.value)}} value={autoID} placeholder='Enter ID' width={20} /></Col>



                            </Row>

                        </Col>

                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="name"
                                label="Subject Name"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter Subject Name',
                                    },
                                ]}
                            >
                                <Input placeholder="Please enter Subject Name" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="credits"
                                label="Credits"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please select number of credits',
                                    },
                                ]}
                            >
                                <InputNumber min={0} max={20} style={{ width: "100%" }} placeholder='Number of credits'/>
                            </Form.Item>
                        </Col>
                        
                    </Row>
                   
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="description"
                                label="Description"
                                rules={[
                                    {
                                        required: true,
                                        message: 'please enter url description',
                                    },
                                ]}
                            >
                                <Input.TextArea rows={4} placeholder="please enter url description" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Form.Item style={{display:"flex", justifyContent:"flex-end"}}>
                                <Button style={{marginRight:16}} onClick={handleCancel}>
                                    Cancel
                                </Button>
                                <Button type="primary" htmlType="submit" >
                                    {subjectModalData.type === "edit" ? "Edit" : "Add"}
                                </Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    )
}

export default SubjectModal