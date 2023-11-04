import { Button, Col, Form, Input, InputNumber, Progress, Radio, Row, } from 'antd';
import { useState } from 'react';
import { CaculatePercent } from '../../util/CaculatePercent/caculatePercent';
import Semester from '../../components/CreateBootcamp/Semester/Semester';
import SubjectModal from '../../components/CreateBootcamp/SubjectModal/SubjectModal';
import ImportBootcampModal from '../../components/CreateBootcamp/ImportBootcampModal/ImportBootcampModal';
import { Collapse } from 'antd';
import AllocateField from '../../components/CreateBootcamp/AllocateField/AllocateField';
import { useDispatch, useSelector } from 'react-redux';
import { createDraft, createField, createFirstBootcamp, createSubject, deleteDraft, resetAll, updateBootcampName, updateDraft, updateTotalCredits } from '../../redux/CreateBootcamp/createBootCamp';
import ContentOfProgram from './../../components/CreateBootcamp/ContentOfProgram/ContentOfProgram';
import SemesterList from '../../components/CreateBootcamp/Semester/SemesterList';
import { MISSING_FIELD_INFO, NO_ALLOWCATION_CREDITS_DATA, NO_BOOTCAMP_NAME, NO_BOOTCAMP_TOTAL_CREDITS } from '../../util/constants/errorMessage';
import { updateLoading } from '../../redux/loading/Loading';
import { NOTI_CREATE_BOOTCAMP_MISS_INFO, NOTI_CREATE_BOOTCAMP_SUCCESS, NOTI_ERROR, NOTI_ERROR_TITLE, NOTI_SUCCESS, NOTI_SUCCESS_SAVE_DRAFT, NOTI_SUCCESS_TITLE } from '../../util/constants/notificationMessage';
import { getAllBootcamp } from '../../redux/bootcamp/bootcamp';
import { validateBootcampData } from '../../util/ValidateBootcamp/validateBootcampData';


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
  const { totalCredits, completeTotalCredits, allowcateFields, bootcampName, semesterList, semesterSubjectList, draftID } = useSelector(store => store.createBootCamp)
  const { importedSubjectsList } = useSelector(store => store.subject)
  const { userData } = useSelector(store => store.authentication)
  const [bootcampNameError, setBootcampNameError] = useState(false)
  const [bootcampCreditError, setBootcampCreditError] = useState(false)
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
      children: <ContentOfProgram confirmModal={confirmModal} errorMessage={errorMessage.elective} type={"Elective"} setIsSubjectModalOpen={setIsSubjectModalOpen} setSubjestModalData={setSubjestModalData} />,
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
    let tempErrorMessage = validateBootcampData(bootcampName,totalCredits,allowcateFields,semesterList,semesterSubjectList,completeTotalCredits)
    setBootcampNameError(tempErrorMessage.bootcampName)
    setBootcampCreditError(tempErrorMessage.totalCredits)
    if (bootcampName !== "" && totalCredits > 0 && tempErrorMessage.allowcate.length === 0 && tempErrorMessage.compulsory.length === 0 && tempErrorMessage.elective.length === 0 && tempErrorMessage.planning.length === 0 && tempErrorMessage.remainning === false) {

      try {
        dispatch(updateLoading(true))
        let newFieldList = []

        for (let i = 0; i < allowcateFields.length; i++) {
          const newSubjectList = []
          for (let j = 0; j < allowcateFields[i].subjectList.length; j++) {

            const subjectIndex = importedSubjectsList.findIndex(subject => subject._id === allowcateFields[i].subjectList[j]._id)
            if (subjectIndex === -1) {
              let subjectData = {
                "name": allowcateFields[i].subjectList[j].name,
                "subjectCode": allowcateFields[i].subjectList[j].subjectCode,
                "credit": allowcateFields[i].subjectList[j].credits,
                "isCompulsory": allowcateFields[i].subjectList[j].isCompulsory,
                "description": allowcateFields[i].subjectList[j].description,
                "type": "major"
              }
              const a = await dispatch(createSubject(subjectData))
              newSubjectList.push(a.payload.data._id)
            }
            else {
              const a = importedSubjectsList[subjectIndex]
              const b = allowcateFields[i].subjectList[j]
              if ((a.name !== b.name) || (a.credit !== b.credits) || (a.subjectCode !== b.subjectCode) || (a.isCompulsory !== b.isCompulsory) || (a.description !== b.description)) {
                let subjectData = {
                  "name": allowcateFields[i].subjectList[j].name,
                  "subjectCode": allowcateFields[i].subjectList[j].subjectCode,
                  "credit": allowcateFields[i].subjectList[j].credits,
                  "isCompulsory": allowcateFields[i].subjectList[j].isCompulsory,
                  "description": allowcateFields[i].subjectList[j].description,
                  "type": "major"
                }
                const a = await dispatch(createSubject(subjectData))
                newSubjectList.push(a.payload.data._id)
              } else if ((a.name === b.name) && (a.credit === b.credits) && (a.subjectCode === b.subjectCode) && (a.isCompulsory === b.isCompulsory) && (a.description === b.description)) {
                newSubjectList.push(a._id)
              }
            }
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
              "subjectList": field.subjectList
            }
          })
        }
        const created_field_container = await dispatch(createField(fieldData))
        const bootcampData = {
          "major": "651ea5a591fd7742d88ae608",
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

        await dispatch(createFirstBootcamp(bootcampData))
        await dispatch(deleteDraft(draftID))
        openNotification(NOTI_SUCCESS, NOTI_SUCCESS_TITLE, NOTI_CREATE_BOOTCAMP_SUCCESS)
        dispatch(updateLoading(false))
        
        dispatch(resetAll())

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
    if(draftID === ""){
      const draftData = {
        author: userData.id,
        data: {
          totalCredits, 
          completeTotalCredits, 
          allowcateFields, 
          bootcampName, 
          semesterList, 
          semesterSubjectList
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
    }
   
    dispatch(updateLoading(false))
  }
  return (
    <div>

      <SubjectModal subjectModalData={subjectModalData} isModalOpen={isSubjectModalOpen} setIsModalOpen={setIsSubjectModalOpen} />
      <ImportBootcampModal setErrorMessage={setErrorMessage} isModalOpen={isImportBootcampModalOpen} setIsModalOpen={setIsImportBootcampModalOpen} />

      <Row gutter={16}>
        <Col span={12}>

          <Button onClick={() => {
            dispatch(getAllBootcamp())
            setIsImportBootcampModalOpen(true)
          }} type='dashed'>Import Bootcamp</Button>

        </Col>
        <Col span={12} style={{display:"flex", justifyContent:"flex-end"}}>

          <Button onClick={handleSaveAsDraft} style={{ marginRight: 20 }}>Save As Draft</Button>
          <Button type='primary' onClick={handleCreatebootcamp} htmlType='submit'>Create</Button>

        </Col>
      </Row>
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
              <Form.Item style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button onClick={handleSaveAsDraft} style={{ marginRight: 20 }}>Save As Draft</Button>
                <Button type='primary' onClick={handleCreatebootcamp} htmlType='submit'>Create</Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>

      </div>

    </div>
  )
}

export default CreateBootcamp