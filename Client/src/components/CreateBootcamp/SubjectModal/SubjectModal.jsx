import { Button, Col, DatePicker, Form, Input, InputNumber, Modal, Row, Select } from 'antd'
import ImportSubjectModal from '../ImportSubjectModal/ImportSubjectModal';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addSubject } from '../../../redux/CreateBootcamp/createBootCamp';
const { Option } = Select;
const SubjectModal = ({ isModalOpen, setIsModalOpen, subjectModalData }) => {
    const dispatch = useDispatch()
    const [form] = Form.useForm()
    const [isImportSubjectModalOpen, setIsImportSubjectModalOpen] = useState(false)

    const handleCancel = () => {
        form.resetFields()
        setIsModalOpen(false);
    };


    const handleOpenImportModal = () => {
        setIsImportSubjectModalOpen(true)
    }

    const handleSubmit = (a) => {
        const newSubject = {
            ...a,
            isCompulsory: subjectModalData.sujectType === "Compulsory" ? true : false
        }
        dispatch(addSubject({
            fieldIndex: subjectModalData.fieldIndex,
            subject: newSubject
        }))
        form.resetFields()
        setIsModalOpen(false)
   
    }
   
    return (
        <>
            <Modal footer={false} title={subjectModalData.modalName} open={isModalOpen} onCancel={handleCancel}>
                <ImportSubjectModal isModalOpen={isImportSubjectModalOpen} setIsModalOpen={setIsImportSubjectModalOpen}/>
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
                                <Col span={6}> <Button>Auto Create</Button></Col>
                                <Col span={9}><DatePicker style={{ marginInline: 16 }} placeholder='Year' picker="year" /></Col>
                                <Col span={9}><Input placeholder='Enter ID' width={20} /></Col>



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
                                    Add
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