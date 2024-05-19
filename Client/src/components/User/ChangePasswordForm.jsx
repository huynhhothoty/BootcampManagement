import { ProFormText } from '@ant-design/pro-components'
import React from 'react'
import {Typography} from 'antd'
const {Text} = Typography

const ChangePasswordForm = ({error}) => {
  return (
    <>
        <div style={{marginBottom:20}}>
        <Text >This action will change your password! To do this, please enter your current password and then enter your new password</Text>
        </div>
        <Text style={{color:"red"}}>{error}</Text>
        <ProFormText.Password
             label='Current Password'
             name='oldPassword'
             rules={[
                 {
                     required: true,
                     message: 'Please input your current password!',
                 },
             ]}
        />
        <ProFormText.Password
             label='New Password'
             name='newPassword'
             rules={[
                 {
                     required: true,
                     message: 'Please input your new password!',
                 },
             ]}
        />
    </>
  )
}

export default ChangePasswordForm