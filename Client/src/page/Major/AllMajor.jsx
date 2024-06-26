import { Layout } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-components';
import { Button, } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { copyObjectWithKeyRename, objectToQueryString } from '../../util/TableParamHandle/tableParamHandle';
import { getBranchMajorById, getDepartmentById, queryAllMajor, updateMajor } from '../../redux/major/major';
import DepartmentModal from '../../components/Major/DepartmentModal';
import BranchMajorModal from '../../components/Major/BranchMajorModal';
import CreateMajorModal from '../../components/Major/CreateMajorModal';
import EditMajorModal from '../../components/Major/EditMajorModal';
import { activateMajorConfirmConfig, deactivateMajorConfirmConfig } from '../../util/ConfirmModal/confirmConfig';

const AllMajor = ({confirmModal}) => {
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const actionRef = useRef();
    const columns = [
        {
            title: 'Major Code',
            dataIndex: 'majorCode',
            copyable: true,
            ellipsis: true,
            width: 300
        },
        {
            title: 'Major Name',
            dataIndex: 'name',
            ellipsis: true,
            copyable: true,

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
            title: 'Involving Departments',
            dataIndex: 'department',
            ellipsis: true,
            width: 200,
            align: 'center',
            render: (_,row) => {
                return <Button onClick={() => handleOpenDepartmentModal(row.department,row._id)}>View / Edit</Button>
            },
            hideInSearch: true,
        },
        {
            title: 'Specializations',
            dataIndex: 'branchMajor',
            ellipsis: true,
            width: 200,
            align: 'center',
            render: (_,row) => {
                return <Button onClick={() => handleOpenbranchMajorModal(row.branchMajor,row._id)}>View / Edit</Button>
            },
            hideInSearch: true,
        },
       
        {
            title: 'Action',
            valueType: 'option',
            key: 'option',
            align: "center",
            width: 170,
            render: (text, record, _, action) => {
                return <div style={{ display: 'flex', justifyContent: "space-between" }}>
                    <Button icon={<EditOutlined />} onClick={() => {handleOpenEditMajorModal(record)}}/>
                    <Button  danger={record.isActive} type='primary' onClick={async () => {
                         const confirmed = await confirmModal.confirm(
                            record.isActive ? deactivateMajorConfirmConfig : activateMajorConfirmConfig
                        );
                        if(confirmed){
                            const res = await dispatch(updateMajor({majorId: record._id, data: {isActive: !record.isActive}}))
                            reloadTable()
                        }
                    }}>{record.isActive ? 'Deactivate' : 'Activate'}</Button>
                </div>
            }
        }

    ];

    const [departmentModalOpen,setDepartmentModalOpen] = useState(false)
    const [departmentModalData,setDepartmentModalData] = useState([])
    const [departmentModalMajorId,setDepartmentModalMajorId] = useState('')

    const [branchMajorModalOpen,setbranchMajorModalOpen] = useState(false)
    const [branchMajorModalData,setbranchMajorModalData] = useState([])
    const [branchMajorModalMajorId,setbranchMajorModalMajorId] = useState('')

    const [createMajorModalOpen,setCreateMajorModalOpen] = useState(false)

    const [editMajorModalOpen, setEditMajorModalOpen] = useState(false)
    const [editMajorModalData, setEditMajorModalData] = useState(null)

    const handleOpenDepartmentModal = async (departments,majorId) => {
        let tempDepartmentList = []
        for (let i = 0; i < departments.length; i++) {
            const departmentId = departments[i];
            const departmentRes = await dispatch(getDepartmentById(departmentId))
            tempDepartmentList.push(departmentRes.payload.data)
            
        }

        setDepartmentModalData(tempDepartmentList)
        setDepartmentModalMajorId(majorId)
        setDepartmentModalOpen(true)
    }

    const handleCloseDepartmentModal = () => {
        setDepartmentModalData([])
        setDepartmentModalMajorId('')
        setDepartmentModalOpen(false)
    }
    
    const handleOpenbranchMajorModal = async (branchList,majorId) => {
        let tempBranchList = []
        for (let i = 0; i < branchList.length; i++) {
            const branchId = branchList[i];
            const branchRes = await dispatch(getBranchMajorById(branchId))
            tempBranchList.push(branchRes.payload.data)
        }

        setbranchMajorModalData(tempBranchList)
        setbranchMajorModalMajorId(majorId)
        setbranchMajorModalOpen(true)
    }

    const handleClosebranchMajorModal = () => {
        setbranchMajorModalData([])
        setbranchMajorModalMajorId('')
        setbranchMajorModalOpen(false)
    }

    const handleUpdateBranchList = (list) => {
        setbranchMajorModalData(list)
    }

    const handleOpenCreateMajorModal = () => {
        setCreateMajorModalOpen(true)
    }
    const handleCloseCreateMajorModal = () => {
        setCreateMajorModalOpen(false)
    }

    const handleOpenEditMajorModal = (data) => {
        setEditMajorModalData(data)
        setEditMajorModalOpen(true)
    }

    const handleCloseEditMajorModal = () => {
        setEditMajorModalData(null)
        setEditMajorModalOpen(false)
    }
    

    const reloadTable = () => {
        actionRef?.current.reload()
    }

    return (
        <div>
            <DepartmentModal open={departmentModalOpen} departments={departmentModalData} handleClose={handleCloseDepartmentModal} confirmModal={confirmModal} majorId={departmentModalMajorId} reloadTable={reloadTable}/>
            <BranchMajorModal branchList={branchMajorModalData} open={branchMajorModalOpen} handleClose={handleClosebranchMajorModal} majorId={branchMajorModalMajorId} handleUpdate={handleUpdateBranchList} reloadTable={reloadTable} confirmModal={confirmModal}/>
            <CreateMajorModal open={createMajorModalOpen} handleClose={handleCloseCreateMajorModal} confirmModal={confirmModal}  reloadTable={reloadTable}/>
            <EditMajorModal open={editMajorModalOpen} handleCancel={handleCloseEditMajorModal} modalData={editMajorModalData} reloadTable={reloadTable}/>
              <ProTable
                columns={columns}
                actionRef={actionRef}
                cardBordered
                tableAlertRender={false}
                // rowSelection={isAddModal ? {
                //     selectedRowKeys,
                //     onChange: onSelectChange,
                //     getCheckboxProps: (record) => ({
                //         disabled: selectedStudent.includes(record._id),
                //         // Column configuration not to be checked
                //     })
                // } : false}

                request={async (params) => {
                    let newParams = copyObjectWithKeyRename(params)
                    let queryString = objectToQueryString(newParams)
                 
                    const res = await dispatch(queryAllMajor(queryString))
                    let newData = res.payload.data.map((major) => {
                        return {
                            ...major,
                            key: major._id
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
                            onClick={handleOpenCreateMajorModal}
                        >
                            Create Major
                        </Button>,

                    ]
                }}
            />
        </div>
    )
}

export default AllMajor