import React, { useEffect, useState } from 'react';
import { Modal, Divider, Radio, Table, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { getAllowcatById } from '../../../redux/allocate/allowcate';
import { importBootcamp } from '../../../redux/CreateBootcamp/createBootCamp';
import { updateLoading } from '../../../redux/loading/Loading';
import { updateAfterImportBootcamp } from '../../../redux/subject/subject';
import { getMajorById } from '../../../redux/major/major';
import ImportFromExcel from './ImportFromExcel';

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
  const handleImport = async (data) => {
    dispatch(updateLoading(true))
    if (data.type === 'bootcamp') {
      setIsModalOpen(false);
      let bootcampName = ''
      let branchMajorSemester = data.branchMajorSemester
      let totalCredits = data.totalCredit
      let completeTotalCredits = data.totalCredit
      let allowcateFields = []
      let semesterSubjectList = []
      let semesterList = [[]]
      let tempSubjectList = []
      allowcateFields = data.allocation.detail.map((field, index) => {
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
          subjectList: field.subjectList.map((subject, sindex) => {
            semesterSubjectList.push({
              fieldIndex: index,
              subjectIndex: sindex,
              semester: null,
              subjectCode: subject.subjectCode,
              _id: null
            })
          
            const a = {
              credits: subject.credit,
              description: "",
              isCompulsory: subject.isCompulsory,
              name: subject.name,
              subjectCode: subject.subjectCode,
              branchMajor: subject.branchMajor !== undefined ? subject.branchMajor !== null ? subject.branchMajor : null : null,
              shortFormName: "",
              isAutoCreateCode: false,
              departmentChild: subject.departmentChild ? subject.departmentChild : undefined,
              _id: null
            }
            tempSubjectList.push(subject)
            return a
          }),
          electiveSubjectList: field.electiveSubjectList,
          isElectiveNameBaseOnBigField: field.isElectiveNameBaseOnBigField,
        }
      })

      semesterList = data.detail.map((semester, index) => {
        let newSubjectList = []
        semester.subjectList.forEach((subject) => {
          const semesterSubjectListIndex = semesterSubjectList.findIndex(sSubject => sSubject.subjectCode === subject.subjectCode)
          if (semesterSubjectListIndex !== -1) {
            semesterSubjectList[semesterSubjectListIndex].semester = index
            const a = semesterSubjectList[semesterSubjectListIndex]
            allowcateFields[a.fieldIndex].subjectList[a.subjectIndex]['semester'] = index
            if(subject.branchMajor !== null){
              allowcateFields[a.fieldIndex].subjectList[a.subjectIndex].branchMajor = subject.branchMajor
            }
            newSubjectList.push({
              ...a,
              semesterSubjectListIndex
            })
          }
        })
        return newSubjectList
      })
      // await dispatch(getMajorById(selectedRows[0].major))
      dispatch(updateAfterImportBootcamp(tempSubjectList))
      dispatch(importBootcamp({
        totalCredits,
        completeTotalCredits,
        allowcateFields,
        semesterSubjectList,
        semesterList,
        bootcampName,
        branchMajorSemester
      }))
      setErrorMessage({
        allowcate: [],
        compulsory: [],
        elective: [],
        planning: [],
        remainning: false
      })
      dispatch(updateLoading(false))
    } else {
      if (selectedRows.length > 0) {
        setIsModalOpen(false);

        let bootcampName = selectedRows[0].name
        let branchMajorSemester = selectedRows[0].branchMajorSemester
        let totalCredits = selectedRows[0].totalCredit
        let completeTotalCredits = 0
        let allowcateFields = []
        let semesterSubjectList = []
        let semesterList = [[]]
        const tempAllowcateFields = await dispatch(getAllowcatById(selectedRows[0].allocation))
        allowcateFields = tempAllowcateFields.payload.data.detail.map((field, index) => {
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
            subjectList: field.subjectList.map((subject, sindex) => {
              semesterSubjectList.push({
                fieldIndex: index,
                subjectIndex: sindex,
                semester: null,
                _id: subject._id
              })
              const a = {
                credits: subject.credit,
                description: subject.description,
                isCompulsory: subject.isCompulsory,
                name: subject.name,
                subjectCode: subject.subjectCode,
                branchMajor: subject.branchMajor !== undefined ? subject.branchMajor !== null ? subject.branchMajor : null : null,
                departmentChild: subject.departmentChild ? subject.departmentChild : undefined,
                shortFormName: subject.shortFormName ? subject.shortFormName : "",
                isAutoCreateCode: subject.isAutoCreateCode ? subject.isAutoCreateCode : false,
                allocateChildId: (subject.allocateChildId !== undefined && subject.allocateChildId !== null) ? (field.detail.findIndex(sField => sField._id === subject.allocateChildId) > -1 ? field.detail.findIndex(sField => sField._id === subject.allocateChildId) : null) : null,
                _id: subject._id
              }
              if(index < tempAllowcateFields.payload.data.detail.length - 1){
                if(subject.isCompulsory){
                  completeTotalCredits += subject.credit
                }
              }
              return a
            }),
            electiveSubjectList: field.electiveSubjectList.map((group) => {
              let newGroupData = { ...group }
              if (newGroupData.allocateChildId !== undefined && newGroupData.allocateChildId !== null) {
                newGroupData.allocateChildId = field.detail.findIndex(sField => sField._id === newGroupData.allocateChildId)
              }
              completeTotalCredits += group.credit
              return newGroupData
            }),
            isElectiveNameBaseOnBigField: field.isElectiveNameBaseOnBigField,
          }
        })

        semesterList = selectedRows[0].detail.map((semester, index) => {
          return semester.subjectList.map((subject) => {
            const semesterSubjectListIndex = semesterSubjectList.findIndex(sSubject => sSubject._id === subject)
            semesterSubjectList[semesterSubjectListIndex].semester = index
            const a = semesterSubjectList[semesterSubjectListIndex]
            allowcateFields[a.fieldIndex].subjectList[a.subjectIndex]['semester'] = index
            return {
              ...a,
              semesterSubjectListIndex
            }
          })
        })
        await dispatch(getMajorById(selectedRows[0].major))
        dispatch(importBootcamp({
          totalCredits,
          completeTotalCredits,
          allowcateFields,
          semesterSubjectList,
          semesterList,
          bootcampName,
          branchMajorSemester
        }))
        setErrorMessage({
          allowcate: [],
          compulsory: [],
          elective: [],
          planning: [],
          remainning: false
        })
        dispatch(updateLoading(false))
      } else setError(true)

      setSelectedRows([])
      setSelectedRowKeys([])
    }

  }

  return (
    <>
      <Modal
        width={1000}
        onOk={handleImport}
        title="Import a bootcamp"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={() => {
          return (
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <ImportFromExcel importFunc={handleImport} style={{ marginRight: 20 }} />
              <Button onClick={handleCancel}>Cancel</Button>
              <Button type='primary' onClick={handleImport}>Import</Button>
            </div>
          )
        }}
      >
        <div>

          {error ?
            <div style={{ color: "red" }}>**You Need to choose a bootcamp</div>
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