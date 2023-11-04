import React, { useEffect, useState } from 'react'
import Semester from './Semester'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from 'antd'
import AddSubjectToSemesterModal from '../SubjectModal/AddSubjectToSemesterModal'
import { addSemester } from '../../../redux/CreateBootcamp/createBootCamp'
import { SUBJECT_STILL_REMAIN } from '../../../util/constants/errorMessage'

const SemesterList = ({planningError,remainning, confirmModal}) => {
    const dispatch = useDispatch()
    const { semesterSubjectList, semesterList } = useSelector(store => store.createBootCamp)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const [selectedSemester, setSelectedSemester] = useState(0)
    const renderSemester = () => {
        return semesterList.map((semester, index) => {
            let error = false
            if(planningError.length > 0){
                if(planningError.includes(index)){
                    error = true
                }
            }
            return (
                <div key={index} style={{marginTop: 20}}>
                    <Semester confirmModal={confirmModal} error={error} totalSemester={semesterList.length} semesterIndex={index} setIsModalOpen={setIsModalOpen} setSelectedSemester={setSelectedSemester} subjectList={semester}/>
                </div>
            )
        })
    }


    const handleAddSemester = () => {
        dispatch(addSemester())
    }

    return (
        <div>
            <AddSubjectToSemesterModal type={"create"} selectedSemester={selectedSemester} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
            <div>
                <Button onClick={handleAddSemester}>Add Semester</Button>
                {(remainning && semesterSubjectList.some((subject) => subject.semester === null)) ? <span style={{ color: "red", marginLeft: 10}}>**{SUBJECT_STILL_REMAIN}</span> : ""}
                
            </div>
            {renderSemester()}
        </div>
    )
}

export default SemesterList