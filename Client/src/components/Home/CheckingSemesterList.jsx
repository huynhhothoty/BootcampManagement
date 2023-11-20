import React, { useEffect, useState } from 'react';
import { Space, Switch, Table, Tag } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { updateSubjectCheckStatus } from '../../redux/subject/subject';
const columns = [
    {
        title: 'Subject Code',
        dataIndex: 'subjectCode',
        key: 'subjectCode',
        width: "35%"
    },
    {
        title: 'Subject Name',
        dataIndex: 'name',
        key: 'name',
        width: "45%",
        render: (text, row) => {
            if (row.isBranch) {
                return <span style={{ fontWeight: "bold" }}>{text}</span>
            } else return text
        }
    },
    {
        title: 'Type',
        dataIndex: 'isCompulsory',
        key: 'isCompulsory',
        width: '13%',
        render: (value, row) => {
            if (row.isBranch) return <></>
            return <Tag color={value ? "volcano" : "green"}>{value ? "Compulsory" : "Elective"}</Tag>
        }
    },
    {
        title: 'Credtis',
        dataIndex: 'credit',
        key: 'address',
        width: '7%',
    },
];


// rowSelection objects indicates the need for row selection


const CheckingSemesterList = ({ subjectList, checkedKeyList,checkedRowList }) => {
    const dispatch = useDispatch()

    const [selectedSubjectRows, setSelectedSubjectRows] = useState([])
    const [selectedRowKeys,setSelectedRowKeys] = useState([])
    const { checkSubjectList } = useSelector(store => store.subject)
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
      
            if (selectedSubjectRows.length < selectedRows.length) {
                selectedRows.forEach((row) => {
                    if (row.isBranch === false) {
                        if (!selectedSubjectRows.some(subject => subject.key === row.key)) {
                            let checkSubjectListIndex = checkSubjectList.findIndex(subject => subject.key === row.key)
                            if (checkSubjectListIndex !== -1) {
                                dispatch(updateSubjectCheckStatus({ subjectIndex: checkSubjectListIndex, check: true }))
                            }
                        }

                    }
                })

            } else if (selectedSubjectRows.length > selectedRows.length) {
            
                selectedSubjectRows.forEach((row) => {
                
                    if (row.isBranch === false) {
                        if (!selectedRows.some(subject => subject.key === row.key)) {
                            let checkSubjectListIndex = checkSubjectList.findIndex(subject => subject.key === row.key)
                          
                            if (checkSubjectListIndex !== -1) {
                           
                                dispatch(updateSubjectCheckStatus({ subjectIndex: checkSubjectListIndex, check: false }))
                            }
                        }

                    }
                })
            }
            setSelectedRowKeys(selectedRowKeys)
            setSelectedSubjectRows(selectedRows)
        },
      
    };
    useEffect(() => {
        setSelectedRowKeys(checkedKeyList)
        setSelectedSubjectRows(checkedRowList)
    },[checkedKeyList,checkedRowList])
    return (
        <>

            <Table
                pagination={false}
                columns={columns}
                rowSelection={{
                    checkStrictly: false,
                    ...rowSelection,
                    selectedRowKeys: selectedRowKeys
                }}
                dataSource={subjectList}
            />
        </>
    )
}

export default CheckingSemesterList