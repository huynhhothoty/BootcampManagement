import { Col, Progress, Row } from "antd"
import ContentOfField from "./ContentOfField"
import { useDispatch, useSelector } from "react-redux"
import { CaculatePercent } from "../../../util/CaculatePercent/caculatePercent"
import { updateCompleteTotalCredits } from "../../../redux/CreateBootcamp/createBootCamp"

const ContentOfProgram = ({errorMessage,type,setIsSubjectModalOpen, setSubjestModalData, confirmModal}) => {
    const dispatch = useDispatch()
    const {totalCredits,completeTotalCredits,allowcateFields} = useSelector(store => store.createBootCamp)
    const renderFields = () => {
        return allowcateFields.map((field,index) => {
            if(errorMessage.length > 0){
                if(errorMessage.includes(index))
                return <ContentOfField confirmModal={confirmModal} error={true} key={index} field={field} index={index}  type={type} setIsSubjectModalOpen={setIsSubjectModalOpen} setSubjestModalData={setSubjestModalData}/>
            }
            return <ContentOfField  confirmModal={confirmModal} error={false} key={index} field={field} index={index}  type={type} setIsSubjectModalOpen={setIsSubjectModalOpen} setSubjestModalData={setSubjestModalData}/>
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
   return (
    <div>
        <Row style={{marginBottom: 10}}>
            <Col span={4}>
            <span style={{fontSize: 15}}>Total {type} Credits:</span>
            </Col>
            <Col span={20}>
            <Progress status={type === "Compulsory" ? getProgressStatus() : ""} percent={getProgressPercentage()} format={() => `${totalActureCredits()}/${totalContentCredits()}`} />
            </Col>

        </Row>
        <div>
            {renderFields()}
        </div>
    </div>
   )
}

export default ContentOfProgram