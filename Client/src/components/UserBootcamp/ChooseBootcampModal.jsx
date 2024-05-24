import { Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import AllBootcampTable from './AllBootcampTable'
import { useDispatch, useSelector } from 'react-redux'
import { getAllowcatById } from '../../redux/allocate/allowcate'
import { SUBJECT_ADDED_IMPORT } from '../../util/constants/subjectStatus'

const ChooseBootcampModal = ({open, handleCancel,handleChoose}) => {
    const dispatch = useDispatch()
    const { viewedBootcamp } = useSelector(store => store.bootcamp)
    const { viewedMajor } = useSelector(store => store.major)
    const [selectedRowKeys, setSelectedRowKeys] = useState([])
    const [selectedBootcamp,setSelectedBootcamp] = useState(null)

    const handleChooseBootcamp = async () => {
        let bootcampNewData = await handleGetCompareBootcampData(selectedBootcamp)
        handleChoose(bootcampNewData)
        handleCancel()
    }

    const handleGetCompareBootcampData = async (data) => {

      let bootcampName = data.name;
      let totalCredits = parseInt(data.totalCredit);
      let completeTotalCredits = data.totalCredit;
      let allowcateFields = [];
      let semesterSubjectList = [];
      let semesterList = [[]];
      const tempAllowcateFields = await dispatch(getAllowcatById(data.allocation));

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
                      fieldName: smallField.name,
                  };
              }),
              subjectList: field.subjectList.map((subject, sindex) => {
                  semesterSubjectList.push({
                      fieldIndex: index,
                      subjectIndex: sindex,
                      semester: null,
                      _id: subject._id,
                  });
                  const a = {
                      credits: subject.credit,
                      description: subject.description,
                      isCompulsory: subject.isCompulsory,
                      name: subject.name,
                      subjectCode: subject.subjectCode,
                      status: [SUBJECT_ADDED_IMPORT],
                      branchMajor:
                          subject.branchMajor !== undefined
                              ? subject.branchMajor !== null
                                  ? subject.branchMajor
                                  : null
                              : null,
                      _id: subject._id,
                      shortFormName: subject.shortFormName ? subject.shortFormName : '',
                      isAutoCreateCode: subject.isAutoCreateCode
                          ? subject.isAutoCreateCode
                          : false,
                      departmentChild: subject.departmentChild
                          ? subject.departmentChild
                          : undefined,
                  };

                  return a;
              }),
              electiveSubjectList: field.electiveSubjectList,
          };
      });
      semesterList = data.detail.map((semester, index) => {
          return semester.subjectList.map((subject) => {
              const semesterSubjectListIndex = semesterSubjectList.findIndex(
                  (sSubject) => sSubject._id === subject
              );

              semesterSubjectList[semesterSubjectListIndex].semester = index;
              const a = semesterSubjectList[semesterSubjectListIndex];
              allowcateFields[a.fieldIndex].subjectList[a.subjectIndex]['semester'] =
                  index;

              return {
                  ...a,
                  semesterSubjectListIndex,
              };
          });
      });
      return {
          allowcateFields,
          bootcampName,
          totalCredits,
          completeTotalCredits,
          semesterList,
          semesterSubjectList,

      }

  };

    useEffect(() => {
        setSelectedRowKeys([])
        setSelectedBootcamp(null)
    },[])
  return (
    <Modal title="Basic Modal" open={open} onCancel={handleCancel} width={1000} onOk={handleChooseBootcamp}>
        <AllBootcampTable isModal={true} selectedRowKeys={selectedRowKeys} setSelectedBootcamp={setSelectedBootcamp} setSelectedRowKeys={setSelectedRowKeys} viewingBootcampId={viewedBootcamp.id} viewedMajorId={viewedMajor._id}/>
    </Modal>
  )
}

export default ChooseBootcampModal