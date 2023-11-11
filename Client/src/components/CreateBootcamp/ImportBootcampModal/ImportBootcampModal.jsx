import React, { useEffect, useState } from 'react';
import { Modal, Divider, Radio, Table } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { getAllowcatById } from '../../../redux/allocate/allowcate';
import { importBootcamp } from '../../../redux/CreateBootcamp/createBootCamp';
import { updateLoading } from '../../../redux/loading/Loading';
import { updateAfterImportBootcamp } from '../../../redux/subject/subject';
import { getMajorById } from '../../../redux/major/major';

const columns = [
  {
    title: 'BootCamp Name',
    dataIndex: 'name',
  },
  {
    title: 'Total Credits',
    dataIndex: 'totalCredit',
  },
  {
    title: 'Created Year',
    dataIndex: 'year',
  },
];




const ImportBootcampModal = ({ isModalOpen, setIsModalOpen, setErrorMessage }) => {
  const dispatch = useDispatch()
  const { loading, bootcampList } = useSelector(store => store.bootcamp)
  const [selectedRows, setSelectedRows] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])

  const [error, setError] = useState(false)
  const handleCancel = () => {
    setIsModalOpen(false);
    setError(false)
    setSelectedRows([])
    setSelectedRowKeys([])
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRows(selectedRows)
      setSelectedRowKeys(selectedRowKeys)
    },

  };
  const handleImport = async () => {
    dispatch(updateLoading(true))
    if (selectedRows.length > 0) {
      setIsModalOpen(false);
      console.log(selectedRows[0])
      let bootcampName = selectedRows[0].name
      let totalCredits = selectedRows[0].totalCredit
      let completeTotalCredits = selectedRows[0].totalCredit
      let allowcateFields = []
      let semesterSubjectList = []
      let semesterList = [[]]
      const tempAllowcateFields = await dispatch(getAllowcatById(selectedRows[0].allocation))
      let tempSubjectList = []
      allowcateFields = tempAllowcateFields.payload.data.detail.map((field,index) => {
        return {
          compulsoryCredits: field.detail.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.compulsoryCredit;
          }, 0),
          electiveCredits: field.detail.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.OptionalCredit;
          }, 0),
          fieldName: field.name,
          smallField: field.detail.map((smallField) => {
            return {
              compulsoryCredits: smallField.compulsoryCredit,
              electiveCredits: smallField.OptionalCredit,
              fieldName: smallField.name
            }
          }),
          subjectList: field.subjectList.map((subject,sindex) => {
            semesterSubjectList.push({
              fieldIndex: index,
              subjectIndex: sindex,
              semester: null,
              _id:subject._id
            })
            const a =  {
              credits: subject.credit,
              description: subject.description,
              isCompulsory:subject.isCompulsory,
              name: subject.name,
              subjectCode:subject.subjectCode,
              branchMajor: subject.branchMajor !== undefined ? subject.branchMajor !== null ? subject.branchMajor : null : null,
              _id:subject._id
            }
            tempSubjectList.push(subject)
            return a
          }),
          electiveSubjectList: field.electiveSubjectList
        }
      })
      
      semesterList = selectedRows[0].detail.map((semester,index) => {
        return semester.subjectList.map((subject) => {
          const semesterSubjectListIndex = semesterSubjectList.findIndex(sSubject => sSubject._id === subject)
          semesterSubjectList[semesterSubjectListIndex].semester = index
          const a = semesterSubjectList[semesterSubjectListIndex]
          return {
            ...a,
            semesterSubjectListIndex
          }
        })
      })
      await dispatch(getMajorById(selectedRows[0].major))
      dispatch(updateAfterImportBootcamp(tempSubjectList))
      dispatch(importBootcamp({
        totalCredits,
        completeTotalCredits,
        allowcateFields,
        semesterSubjectList,
        semesterList,
        bootcampName
      }))
      setErrorMessage({
        allowcate: [],
        compulsory: [],
        elective: [],
        planning: [],
        remainning: false
      })
      dispatch(updateLoading(false))
    }else setError(true)

    setSelectedRows([])
    setSelectedRowKeys([])
  }

  return (
    <>
      <Modal width={1000}  onOk={handleImport} title="Import a bootcamp" open={isModalOpen} onCancel={handleCancel}>
        <div>

          {error ?
            <div style={{color:"red"}}>**You Need to choose a bootcamp</div>
            :
            <></>
          }
          <Divider />

          <Table
            loading={loading}
            rowSelection={{
              type: "radio",
              ...rowSelection,
            }}
            columns={columns}
            dataSource={bootcampList}
          />
        </div>

      </Modal>
    </>
  )
}

export default ImportBootcampModal