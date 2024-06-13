import { ProForm, ProFormSelect } from '@ant-design/pro-components'
import { Modal, message } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { swapSubject } from '../../../redux/CreateBootcamp/createBootCamp'

const SwapModal = ({open, handleClose, modalData}) => {
    const dispatch = useDispatch()
    const { allowcateFields } = useSelector(store => store.createBootCamp)
    const [smallFiledChooseList,setSmallFieldChooseList] = useState(null)
    const formRef = useRef()

    const handleChooseField = (value) => {
        let choosenField = allowcateFields[value]
        let newSmallFieldChooseList = {}
        
        choosenField.smallField.forEach((sField,sIndex) => {
            newSmallFieldChooseList[sIndex] = sField.fieldName
        })

        setSmallFieldChooseList(newSmallFieldChooseList)
    }

    const handleOk = async () => {
        try {
            let formData = await formRef.current.validateFields()
            await dispatch(swapSubject({
                subjectIndex: modalData.subjectData.index, 
                oldFieldIndex: modalData.fieldIndex, 
                newFieldIndex: formData.field, 
                newSmallFieldIndex: Number(formData.smallField)
            }))
            handleClose()
            message.success('Move Subject successfully')
        } catch (error) { /* empty */ }
    }

    useEffect(() => {
        if(formRef.current){
            formRef.current.resetFields()
            setSmallFieldChooseList(null)
        }
    },[open])

  return (
    <Modal title={`Move ${modalData?.subjectData.name} to...`} open={open} onCancel={handleClose} onOk={handleOk}>
        <ProForm submitter={false} formRef={formRef}>
            <ProFormSelect
                label="Field"
                name={'field'}
                request={() => {
                    let valueList = []
                    allowcateFields.forEach((field,index) => {
                        if(index < allowcateFields.length - 1 && index !== modalData?.fieldIndex){
                            valueList.push({
                                value:index,
                                label: field?.fieldName
                            })
                        }
                    })
                    return valueList
                }}
                rules={[
                    {
                        required: true,
                        message: 'Please choose 1 field',
                    },
                ]}
                onChange={handleChooseField}
            />
            <ProFormSelect
                label="Child Field"
                name={'smallField'}
                rules={[
                    {
                        required: true,
                        message: 'Please choose 1 child field',
                    },
                ]}
                disabled={!smallFiledChooseList}
                valueEnum={smallFiledChooseList}
            />
        </ProForm>
    </Modal>
  )
}

export default SwapModal