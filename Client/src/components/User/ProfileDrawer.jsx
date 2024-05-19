import { ProForm, ProFormCaptcha } from '@ant-design/pro-components'
import { Button, Drawer, Space, message } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import ProfileForm from './ProfileForm'
import ChangePasswordForm from './ChangePasswordForm'
import { useDispatch, useSelector } from 'react-redux'
import { changeUserPassword, editUserData, setFirstUserData, updateUser } from '../../redux/authentication/authentication'
import { useNavigate } from 'react-router-dom'
import { USER_DATA, USER_TOKEN } from '../../util/constants/sectionStorageKey'

const ProfileDrawer = ({ onClose, open, drawerType }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const formRef = useRef()
    const { userData } = useSelector(store => store.authentication)
    const [loading,setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        if(drawerType === 'profile' && userData){
            formRef?.current.setFieldsValue({
                name: userData.name,
                email: userData.email
            })
        }
    },[drawerType, userData])

    const handleSaveChange = async () => {
        setLoading(true)
        try {
            const fieldData = await formRef?.current.validateFields()
            const res = await dispatch(updateUser(fieldData))
            const newUserData = res.payload.data
            dispatch(editUserData({
                ...newUserData,
                id: newUserData._id
            }))
            setLoading(false)
            onClose()
        }catch{
            setLoading(false)
        }
        
    }

    const handleChangePassword = async () => {
        setLoading(true)
        try {
            const fieldData = await formRef?.current.validateFields()
            const res = await dispatch(changeUserPassword(fieldData))
            if(res.payload.status === 'ok'){
                setLoading(false)
                onClose()
                sessionStorage.removeItem(USER_TOKEN)
                sessionStorage.removeItem(USER_DATA)
                message.success('Password updated successfully')
                navigate("/login")
            }else{
                setErrorMessage('Your current password is incorrect!')
                setLoading(false)
            }
            
        }catch{
            setLoading(false)
        }
    }

    return (
        <Drawer

            title={drawerType === 'profile' ? 'Profile' : 'Change Password'}
            onClose={onClose}
            open={open}
            width={500}
            extra={
                <Space>
                    <Button onClick= {drawerType === 'profile' ? handleSaveChange : handleChangePassword} type="primary" loading={loading}>
                        {drawerType === 'profile' ? 'Save' : 'Change Password'}
                    </Button>
                </Space>
            }
        >
            <ProForm submitter={false}  formRef={formRef}>
                {drawerType === 'profile' ?
                    <ProfileForm /> :
                    <ChangePasswordForm error={errorMessage}/>
                }
               
            </ProForm>
        </Drawer>
    )
}

export default ProfileDrawer