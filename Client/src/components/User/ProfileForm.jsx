import { ProFormText } from '@ant-design/pro-components'
import React from 'react'


const ProfileForm = () => {
  return (
    <>

        <ProFormText
            name='name'
            label='User name'
            rules={[{ required: true, message: 'Please enter user name' }]}
        />
        <ProFormText
            label='Email'
            name='email'
            rules={[
                {
                    required: true,
                    type: 'email',
                    message: 'This is not an email!',
                }
            ]}
        />
    </>
  )
}

export default ProfileForm