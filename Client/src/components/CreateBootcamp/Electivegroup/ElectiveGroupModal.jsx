import { ProForm, ProFormDigit, ProFormSelect, ProFormText } from '@ant-design/pro-components'
import { Modal } from 'antd'
import React, { useEffect, useRef, useState } from 'react'

const ElectiveGroupModal = ({open, handleCancel,fieldData,modalData,handleAddGroup, handleEditGroup}) => {
    const [childList,setChildList] = useState([])
    const formRef = useRef()
    useEffect(() => {
        if(fieldData){
            setChildList(fieldData.smallField.map((sfield,sIndex) => {
                return {
                    label: sfield.fieldName,
                    value: sIndex
                }
            }))
        }
    },[fieldData])

    const handleSubmit = () => {
        if(modalData){
            let editedData = {
                credit: formRef.current.getFieldValue('credit'),
                allocateChildId: formRef.current.getFieldValue('allocateChildId'),
                semester: modalData.semester,
                branchMajor: modalData.branchMajor,
                index: modalData.index
            }
            handleEditGroup(editedData,modalData)
        }else {
            let addedData = {
                credit: formRef.current.getFieldValue('credit'),
                allocateChildId: formRef.current.getFieldValue('allocateChildId')
            }
            handleAddGroup(addedData)
        }
        handleCancel()
    }

    useEffect(() => {
        if(modalData){
            formRef.current?.setFieldValue('courseName', modalData.courseName)
            formRef.current?.setFieldValue('credit', modalData.credit)
            formRef.current?.setFieldValue('allocateChildId', modalData.allocateChildId)
        }else {
            if(fieldData){
                formRef.current?.setFieldValue('courseName', `${fieldData.fieldName} ${fieldData.electiveSubjectList.length + 1}`)
            }
        }
    },[fieldData,modalData])
  return (
    <Modal title={modalData ? 'Edit Course' : 'Add Course'} open={open} onCancel={handleCancel} onOk={handleSubmit}>
    <ProForm submitter={false} formRef={formRef}>
        <ProFormText
            label="Course Name"
            name="courseName"
            disabled
        />
        <ProFormDigit
            label="Credit"
            name="credit"
            rules={[
                {
                    required: true,
                    message: 'Please select number of credits',
                },
            ]}
        />
        <ProFormSelect
             name='allocateChildId'
             label='Field Group'
             rules={[
                 {
                     required: true,
                     message: 'Please choose 1 child field',
                 },
             ]}
             options={childList}
        />
    </ProForm>
  </Modal>
  )
}

export default ElectiveGroupModal