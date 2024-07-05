import { Button, Col, FloatButton, Form, Input, InputNumber, Progress, Radio, Result, Row, Select, } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';
import { CaculatePercent } from '../../util/CaculatePercent/caculatePercent';
import Semester from '../../components/CreateBootcamp/Semester/Semester';
import SubjectModal from '../../components/CreateBootcamp/SubjectModal/SubjectModal';
import ImportBootcampModal from '../../components/CreateBootcamp/ImportBootcampModal/ImportBootcampModal';
import { Collapse } from 'antd';
import AllocateField from '../../components/CreateBootcamp/AllocateField/AllocateField';
import { useDispatch, useSelector } from 'react-redux';
import { createDraft, createField, createFirstBootcamp, createSubject, createTemplateBootcamp, deleteDraft, importBootcamp, resetAll, updateAutogenSubjectCode, updateBootcampName, updateDraft, updateSelectedMajor, updateTotalCredits, queryUserDraft } from '../../redux/CreateBootcamp/createBootCamp';
import ContentOfProgram from './../../components/CreateBootcamp/ContentOfProgram/ContentOfProgram';
import SemesterList from '../../components/CreateBootcamp/Semester/SemesterList';
import { MISSING_FIELD_INFO, NO_ALLOWCATION_CREDITS_DATA, NO_BOOTCAMP_NAME, NO_BOOTCAMP_TOTAL_CREDITS, } from '../../util/constants/errorMessage';
import { updateLoading } from '../../redux/loading/Loading';
import { NOTI_CREATE_BOOTCAMP_MISS_INFO, NOTI_CREATE_BOOTCAMP_SUCCESS, NOTI_ERROR, NOTI_ERROR_TITLE, NOTI_SUCCESS, NOTI_SUCCESS_SAVE_DRAFT, NOTI_SUCCESS_TITLE, NOTI_UPDATE_BOOTCAMP_TEMPLATE_SUCCESS, NOTI_SUCCESS_UPDATE_DRAFT_NAME, NOTI_SUCCESS_AUTO_SAVE_DRAFT } from '../../util/constants/notificationMessage';
import { getAllBootcamp, getBootcampById, updateBootcamp } from '../../redux/bootcamp/bootcamp';
import { validateBootcampData } from '../../util/ValidateBootcamp/validateBootcampData';
import { getAllMajor, getDepartmentById, getMajorById, updateDepartmentList, updateViewedMajor } from '../../redux/major/major';
import { AutogenAllSubjectCode } from '../../util/AutogenSubjectCode/autogenSubjectCode';
import { getAllowcatById, updateAllowcate } from '../../redux/allocate/allowcate';
import { updateAfterImportBootcamp } from '../../redux/subject/subject';
import ContentModal from '../../components/CreateBootcamp/ContentOfProgram/ContentModal';
import { clearAllConfirmConfig } from '../../util/ConfirmModal/confirmConfig';
import DraftTableModal from '../../components/CreateBootcamp/DraftTable/DraftTableModal';
import { editUserData, getUserData, updateUser } from '../../redux/authentication/authentication';


const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;


