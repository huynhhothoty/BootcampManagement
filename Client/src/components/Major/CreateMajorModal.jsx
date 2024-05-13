import { Button, Form, Modal, message } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import {
    ProFormCheckbox,
    ProFormText,
    StepsForm,
} from '@ant-design/pro-components';
import MajorDetailModalForm from './MajorDetailModalForm';
import BranchMajorList from './BranchMajorList';
import MajorDepartmentList from './MajorDepartmentList';
import AddDepartmentModal from './AddDepartmentModal';
import { PlusOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { addBranchMajor, createMajor } from '../../redux/major/major';

const CreateMajorModal = ({ open, handleClose, confirmModal, reloadTable }) => {
    const dispatch = useDispatch()

    const [branchList, setBranchList] = useState([])
    const [form] = Form.useForm();
    const [current, setCurrent] = useState(0)

    const [departmentList, setDepartmentList] = useState([])
    const [addDepartmentModalOpen, setAddDepartmentModalOpen] = useState(false)

    const [error, setError] = useState(false)
    const [loading,setLoading] = useState(false)

    const handleUpdateBranchList = (change) => {
        if (change.index !== undefined

        ) {
            let tempBranchList = [...branchList]
            tempBranchList[change.index].name = change.name
            tempBranchList[change.index].branchCode = change.branchCode
            setBranchList(tempBranchList)
        } else {
            let tempBranchList = [...branchList]
            tempBranchList.push({ ...change, key: tempBranchList.length })
            setBranchList(tempBranchList)
        }
    }

    const handleOpenAddDepartmentModal = () => {
        setAddDepartmentModalOpen(true)
    }

    const handleCloseAddDepartmentModal = () => {
        setAddDepartmentModalOpen(false)
    }

    const handleUpdateDepartmentList = (change) => {
        setDepartmentList(change)
    }

    const handleCreateMajor = async () => {
        setLoading(true)
        let createData = {
            name: form.getFieldValue('name'),
            majorCode: form.getFieldValue('majorCode'),
            branchMajor: [],
            department: departmentList.map(department => department._id)
        }

        for (let i = 0; i < branchList.length; i++) {
            const branch = branchList[i]
            let tempBranch = {
                name: branch.name,
                branchCode: branch.branchCode
            }
            let branchRes = await dispatch(addBranchMajor(tempBranch))
            createData.branchMajor.push(branchRes.payload.data._id)
        }
        let res = await dispatch(createMajor(createData))
        console.log(res)
        setLoading(false)
        message.success('Create new major successfully!')
        reloadTable()
        handleClose()
    }

    useEffect(() => {
        setBranchList([])
        setDepartmentList([])
        form.setFieldsValue({
            majorCode: '',
            name: ''
        })
        setCurrent(0)
    }, [open])

    return (
        <Modal title="Create Major" open={open} onCancel={handleClose} width={1000} footer={false}>
            <StepsForm
                
                onFinish={async () => {

                }}
                stepsProps={{
                    status: error ? 'error' : 'process'
                }}
                current={current}
                submitter={{
                    render: ({ form, onSubmit, step, onPre }) => {
                        return [

                            step > 0 && (
                                <Button
                                    key="pre"
                                    onClick={() => {
                                        onPre?.();
                                        setCurrent(current - 1)
                                    }}
                                >
                                    Back
                                </Button>
                            ),
                            step < 2 ? <Button
                                key="next"
                                type="primary"
                                onClick={() => {
                                    if (step === 0) {
                                        form.validateFields().then(() => {

                                            setCurrent(current + 1)
                                            setError(false)
                                        }).catch(() => {
                                            setError(true)
                                        })
                                    }
                                    else if (step === 1) {
                                        if (branchList.length === 0) {
                                            setError(true)
                                        } else {
                                            setCurrent(current + 1)
                                            setError(false)
                                        }
                                    }

                                }}
                            >
                                Next
                            </Button> :
                                <Button
                                    key="next"
                                    type="primary"
                                    loading={loading}
                                    onClick={async () => {
                                        if (step === 2) {
                                            if (departmentList.length === 0) {
                                                setError(true)
                                            } else {
                                                await handleCreateMajor()
                                                setError(false)
                                            }
                                        }
                                    }}
                                >
                                    Create
                                </Button>
                            ,
                        ];
                    },
                }}
                formProps={{
                    style: {
                        minWidth: 900,
                        minHeight: 300
                    },
                    form: form
                }}

            >
                <StepsForm.StepForm
                    name="base"
                    title="Base Detail"
                    onFinish={async () => {
                        return true;
                    }}
                >
                    <MajorDetailModalForm />

                </StepsForm.StepForm>
                <StepsForm.StepForm name="specializations" title="Specializations" >
                    <BranchMajorList branchList={branchList} handleChange={handleUpdateBranchList} />

                </StepsForm.StepForm>
                <StepsForm.StepForm name="departments" title="Departments">
                    <AddDepartmentModal open={addDepartmentModalOpen} handleClose={handleCloseAddDepartmentModal} departmentList={departmentList} handleOk={handleUpdateDepartmentList} />
                    <div style={{ display: 'flex', flexDirection: "column", gap: 10, }}>
                        <Button style={{ alignSelf: 'flex-end' }} icon={<PlusOutlined />} type='primary' onClick={handleOpenAddDepartmentModal}>Add</Button>
                        <MajorDepartmentList departmentList={departmentList} deleteFunc={handleUpdateDepartmentList} confirmModal={confirmModal} />
                    </div>
                </StepsForm.StepForm>
            </StepsForm>
        </Modal>
    )
}

export default CreateMajorModal