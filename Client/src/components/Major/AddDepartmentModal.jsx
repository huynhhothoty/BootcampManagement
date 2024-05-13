import { Button, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import AllDepartment from '../../page/Department/AllDepartment'

const AddDepartmentModal = ({ open, handleClose, departmentList,handleOk }) => {
    const [selectedDepartmentKey, setSelectedDepartmentKey] = useState([])
    const [selectedDepartment, setSelectedDepartment] = useState([])
    const handleGenSelectedDepartment = () => {
        return departmentList.map((department) => {
            return department._id
        })
    }
    const handleAddDepartment = (newDepartmentList) => {
        setSelectedDepartment(newDepartmentList)
        // setSelectedDepartment(newDepartmentList)
    }

    const handleFinish = () => {
        handleOk(selectedDepartment)
        handleClose()
    }
    useEffect(() => {
        setSelectedDepartmentKey(handleGenSelectedDepartment())
        setSelectedDepartment(departmentList)
    },[departmentList])
  return (
    <Modal title="All Departments" open={open} onCancel={handleClose} width={1000} onOk={handleFinish}>
        <AllDepartment isAddModal={true} selectedDepartment={selectedDepartmentKey} handleAddDepartment={handleAddDepartment}/>
    </Modal>
  )
}

export default AddDepartmentModal