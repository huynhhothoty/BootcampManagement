import { ModalForm, ProFormText } from '@ant-design/pro-components'
import { Form, message } from 'antd';
import { useEffect } from 'react'
import { useDispatch } from 'react-redux';

const BranchMajorDetailModal = ({open, onClose, modalType, modalData, onSubmit}) => {
    const dispatch = useDispatch()

    const [form] = Form.useForm();

    const handleSubmitModal = (formData) => {
        if(modalType === 'edit'){
            onSubmit({...formData,_id: modalData._id,index: modalData.index}, modalType)
        }else if(modalType === 'add'){
            onSubmit(formData, modalType)
        }
        
        onClose()
    }
    
    useEffect(() => {
        if(modalData){
            form.setFieldsValue({
                name: modalData.name,
                branchCode: modalData.branchCode
            })
        }
    },[modalData])
    return (
        <ModalForm

            title={modalType === 'create' ? "New Specialization" : "Edit Specialization"}
            open={open}
            form={form}
            width={500}
            autoFocusFirstInput
            modalProps={{
                destroyOnClose: true,
                onCancel: onClose,
                okText: modalType === 'create' ? "Create" : "Save"
            }}
            onFinish={handleSubmitModal}
        >
            <ProFormText

                name="name"
                label="Specialization Name"
                placeholder="Please enter department name"
                rules={[
                    {
                        required: true,
                        message: 'You must enter department name!',
                    },
                ]}
            />
            <ProFormText
                name="branchCode"
                label="Specialization Code"
                placeholder="Please enter department code"
                rules={[
                    {
                        required: true,
                        message: 'You must enter department code!',
                    },
                ]}
            />


        </ModalForm>
    )
}

export default BranchMajorDetailModal