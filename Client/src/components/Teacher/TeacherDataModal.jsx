import { ProForm, ProFormCascader, ProFormText } from '@ant-design/pro-components'
import { Modal, message } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { queryAllDepartment } from '../../redux/major/major'
import { getDepartmentIndex } from '../../util/GetDepartmentIndex/GetDepartmentIndex'
import { addTeacher, updateTeacherData } from '../../redux/teacher/teacher'

const TeacherDataModal = ({ open, handleCancel, modalData, modalType, departmentList, reloadTable }) => {
    const dispatch = useDispatch()
    const formRef = useRef()

    const handleOk = async () => {
        try {
            const formData = await formRef.current.validateFields()
            if(modalType === 'edit'){
                const newData = {
                    ...formData,
                    departmentChild: formData.departmentChild[1]
                }
                const res = await dispatch(updateTeacherData({
                    teacherId: modalData._id,
                    data: newData
                }))
                reloadTable()
                message.success('Edit teacher info successfully!')
                handleCancel()
            }else {
                const newData = {
                    ...formData,
                    departmentChild: formData.departmentChild[1]
                }
                const res = await dispatch(addTeacher(newData))
                console.log(res)
                reloadTable()
                message.success('Add teacher successfully!')
                handleCancel()
            }
        } catch (error) { 
            message.error('There is an error!')
         }
        
        // if(modalType === 'edit'){
            
        // }
    }

    useEffect(() => {
        if(open){
            if(modalData){
                formRef.current.setFieldsValue({
                    name: modalData.name,
                    code: modalData.code,
                    departmentChild: getDepartmentIndex(departmentList, modalData.departmentChild)
                })
            }
            
        }else {
            formRef?.current?.resetFields()
        }
    },[open])

    return (
        <Modal title={modalType === 'edit' ? 'Edit Teacher' : 'Add Teacher'} open={open} onCancel={handleCancel} okText={modalType === 'edit' ? 'Save' : 'Add'} onOk={handleOk}>
            <ProForm formRef={formRef} submitter={false}> 
                <ProFormText
                    name={'code'}
                    label={'Teacher Code'}
                    rules={[
                        {
                            required: true,
                            message: 'Please enter teacher code',
                        },
                    ]}
                />
                <ProFormText
                    name={'name'}
                    label={'Name'}
                    rules={[
                        {
                            required: true,
                            message: 'Please enter teacher code',
                        },
                    ]}
                />
                <ProFormCascader
                    name={'departmentChild'}
                    label="Department"
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
                        })
                    }}
                    rules={[
                        {
                            required: true,
                            message: 'Please choose a department',
                        },
                    ]}
                />
            </ProForm>
        </Modal>
    )
}

export default TeacherDataModal