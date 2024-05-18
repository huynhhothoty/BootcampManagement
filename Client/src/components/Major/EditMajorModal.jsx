import { ProForm } from '@ant-design/pro-components'
import { Modal } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import MajorDetailModalForm from './MajorDetailModalForm'
import { useDispatch } from 'react-redux'
import { updateMajor } from '../../redux/major/major'

const EditMajorModal = ({open, handleCancel, modalData,reloadTable}) => {
    const formRef = useRef()
    const dispatch = useDispatch()
    const [loading,setLoading] = useState(false)

    const handleOk = () => {
        setLoading(true)
        formRef?.current.validateFields().then(async (data) => {
            await dispatch(updateMajor({majorId: modalData._id, data: data}))
            reloadTable()
            handleCancel()
            setLoading(false)
        }).catch(() => {
            setLoading(false)
        })
    }

    useEffect(() => {
        if(modalData){
            formRef?.current.setFieldsValue({
                name: modalData.name,
                majorCode: modalData.majorCode
            })
        }
    },[modalData])

    return (

        <Modal title="Edit Major" open={open} onOk={handleOk} onCancel={handleCancel} okButtonProps={{loading:loading}}>
            <ProForm
                formRef={formRef}
                submitter={false}
            >
                <MajorDetailModalForm/>
            </ProForm>
        </Modal>
    )
}

export default EditMajorModal