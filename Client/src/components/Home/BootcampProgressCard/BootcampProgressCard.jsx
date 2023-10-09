import { Card, Divider, Tooltip } from "antd"
const { Meta } = Card;
import { Progress } from 'antd';
import { CaculatePercent } from "../../../util/CaculatePercent/caculatePercent";

const BootcampProgressCard = ({bootcamp}) => {
    const {
        bootcampName,
        createrName,
        currentSemester,
        totalSpecializedSubjectcredits,
        totalGeneralSubjectcredits,
        completedSpecializedSubjectcredits,
        completedGeneralSubjectcredits,
    } = bootcamp;
    const percentSpecialized = CaculatePercent(completedSpecializedSubjectcredits,totalSpecializedSubjectcredits)
    const percentGeneral = CaculatePercent(completedGeneralSubjectcredits,totalGeneralSubjectcredits)
    return (
        <div className="bootcamp-progress_card_info">
            <div className="card-header">
                <Meta title={bootcampName} description={`Created By: ${createrName}`} />
                <Meta  title={`Current Semester: ${currentSemester}`} />
            </div>
            <Divider />
            <div className="progress-container" >
                <div className="progress">
                    <Tooltip title={`${completedSpecializedSubjectcredits}/${totalSpecializedSubjectcredits} Credit`}>
                        <Progress type="dashboard" percent={percentSpecialized} format={() => `${completedSpecializedSubjectcredits}/${totalSpecializedSubjectcredits}`} />
                    </Tooltip>
                    <p>Specialized Subject</p>
                </div>
                <div className="progress">
                    <Tooltip title={`${completedGeneralSubjectcredits}/${totalGeneralSubjectcredits} Credit`}>
                        <Progress type="dashboard" percent={percentGeneral} format={() => `${completedGeneralSubjectcredits}/${totalGeneralSubjectcredits}`} />
                    </Tooltip>
                    <p>Genaral Subject</p>
                </div>
            </div>
        </div>
    )
}

export default BootcampProgressCard