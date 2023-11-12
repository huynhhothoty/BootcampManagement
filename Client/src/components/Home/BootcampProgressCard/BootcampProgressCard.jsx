import { Card, Divider, Tooltip } from "antd"
const { Meta } = Card;
import { Progress } from 'antd';
import { CaculatePercent } from "../../../util/CaculatePercent/caculatePercent";
import { useEffect, useState } from "react";

const BootcampProgressCard = ({bootcamp}) => {
    const [completeCompulsoryCredits, setCompleteCompulsoryCredits] = useState(0)
    const [completeElectiveCredits, setCompleteElectiveCredits] = useState(0)
    const [totalElectiveCredits, setTotalElectiveCredits] = useState(0)
    const [totalCompulsoryCredits, setTotalCompulsoryCredits] = useState(0)
    const {
        name,
        totalCredit,
        detail,
        year,
        allocation
    } = bootcamp;
    const getTrackingData = () => {
        let completeTotalCompulsoryCredit = 0
        let completeTotalElectiveCredit = 0
        let totalCompulsoryCredits = 0
        let totalElectiveCredits = 0
        
        detail.forEach((semester,index) => {
            semester.subjectList.forEach(subject => {
                if(semester.trackingList.includes(subject._id)){
                    if(subject.isCompulsory) {
                        completeTotalCompulsoryCredit += subject.credit
                    }
                }
                if(subject.isCompulsory){
                    totalCompulsoryCredits += subject.credit
                }
            })
           
        })
      
        allocation.detail.forEach(field => {
            field.electiveSubjectList.forEach((group) => {

                if(group.semester !== null){
                    if(group.tracking){
                        completeTotalElectiveCredit+=group.credit
                    }
                    totalElectiveCredits += group.credit
                }
            })
        }) 
        setCompleteCompulsoryCredits(completeTotalCompulsoryCredit)
        setCompleteElectiveCredits(completeTotalElectiveCredit)
        setTotalElectiveCredits(totalElectiveCredits)
        setTotalCompulsoryCredits(totalCompulsoryCredits)
    }
    useEffect(() => {

        getTrackingData()
    },[bootcamp])

    return (
        <div className="bootcamp-progress_card_info">
            <div className="card-header">
                <Meta title={name}  />
            </div>
            <Divider />
            <div className="progress-container" >
                <div className="progress">
                    <Tooltip title={`${completeCompulsoryCredits}/${totalCompulsoryCredits} Credit`}>
                        <Progress type="dashboard" percent={CaculatePercent(completeCompulsoryCredits,totalCompulsoryCredits)} format={() => `${completeCompulsoryCredits}/${totalCompulsoryCredits}`} />
                    </Tooltip>
                    <p>Compulsory Subject</p>
                </div>
                <div className="progress">
                    <Tooltip title={`${completeElectiveCredits}/${totalElectiveCredits} Credit`}>
                        <Progress type="dashboard" percent={CaculatePercent(completeElectiveCredits,totalElectiveCredits)} format={() => `${completeElectiveCredits}/${totalElectiveCredits}`} />
                    </Tooltip>
                    <p>Elective Subject</p>
                </div>
            </div>
        </div>
    )
}

export default BootcampProgressCard