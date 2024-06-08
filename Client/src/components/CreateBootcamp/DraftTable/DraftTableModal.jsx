import { ProTable } from '@ant-design/pro-components'
import { Button, Modal } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { EditOutlined, DeleteOutlined, PlusOutlined, DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { copyObjectWithKeyRename, objectToQueryString } from '../../../util/TableParamHandle/tableParamHandle'
import { loadDraft, queryUserDraft } from '../../../redux/CreateBootcamp/createBootCamp'
import { deleteConfirmConfig, loadDraftConfirmConfig, uploadDraftConfirmConfig } from '../../../util/ConfirmModal/confirmConfig'
import { NOTI_SUCCESS, NOTI_SUCCESS_DELETE_DRAFT, NOTI_SUCCESS_LOAD_DRAFT, NOTI_SUCCESS_TITLE } from '../../../util/constants/notificationMessage'
import DraftNameModal from './DraftNameModal'

const DraftTableModal = ({ actionRef, open, handleCancel, confirmModal, openNotification, handleUploadDraft,handleSaveAsDraft, handleUploadDraftName, handleDeleteDraft }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate();
 

    const [openDraftNameModal, setOpenDraftNameModal] = useState(false)
    const [editingDraftName, setEditingDraftName] = useState(null)
    const [editingDraftId, setEditingDraftId] = useState(null)

    const handleOpenDraftNameModal = (data) => {
        setOpenDraftNameModal(true)
        if(data){
            setEditingDraftName(data.name)
            setEditingDraftId(data._id)
        }
        else {
            setEditingDraftName(null)
            setEditingDraftId(null)
        }
    }
    const handleCloseDraftNameModal = () => {
        setOpenDraftNameModal(false)
        setEditingDraftName(null)
        setEditingDraftId(null)
    }

    const columns = [
        {
            title: 'Draft Name',
            dataIndex: 'name',
            copyable: true,
            ellipsis: true,

        },
        {
            title: 'Saved Time',
            dataIndex: 'updatedAt',
            ellipsis: true,
            valueType: 'dateTime'
        },
       {
            title: 'Load/Upload',
            dataIndex: '',
            hideInSearch: true,
            align: 'center',
            width: 220,
            render: (_,row) => {
                return (
                    <div style={{display:'flex', justifyContent:'space-between'}}>
                        <Button icon={<DownloadOutlined/>} type='primary' onClick={async () => {
                            const confirmed = await confirmModal.confirm(loadDraftConfirmConfig);
                        if (confirmed) {
                            dispatch(loadDraft(row))
                            handleCancel()
                            openNotification(NOTI_SUCCESS, NOTI_SUCCESS_TITLE, NOTI_SUCCESS_LOAD_DRAFT)
                        }
                        }}>Load</Button>
                        <Button icon={<UploadOutlined/>} onClick={async () => {
                            const confirmed = await confirmModal.confirm(uploadDraftConfirmConfig);
                        if (confirmed) {
                            await handleUploadDraft(row._id)
                            handleCancel()
                        }
                        }}>Upload</Button>
                    </div>
                )
            }
       }, 
       
        {
            title: 'Action',
            valueType: 'option',
            key: 'option',
            align: "center",
            width: 100,
            render: (text, record, _, action) => {
                return <div style={{ display: 'flex', justifyContent: "space-between" }}>
                    <Button icon={<EditOutlined />} onClick={() => handleOpenDraftNameModal(record)} />
                    <Button icon={<DeleteOutlined />} danger onClick={async () => {
                        const confirmed = await confirmModal.confirm(deleteConfirmConfig);
                        if (confirmed) {
                            await handleDeleteDraft(record._id)
                            openNotification(NOTI_SUCCESS, NOTI_SUCCESS_TITLE, NOTI_SUCCESS_DELETE_DRAFT)
                            reloadTable()
                        }
                    }} />
                </div>
            },
        }

    ];

    const handleDraftNameModalSave = async (draftName) => {
        if(editingDraftName){
            
            await handleUploadDraftName(editingDraftId,draftName)
        }else {
            await handleSaveAsDraft(draftName)
        }
        reloadTable()
    }

    const reloadTable = () => {
        actionRef?.current.reload()
    }

    return (
        <Modal title={'Draft'} open={open} footer={null} onCancel={handleCancel} width={1000}>
            <DraftNameModal handleCancel={handleCloseDraftNameModal} open={openDraftNameModal} editingDraftName={editingDraftName} handleSave={handleDraftNameModalSave} />
            <ProTable
                columns={columns}
                actionRef={actionRef}
                cardBordered
                tableAlertRender={false}
                request={async (params) => {
                    let newParams = copyObjectWithKeyRename(params)
                    let queryString = objectToQueryString(newParams)
                    const res = await dispatch(queryUserDraft(queryString))
                    let newData = res.payload.data.map((draft) => {
                        return {
                            ...draft,
                            key: draft._id
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
                                // handleOpenModal()
                                handleOpenDraftNameModal(null)
                            }}
                            type="primary"
                        >
                            Save new draft
                        </Button>,

                    ]
                }}
            />
        </Modal>
    )
}

export default DraftTableModal
