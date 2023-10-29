import { ProCard, ProDescriptions } from '@ant-design/pro-components'
import React, { useRef, useState } from 'react'
import AllowcateDisplay from './AllowcateDisplay'
import { Tag } from 'antd'
import { useDispatch } from 'react-redux'
import { updateViewedBigFieldName } from '../../redux/allocate/allowcate'

const BigFieldDisplay = ({field,index, confirmModal}) => {
    const actionRef = useRef();
    const dispatch = useDispatch()
    const [fieldName,setFieldName] = useState(field?.fieldName)
    return (
        <ProCard
            headStyle={{padding:0}}
            title={<ProDescriptions
                actionRef={actionRef}
                // bordered
                formProps={{
                    onValuesChange: (e, f) => setFieldName(e.fieldName),
                    
                }}

                request={async () => {
                    return Promise.resolve({
                        success: true,
                        data: {
                            fieldName:field?.fieldName
                        },
                    });
                }}
                style={{width:300}}
                editable={{
                    onSave: (_,data) => {
                        dispatch(updateViewedBigFieldName({index,fieldName:data.fieldName}))
                    }
                }}
                columns={[
                    {
                        title: '',
                        key: 'fieldName',
                        dataIndex: 'fieldName',
                        ellipsis: true,
                        style:{
                            padding:0
                        },
                        fieldProps:{
                            placeholder:"Field Name"
                        },

                    },
                    
                
                ]}
            ></ProDescriptions>}
            extra={
                <div>
                    <span>Total Compulsory Credits: <Tag color="volcano" style={{fontSize:15}}>{field?.compulsoryCredits}</Tag></span>
                    <span>Total Elective Credits: <Tag color="green" style={{fontSize:15}}>{field.electiveCredits}</Tag></span>
                </div>
            }
            ghost
            gutter={8}
            collapsible
        >
            <AllowcateDisplay confirmModal={confirmModal} bigFieldIndex={index} field={field.smallField.map((f,index) => ({...f,id:index}))}/>
        </ProCard>
    )
}

export default BigFieldDisplay