import React, { useEffect, useState } from 'react';
import { Button, Drawer, Space } from 'antd';
import CheckingSemesterList from './CheckingSemesterList';
import { ProCard } from '@ant-design/pro-components';
import { useDispatch, useSelector } from 'react-redux';
import { initCheckSubjectList } from '../../redux/subject/subject';
import { updateAllowcate } from '../../redux/allocate/allowcate';
import { getBootcampsForTrackingByUserID, updateBootcamp } from '../../redux/bootcamp/bootcamp';
import { updateLoading } from '../../redux/loading/Loading';

const BootcampSemesterDrawer = ({ open, onClose, data, resetDrawerData }) => {
    const { viewedMajor } = useSelector(store => store.major)
    const { checkSubjectList } = useSelector(store => store.subject)
    const [subjectData, setSubjectData] = useState([])
    const [loading,setLoading] = useState(false)
    const dispatch = useDispatch()
    const generateData = () => {
        const { semesterList, allocation } = data
        let tempCheckSubjectList = []
     
        const a =  semesterList.map((semester, index) => {
            let checkedKeyList = []
            let subjectList = []
            let checkedRowList = []
            let branchMajorList = []
            branchMajorList = viewedMajor.branchMajor.map((branch, index) => {
                return {
                    ...branch,
                    key: branch._id,
                    isBranch: true,
                    isGroup: false,
                    children: []
                }
            })
            semester.subjectList.forEach((subject, sindex) => {
                let check = false
                if (semester.trackingList.includes(subject._id)) {
                    check = true
                }
                const newSubject = {
                    ...subject,
                    semester: index,
                    subjectIndex: sindex,
                    isBranch: false,
                    isGroup: false,
                    check,
                    key: subject._id
                }
                if(newSubject.check){
                    checkedKeyList.push(subject._id)
                    checkedRowList.push(newSubject)
                }
                if (subject.branchMajor !== undefined) {
                    if (subject.branchMajor !== null) {

                        const branchMajorIndex = branchMajorList.findIndex(branchMajor => branchMajor._id === subject.branchMajor)
                        if (branchMajorIndex !== -1) {
                            branchMajorList[branchMajorIndex].children.push(newSubject)
                            tempCheckSubjectList.push(newSubject)
                            return
                        }
                    }
                }
                tempCheckSubjectList.push(newSubject)
                subjectList.push(newSubject)
            })
            allocation.detail.forEach((field, fIndex) => {
                field.electiveSubjectList.forEach((group, gIndex) => {
                    if (group.semester === index) {
                        let newGroup = {
                            name: `${field.name} ${gIndex + 1}`,
                            isCompulsory: false,
                            credit: group.credit,
                            isBranch: false,
                            isGroup: true,
                            branchMajor: group.branchMajor?._id ? group.branchMajor._id : group.branchMajor,
                            semester: group.semester,
                            fieldIndex: fIndex,
                            groupIndex: gIndex,
                            check: group.tracking ,
                            key:`group-${fIndex}-${gIndex}`
                        }
                        if(newGroup.check){
                            checkedRowList.push(newGroup)
                            checkedKeyList.push(newGroup.key)
                        }
                        if (group.branchMajor !== undefined) {
                            if (group.branchMajor !== null) {
        
                                const branchMajorIndex = branchMajorList.findIndex(branchMajor => branchMajor._id === group.branchMajor)
                                if (branchMajorIndex !== -1) {
                                    branchMajorList[branchMajorIndex].children.push(newGroup)
                                    tempCheckSubjectList.push(newGroup)
                                    return
                                }
                            }
                        }
                        tempCheckSubjectList.push(newGroup)
                        subjectList.push(newGroup)
                    }
                })
            })
            subjectList = [...branchMajorList,...subjectList]


            return <ProCard title={<h2>{`Semester ${index + 1}`}</h2>} key={index} collapsible>
                <CheckingSemesterList subjectList={subjectList} checkedKeyList={checkedKeyList} checkedRowList={checkedRowList}/>
            </ProCard>
        })
        // dispatch(initCheckSubjectList(tempCheckSubjectList))
        return a
    }

    const generateTrackingDataData = () => {
        const { semesterList, allocation } = data
        let tempCheckSubjectList = []
     
        semesterList.forEach((semester, index) => {
            let checkedKeyList = []
            let checkedRowList = []
            let subjectList = []
            let branchMajorList = []
            branchMajorList = viewedMajor.branchMajor.map((branch) => {
                return {
                    ...branch,
                    key: branch._id,
                    isBranch: true,
                    isGroup: false,
                    children: []
                }
            })
            semester.subjectList.forEach((subject, sindex) => {
                let check = false
                if (semester.trackingList.includes(subject._id)) {
                  
                    check = true
                }
                const newSubject = {
                    ...subject,
                    semester: index,
                    subjectIndex: sindex,
                    isBranch: false,
                    isGroup: false,
                    check,
                    key: subject._id
                }
                if(newSubject.check){
                    checkedKeyList.push(subject._id)
                    checkedRowList.push(newSubject)
                }
                if (subject.branchMajor !== undefined) {
                    if (subject.branchMajor !== null) {

                        const branchMajorIndex = branchMajorList.findIndex(branchMajor => branchMajor._id === subject.branchMajor)
                        if (branchMajorIndex !== -1) {
                            branchMajorList[branchMajorIndex].children.push(newSubject)
                            tempCheckSubjectList.push(newSubject)
                            return
                        }
                    }
                }
                tempCheckSubjectList.push(newSubject)
                subjectList.push(newSubject)
            })
            allocation.detail.forEach((field, fIndex) => {
                field.electiveSubjectList.forEach((group, gIndex) => {
                    if (group.semester === index) {
                        let newGroup = {
                            name: `${field.name} ${gIndex + 1}`,
                            isCompulsory: false,
                            credit: group.credit,
                            isBranch: false,
                            isGroup: true,
                            branchMajor: group.branchMajor?._id ? group.branchMajor._id : group.branchMajor,
                            semester: group.semester,
                            fieldIndex: fIndex,
                            groupIndex: gIndex,
                            check: group.tracking ,
                            key:`group-${fIndex}-${gIndex}`
                        }
                        if(newGroup.check){
                            checkedKeyList.push(newGroup.key)
                            checkedRowList.push(newGroup)
                        }
                        if (group.branchMajor !== undefined) {
                            if (group.branchMajor !== null) {
        
                                const branchMajorIndex = branchMajorList.findIndex(branchMajor => branchMajor._id === group.branchMajor)
                                if (branchMajorIndex !== -1) {
                                    branchMajorList[branchMajorIndex].children.push(newGroup)
                                    tempCheckSubjectList.push(newGroup)
                                    return
                                }
                            }
                        }
                        tempCheckSubjectList.push(newGroup)
                        subjectList.push(newGroup)
                    }
                })
            })
            subjectList = [...branchMajorList,...subjectList]

        })
        dispatch(initCheckSubjectList(tempCheckSubjectList))
      
    }
    useEffect(() => {
        if(open){
            generateTrackingDataData()
            setSubjectData(generateData)
        }
        
    },[open])

    const saveTracking = async () => {
        dispatch(updateLoading(true))
        setLoading(true)
        const { semesterList, allocation } = data
        let newAllowcation = JSON.stringify(allocation)
        newAllowcation = JSON.parse(newAllowcation)
        let newSemesterList =  JSON.stringify(semesterList)
        newSemesterList =  JSON.parse(newSemesterList)
       
        checkSubjectList.forEach((subject) => {
            if(subject.isBranch === false) {
                
                if(subject.isGroup){
                    newAllowcation.detail[subject.fieldIndex].electiveSubjectList[subject.groupIndex].tracking = subject.check
                }else{
                    const trackingSubjectIndex = newSemesterList[subject.semester].trackingList.findIndex(subjectId => subjectId === subject._id)
                    if(subject.check){
                        if(trackingSubjectIndex === -1){
                            newSemesterList[subject.semester].trackingList.push(subject._id)
                        }
                    }else {
                        if(trackingSubjectIndex !== -1){
                            newSemesterList[subject.semester].trackingList.splice(trackingSubjectIndex, 1)
                        }
                    }
                }
            }
        })

        const fieldData = {
            "detail": newAllowcation.detail
          }
        const bootcampData = {
            "detail": newSemesterList
        }
        await dispatch(updateAllowcate({allowcateId:newAllowcation._id, fieldData}))
        await dispatch(updateBootcamp({bootcampID:data.bootcampId,bootcampData }))
        await dispatch(getBootcampsForTrackingByUserID())
        resetDrawerData()
        onClose()
        setLoading(false)
        dispatch(updateLoading(false))
    }
    return (
        <Drawer width={'50%'} title="Basic Drawer" placement="right" onClose={onClose} open={open}  extra={
            <Space>
              <Button  onClick={() => {
                onClose()
                resetDrawerData()
                }}>Cancel</Button>
              <Button loading={loading} type="primary" onClick={saveTracking}>
                Save
              </Button>
            </Space>
          }>
            {subjectData}
            {/* <CheckingSemesterList/> */}
        </Drawer>
    )
}

export default BootcampSemesterDrawer