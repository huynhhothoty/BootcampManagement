import React, { useEffect, useState } from 'react'
import Semester from './Semester'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Descriptions, InputNumber, Popconfirm } from 'antd'
import AddSubjectToSemesterModal from '../SubjectModal/AddSubjectToSemesterModal'
import { addSemester, editGroup, removeSubjectFromSemester, updateBranchMajorSemester } from '../../../redux/CreateBootcamp/createBootCamp'
import { SUBJECT_STILL_REMAIN } from '../../../util/constants/errorMessage'

const SemesterList = ({ planningError, remainning, confirmModal }) => {
    const dispatch = useDispatch()
    const { semesterSubjectList, semesterList, branchMajorSemester, allowcateFields} = useSelector(store => store.createBootCamp)
    const [startBranchMajor, setStartBranchMajor] = useState(branchMajorSemester + 1)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedSemester, setSelectedSemester] = useState(0)
    const renderSemester = () => {
        return semesterList.map((semester, index) => {
            let error = false
            if (planningError.length > 0) {
                if (planningError.includes(index)) {
                    error = true
                }
            }
            return (
                <div key={index} style={{ marginTop: 20 }}>
                    <Semester confirmModal={confirmModal} error={error} totalSemester={semesterList.length} semesterIndex={index} setIsModalOpen={setIsModalOpen} setSelectedSemester={setSelectedSemester} subjectList={semester} />
                </div>
            )
        })
    }


    const handleAddSemester = () => {
        dispatch(addSemester())
    }

    useEffect(() => {
        setStartBranchMajor(branchMajorSemester + 1)
    }, [branchMajorSemester])

    return (
        <div>
            <AddSubjectToSemesterModal type={"create"} selectedSemester={selectedSemester} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
            <div>
                <div style={{display:'flex', justifyContent:'space-between'}}>
                    <Button onClick={handleAddSemester}>Add Semester</Button>
                    <div style={{display:'flex', alignItems:'center'}}>
                        <Descriptions style={{width: 300}} items={[{
                            key: '1',
                            label: 'Apply Specialization from semester',
                            children: branchMajorSemester + 1,
                            style: {
                                paddingBottom: 0
                            }
                        }]}/>
                        <Popconfirm
                            title='Semester'
                            onOpenChange={() => setStartBranchMajor(branchMajorSemester + 1)}
                            description={
                                <InputNumber
                                    value={startBranchMajor}
                                    min={0}
                                    max={semesterList.length}
                                    onChange={(value) => setStartBranchMajor(value)}
                                />
                            }
                            onConfirm={() => {
                                if(branchMajorSemester < startBranchMajor - 1) {
                                    allowcateFields.forEach((field,fIndex) => {
                                        field.subjectList.forEach(subject => {
                                            if(subject.name === 'Programming for Mobile Devices')
                                          if(subject.semester >= branchMajorSemester  && subject.semester < startBranchMajor - 1 && subject.branchMajor !== null) {
                                            let subjectSemesterIndex = semesterList[subject.semester].findIndex(semesterSubject => semesterSubject._id === subject._id)
                                 
                                            dispatch(
                                                removeSubjectFromSemester({
                                                    subjestIndex: subjectSemesterIndex,
                                                    semesterIndex: subject.semester,
                                                    semesterSubjectListIndex:semesterList[subject.semester][subjectSemesterIndex].semesterSubjectListIndex,
                                                })
                                            );
                                          }
                                        })
                                        field.electiveSubjectList.forEach((electiveSubject,groupIndex) => {
                                            if(electiveSubject.semester >= branchMajorSemester  && electiveSubject.semester < startBranchMajor - 1 && electiveSubject.branchMajor !== null) {
                                                const groupData = {
                                                    credit: electiveSubject.credit,
                                                    semester: null,
                                                    branchMajor: null,
                                                };
                                                dispatch(
                                                    editGroup({
                                                        fieldIndex: fIndex,
                                                        groupData,
                                                        groupIndex: groupIndex,
                                                    })
                                                );
                                            }
                                        })
                                    })
                                  }
                                dispatch(updateBranchMajorSemester({oldData: branchMajorSemester, newData: startBranchMajor - 1}))
                                
                            }}
                            onCancel={() => setStartBranchMajor(0)}
                            okText='Set'
                            cancelText='Cancel'
                        >
                        <Button type='primary'>Change</Button>
                        </Popconfirm>
                    </div>
                </div>

                {(remainning && semesterSubjectList.some((subject) => subject.semester === null)) ? <span style={{ color: "red", marginLeft: 10 }}>**{SUBJECT_STILL_REMAIN}</span> : ""}

            </div>
            {renderSemester()}
        </div>
    )
}

export default SemesterList