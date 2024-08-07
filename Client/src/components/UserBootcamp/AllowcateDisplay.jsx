import { ProList } from '@ant-design/pro-components';
import { Button, Input, InputNumber, Progress, Space, Tag } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteViewedSmallField, editViewedSmallField } from '../../redux/allocate/allowcate';
import Highlighter from 'react-highlight-words';
import { deleteConfirmConfig } from '../../util/ConfirmModal/confirmConfig';
import { updateCompleteCreditsToViewedBootcamp } from '../../redux/bootcamp/bootcamp';
import { MISSING_FIELD_NAME } from '../../util/constants/errorMessage';



const AllowcateDisplay = ({ field, bigFieldIndex, confirmModal, addedSmallFieldID, setAddedSmallFieldID, setIsUpdated, isLastField }) => {
    const dispatch = useDispatch()
    const actionRef = useRef()
    const [fieldName, setFieldName] = useState('')
    const [compulsoryCredits, setCompulsoryCredits] = useState(0)
    const [electiveCredits, setElectiveCredits] = useState(0)

    useEffect(() => {
        if (addedSmallFieldID !== null) {
            actionRef.current.startEditable(addedSmallFieldID)
        }
    }, [addedSmallFieldID])
    return (
        <ProList
            style={{ marginTop: 15 }}
            rowKey="id"
            actionRef={actionRef}
            dataSource={field}
            editable={{

                saveText: "Save",
                cancelText: "Cancel",
                deleteText: <span style={{ color: "red" }}>Delete</span>,
                actionRender: (record, action) => {

                    return <div>
                        <a onClick={() => {

                            dispatch(editViewedSmallField({ fieldIndex: bigFieldIndex, smallFieldIndex: record.index, fieldData: { fieldName } }))

                            setAddedSmallFieldID(null)
                            action.cancelEditable(record.id)
                            setIsUpdated(true)
                        }}>Edit</a>
                        <a onClick={async () => {
                            const confirmed = await confirmModal.confirm(deleteConfirmConfig);
                            if (confirmed) {
                                action.cancelEditable(record.id)
                                dispatch(deleteViewedSmallField({ fieldIndex: bigFieldIndex, smallFieldIndex: record.index }))
                                dispatch(updateCompleteCreditsToViewedBootcamp(electiveCredits * -1))
                                setAddedSmallFieldID(null)
                                setIsUpdated(true)
                            }

                        }} style={{ color: "red", marginInline: 10 }}>Delete</a>
                        <a onClick={() => {
                            action.cancelEditable(record.id)
                            setAddedSmallFieldID(null)
                        }}>Cancel</a>
                    </div>
                }
            }}
            metas={{
                title: {
                    renderFormItem: () => {
                        return (
                            <div>
                                <Input placeholder='Field Name' value={fieldName} onChange={(e) => setFieldName(e.target.value)} />
                            </div>
                        )
                    },
                    render: (_, data) => {
                        if (data.error !== null) console.log(data)
                        // if (data.edited)
                        //     return (
                        //         <Highlighter
                        //             highlightStyle={{
                        //                 backgroundColor: '#ffc069',
                        //                 padding: 0,
                        //             }}
                        //             searchWords={[data.fieldName]}
                        //             autoEscape
                        //             textToHighlight={data.fieldName}
                        //         />
                        //     )
                        return (<div>
                            <span>{data.fieldName}</span>
                            {(data.error !== null && data.fieldName === "") ? <span style={{fontWeight:"normal", color:"red"}}>**{MISSING_FIELD_NAME}</span> : ""}
                           
                        </div>)
                    }
                },
                subTitle: {
                    editable:false,
                    render: (_, data) => {
                        return (
                            <Space size={0}>
                                <Tag color={"volcano"}>Compulsory Credits: {data.compulsoryCredits}</Tag>
                                <Tag color="green">Elective Credits: {data.electiveCredits}</Tag>
                            </Space>
                        );
                    },
                    // renderFormItem: () => {
                    //     return (<div style={{ display: "flex" }}>
                    //         <InputNumber min={0} placeholder='Compulsory' name="compulsoryCredits" style={{ marginRight: 20 }} value={compulsoryCredits} onChange={(value) => setCompulsoryCredits(value)} />
                    //         <InputNumber min={0} placeholder='Elective' name="electiveCredits" value={electiveCredits} onChange={(value) => setElectiveCredits(value)} />
                    //     </div>)
                    // }
                },



                actions: {
                    render: (text, row, index, action) => [
                        !isLastField && <a
                            onClick={() => {
                                setFieldName(row.fieldName)
                                setCompulsoryCredits(row.compulsoryCredits)
                                setElectiveCredits(row.electiveCredits)
                                action?.startEditable(row.id);
                            }}
                            key="link"
                        >
                            Edit
                        </a>,
                    ],
                },
            }}
        >

        </ProList>
    )
}

export default AllowcateDisplay