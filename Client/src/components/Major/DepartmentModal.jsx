import { Button, Modal, message } from 'antd'
import React, { useEffect, useState } from 'react'
import MajorDepartmentList from './MajorDepartmentList'
import { PlusOutlined } from '@ant-design/icons';
import AddDepartmentModal from './AddDepartmentModal';
import { useDispatch } from 'react-redux';
import major, { updateMajor } from '../../redux/major/major';

const DepartmentModal = ({ open, handleClose, departments, confirmModal, majorId, reloadTable }) => {
    const dispatch = useDispatch()

    const [departmentList, setDepartmentList] = useState([])
    const [addDepartmentModalOpen, setAddDepartmentModalOpen] = useState(false)

    const handleOpenAddDepartmentModal = () => {
        setAddDepartmentModalOpen(true)
    }

    const handleCloseAddDepartmentModal = () => {
        setAddDepartmentModalOpen(false)
    }

    const handleUpdateDepartments = (departmentList) => {
        setDepartmentList(departmentList)
    }

    const handleOk = async () => {
       const res = await dispatch(updateMajor({majorId: majorId, data: {department: departmentList.map(department => department._id)}}))
       message.success('Update Major Department successfully!')
       reloadTable()
       handleClose()
    }

    useEffect(() => {
        setDepartmentList(departments)
    }, [departments])
    return (
        <>
        <AddDepartmentModal open={addDepartmentModalOpen} handleClose={handleCloseAddDepartmentModal} departmentList={departmentList} handleOk={handleUpdateDepartments}/>
        <Modal title="Edit Departments" open={open} onOk={handleOk} onCancel={handleClose} width={1000}>
            <div style={{ display: 'flex', flexDirection: "column", gap: 10, }}>
                <Button style={{ alignSelf: 'flex-end' }} icon={<PlusOutlined />} type='primary' onClick={handleOpenAddDepartmentModal}>Add</Button>
                <MajorDepartmentList departmentList={departmentList} confirmModal={confirmModal} deleteFunc={handleUpdateDepartments}/>
            </div>
        </Modal>
        </>
    )
}

export default DepartmentModal