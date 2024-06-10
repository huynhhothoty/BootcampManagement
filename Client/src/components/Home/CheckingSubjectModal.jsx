import { ProTable } from '@ant-design/pro-components'
import { Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateCheckElectiveSubjectList } from '../../redux/subject/subject'

const CheckingSubjectModal = ({ open, modalData, handleCancel }) => {
    const dispatch = useDispatch()

    const { checkElecttivSubjectList } = useSelector(store => store.subject)
    const [data, setData] = useState([])
    const [selectedRowKeys, setSelectedRowKeys] = useState([])
    const [selectedRows, setSelectedRows] = useState([])

    const columns = [
        {
            title: 'Subject Code',
            dataIndex: 'subjectCode',
            key: 'subjectCode',
            width: 20,

        },

        {
            title: 'Subject Name',
            dataIndex: 'name',
            key: 'name',
            width: 100,

        },
        {
            title: 'Checked Semester',
            dataIndex: 'semester',
            key: 'semester',
            width: 50,
             align:'center',
             render: (text,row) => {
                if(row.semester === null){
                    return text
                }else return text + 1
             }
        },
        {
            title: 'Credits',
            dataIndex: 'credit',
            key: 'credits',
            width: 50,
            align:'center'
        },
        {
            title: 'Field Groups',
            dataIndex: 'allocateChildId',
            key: 'credits',
            width: 100,
            filters: modalData?.field.detail.map((field) => {
                return {
                    text: field.name,
                    value: field._id,
                }
            }),
            onFilter: (value, record) => {
                return record.allocateChildId == value
            },
            render: (text, row) => {
                if (modalData) {
                    let smallField = modalData.field.detail.find(sField => sField._id === row.allocateChildId)
                    return smallField.name
                }
                return ''
            }
        },


    ]

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRowKeys(selectedRowKeys)
        },
        getCheckboxProps: (record) => ({
            disabled: (record.semester !== null && record.semester !== modalData?.semesterIndex),
            // Column configuration not to be checked
            name: record.name,
          })
    };

    const setInitCheckedKey = () => {
        let checkedKeyList = []
        checkElecttivSubjectList[modalData.fieldIndex].forEach(subject => {
            if (subject.semester !== null) {
                checkedKeyList.push(subject._id)
            }
        })
        return checkedKeyList
    }

    const handleOk = () => {
        console.log(selectedRowKeys)
        let updatedCheckedList = JSON.parse(JSON.stringify(checkElecttivSubjectList))
        updatedCheckedList[modalData.fieldIndex] = updatedCheckedList[modalData.fieldIndex].map(subject => {
            let newSubject = subject
            if(selectedRowKeys.includes(newSubject._id)){
                if(newSubject.semester === null)
                    newSubject.semester = modalData.semesterIndex
            }else {
                newSubject.semester = null
            }
            return newSubject
        })
        dispatch(updateCheckElectiveSubjectList(updatedCheckedList))
        handleCancel()
    }
    useEffect(() => {
        if (modalData) {
            setData(checkElecttivSubjectList[modalData.fieldIndex])
            setSelectedRowKeys(setInitCheckedKey)
        }
    }, [modalData, checkElecttivSubjectList])
    return (
        <Modal title={`Tracking Elective for ${modalData?.groupName}`} open={open} onCancel={handleCancel} width={1200} onOk={handleOk}>
            <ProTable
                columns={columns}
                search={false}
                pagination={false}
                dragSortKey="sort"
                rowKey="key"
                dataSource={data}
                options={false}
                rowSelection={{
                    checkStrictly: false,
                    ...rowSelection,
                    selectedRowKeys: selectedRowKeys
                }}
                tableAlertRender={false}
            />

        </Modal>
    )
}

export default CheckingSubjectModal