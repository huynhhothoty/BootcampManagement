import { ProForm, ProFormSelect, ProFormText } from '@ant-design/pro-components'
import { Modal, message } from 'antd'
import React, { useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { getAllMajor } from '../../redux/major/major'
import { createUser } from '../../redux/authentication/authentication'

const NewUserModal = ({open,handleCancel,reloadTable}) => {
    const formRef = useRef()
    const dispatch = useDispatch()
    const [loading,setLoading] = useState(false)
    const [error, setError] = useState('')
    const handleAddNewUser = async () => {
        setLoading(true)
        try {
            let formData = await formRef?.current.validateFields()
            formData = {
                ...formData,
                role: 'teacher'
            }
            const res = await dispatch(createUser(formData))
            if(res.payload.status && res.payload.status === 'ok'){
                message.success('Create new user successfully')
                reloadTable()
                handleCancel()
                formRef?.current.resetFields()
                setError('')
            }else {
                setError('**This email has already been registered, Please try another email')
            }
            setLoading(false)
            
        } catch (error) {
            setLoading(false)
        }
    }
  return (
    <Modal title="New User" open={open} onOk={handleAddNewUser} onCancel={handleCancel} okButtonProps={{loading:loading}}>
        <span style={{color:'red'}}>{error}</span>
        <ProForm submitter={false} formRef={formRef}>
            <ProFormText
                name='name'
                label='User Name'
                rules={[
                    {
                        required: true,
                        message: 'You must enter user name!',
                    },
                ]}
            />
            <ProFormText
                name='email'
                label='Email'
                rules={[
                    {
                        required: true,
                        type: 'email',
                        message: 'This is not an email!',
                    }
                ]}
            />
            <ProFormSelect
                name='major'
                label='Major'
                rules={[
                    {
                        required: true,
                        message: 'You must choose a major!',
                    },
                ]}
                request={async () => {
                    const majorRes = await dispatch(getAllMajor())

                    return majorRes.payload.data.map((major) => {
                        return {
                            label: major.name,
                            value: major._id
                        }
                    })
                }}
            />
        </ProForm>
      </Modal>
  )
}

export default NewUserModal