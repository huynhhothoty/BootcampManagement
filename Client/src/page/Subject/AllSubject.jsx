import { Layout } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-components';
import { Button, } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { copyObjectWithKeyRename, objectToQueryString } from '../../util/TableParamHandle/tableParamHandle';
import { deleteSubject, querySubject } from '../../redux/subject/subject';
import { queryAllDepartment } from '../../redux/major/major';
import SubjectDetailModal from '../../components/Subject/SubjectDetailModal';
import { deleteConfirmConfig } from '../../util/ConfirmModal/confirmConfig';
import { NOTI_SUCCESS, NOTI_SUCCESS_DELETE_SUBJECT, NOTI_SUCCESS_TITLE } from '../../util/constants/notificationMessage';

const AllSubject = ({ openNotification, confirmModal, isSelect, importingType, setSelectedSubject, selectedRowKeys, setSelectedRowKeys }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const actionRef = useRef();
    const [departmentList, setDepartmentList] = useState([])
    const columns = [
        {
            title: 'Subject Name',
            dataIndex: 'name',
            copyable: true,
            ellipsis: true,

        },
        {
            title: 'Credit',
            dataIndex: 'credit',
            ellipsis: true,

        },
        {
            disable: true,
            title: 'Subject Type',
            dataIndex: 'isCompulsory',
            onFilter: true,
            ellipsis: true,
            valueType: 'select',
            valueEnum: {
                true: {
                    text: "Compulsory",
                    status: "Error"
                },
                false: {
                    text: "Elective",
                    status: "Success"
                }
            },
            initialValue: importingType ? importingType === 'Compulsory' ? "true" : "false" : "true"
        },
        {
            title: 'Deparment',
            dataIndex: 'departmentChild',
            valueType: 'cascader',
            request: async () => {
                const academicRes = await dispatch(queryAllDepartment(''))
                setDepartmentList(academicRes.payload.data)
                return academicRes.payload.data.map((department) => {
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
                });
            },
            ellipsis: true,
            hideInTable: true,
        },
        {
            title: 'Action',
            valueType: 'option',
            key: 'option',
            align: "center",
            width: 100,
            render: (text, record, _, action) => {
                return <div style={{ display: 'flex', justifyContent: "space-between" }}>
                    <Button icon={<EditOutlined />} onClick={() => handleOpenModal(record)} />
                    <Button icon={<DeleteOutlined />} danger onClick={async () => {
                        const confirmed = await confirmModal.confirm(deleteConfirmConfig);
                        if (confirmed) {
                            const res = await dispatch(deleteSubject(record._id))
                            openNotification(NOTI_SUCCESS, NOTI_SUCCESS_TITLE, NOTI_SUCCESS_DELETE_SUBJECT)
                            reloadTable()

                        }
                    }} />
                </div>
            },
            hideInTable: isSelect ? true : false
        }

    ];

    const [openModal, setOpenModal] = useState(false)
    const [modalData, setModalData] = useState(null)
    const [modalType, setModalType] = useState('create')


    const handleOpenModal = (subjectData) => {
        if (subjectData) {
            setModalData(subjectData)
            setModalType("edit")
        } else {
            setModalData(null)
            setModalType("create")
        }
        setOpenModal(true)
    }

    const handleCloseModal = () => {
        setOpenModal(false)
    }

    const reloadTable = () => {
        actionRef?.current.reload()
    }

    const rowSelection = {
        selectedRowKeys: selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRowKeys(selectedRowKeys);
            setSelectedSubject(selectedRows);
        },
    };

    useEffect(() => {
        actionRef?.current.reset()
       
    },[importingType])

    return (
        <>
            <SubjectDetailModal openNotification={openNotification} departmentList={departmentList} open={openModal} onClose={handleCloseModal} modalType={modalType} modalData={modalData} reloadTable={reloadTable} />
            <ProTable
                columns={columns}
                actionRef={actionRef}
                cardBordered
                tableAlertRender={false}
                rowSelection={isSelect ? {
                    type: 'radio',
                    ...rowSelection,
                }: false}
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
                    
                    let departmentChildParams = null
                    if (newParams.departmentChild) {
                        departmentChildParams = {
                            ...newParams.departmentChild
                        }
                        delete newParams.departmentChild
                    }
                    if(importingType){
                        if(!('isCompulsory' in newParams)){
                            newParams['isCompulsory'] = importingType === 'Compulsory' ? true : false
                        }
                    }
                    let queryString = objectToQueryString(newParams)
                    if (departmentChildParams !== null) {
                        queryString += `&departmentChild=${departmentChildParams['1']}`
                    }
                    
                    const res = await dispatch(querySubject(queryString))
                    let newData = res.payload.data.map((student) => {
                        return {
                            ...student,
                            key: student._id
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
                            onClick={() => {
                                handleOpenModal()
                            }}
                            type="primary"
                        >
                            Add Subject
                        </Button>,

                    ]
                }}
            />
        </>
    )
}

export default AllSubject
