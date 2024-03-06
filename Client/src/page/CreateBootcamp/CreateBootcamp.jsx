import { Button, Col, Form, Input, InputNumber, Progress, Radio, Result, Row, Select, } from 'antd';
import { useEffect, useState } from 'react';
import { CaculatePercent } from '../../util/CaculatePercent/caculatePercent';
import Semester from '../../components/CreateBootcamp/Semester/Semester';
import SubjectModal from '../../components/CreateBootcamp/SubjectModal/SubjectModal';
import ImportBootcampModal from '../../components/CreateBootcamp/ImportBootcampModal/ImportBootcampModal';
import { Collapse } from 'antd';
import AllocateField from '../../components/CreateBootcamp/AllocateField/AllocateField';
import { useDispatch, useSelector } from 'react-redux';
import { createDraft, createField, createFirstBootcamp, createSubject, createTemplateBootcamp, deleteDraft, importBootcamp, resetAll, updateAutogenSubjectCode, updateBootcampName, updateDraft, updateSelectedMajor, updateTotalCredits } from '../../redux/CreateBootcamp/createBootCamp';
import ContentOfProgram from './../../components/CreateBootcamp/ContentOfProgram/ContentOfProgram';
import SemesterList from '../../components/CreateBootcamp/Semester/SemesterList';
import { MISSING_FIELD_INFO, NO_ALLOWCATION_CREDITS_DATA, NO_BOOTCAMP_NAME, NO_BOOTCAMP_TOTAL_CREDITS } from '../../util/constants/errorMessage';
import { updateLoading } from '../../redux/loading/Loading';
import { NOTI_CREATE_BOOTCAMP_MISS_INFO, NOTI_CREATE_BOOTCAMP_SUCCESS, NOTI_ERROR, NOTI_ERROR_TITLE, NOTI_SUCCESS, NOTI_SUCCESS_SAVE_DRAFT, NOTI_SUCCESS_TITLE, NOTI_UPDATE_BOOTCAMP_TEMPLATE_SUCCESS } from '../../util/constants/notificationMessage';
import { getAllBootcamp, getBootcampById, updateBootcamp } from '../../redux/bootcamp/bootcamp';
import { validateBootcampData } from '../../util/ValidateBootcamp/validateBootcampData';
import { getAllMajor, getMajorById, updateViewedMajor } from '../../redux/major/major';
import { AutogenAllSubjectCode } from '../../util/AutogenSubjectCode/autogenSubjectCode';
import { getAllowcatById, updateAllowcate } from '../../redux/allocate/allowcate';
import { updateAfterImportBootcamp } from '../../redux/subject/subject';


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
  const { totalCredits, completeTotalCredits, allowcateFields, bootcampName, semesterList, semesterSubjectList, draftID, selectedMajor } = useSelector(store => store.createBootCamp)
  const { importedSubjectsList } = useSelector(store => store.subject)
  const { userData } = useSelector(store => store.authentication)
  const { majorList } = useSelector(store => store.major)
  const [bootcampNameError, setBootcampNameError] = useState(false)
  const [bootcampCreditError, setBootcampCreditError] = useState(false)
  const [majorSelectList, setMajorSelectList] = useState([])

  const [manageStatus, setManageStatus] = useState('create')
  const items = [
    {
      key: '1',
      label: 'Allocate of Credits',
      children: <AllocateField errorMessage={errorMessage.allowcate} confirmModal={confirmModal} />,
    },
    {
      key: '2',
      label: 'Add Composory Subjects',
      children: <ContentOfProgram confirmModal={confirmModal} errorMessage={errorMessage.compulsory} type={"Compulsory"} setIsSubjectModalOpen={setIsSubjectModalOpen} setSubjestModalData={setSubjestModalData} />,
    },
    {
      key: '3',
      label: 'Add Elective Subjects',
      children: <ContentOfProgram confirmModal={confirmModal} groupError={errorMessage.electiveGroup} errorMessage={errorMessage.elective} type={"Elective"} setIsSubjectModalOpen={setIsSubjectModalOpen} setSubjestModalData={setSubjestModalData} />,
    },
    {
      key: '4',
      label: 'Semester Planning',
      children: <SemesterList confirmModal={confirmModal} planningError={errorMessage.planning} remainning={errorMessage.remainning} />
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
        for (let i = 0; i < allowcateFields.length; i++) {
          const newSubjectList = []
          for (let j = 0; j < allowcateFields[i].subjectList.length; j++) {
            const subjectIndex = importedSubjectsList.findIndex(subject => subject._id === allowcateFields[i].subjectList[j]._id)
            if (subjectIndex === -1) {
              let subjectData = {
                "name": allowcateFields[i].subjectList[j].name,
                "subjectCode": allowcateFields[i].subjectList[j].isAutoCreateCode ? AutogenAllSubjectCode({...allowcateFields[i].subjectList[j],indexAutogenSubjectCode:subjectInListIndex}) : allowcateFields[i].subjectList[j].subjectCode,
                "credit": allowcateFields[i].subjectList[j].credits,
                "isCompulsory": allowcateFields[i].subjectList[j].isCompulsory,
                "description": allowcateFields[i].subjectList[j].description,
                "branchMajor": allowcateFields[i].subjectList[j].branchMajor !== undefined ? allowcateFields[i].subjectList[j].branchMajor : null,
                "type": "major",
                "shortFormName": allowcateFields[i].subjectList[j].shortFormName,
                "isAutoCreateCode": allowcateFields[i].subjectList[j].isAutoCreateCode
              }
              const a = await dispatch(createSubject(subjectData))
              newSubjectList.push(a.payload.data._id)
            }
            else {
              const a = importedSubjectsList[subjectIndex]
              const b = allowcateFields[i].subjectList[j]
              if ((a.name !== b.name) || (a.credit !== b.credits) || (a.subjectCode !== b.subjectCode) || (a.isCompulsory !== b.isCompulsory) || (a.description !== b.description) || (a.branchMajor !== b.branchMajor) || (a.isAutoCreateCode !== b.isAutoCreateCode) || (a.shortFormName !== b.shortFormName)) {
                let subjectData = {
                  "name": allowcateFields[i].subjectList[j].name,
                  "subjectCode": allowcateFields[i].subjectList[j].isAutoCreateCode ? AutogenAllSubjectCode({...allowcateFields[i].subjectList[j],indexAutogenSubjectCode:subjectInListIndex}) : allowcateFields[i].subjectList[j].subjectCode,
                  "credit": allowcateFields[i].subjectList[j].credits,
                  "isCompulsory": allowcateFields[i].subjectList[j].isCompulsory,
                  "description": allowcateFields[i].subjectList[j].description,
                  "branchMajor": allowcateFields[i].subjectList[j].branchMajor !== undefined ? allowcateFields[i].subjectList[j].branchMajor : null,
                  "type": "major",
                  "shortFormName": allowcateFields[i].subjectList[j].shortFormName,
                  "isAutoCreateCode": allowcateFields[i].subjectList[j].isAutoCreateCode 
                }
                const a = await dispatch(createSubject(subjectData))
                newSubjectList.push(a.payload.data._id)
              } else if ((a.name === b.name) && (a.credit === b.credits) && (a.subjectCode === b.subjectCode) && (a.isCompulsory === b.isCompulsory) && (a.description === b.description)) {
                newSubjectList.push(a._id)
              }
            }
            subjectInListIndex++
          }
          newFieldList.push({
            ...allowcateFields[i],
            subjectList: newSubjectList
          })
        }

        const fieldData = {
          "detail": newFieldList.map((field) => {
            return {
              "name": field.fieldName,
              "detail": field.smallField.map((sfield) => {
                return {
                  "name": sfield.fieldName,
                  "compulsoryCredit": sfield.compulsoryCredits,
                  "OptionalCredit": sfield.electiveCredits
                }
              }),
              "subjectList": field.subjectList,
              "electiveSubjectList": field.electiveSubjectList
            }
          })
        }
        let created_field_container
        if(manageStatus === 'create'){
          created_field_container = await dispatch(createField(fieldData))
        }else{
          if (selectedMajor.length > 0) {
            const selectedMajorData = majorList.find((major) => major._id === selectedMajor)
            if (selectedMajorData.templateBootcamp) {
              created_field_container = await dispatch(updateAllowcate({ allowcateId: allowcateFields[0]._id, fieldData }))
            }else {
              created_field_container = await dispatch(createField(fieldData))
            }
          }
        }
        const bootcampData = {
          "major": selectedMajor,
          "author": userData.id,
          "name": bootcampName,
          "year": 2023,
          "totalCredit": totalCredits,
          "draft": false,
          "allocation": created_field_container.payload.data._id,
          "detail": semesterList.map((semester, index) => {
            return {
              semester: `Semester ${index + 1}`,
              subjectList: semester.map((subject) => {
                return newFieldList[subject.fieldIndex].subjectList[subject.subjectIndex]
              })
            }
          })
        }
        if(manageStatus === 'create'){
          await dispatch(createFirstBootcamp(bootcampData))
          dispatch(resetAll())
          await dispatch(deleteDraft(draftID))
          openNotification(NOTI_SUCCESS, NOTI_SUCCESS_TITLE, NOTI_CREATE_BOOTCAMP_SUCCESS)
        }else{
          if (selectedMajor.length > 0) {
            const selectedMajorData = majorList.find((major) => major._id === selectedMajor)
            if (selectedMajorData.templateBootcamp) {
              await dispatch(updateBootcamp({ bootcampID: selectedMajorData.templateBootcamp, bootcampData }))
              openNotification(NOTI_SUCCESS, NOTI_SUCCESS_TITLE, NOTI_UPDATE_BOOTCAMP_TEMPLATE_SUCCESS)
            }else {
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

  const handleSaveAsDraft = async () => {
    dispatch(updateLoading(true))
    if (draftID === "") {
      const draftData = {
        author: userData.id,
        data: {
          totalCredits,
          completeTotalCredits,
          allowcateFields,
          bootcampName,
          semesterList,
          semesterSubjectList,
          selectedMajor
        }
      }
      await dispatch(createDraft(draftData))
      openNotification(NOTI_SUCCESS, NOTI_SUCCESS_TITLE, NOTI_SUCCESS_SAVE_DRAFT)
    }
    else {
      const sendData = {
        draftID,
        data: {
          data: {
            totalCredits,
            completeTotalCredits,
            allowcateFields,
            bootcampName,
            semesterList,
            semesterSubjectList
          }
        }
      }
      await dispatch(updateDraft(sendData))
      openNotification(NOTI_SUCCESS, NOTI_SUCCESS_TITLE, NOTI_SUCCESS_SAVE_DRAFT)
    }

    dispatch(updateLoading(false))
  }

  const handleSelectMajor = (value) => {
    dispatch(updateSelectedMajor(value))

      if(userData){
        if(userData.role === "admin"){
          const selectedMajorData = majorList.find((major) => major._id === value)
          if (selectedMajorData.templateBootcamp) {
            handleAddTemplate(selectedMajorData.templateBootcamp)
          }
        }else if(userData.role === "leader"){
          handleAddTemplate(userData.major.templateBootcamp)
        }
      }
     
  }

  const handleAddTemplate = async (bootcampId) => {
    dispatch(updateLoading(true))
    const templateBootcampData = await dispatch(getBootcampById(bootcampId))

    if (templateBootcampData.payload.status === 'ok') {
      let newTemplateBootcampData = templateBootcampData.payload.data
      let bootcampName = newTemplateBootcampData.name
      let totalCredits = newTemplateBootcampData.totalCredit
      let completeTotalCredits = newTemplateBootcampData.totalCredit
      let allowcateFields = []
      let semesterSubjectList = []
      let semesterList = [[]]
      const tempAllowcateFields = await dispatch(getAllowcatById(newTemplateBootcampData.allocation._id))
      console.log(tempAllowcateFields.payload.data.detail)
      let tempSubjectList = []
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
              shortFormName: subject.shortFormName ? subject.shortFormName : "",
              isAutoCreateCode: subject.isAutoCreateCode ? subject.isAutoCreateCode : false,
              _id: subject._id
            }
            tempSubjectList.push(subject)
            return a
          }),
          electiveSubjectList: field.electiveSubjectList,
          _id: newTemplateBootcampData.allocation._id
        }
      })

      semesterList = newTemplateBootcampData.detail.map((semester) => {
        return semester.subjectList.map((subject, index) => {
          const semesterSubjectListIndex = semesterSubjectList.findIndex(sSubject => sSubject._id === subject._id)
          semesterSubjectList[semesterSubjectListIndex].semester = index
          const a = semesterSubjectList[semesterSubjectListIndex]
          allowcateFields[a.fieldIndex].subjectList[a.subjectIndex]['semester'] = index
          return {
            ...a,
            semesterSubjectListIndex
          }


        })
      })
      dispatch(updateViewedMajor(newTemplateBootcampData.major))
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
    }
  }

  useEffect(() => {
    if(userData){
      if(userData.role === "admin"){
        dispatch(getAllMajor())
      }else if(userData.role === "leader"){
        dispatch(updateSelectedMajor(userData.major._id))
      }
    }
     
    // dispatch(getMajorById('651ea4fac9a4c12da715528f'))
  }, [])
  useEffect(() => {
    if(userData){
      if(userData.role === "admin"){
        const newMajorList = majorList.map((major) => {
          return {
            value: major._id,
            label: major.name
          }
        })
        setMajorSelectList(newMajorList)
      }else if(userData.role === "leader"){
        const newMajorList = [{
          value: userData.major._id,
          label: userData.major.name
        }]
        setMajorSelectList(newMajorList)
      }
    }
   
  },[userData])


  useEffect(() => {

   

  }, [])
  return (
    <div>

      <SubjectModal subjectModalData={subjectModalData} isModalOpen={isSubjectModalOpen} setIsModalOpen={setIsSubjectModalOpen} />
      <ImportBootcampModal setErrorMessage={setErrorMessage} isModalOpen={isImportBootcampModalOpen} setIsModalOpen={setIsImportBootcampModalOpen} />

      <Row gutter={16}>
        <Col span={12}>

          <Button onClick={() => {
            dispatch(getAllBootcamp())
            setIsImportBootcampModalOpen(true)
          }} type='dashed' disabled={selectedMajor.length > 0 ? false : true}>Import Bootcamp</Button>
          <Select
            placeholder='Select a major'
            style={{
              width: 240,
              marginLeft: 20
            }}
            defaultValue={selectedMajor.length > 0 ? selectedMajor : null}
            options={majorSelectList}
            onChange={handleSelectMajor}
          />
          {
            userData?.role === "admin" ? 
            <Radio.Group style={{ marginLeft: 20 }} defaultValue="create" buttonStyle="solid" onChange={(e) => setManageStatus(e.target.value)}>
              <Radio.Button value="template">Template Manage</Radio.Button>
              <Radio.Button value="create">Create Bootcamp</Radio.Button>
            </Radio.Group>
            :
            <Button style={{ marginLeft: 20 }} type='primary' onClick={() => {handleAddTemplate(userData.major.templateBootcamp)}}>Reload Template</Button>
          }
          
        </Col>
        <Col span={12} style={{ display: "flex", justifyContent: "flex-end" }}>

          {
            manageStatus === 'create' ?

              <>
                <Button onClick={handleSaveAsDraft} style={{ marginRight: 20 }} disabled={selectedMajor.length > 0 ? false : true}>Save As Draft</Button>
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
                  <div><span style={{ color: "red" }}>* </span>Bootcamp Name</div>
                  <Input style={{ marginBlock: 8 }} status={(bootcampNameError && bootcampName === "") ? "error" : ""} value={bootcampName} placeholder="Please enter user name" onChange={handleChangeBootcampName} />
                  {(bootcampNameError && bootcampName === "") ? <div style={{ color: "red" }}>{NO_BOOTCAMP_NAME}</div> : ""}
                </Col>
                <Col span={8} className='staticColum'>
                  <div><span style={{ color: "red" }}>* </span>Total Program Credits</div>
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
                    <Collapse items={items} defaultActiveKey={['1']} />
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