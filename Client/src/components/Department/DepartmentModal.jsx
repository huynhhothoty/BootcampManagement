import { ModalForm, ProFormText } from '@ant-design/pro-components'
import { Form, message } from 'antd';
import { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { createDepartment, updateDepartment } from '../../redux/department/department';

const DepartmentModal = ({ open, onClose, modalType, modalData, reloadTable, openNotification }) => {
    const dispatch = useDispatch()

    const [form] = Form.useForm();

    const handleSubmitModal = async (formData) => {
        if(modalData){
            if(modalType === 'edit'){
                if(!modalData.isChild){
                    await dispatch(updateDepartment({departmentId: modalData._id, data: formData}))
                    message.success("Update department successfully!")
                    reloadTable()
                    onClose()
                }else {
                    let newList = [...modalData.root.list]
                    const index = newList.findIndex((child) => child._id === modalData._id)
                    newList[index].name = formData.name
                    newList[index].code = formData.code
                    await dispatch(updateDepartment({departmentId: modalData.root._id, data: {list: [...newList]}}))
                    message.success("Update sub-department successfully!")
                    reloadTable()
                    onClose()
                }
                
            }else if(modalType === 'add'){
                let newList = [...modalData.list]
                newList.push(formData)
                await dispatch(updateDepartment({departmentId: modalData._id, data: {list: [...newList]}}))
                message.success("Add new sub-department successfully!")
                reloadTable()
                onClose()
            }
        }else {
            let newFormData = {...formData}
            newFormData['list'] = [
                {
                    name: formData.name + ' 1',
                    code: formData.code
                }
            ]
            const a = await dispatch(createDepartment(newFormData))
            message.success("Add new department successfully!")
            reloadTable()
            onClose()
        }
    }

    useEffect(() => {
        if(modalType === 'edit'){
            form.setFieldsValue({
                name: modalData.name,
                code:modalData.code
            })
        }
    },[modalType, modalData, form])
  return (
    <ModalForm

            title={modalType === 'create' ? "New Department" : "Edit Department"}
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
                label="Deparment Name"
                placeholder="Please enter department name"
                rules={[
                    {
                        required: true,
                        message: 'You must enter department name!',
                    },
                ]}
            />
            <ProFormText
                name="code"
                label="Department Code"
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

export default DepartmentModal