import { ProForm, ProFormText } from '@ant-design/pro-components'
import { Modal } from 'antd'
import React, { useEffect, useRef, useState } from 'react'

const DraftNameModal = ({open,handleCancel,editingDraftName, handleSave}) => {
    const formRef = useRef()
    const [loading,setLoading] = useState(false)
    const handleSubmit = async () => {
        setLoading(true)
        try {
            const fieldValue = await formRef.current.validateFields()
            await handleSave(fieldValue.name)
            setLoading(false)
            handleCancel()
        } catch (error) {
            setLoading(false)
        }
        
    }

    useEffect(() => {
        if(editingDraftName){
            formRef.current.setFieldValue('name', editingDraftName)
        }
    },[editingDraftName])
  return (
    <Modal title={editingDraftName ? 'Edit Draft' : 'Save New Draft'} open={open} onCancel={handleCancel} okText={'Save'} onOk={handleSubmit} okButtonProps={{loading:loading}}>
      <ProForm submitter={false} formRef={formRef}>
        <ProFormText
            label='Draft Name'
            name='name'
            rules={[
                {
                    required: true,
                    message: 'You must enter draft name!',
                },
            ]}
        />
      </ProForm>
    </Modal>
  )
}

export default DraftNameModal
