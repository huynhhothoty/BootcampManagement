import { ProFormText } from '@ant-design/pro-components'
import React from 'react'

const MajorDetailModalForm = () => {
    return (
        <>
            <ProFormText
                name="name"
                label="Major Name"
                rules={[{ required: true, message: 'Please enter major name' }]}
            />
            <ProFormText
                name="majorCode"
                label="Major Code"
                rules={[{ required: true, message: 'Please enter major code' }]}
            />
        </>
    )
}

export default MajorDetailModalForm