import React, { useEffect, useState } from 'react';
import { Button, Space, Switch, Table, Tag } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { updateSubjectCheckStatus } from '../../redux/subject/subject';



// rowSelection objects indicates the need for row selection


const CheckingSemesterList = ({ subjectList, checkedKeyList,checkedRowList, handleOpenElectiveTrackingModal, semester, handleOpenTeacherListModal,handleOpenNoteModal }) => {
    const dispatch = useDispatch()

    const [selectedSubjectRows, setSelectedSubjectRows] = useState([])
    const [selectedRowKeys,setSelectedRowKeys] = useState([])
    const { checkSubjectList } = useSelector(store => store.subject)

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
        {
            title: '',
            width: '7%',
            align: 'center',
            render: (_,row) => {
                if(row.isGroup)
                return <Button onClick={() => handleOpenElectiveTrackingModal(row.fieldIndex, semester, row.name)}>Checked Subjects</Button>
                else return <Button onClick={() => {
                    let checkListIndex = checkSubjectList.findIndex(subject => subject._id === row._id)
                    handleOpenTeacherListModal(checkSubjectList[checkListIndex])
                }}>Teacher List ({checkSubjectList.find(subject => subject._id === row._id)?.teachers.length})</Button>
            }
        },
        {
            title: '',
            width: '7%',
            align: 'center',
            render: (_,row) => {
                return <Button onClick={() => {
                    let checkListIndex = checkSubjectList.findIndex(subject => subject._id === row._id)
                    handleOpenNoteModal(checkSubjectList[checkListIndex])
                }}>Note {checkSubjectList.find(subject => subject._id === row._id)?.note ? <span style={{color:'red'}}>*</span> : <></>}</Button>
            }
        },
    ];

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