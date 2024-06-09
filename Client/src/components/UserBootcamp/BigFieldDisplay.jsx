import { ProCard, ProDescriptions } from '@ant-design/pro-components'
import React, { useEffect, useRef, useState } from 'react'
import AllowcateDisplay from './AllowcateDisplay'
import { Button, Tag } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { addSmallFieldToViewedFields, deleteBigFieldFromViewedFields, updateViewedBigFieldName } from '../../redux/allocate/allowcate'
import { deleteConfirmConfig } from '../../util/ConfirmModal/confirmConfig'
import { removeSubjectFromRemovedField } from '../../redux/subject/subject'
import { updateCompleteCreditsToViewedBootcamp } from '../../redux/bootcamp/bootcamp'
import { MISSING_FIELD_NAME, MISSING_SMALL_FIELD } from '../../util/constants/errorMessage'

const BigFieldDisplay = ({ field, index, confirmModal, addBigFieldIndex, setAddBigFieldIndex, setScrollX, setIsUpdated, error }) => {
    const actionRef = useRef();
    const positionRef = useRef()
    const dispatch = useDispatch()
    const [fieldName, setFieldName] = useState(field?.fieldName)
    const [addedSmallFieldID, setAddedSmallFieldID] = useState(null)
    const { viewedAllowcatedFields } = useSelector(store => store.allowcate)

    useEffect(() => {
        if (setScrollX !== null) {

            setScrollX(positionRef.current.offsetTop)
        }
    }, [setScrollX])

    const createSmallField = (() => {
        return field.smallField.map((f, index) => {
            let sError = null
            if(error !== null) {
                if(error.smallFieldError.length > 0){
                    // sError = error.smallFieldError[index]
                    if(error.smallFieldError.includes(index)){
                        sError = index
                    }
                }
            }
            return { ...f, id: index, error: sError }
        })
    })
    return (
        <ProCard
            ref={positionRef}
            headStyle={{ padding: 0 }}
            title={<ProDescriptions
                actionRef={actionRef}
                // bordered
                formProps={{
                    onValuesChange: (e, f) => setFieldName(e.fieldName),

                }}
                dataSource={{
                    fieldName: field?.fieldName
                }}
                // request={async () => {
                //     return Promise.resolve({
                //         success: true,
                //         data: {
                //             fieldName: field?.fieldName
                //         },
                //     });
                // }}
                style={{ width: 300 }}
                editable={{
                    onSave: (_, data) => {
                        dispatch(updateViewedBigFieldName({ index, fieldName: data.fieldName }))
                        setAddBigFieldIndex(null)
                        setIsUpdated(true)
                    },
                    onCancel: (_, data) => {
                        setAddBigFieldIndex(null)
                    },

                }}
                columns={[
                    {
                        title: '',
                        key: 'fieldName',
                        dataIndex: 'fieldName',
                        ellipsis: true,
                        style: {
                            padding: 0
                        },
                        fieldProps: {
                            placeholder: "Field Name"
                        },
                        render: (a) => {
                            return <div style={{ display: 'flex', flexDirection: "column" }}>
                                {a}
                                {error !== null ? error.missFieldName ?
                                    <span style={{ color: "red" }}>{MISSING_FIELD_NAME}</span>
                                    :
                                    <></>
                                    :
                                    <></>
                                }

                            </div>
                        }
                    },


                ]}
            ></ProDescriptions>}
            extra={
                <div style={{ display: "flex", alignItems: "center" }}>
                    <span>Total Compulsory Credits: <Tag color="volcano" style={{ fontSize: 15 }}>{field?.compulsoryCredits}</Tag></span>
                    <span>Total Elective Credits: <Tag color="green" style={{ fontSize: 15 }}>{field.electiveCredits}</Tag></span>

                    <Button
                        style={{ marginLeft: 20 }}
                        type='dashed'
                        onClick={() => {
                            setAddedSmallFieldID(field.smallField.length)
                            dispatch(addSmallFieldToViewedFields(index))
                            setIsUpdated(true)
                        }}
                    >Add Child Field</Button>
                    <Button
                        style={{ marginLeft: 20 }}
                        type='dashed'
                        danger
                        onClick={async () => {
                            const confirmed = await confirmModal.confirm(deleteConfirmConfig);
                            if (confirmed) {
                                dispatch(updateCompleteCreditsToViewedBootcamp((field.compulsoryCredits + field.electiveCredits) * -1))
                                dispatch(removeSubjectFromRemovedField(index))
                                dispatch(deleteBigFieldFromViewedFields(index))
                                setIsUpdated(true)
                            }
                        }}
                    >Delete Field</Button>
                </div>
            }
            ghost
            gutter={8}
            collapsible
        >
            {error !== null ? error.missSmallField ? <span style={{ color: "red" }}>**{MISSING_SMALL_FIELD}</span> : <></> : <></>}
            <AllowcateDisplay setIsUpdated={setIsUpdated} setAddedSmallFieldID={setAddedSmallFieldID} addedSmallFieldID={addedSmallFieldID} confirmModal={confirmModal} bigFieldIndex={index} field={createSmallField()} />
        </ProCard>
    )
}

export default BigFieldDisplay