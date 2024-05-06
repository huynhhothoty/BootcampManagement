import { ModalForm, ProFormCascader, ProFormDigit, ProFormRadio, ProFormText, ProFormTextArea } from '@ant-design/pro-components'
import { Form, message } from 'antd';
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { queryAllDepartment } from '../../redux/major/major';
import { updateSubject } from '../../redux/subject/subject';
import { NOTI_SUCCESS, NOTI_SUCCESS_CREATE_SUBJECT, NOTI_SUCCESS_TITLE, NOTI_SUCCESS_UPDATE_SUBJECT } from '../../util/constants/notificationMessage';
import { createSubject } from '../../redux/CreateBootcamp/createBootCamp';

const SubjectDetailModal = ({ open, onClose, modalType, modalData, reloadTable, departmentList, openNotification }) => {
    const dispatch = useDispatch()

    const [form] = Form.useForm();

    const findDepartmentWithChild = (childId) => {
        let finalData = []
        departmentList.forEach(department => {
            department.list.forEach(child => {
                if(child._id === childId){
                    finalData.push(department._id)
                    finalData.push(childId)
                }
               
                
            })
        })
        return finalData
    }

    const handleSubmitForm = async (formData) => {
        let tempFormData = {
            ...formData,
            departmentChild: formData.departmentChild[1]
        }
        if(modalType === 'edit'){
            const res = await dispatch(updateSubject({subjectID: modalData._id, updatedData:tempFormData}))
            if(res.payload.status === 'ok'){
                openNotification(NOTI_SUCCESS, NOTI_SUCCESS_TITLE, NOTI_SUCCESS_UPDATE_SUBJECT)
                onClose()
                reloadTable()
            }
        }else if(modalType === 'create'){
            const res = await dispatch(createSubject({...tempFormData,type:"major"}))
            if(res.payload.status === 'ok'){
                openNotification(NOTI_SUCCESS, NOTI_SUCCESS_TITLE, NOTI_SUCCESS_CREATE_SUBJECT)
                onClose()
                reloadTable()
            }
        }
    }

    useEffect(() => {
        if (modalData) {
            form.setFieldsValue({
                name: modalData.name,
                subjectCode: modalData.subjectCode,
                credit: modalData.credit,
                isCompulsory: modalData.isCompulsory,
                departmentChild: findDepartmentWithChild(modalData.departmentChild),
                description: modalData.description
            })
        }
    }, [modalData])
    return (
        <ModalForm

            title={modalType === 'create' ? "New Subject" : "Edit Subject"}
            open={open}
            form={form}
            width={500}
            autoFocusFirstInput
            modalProps={{
                destroyOnClose: true,
                onCancel: onClose,
                okText: modalType === 'create' ? "Create" : "Save"
            }}
            onFinish={handleSubmitForm}
        >
            <ProFormText

                name="name"
                label="Subject Name"
                placeholder="Please enter subject name"
                rules={[
                    {
                        required: true,
                        message: 'You must enter subject name!',
                    },
                ]}
            />
            <ProFormDigit
                name="credit"
                label="Credit"
                placeholder="Please enter subject sredit"
                rules={[
                    {
                        required: true,
                        message: 'You must enter subject credit!',
                    },
                ]}
            />
             <ProFormCascader
                name='departmentChild'
                label='Department'
                rules={[
                    {
                        required: true,
                        message: 'You must choose 1 department',
                    },
                ]}
                request={async () => {
                   return departmentList.map((department) => {
                        return {
                            value: department._id,
                            label: department.name,
                            children: department.list.map((subDepartment) => {
                                return {
                                    value: subDepartment._id,
                                    label: subDepartment.name,
                                };
                            }),
                        };
                    });
                }}
            />
            <ProFormRadio.Group
                name="isCompulsory"
                label="Subject Type"
                rules={[
                    {
                        required: true,
                        message: 'You must choose 1 subject type',
                    },
                ]}
                options={[
                    {
                        label: 'Compulsory',
                        value: true,
                    },
                    {
                        label: 'Elective',
                        value: false,
                    },

                ]}
            />
            <ProFormTextArea
                name={'description'}
                label='Description'
            />
           
        </ModalForm>
    )
}

export default SubjectDetailModal