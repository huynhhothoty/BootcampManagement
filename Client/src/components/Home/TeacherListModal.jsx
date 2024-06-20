import { Button, Modal, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { queryAllDepartment } from '../../redux/major/major'
import { ProTable } from '@ant-design/pro-components'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import SelectTeacherModal from '../Teacher/SelectTeacherModal'
import { updateSubjectTeacherList } from '../../redux/subject/subject'

const TeacherListModal = ({open, handleCancel, modalData}) => {
    const dispatch = useDispatch()
    const [data,setData] = useState([])
    const [openSelectTeacherModal, setOpenSelectTeacherModal] = useState(false)
    const [selectTeacherModalData, setSelectTeacherModalData] = useState(null)
    const {checkSubjectList} = useSelector(store => store.subject)

    const handleOpenSelectTeacherModal = (teacher) => {
        setOpenSelectTeacherModal(true)
        setSelectTeacherModalData(teacher)
    }

    const handleCloseSelectTeacherModal = () => {
        setOpenSelectTeacherModal(false)
        setSelectTeacherModalData(null)
    }

    const handleAddTeacher = (newList) => {
        setData([...newList])
    }

    const handleDeleteTeacher = (teacherId) => {
        setData(data.filter(teacher => teacher._id !== teacherId))
    }

    const column = [
        {
            title: 'Teacher Code',
            dataIndex: 'code',
            copyable: true,
            ellipsis: true,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            ellipsis: true,
            copyable: true,
        },

        {
            title: 'Department',
            dataIndex: 'departmentChild',
            ellipsis: true,
            valueType: 'cascader',
            request: async () => {
                const res = await dispatch(queryAllDepartment(''))
                return res.payload.data.map((department) => {
                    return {
                        value: department._id,
                        label: department.name,
                        children: department.list.map((subDepartment) => {
                            return {
                                value: subDepartment._id,
                                label: subDepartment.name,
                            };
                        }),
                    };
                })
            }
        },
        {
            title: 'Active',
            dataIndex: 'isActive',
            ellipsis: true,
            valueType: 'select',
            valueEnum: {
                true: {
                    text: "Active",
                    status: "Success"
                },
                false: {
                    text: "Inactive",
                    status: "Error"
                }
            },
            initialValue: 'true',
        },
        {
            title: 'Action',
            valueType: 'option',
            key: 'option',
            align: "center",
            width: 100,
            render: (_,row) => {
                return <Button icon={<DeleteOutlined/>} danger onClick={() => handleDeleteTeacher(row._id)}/>
            }
        }
    ]

    const handleOk = () => {
        let checkListIndex = checkSubjectList.findIndex(subject => subject._id === modalData._id)
        dispatch(updateSubjectTeacherList({
            subjectIndex: checkListIndex,
            teachers: data
        }))
        handleCancel()
    }


    useEffect(() => {
        if(modalData){
            setData(modalData.teachers)
        }
    },[modalData])
  return (
    <>
    <SelectTeacherModal open={openSelectTeacherModal} handleCancel={handleCloseSelectTeacherModal} modalData={selectTeacherModalData} handleAddTeacher={handleAddTeacher}/>
    <Modal title={modalData ? modalData.name : ''} open={open} onCancel={handleCancel} width={1000} onOk={handleOk}>
        <ProTable
            dataSource={data}
            columns={column}
            search={false}
            options={false}
            pagination={false}
            bordered
            toolBarRender={() => {

                return [
                    <Button
                        key="button"
                       
                        type="primary"
                        onClick={() => handleOpenSelectTeacherModal(data)}
                    >
                        Modify List
                    </Button>,

                ]
            }}
        />
    </Modal>
    </>
  )
}

export default TeacherListModal