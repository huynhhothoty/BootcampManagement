import { ProList } from '@ant-design/pro-components';
import { Button, Input, InputNumber, Progress, Space, Tag } from 'antd';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteViewedSmallField, editViewedSmallField } from '../../redux/allocate/allowcate';
import Highlighter from 'react-highlight-words';
import { deleteConfirmConfig } from '../../util/ConfirmModal/confirmConfig';



const AllowcateDisplay = ({ field,bigFieldIndex, confirmModal}) => {
    const dispatch = useDispatch()

    const [fieldName, setFieldName] = useState('')
    const [compulsoryCredits, setCompulsoryCredits] = useState(0)
    const [electiveCredits, setElectiveCredits] = useState(0)
    return (
        <ProList
            style={{ marginTop: 15 }}
            rowKey="id"
            dataSource={field}
            editable={{

                saveText: "Save",
                cancelText: "Cancel",
                deleteText: <span style={{color:"red"}}>Delete</span>,
                actionRender: (record,action) => {

                    return <div>
                        <a onClick={() => {
                            dispatch(editViewedSmallField({fieldIndex: bigFieldIndex,smallFieldIndex:record.index,fieldData:{fieldName,compulsoryCredits,electiveCredits}}))
                            action.cancelEditable(record.id)
                        }}>Edit</a>
                        <a onClick={async () => {
                            const confirmed = await confirmModal.confirm(deleteConfirmConfig);
                            if(confirmed){
                                action.cancelEditable(record.id)
                                dispatch(deleteViewedSmallField({fieldIndex: bigFieldIndex,smallFieldIndex:record.index}))
                            }
                         
                        }} style={{color:"red",marginInline:10}}>Delete</a>
                        <a onClick={() => {action.cancelEditable(record.id)}}>Cancel</a>
                    </div>
                }
            }}
            metas={{
                title: {
                    renderFormItem: () => {
                        return (
                            <div>
                                <Input placeholder='Field Name' value={fieldName} onChange={(e) => setFieldName(e.target.value)}/>
                            </div>
                        )
                    },
                    render: (_, data) => {
                        if(data.edited)
                        return (<Highlighter
                            highlightStyle={{
                              backgroundColor: '#ffc069',
                              padding: 0,
                            }}
                            searchWords={[data.fieldName]}
                            autoEscape
                            textToHighlight={data.fieldName}
                          />)
                        return data.fieldName
                    }
                },
                subTitle: {
                    render: (_, data) => {
                        return (
                            <Space size={0}>
                                <Tag color={"volcano"}>Compulsory Credits: {data.compulsoryCredits}</Tag>
                                <Tag color="green">Elective Credits: {data.electiveCredits}</Tag>
                            </Space>
                        );
                    },
                    renderFormItem: () => {
                        return (<div style={{ display: "flex" }}>
                            <InputNumber placeholder='Compulsory' name="compulsoryCredits" style={{ marginRight: 20 }} value={compulsoryCredits} onChange={(value) => setCompulsoryCredits(value)}/>
                            <InputNumber placeholder='Elective' name="electiveCredits" value={electiveCredits} onChange={(value) => setElectiveCredits(value)}/>
                        </div>)
                    }
                },



                actions: {
                    render: (text, row, index, action) => [
                        <a
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