import { Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import AllTeacher from '../../page/Teacher/AllTeacher'

const SelectTeacherModal = ({open, handleCancel, modalData, handleAddTeacher}) => {
    const [selectedTeacherKey, setSelectedTeacherKey] = useState([])
    const [selectedTeacher, setSelectedTeacher] = useState([])

    const onSelectChange = (newSelectedRowKeys,newSelectedRows) => {
        setSelectedTeacherKey(newSelectedRowKeys)
        setSelectedTeacher(newSelectedRows)
    }
    
    const handleOk = () => {
        handleAddTeacher(selectedTeacher)
        handleCancel()
    }

    useEffect(() => {
        if(modalData){
            setSelectedTeacherKey(modalData.map(teacher => teacher._id))
            setSelectedTeacher([...modalData])
        }
    },[modalData])

  return (
    <Modal open={open} onCancel={handleCancel} width={1200} onOk={handleOk}>
        <AllTeacher isModal={true} selectedTeacherKey={selectedTeacherKey} onSelectChange={onSelectChange}/>
    </Modal>
  )
}

export default SelectTeacherModal