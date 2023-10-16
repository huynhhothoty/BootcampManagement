import React, { useEffect, useState } from 'react';
import { Modal, Divider, Radio, Table } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { getAllowcatById } from '../../../redux/allocate/allowcate';
import { importBootcamp } from '../../../redux/CreateBootcamp/createBootCamp';
import { updateLoading } from '../../../redux/loading/Loading';
import { updateAfterImportBootcamp } from '../../../redux/subject/subject';

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
  const [selectedBootcamp, setSelectedBootcamp] = useState(null)

  const [error, setError] = useState(false)
  const handleCancel = () => {
    setIsModalOpen(false);
    setError(false)
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedBootcamp(selectedRows)
    },

  };
  const handleImport = async () => {
    dispatch(updateLoading(true))
    if (selectedBootcamp !== null) {
      setIsModalOpen(false);
      let bootcampName = selectedBootcamp[0].name
      let totalCredits = selectedBootcamp[0].totalCredit
      let completeTotalCredits = selectedBootcamp[0].totalCredit
      let allowcateFields = []
      let semesterSubjectList = []
      let semesterList = [[]]

      const tempAllowcateFields = await dispatch(getAllowcatById(selectedBootcamp[0].allocation))
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
              _id:subject._id
            }
            tempSubjectList.push(subject)
            return a
          })
        }
      })
      
      semesterList = selectedBootcamp[0].detail.map((semester,index) => {
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