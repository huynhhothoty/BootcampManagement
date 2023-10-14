import React, { useEffect, useState } from 'react'
import Semester from './Semester'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from 'antd'
import AddSubjectToSemesterModal from '../SubjectModal/AddSubjectToSemesterModal'
import { addSemester } from '../../../redux/CreateBootcamp/createBootCamp'

const SemesterList = () => {
    const dispatch = useDispatch()
    const { semesterSubjectList, semesterList } = useSelector(store => store.createBootCamp)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const [selectedSemester, setSelectedSemester] = useState(0)
    const renderSemester = () => {
        return semesterList.map((semester, index) => {
            return (
                <div key={index} style={{marginTop: 20}}>
                    <Semester semesterIndex={index} setIsModalOpen={setIsModalOpen} setSelectedSemester={setSelectedSemester} subjectList={semester}/>
                </div>
            )
        })
    }


    const handleAddSemester = () => {
        dispatch(addSemester())
    }
    return (
        <div>
            <AddSubjectToSemesterModal selectedSemester={selectedSemester} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
            <div>
                <Button onClick={handleAddSemester}>Add Semester</Button>
            </div>
            {renderSemester()}
        </div>
    )
}

export default SemesterList