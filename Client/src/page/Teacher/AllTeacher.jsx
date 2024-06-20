import { Layout, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-components';
import { Button, } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { copyObjectWithKeyRename, objectToQueryString } from '../../util/TableParamHandle/tableParamHandle';
import { queryAllTeacher, updateTeacherData } from '../../redux/teacher/teacher';
import { queryAllDepartment } from '../../redux/major/major';
import TeacherDataModal from '../../components/Teacher/TeacherDataModal';
import { deactiveTeacherConfirmConfig } from '../../util/ConfirmModal/confirmConfig';

const AllTeacher = ({confirmModal, isModal, selectedTeacherKey, onSelectChange}) => {
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const actionRef = useRef();
    const [departmentList, setDepartmentList] = useState([])
    const [openTeacherDataModal, setOpenTeacherDataModal] = useState(false)
    const [teacherDataModalData, setTeacherDataModalData] = useState(null)
    const [teacherDataModalType, setTeacherDataModalType] = useState('add')

    const handleOpenTeacherModalData = (data) => {
        if(data){
            setTeacherDataModalData(data)
            setTeacherDataModalType('edit')
        }else {
            setTeacherDataModalData(null)
            setTeacherDataModalType('add')
        }
        setOpenTeacherDataModal(true)
    }

    const handleCloseTeacherModalData = () => {
        setTeacherDataModalData(null)
        setTeacherDataModalType('add')
        setOpenTeacherDataModal(false)
    }

    const columns = [
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
                setDepartmentList(res.payload.data)
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
            width: 170,
            hideInTable: isModal,
            render: (text, record, _, action) => {
                return <div style={{ display: 'flex', justifyContent: "space-between" }}>
                    <Button icon={<EditOutlined />} onClick={() => handleOpenTeacherModalData(record)}/>
                    {
                        record.isActive ? 
                        (
                            <Button danger onClick={async () => {
                                const confirmed = await confirmModal.confirm(
                                    deactiveTeacherConfirmConfig
                                );
                                if (confirmed) {
                                    const newData = {
                                        isActive: false
                                    }
                                    const res = await dispatch(updateTeacherData({
                                        teacherId: record._id,
                                        data: newData
                                    }))
                                    message.success('Deactivate teacher successfully')
                                    actionRef.current.reload()
                                }
                            }}>Deactivate</Button>
                        ) :
                        (
                            <Button onClick={async () => {
                                const newData = {
                                    isActive: true
                                }
                                const res = await dispatch(updateTeacherData({
                                    teacherId: record._id,
                                    data: newData
                                }))
                                message.success('Activate teacher successfully')
                                actionRef.current.reload()
                            }}>Activate</Button>
                        )
                    }
                    
                </div>
            }
        }

    ];
    const reloadTable = () => {
        actionRef.current.reload()
    }

    return (
        <div>
            <TeacherDataModal open={openTeacherDataModal} handleCancel={handleCloseTeacherModalData} modalData={teacherDataModalData} modalType={teacherDataModalType} departmentList={departmentList} reloadTable={reloadTable}/>
            <ProTable
                columns={columns}
                actionRef={actionRef}
                cardBordered
                tableAlertRender={false}
                rowSelection={isModal ? {
                    selectedRowKeys: selectedTeacherKey,
                    onChange: onSelectChange,
                    // getCheckboxProps: (record) => ({
                    //     disabled: selectedTeacherKey.includes(record._id),
                    //     // Column configuration not to be checked
                    //   }),
                    
                  } : false}
                request={async (params) => {
                   
                    let newParams = copyObjectWithKeyRename(params)
                    if(newParams.departmentChild){
                        newParams = {
                            ...newParams,
                            departmentChild: newParams.departmentChild[1]
                        }
                    }
                    let queryString = objectToQueryString(newParams)

                    const res = await dispatch(queryAllTeacher(queryString))
                    let newData = res.payload.data.map((teacher) => {
                        return {
                            ...teacher,
                            key: teacher._id
                        }
                    })
                    return {
                        data: newData,
                        success: true,
                        total: res.payload.total,
                    }
                }}
                columnsState={{
                    persistenceKey: 'pro-table-singe-demos',
                    persistenceType: 'localStorage',
                    defaultValue: {
                        option: { fixed: 'right', disable: true },
                    },
                }}
                rowKey="key"
                search={{
                    labelWidth: 'auto',

                }}
                options={{
                    setting: {
                        listsHeight: 400,
                    },
                }}
                pagination={{
                    pageSize: 10,
                }}
                dateFormatter="string"
                toolBarRender={() => {

                    return [
                        <Button
                            key="button"
                            icon={<PlusOutlined />}
                            type="primary"
                            onClick={() => handleOpenTeacherModalData(null)}
                        >
                            Add Teacher
                        </Button>,

                    ]
                }}
            />
        </div>
    )
}

export default AllTeacher