const CreateBootcamp = ({ openNotification, confirmModal }) => {
  const dispatch = useDispatch()
  const [specialistCredits, setSpecialistCredits] = useState({ total: 0, complete: 0 })
  const [generalCredits, setGeneralCredits] = useState({ total: 0, complete: 0 })
  const [errorMessage, setErrorMessage] = useState({
    allowcate: [],
    compulsory: [],
    elective: [],
    planning: [],
    electiveGroup: [],
    remainning: false
  })
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [subjectModalData, setSubjestModalData] = useState({
    type: "",
    fieldIndex: "",
    modalName: "",
    sujectType: "",
    subjectData: null,
    isCreateBootcamp: true,
    isViewBootcamp: false
  })

  const [isImportBootcampModalOpen, setIsImportBootcampModalOpen] = useState(false)
  const { totalCredits, completeTotalCredits, allowcateFields, bootcampName, semesterList, semesterSubjectList, draftID, selectedMajor, branchMajorSemester, draftList } = useSelector(store => store.createBootCamp)
  const { importedSubjectsList } = useSelector(store => store.subject)
  const { userData } = useSelector(store => store.authentication)
  const { majorList, viewedMajor, departmentList } = useSelector(store => store.major)
  const [bootcampNameError, setBootcampNameError] = useState(false)
  const [bootcampCreditError, setBootcampCreditError] = useState(false)
  const [majorSelectList, setMajorSelectList] = useState([])
  const [contentModalStatus, setContainModalStatus] = useState(false)
  const [contentModalComponent, setContentModalComponent] = useState(<></>)
  const [contentModalFieldData, setContentModalFieldData] = useState({ index: -1, type: "compulsory" })
  const [manageStatus, setManageStatus] = useState('create')
  const [openDraftModal, setOpenDraftModal] = useState(false)
  const actionRef = useRef();
  // console.log(allowcateFields[4].subjectList.filter(student => student.isCompulsory === true))
  // console.log(semesterList[5].filter(subject => subject.semesterSubjectListIndex === 37))
  // let a = []
  // semesterList.forEach((semester) => {
  //   semester.forEach(subject => a.push(subject.semesterSubjectListIndex))
  // })
  // console.log(a.sort(function(a, b){return a - b}))
  const closeContentModal = () => {
    setContainModalStatus(false)
  }
  const openContentModal = (fieldIndex, type) => {
    setContainModalStatus(true)
    setContentModalFieldData({
      index: fieldIndex,
      type: type
    })
  }
  const updateContentModalContent = (component) => {
    setContentModalComponent(component)
  }

  const items = [
    {
      key: '1',
      label: 'Allocate of Credits',
      children: <AllocateField openContentModal={openContentModal} errorMessage={errorMessage.allowcate} confirmModal={confirmModal} />,
    },
    {
      key: '2',
      label: 'Add Compulsory Subjects',
      children: <ContentOfProgram chosenFieldData={contentModalFieldData} updateContentFunc={updateContentModalContent} confirmModal={confirmModal} errorMessage={errorMessage.compulsory} type={"Compulsory"} setIsSubjectModalOpen={setIsSubjectModalOpen} setSubjestModalData={setSubjestModalData} />,
    },
    {
      key: '3',
      label: 'Add Elective Subjects',
      children: <ContentOfProgram chosenFieldData={contentModalFieldData} updateContentFunc={updateContentModalContent} confirmModal={confirmModal} groupError={errorMessage.electiveGroup} errorMessage={errorMessage.elective} type={"Elective"} setIsSubjectModalOpen={setIsSubjectModalOpen} setSubjestModalData={setSubjestModalData} />,
    },
    {
      key: '4',
      label: 'Semester Planning',
      children: <SemesterList confirmModal={confirmModal} planningError={errorMessage.planning} remainning={errorMessage.remainning} />,
    },
  ];

  const handleChangeBootcampName = (e) => {
    dispatch(updateBootcampName(e.target.value))
  }
  const handleChangeBootcampTotalCredits = (value) => {
    dispatch(updateTotalCredits(value ? value : 0))
  }

  const handleCreatebootcamp = async () => {

    let tempErrorMessage = validateBootcampData(bootcampName, totalCredits, allowcateFields, semesterList, semesterSubjectList, completeTotalCredits)
    setBootcampNameError(tempErrorMessage.bootcampName)
    setBootcampCreditError(tempErrorMessage.totalCredits)
    if (bootcampName !== "" && totalCredits > 0 && tempErrorMessage.allowcate.length === 0 && tempErrorMessage.compulsory.length === 0 && tempErrorMessage.elective.length === 0 && tempErrorMessage.planning.length === 0 && tempErrorMessage.remainning === false && tempErrorMessage.electiveGroup.length === 0) {

      try {
        dispatch(updateLoading(true))
        let newFieldList = []
        let subjectInListIndex = 1
        let createdAllowcate = null
        if (manageStatus === 'create') {
          const newFieldData = {
            "detail": allowcateFields.map((field) => {
              return {
                "name": field?.fieldName,
                "detail": field.smallField.map((sfield) => {
                  return {
                    "name": sfield?.fieldName,
                    "compulsoryCredit": sfield.compulsoryCredits,
                    "OptionalCredit": sfield.electiveCredits
                  }
                }),
                "isElectiveNameBaseOnBigField": field.isElectiveNameBaseOnBigField
              }
            })
          }
          const allowcateRes = await dispatch(createField(newFieldData))
          createdAllowcate = allowcateRes.payload.data
        } else {
          const selectedMajorData = majorList.find((major) => major._id === selectedMajor)
          const newFieldData = {
            "detail": allowcateFields.map((field) => {
              return {
                "name": field?.fieldName,
                "detail": field.smallField.map((sfield) => {
                  return {
                    "name": sfield?.fieldName,
                    "compulsoryCredit": sfield.compulsoryCredits,
                    "OptionalCredit": sfield.electiveCredits
                  }
                }),
                "isElectiveNameBaseOnBigField": field.isElectiveNameBaseOnBigField
              }
            })
          }
          if (selectedMajorData.templateBootcamp) {
            let bootcampRes = await dispatch(getBootcampById(selectedMajorData.templateBootcamp))
            let allowcateRes = await dispatch(updateAllowcate({ allowcateId: bootcampRes.payload.data.allocation._id, fieldData: newFieldData }))
            createdAllowcate = allowcateRes.payload.data
          } else {

            const allowcateRes = await dispatch(createField(newFieldData))
            createdAllowcate = allowcateRes.payload.data
          }

        }

        for (let i = 0; i < allowcateFields.length; i++) {
          const newSubjectList = []
          for (let j = 0; j < allowcateFields[i].subjectList.length; j++) {
            let subjectData = {
              "name": allowcateFields[i].subjectList[j].name,
              "subjectCode": allowcateFields[i].subjectList[j].isAutoCreateCode ? AutogenAllSubjectCode({ ...allowcateFields[i].subjectList[j], indexAutogenSubjectCode: subjectInListIndex }) : allowcateFields[i].subjectList[j].subjectCode,
              "credit": allowcateFields[i].subjectList[j].credits,
              "isCompulsory": allowcateFields[i].subjectList[j].isCompulsory,
              "description": allowcateFields[i].subjectList[j].description,
              "branchMajor": allowcateFields[i].subjectList[j].branchMajor !== undefined ? allowcateFields[i].subjectList[j].branchMajor : null,
              "type": "major",
              "shortFormName": allowcateFields[i].subjectList[j].shortFormName,
              "isAutoCreateCode": allowcateFields[i].subjectList[j].isAutoCreateCode,
              "departmentChild": allowcateFields[i].subjectList[j].departmentChild,
              "allocateChildId": (allowcateFields[i].subjectList[j].allocateChildId !== undefined && allowcateFields[i].subjectList[j].allocateChildId !== null) ? createdAllowcate.detail[i].detail[allowcateFields[i].subjectList[j].allocateChildId]._id : null,
              "teachers": manageStatus === 'create' ? [] : allowcateFields[i].subjectList[j].teachers === undefined ?  [] : allowcateFields[i].subjectList[j].teachers.map((teacher) => teacher._id) ,
              "note": manageStatus === 'create' ? '' : allowcateFields[i].subjectList[j].note !== undefined ? allowcateFields[i].subjectList[j].note : ''
            }
            newSubjectList.push(subjectData)


            subjectInListIndex++
          }
          createdAllowcate.detail[i].subjectList = newSubjectList
          createdAllowcate.detail[i].electiveSubjectList = allowcateFields[i].electiveSubjectList.map((group) => {
            let newGroupData = { ...group }
            if (newGroupData.allocateChildId !== undefined && newGroupData.allocateChildId !== null) {
              newGroupData.allocateChildId = createdAllowcate.detail[i].detail[newGroupData.allocateChildId]._id
            }
            return newGroupData
          })

        }
        const fieldData = {
          "detail": [...createdAllowcate.detail]
        }

        let created_field_container

        if (selectedMajor.length > 0) {
          const selectedMajorData = majorList.find((major) => major._id === selectedMajor)
          if (selectedMajorData.templateBootcamp) {
            created_field_container = await dispatch(updateAllowcate({ allowcateId: createdAllowcate._id, fieldData }))
          } else {
            created_field_container = await dispatch(updateAllowcate({ allowcateId: createdAllowcate._id, fieldData }))
          }
        }

        created_field_container = created_field_container.payload.data
        const bootcampData = {
          "major": selectedMajor,
          "author": userData.id,
          "name": bootcampName,
          "year": 2023,
          "totalCredit": totalCredits,
          "draft": false,
          "allocation": created_field_container._id,
          "branchMajorSemester": branchMajorSemester,
          "detail": semesterList.map((semester, index) => {
            return {
              semester: `Semester ${index + 1}`,
              subjectList: semester.map((subject) => {
                return created_field_container.detail[subject.fieldIndex].subjectList[subject.subjectIndex]._id
              })
            }
          })
        }
        if (manageStatus === 'create') {
          await dispatch(createFirstBootcamp(bootcampData))
          dispatch(resetAll())
          // if (draftID)
          //   await dispatch(deleteDraft(draftID))
          openNotification(NOTI_SUCCESS, NOTI_SUCCESS_TITLE, NOTI_CREATE_BOOTCAMP_SUCCESS)
        } else {
          if (selectedMajor.length > 0) {
            const selectedMajorData = majorList.find((major) => major._id === selectedMajor)
            if (selectedMajorData.templateBootcamp) {
              await dispatch(updateBootcamp({ bootcampID: selectedMajorData.templateBootcamp, bootcampData }))
              openNotification(NOTI_SUCCESS, NOTI_SUCCESS_TITLE, NOTI_UPDATE_BOOTCAMP_TEMPLATE_SUCCESS)
            } else {
              await dispatch(createTemplateBootcamp(bootcampData))
            }
          }
        }

        dispatch(updateLoading(false))
      } catch (e) {
        dispatch(updateLoading(false))
      }


    } else {
      setErrorMessage(tempErrorMessage)
      openNotification(NOTI_ERROR, NOTI_ERROR_TITLE, NOTI_CREATE_BOOTCAMP_MISS_INFO)
    }

  }
  const handleUploadDraft = async (uploadedId) => {
    const sendData = {
      draftID: uploadedId,
      data: {
        data: {
          totalCredits,
          completeTotalCredits,
          allowcateFields,
          bootcampName,
          semesterList,
          semesterSubjectList,
          selectedMajor,
          branchMajorSemester
        }
      }
    }
    let draftRes = await dispatch(updateDraft(sendData))
    if (draftRes.payload.status === 'ok') {
      openNotification(NOTI_SUCCESS, NOTI_SUCCESS_TITLE, NOTI_SUCCESS_SAVE_DRAFT)
      return true
    }else {
      return false
    }

  }

  const handleUploadDraftName = async (uploadedId, draftName) => {
    const sendData = {
      draftID: uploadedId,
      data: {
        name: draftName
      }
    }
    await dispatch(updateDraft(sendData))
    openNotification(NOTI_SUCCESS, NOTI_SUCCESS_TITLE, NOTI_SUCCESS_UPDATE_DRAFT_NAME)
  }

  // const handleAutoSaveDraft = async (autoDraftId) => {
  //   const sendData = {
  //     draftID: autoDraftId,
  //     data: {
  //       data: {
  //         totalCredits,
  //         completeTotalCredits,
  //         allowcateFields,
  //         bootcampName,
  //         semesterList,
  //         semesterSubjectList,
  //         selectedMajor,
  //         branchMajorSemester
  //       }
  //     }
  //   }
  //   await dispatch(updateDraft(sendData))
  //   openNotification(NOTI_SUCCESS, NOTI_SUCCESS_TITLE, NOTI_SUCCESS_AUTO_SAVE_DRAFT)
  // }

  const handleSaveAsDraft = async (draftName) => {
    dispatch(updateLoading(true))
    const draftData = {
      author: userData.id,
      name: draftName,
      data: {
        totalCredits,
        completeTotalCredits,
        allowcateFields,
        bootcampName,
        semesterList,
        semesterSubjectList,
        selectedMajor,
        branchMajorSemester
      }
    }
    let draftRes = await dispatch(createDraft(draftData))
    openNotification(NOTI_SUCCESS, NOTI_SUCCESS_TITLE, NOTI_SUCCESS_SAVE_DRAFT)
    dispatch(updateLoading(false))
    return draftRes.payload.data
  }

  const handleDeleteDraft = async (deletedId) => {
    await dispatch(deleteDraft(deletedId))
  }

  const handleSelectMajor = (value) => {
    dispatch(updateSelectedMajor(value))
    dispatch(getMajorById(value))
    if (userData) {
      if (userData.role === "admin") {
        const selectedMajorData = majorList.find((major) => major._id === value)
        if (selectedMajorData.templateBootcamp) {
          handleAddTemplate(selectedMajorData.templateBootcamp)
        }
      } else if (userData.role === "teacher") {
        if (userData.major.templateBootcamp)
          handleAddTemplate(userData.major.templateBootcamp)
      }
    }

  }

  const handleAddTemplate = async (bootcampId) => {
    dispatch(updateLoading(true))
    const templateBootcampData = await dispatch(getBootcampById(bootcampId))

    if (templateBootcampData.payload.status === 'ok') {
      let newTemplateBootcampData = templateBootcampData.payload.data
      let branchMajorSemester = newTemplateBootcampData.branchMajorSemester
      let bootcampName = newTemplateBootcampData.name
      let totalCredits = newTemplateBootcampData.totalCredit
      let completeTotalCredits = 0
      let allowcateFields = []
      let semesterSubjectList = []
      let semesterList = [[]]
      const tempAllowcateFields = newTemplateBootcampData.allocation
      // const tempDepartmentList = await getAllMajorDepartment()
      // let tempDepartmentList = []
      // for (let i = 0; i < newTemplateBootcampData.major.department.length; i++) {
      //   const departmentId = newTemplateBootcampData.major.department[i];
      //   const departmentRes = await dispatch(getDepartmentById(departmentId))
      //   tempDepartmentList.push(departmentRes.payload.data)
      // }

      allowcateFields = tempAllowcateFields.detail.map((field, index) => {
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
              shortFormName: subject.shortFormName ? subject.shortFormName : "",
              isAutoCreateCode: subject.isAutoCreateCode ? subject.isAutoCreateCode : false,
              departmentChild: subject.departmentChild ? subject.departmentChild : undefined,
              allocateChildId: (subject.allocateChildId !== undefined && subject.allocateChildId !== null) ? field.detail.findIndex(sField => sField._id === subject.allocateChildId) : null,
              teachers: subject.teachers,
              note: subject.note,
              _id: subject._id
            }
            if (index < tempAllowcateFields.detail.length - 1) {
              if (subject.isCompulsory) {
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
          _id: newTemplateBootcampData.allocation._id
        }
      })
      semesterList = newTemplateBootcampData.detail.map((semester) => {
        let semesterIndex = Number(semester.semester.split(" ")[1]) - 1
        return semester.subjectList.map((subject, index) => {
          const semesterSubjectListIndex = semesterSubjectList.findIndex(sSubject => sSubject._id === subject._id)
          semesterSubjectList[semesterSubjectListIndex].semester = semesterIndex
          const a = semesterSubjectList[semesterSubjectListIndex]
          allowcateFields[a.fieldIndex].subjectList[a.subjectIndex]['semester'] = semesterIndex
          return {
            ...a,
            semesterSubjectListIndex
          }


        })
      })
      dispatch(updateViewedMajor(newTemplateBootcampData.major))
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
    }
  }

  const getAllMajorDepartment = async () => {

    if (viewedMajor) {
      if (viewedMajor.department) {
        let tempDepartmentList = []

        for (let i = 0; i < viewedMajor.department.length; i++) {
          const departmentId = viewedMajor.department[i];

          if (typeof departmentId === 'string') {
            const departmentRes = await dispatch(getDepartmentById(departmentId))

            tempDepartmentList.push(departmentRes.payload.data)
          } else {
            tempDepartmentList.push(departmentId)
          }

        }
        dispatch(updateDepartmentList(tempDepartmentList))
      }
    }
  }

  const handleOpenDraftModal = () => {
    setOpenDraftModal(true)
  }
  const handleCloseDraftModal = () => {
    setOpenDraftModal(false)
  }
  useEffect(() => {
    if (userData) {
      if (userData.role === "admin") {
        dispatch(getAllMajor())
      } else if (userData.role === "teacher") {
        dispatch(updateSelectedMajor(userData.major._id))
        handleSelectMajor(userData.major._id)
      }
      dispatch(queryUserDraft(''))
    }

    // dispatch(getMajorById('651ea4fac9a4c12da715528f'))
  }, [userData, dispatch])
  useEffect(() => {
    if (userData) {
      if (userData.role === "admin") {
        const newMajorList = majorList.map((major) => {
          return {
            value: major._id,
            label: major.name
          }
        })
        setMajorSelectList(newMajorList)
      } else if (userData.role === "teacher") {
        const newMajorList = [{
          value: userData.major._id,
          label: userData.major.name
        }]
        setMajorSelectList(newMajorList)
      }
    }

  }, [userData, majorList])


  useEffect(() => {
    getAllMajorDepartment()


  }, [viewedMajor])

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     console.log("saved")
  //   }, 5000); // Gọi API sau mỗi 5 giây

  //   return () => clearTimeout(timer);
  // },[bootcampName,totalCredits, allowcateFields, semesterList])
  return (
    <div>
      {selectedMajor.length > 0 ? 
      <>
      <FloatButton
        shape="square"

        type="primary"
        style={{
          right: 94,
          width: 100,
          height: 30
        }}

        description="Quick Save"
        onClick={async () => {
          if (userData.autoDraftId) {
            let updateResult = await handleUploadDraft(userData.autoDraftId)
            if(updateResult === false){
              let createdData = await handleSaveAsDraft('Auto Save')
              let userRes = await dispatch(updateUser({
                autoDraftId: createdData._id
              }))
              const newUserData = userRes.payload.data
              dispatch(editUserData({
                ...newUserData,
                id: newUserData._id
              }))
            }
          } else {
            let createdData = await handleSaveAsDraft('Auto Save')
            let userRes = await dispatch(updateUser({
              autoDraftId: createdData._id
            }))
            const newUserData = userRes.payload.data
            dispatch(editUserData({
              ...newUserData,
              id: newUserData._id
            }))
          }
          actionRef?.current.reload()
        }}

        icon={<SaveOutlined />}
      />
      <FloatButton
        shape="circle"
        style={{
          right: 30,
        }}
        badge={{
          count: draftList.length
        }}
        onClick={handleOpenDraftModal}
        tooltip={`You have (${draftList.length}) Draft`}
        icon={<SaveOutlined />}
      />
      </> : 
      <></>
      }
      
      <ContentModal isModalOpen={contentModalStatus} handleCancel={closeContentModal}>

        {contentModalComponent}
      </ContentModal>
      <DraftTableModal actionRef={actionRef} open={openDraftModal} handleCancel={handleCloseDraftModal} confirmModal={confirmModal} openNotification={openNotification} handleUploadDraft={handleUploadDraft} handleSaveAsDraft={handleSaveAsDraft} handleUploadDraftName={handleUploadDraftName} handleDeleteDraft={handleDeleteDraft} />
      <SubjectModal subjectModalData={subjectModalData} isModalOpen={isSubjectModalOpen} setIsModalOpen={setIsSubjectModalOpen} />
      <ImportBootcampModal setErrorMessage={setErrorMessage} isModalOpen={isImportBootcampModalOpen} setIsModalOpen={setIsImportBootcampModalOpen} />


      <Row gutter={16}>
        <Col span={12}>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: "wrap" }}>
            <Button onClick={() => {
              dispatch(getAllBootcamp())
              setIsImportBootcampModalOpen(true)
            }} type='dashed' disabled={selectedMajor.length > 0 ? false : true}>Import</Button>
            <Select
              placeholder='Select a major'
              style={{
                width: 240
              }}
              value={selectedMajor}
              options={majorSelectList}
              onChange={handleSelectMajor}
            />
            {
              userData?.role === "admin" ?
                <Radio.Group defaultValue="create" buttonStyle="solid" onChange={(e) => setManageStatus(e.target.value)}>
                  <Radio value="template">Manage Template</Radio>
                  <Radio value="create">Create Curriculum</Radio>
                </Radio.Group>
                :
                <></>
            }
          </div>
        </Col>
        <Col span={12} style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button style={{ marginRight: 20 }} onClick={() => {
          if (userData.major.templateBootcamp) {
            handleAddTemplate(userData.major.templateBootcamp)
          }

        }}>Reload Template</Button>
        <Button onClick={async () => {
          const confirmed = await confirmModal.confirm(clearAllConfirmConfig)
          if (confirmed) {
            await dispatch(resetAll())

          }

        }} style={{ marginRight: 20 }} disabled={selectedMajor.length > 0 ? false : true} danger>Clear All</Button>
          {
            manageStatus === 'create' ?

              <>
                
                {/* <Button onClick={handleOpenDraftModal} style={{ marginRight: 20 }} disabled={selectedMajor.length > 0 ? false : true}>You have ({draftList.length}) Draft</Button> */}
                <Button type='primary' onClick={handleCreatebootcamp} htmlType='submit' disabled={selectedMajor.length > 0 ? false : true}>Create</Button>
              </>


              :

              <Button type='primary' onClick={handleCreatebootcamp} htmlType='submit' disabled={selectedMajor.length > 0 ? false : true}>Update Template</Button>

          }


        </Col>
      </Row>
      {
        selectedMajor.length > 0 ?
          <div className='createFormContainer'>
            <Form layout="vertical">
              <Row gutter={16}>
                <Col span={8}>
                  <div><span style={{ color: "red" }}>* </span>Name</div>
                  <Input style={{ marginBlock: 8 }} status={(bootcampNameError && bootcampName === "") ? "error" : ""} value={bootcampName} placeholder="Please enter user name" onChange={handleChangeBootcampName} />
                  {(bootcampNameError && bootcampName === "") ? <div style={{ color: "red" }}>{NO_BOOTCAMP_NAME}</div> : ""}
                </Col>
                <Col span={8} className='staticColum'>
                  <div><span style={{ color: "red" }}>* </span>Total Credits</div>
                  <InputNumber status={(bootcampCreditError && totalCredits <= 0) ? "error" : ""} onChange={handleChangeBootcampTotalCredits} value={totalCredits} min={1}
                    // max={300} 
                    style={{ width: "100%", marginBlock: 8 }} placeholder="Please enter total credits" />
                  {(bootcampCreditError && totalCredits <= 0) ? <div style={{ color: "red" }}>{NO_BOOTCAMP_TOTAL_CREDITS}</div> : ""}
                  <Progress status={completeTotalCredits > totalCredits ? "exception" : ""} percent={CaculatePercent(completeTotalCredits, totalCredits)} format={() => `${completeTotalCredits}/${totalCredits}`} />
                </Col>
              </Row>


              <Row style={{ marginTop: 30 }}>

                <Col span={24}>
                  <Form.Item>
                    <Collapse items={items} defaultActiveKey={[1, 2, 3]} />
                  </Form.Item>
                </Col>

              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  {
                    manageStatus === 'create' ?
                      <Form.Item style={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button onClick={handleSaveAsDraft} style={{ marginRight: 20 }}>Save As Draft</Button>
                        <Button type='primary' onClick={handleCreatebootcamp} htmlType='submit'>Create</Button>
                      </Form.Item>
                      :
                      <Form.Item style={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button type='primary' onClick={handleCreatebootcamp} htmlType='submit'>Update Template</Button>
                      </Form.Item>
                  }


                </Col>
              </Row>
            </Form>

          </div>
          :
          <div style={{ marginTop: 100 }}>
            <Result
              title="Please, choose a major before you start your work"
            />
          </div>
      }


    </div>
  )
}

export default CreateBootcamp