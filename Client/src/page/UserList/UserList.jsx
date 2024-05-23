import { Layout, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-components';
import { Button, } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { copyObjectWithKeyRename, objectToQueryString } from '../../util/TableParamHandle/tableParamHandle';
import { queryAllUser, resetPassword } from '../../redux/authentication/authentication';
import { resetPasswordConfirm } from '../../util/ConfirmModal/confirmConfig';
import NewUserModal from '../../components/User/NewUserModal';

const UserList = ({ confirmModal }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const actionRef = useRef();
    const [openNewUserModal, setOpenNewUserModal] = useState(false)
    const columns = [
        {
            title: 'User Name',
            dataIndex: 'name',
            copyable: true,
            ellipsis: true,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            ellipsis: true,
            copyable: true,
        },

        {
            title: 'Active',
            dataIndex: 'isActive',
            ellipsis: true,
            copyable: true,
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
            title: 'Reset Password',
            dataIndex: '',
            ellipsis: true,
            width: 200,
            align: 'center',
            render: (_, row) => {
                return <Button onClick={async () => {
                    const confirmed = await confirmModal.confirm(
                        resetPasswordConfirm
                    );
                    if(confirmed){
                        handleResetPassword(row._id)
                    }
                }}>Reset Password</Button>
            },
            hideInSearch: true,
        },
        // {
        //     title: 'Action',
        //     valueType: 'option',
        //     key: 'option',
        //     align: "center",
        //     width: 100,
        //     render: (text, record, _, action) => {
        //         return <div style={{ display: 'flex', justifyContent: "center" }}>
        //             <Button icon={<DeleteOutlined />} danger />
        //         </div>
        //     }
        // }

    ];

    const handleOpenNewUserModal = () => {
        setOpenNewUserModal(true)
    }

    const handleCloseNewUserModal = () => {
        setOpenNewUserModal(false)
    }

    const handleResetPassword = async (userId) => {
        const res = await dispatch(resetPassword({userId}))
        message.success('Reset Password Success')
    }

    const reloadTable = () => {
        actionRef?.current.reload()
    }

    return (
        <div>
            
            <NewUserModal open={openNewUserModal} handleCancel={handleCloseNewUserModal} reloadTable={reloadTable}/>

            <ProTable
                columns={columns}
                actionRef={actionRef}
                cardBordered
                tableAlertRender={false}

                request={async (params) => {
                    let newParams = copyObjectWithKeyRename(params)
                    let queryString = objectToQueryString(newParams)

                    const res = await dispatch(queryAllUser(queryString))
                    let newData = res.payload.data.map((user) => {
                        return {
                            ...user,
                            key: user._id
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
                            onClick={handleOpenNewUserModal}
                        >
                            New user
                        </Button>,

                    ]
                }}
            />
        </div>
    )
}

export default UserList