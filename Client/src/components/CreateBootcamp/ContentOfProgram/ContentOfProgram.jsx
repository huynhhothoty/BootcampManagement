import { Col, Progress, Row } from "antd"
import ContentOfField from "./ContentOfField"
import { useDispatch, useSelector } from "react-redux"
import { CaculatePercent } from "../../../util/CaculatePercent/caculatePercent"
import { updateCompleteTotalCredits } from "../../../redux/CreateBootcamp/createBootCamp"
import { useEffect, useState } from "react"

const ContentOfProgram = ({chosenFieldData, updateContentFunc, errorMessage,type,setIsSubjectModalOpen, setSubjestModalData, confirmModal,groupError}) => {
    const dispatch = useDispatch()
    const {totalCredits,completeTotalCredits,allowcateFields} = useSelector(store => store.createBootCamp)
    const [newFieldList, setNewFieldList] = useState([])
    const renderFields = () => {
        let firstIndexSubjectCode = 0
        return allowcateFields.map((field,index) => {
            let isLastField = allowcateFields.length - 1 === index
            let newGroupError = false
            let newField = {}
            if(groupError){
                if(groupError.length > 0){
                    if(groupError.includes(index))
                    newGroupError = true
                }
            }
            newField = {
                ...field,
                firstIndexSubjectCode
            }
            firstIndexSubjectCode += field.subjectList.length 
            if(errorMessage.length > 0){
                if(errorMessage.includes(index)){
                    return <ContentOfField groupError={groupError} confirmModal={confirmModal} error={true} key={index} field={newField} index={index}  type={type} setIsSubjectModalOpen={setIsSubjectModalOpen} setSubjestModalData={setSubjestModalData} isLastField={isLastField}/>
                }
                   
            }
            return <ContentOfField groupError={groupError} confirmModal={confirmModal} error={false} key={index} field={newField} index={index}  type={type} setIsSubjectModalOpen={setIsSubjectModalOpen} setSubjestModalData={setSubjestModalData} isLastField={isLastField}/>
        })
    }
    const totalActureCredits = () => {
        let totalSubjectCredits = 0
        allowcateFields.forEach((field) => {
            field.subjectList.forEach((subject) => {
                if(subject.isCompulsory === (type === "Compulsory" ? true : false)){
                    totalSubjectCredits += subject.credits
                }
            })
        })
       
        return totalSubjectCredits
    }
    const totalContentCredits = () => {
        let totalCredits = 0
        allowcateFields.forEach((field) => {
            if(type === "Compulsory"){
                totalCredits += field.compulsoryCredits
            }else totalCredits += field.electiveCredits
        })
        return totalCredits
    }
    const getProgressStatus = () => {
        if (totalActureCredits() > totalContentCredits())
            return "exception"
        else return ""
    }
    const getProgressPercentage = () => {
        return CaculatePercent(totalActureCredits(), totalContentCredits())
    }
    useEffect(() => {
        if(type === chosenFieldData.type) 
            updateContentFunc(newFieldList[chosenFieldData.index])
    },[chosenFieldData])

    useEffect(() => {
        let tempComponentList = renderFields()
        setNewFieldList(tempComponentList)
        if(chosenFieldData)
            if(type === chosenFieldData.type) 
                updateContentFunc(tempComponentList[chosenFieldData.index])
    },[allowcateFields])

   return (
    <div>
        <Row style={{marginBottom: 10}}>
            {/* <Col span={4}>
            <span style={{fontSize: 15}}>Total {type} Credits:</span>
            </Col>
            <Col span={20}>
          
            </Col> */}

        </Row>
        <div>
            {newFieldList}
        </div>
    </div>
   )
}

export default ContentOfProgram