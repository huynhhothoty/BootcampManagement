import { ProCard, ProDescriptions } from '@ant-design/pro-components';
import { Button, Divider, Input, Tooltip } from 'antd';
import { useRef, useState } from 'react';
import { WarningOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import AllowcateDisplay from './AllowcateDisplay';
import BigFieldDisplay from './BigFieldDisplay';
import SubjectDisplayTable from './SubjectDisplayTable';
import SemesterTableDisplay from './SemesterTableDisplay';
import { addBigFieldToViewedFields, getAllowcatById, updateAllowcate, updateViewedAllocatedField } from '../../redux/allocate/allowcate';
import { addSemesterToViewedSemesterList, updateSubject, updateViewedSemesterList, updateViewedSemesterSubjectLis, updateViewedSubjectList } from '../../redux/subject/subject';
import AddSubjectToSemesterModal from '../CreateBootcamp/SubjectModal/AddSubjectToSemesterModal';
import { validateBootcampData } from '../../util/ValidateBootcamp/validateBootcampData';
import { updateBootcamp, updateViewedBootcamp, updateViewedBootcampName, updateViewedBootcampTotalCredits } from '../../redux/bootcamp/bootcamp';
import { updateLoading } from '../../redux/loading/Loading';
import { NOT_CORRECT_CREDITS, NO_BOOTCAMP_NAME, NO_BOOTCAMP_TOTAL_CREDITS, SUBJECT_STILL_REMAIN, VIEW_NOT_EQUAL_TOTAL_CREDITS } from '../../util/constants/errorMessage';
import { NOTI_CREATE_BOOTCAMP_MISS_INFO, NOTI_ERROR, NOTI_ERROR_TITLE, NOTI_RESET_SUCCESS_INFO, NOTI_RESET_SUCCESS_TITLE, NOTI_SUCCESS, NOTI_SUCCESS_TITLE, NOTI_UPDATE_BOOTCAMP_MISS_INFO, NOTI_UPDATE_BOOTCAMP_SUCCESS } from '../../util/constants/notificationMessage';
import { createSubject } from '../../redux/CreateBootcamp/createBootCamp';
import { SUBJECT_ADDED_IMPORT, SUBJECT_EDITED } from '../../util/constants/subjectStatus';
import { useLocation } from 'react-router-dom';
import DraggableSemesterTable from './DraggableSemesterTable';
import { getMajorById, updateViewedMajor } from '../../redux/major/major';

const BootcampDetail = ({ confirmModal, openNotification }) => {
    const actionRef = useRef();
    const positionRef = useRef();
    const history = useLocation()
    const [scrollX, setScrollX] = useState(0)
    const dispatch = useDispatch()
    const { viewedBootcamp } = useSelector(store => store.bootcamp)
    const { viewedAllowcatedFields, viewedAllowcatedFieldsID } = useSelector(store => store.allowcate)
    const { importedSubjectsList } = useSelector(store => store.subject)
    const { viewedSemesterList, viewedSemesterSubjectList } = useSelector(store => store.subject)
    const { viewedMajor } = useSelector(store => store.major)
    const { userData } = useSelector(store => store.authentication)
    const [addBigFieldIndex, setAddBigFieldIndex] = useState(null)

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedSemester, setSelectedSemester] = useState(-1)

    const [errorMessage, setErrorMessage] = useState({
        bootcampName: false,
        totalCredits: false,
        allowcate: [],
        compulsory: [],
        elective: [],
        planning: [],
        electiveGroup: [],
        remainning: false,
        completeTotalCredits: false
    })

    const [isUpdated, setIsUpdated] = useState(false)
    const sumTotalAllowcatedCredits = () => {
        return viewedAllowcatedFields.reduce((accumulator, field) => {
            return accumulator + field.compulsoryCredits + field.electiveCredits
        }, 0)
    }
    const renderAllowcate = () => {
        return viewedAllowcatedFields.map((field, index) => {
            // if(index === viewedAllowcatedFields.length - 1)
            let error = null
            if (errorMessage.allowcate.length > 0) {
                if (errorMessage.allowcate[0].data) {
                    if (errorMessage.allowcate[0].data.errorFieldIndex.includes(index)) {
                        error = errorMessage.allowcate[0].data.errorField[index]
                    }
                }
            }
            return (<>
                <Divider />
                <BigFieldDisplay error={error} setIsUpdated={setIsUpdated} setScrollX={index === viewedAllowcatedFields.length - 1 ? setScrollX : null} addBigFieldIndex={addBigFieldIndex} setAddBigFieldIndex={setAddBigFieldIndex} field={field} key={index} index={index} confirmModal={confirmModal} />
            </>)
        })
    }
    const renderFieldSubject = (type) => {
        return viewedAllowcatedFields.map((field, index) => {
            if (type === "compulsory") {
                const subjectList = []
                let error = false
                if (errorMessage.compulsory.length > 0) {
                    if (errorMessage.compulsory.includes(index)) error = true
                }
                field.subjectList.forEach((subject, sindex) => {
                    if (subject?.isCompulsory === true) {
                        subjectList.push({ ...subject, fieldSubjectListIndex: sindex, id: subject._id })
                    }
                })
                return <SubjectDisplayTable error={error} setIsUpdated={setIsUpdated} confirmModal={confirmModal} key={index} fieldName={field.fieldName} fieldIndex={index} subjectList={subjectList} totalCredits={field.compulsoryCredits} type={type} />
            } else if (type === "elective") {
                const subjectList = []
                let error = false
                let groupError = false
                if (errorMessage.elective.length > 0) {
                    if (errorMessage.elective.includes(index)) error = true
                }
                if(errorMessage.electiveGroup.length > 0){
                    if (errorMessage.electiveGroup.includes(index)) groupError = true
                }
                field.subjectList.forEach((subject, sindex) => {
                    if (subject?.isCompulsory === false) {
                        subjectList.push({ ...subject, fieldSubjectListIndex: sindex, id: subject._id })
                    }
                })
               
                return <SubjectDisplayTable groupError={groupError} electiveSubjectList={field.electiveSubjectList} error={error} setIsUpdated={setIsUpdated} confirmModal={confirmModal} key={index} fieldName={field.fieldName} fieldIndex={index} subjectList={subjectList} totalCredits={field.electiveCredits} type={type} />
            }
        })
    }

    const renderSemester = () => {
        const semesterCardList = viewedSemesterList.map((semester, index) => {
            let subjectList = []
            
           
 
            subjectList = semester.map((subject, sindex) => {
                return {
                    ...viewedAllowcatedFields[subject.fieldIndex].subjectList[subject.subjectIndex],
                    fieldIndex: subject.fieldIndex,
                    subjectIndex: subject.subjectIndex,
                    isBranch: false,
                    isGroup: false,
                    key: sindex
                }
            })
            viewedAllowcatedFields.forEach((field,fIndex) => {
                field.electiveSubjectList.forEach((group,gIndex) => {
                    if(group.semester === index){
                        
                        subjectList.unshift({
                            name: `${field.fieldName} ${gIndex + 1}`,
                            isCompulsory: false,
                            credits: group.credit,
                            isBranch: false,
                            isGroup: true,
                            branchMajor: group.branchMajor?._id ? group.branchMajor._id : group.branchMajor,
                            semester:group.semester,
                            fieldIndex: fIndex,
                            groupIndex: gIndex,
                        })
                    }
                })
            })
            viewedMajor.branchMajor.forEach((branch,index) => {
                subjectList.unshift({
                    ...branch,
                    key: branch._id,
                    isBranch: true,
                    isGroup: false,
                })
            })
            return {
                component: <SemesterTableDisplay totalSemester={viewedSemesterList.length} setIsUpdated={setIsUpdated} setIsModalOpen={setIsModalOpen} setSelectedSemester={setSelectedSemester} confirmModal={confirmModal} key={index} semesterIndex={index} subjectList={subjectList} />,
                key: index,
                index
            }
        })
        return <DraggableSemesterTable semesterCardList={semesterCardList}/>
        
    }
    const handleSaveChange = async () => {
        dispatch(updateLoading(true))
        let tempErrorMessage = validateBootcampData(viewedBootcamp.bootcampName, viewedBootcamp.totalCredits, viewedAllowcatedFields, viewedSemesterList, viewedSemesterSubjectList, viewedBootcamp.completeTotalCredits)
        if (!tempErrorMessage.bootcampName && !tempErrorMessage.totalCredits && !tempErrorMessage.completeTotalCredits && tempErrorMessage.allowcate.length === 0 && tempErrorMessage.compulsory.length === 0 && tempErrorMessage.elective.length === 0 && tempErrorMessage.planning.length === 0 && tempErrorMessage.remainning === false && tempErrorMessage.electiveGroup.length === 0) {
            try {
                let newFieldList = []

                for (let i = 0; i < viewedAllowcatedFields.length; i++) {
                    const newSubjectList = []
                    for (let j = 0; j < viewedAllowcatedFields[i].subjectList.length; j++) {
                        if (viewedAllowcatedFields[i].subjectList[j]._id === null) {
                            let subjectData = {
                                "name": viewedAllowcatedFields[i].subjectList[j].name,
                                "subjectCode": viewedAllowcatedFields[i].subjectList[j].subjectCode,
                                "credit": viewedAllowcatedFields[i].subjectList[j].credits,
                                "isCompulsory": viewedAllowcatedFields[i].subjectList[j].isCompulsory,
                                "description": viewedAllowcatedFields[i].subjectList[j].description,
                                "branchMajor": viewedAllowcatedFields[i].subjectList[j].branchMajor !== undefined ? viewedAllowcatedFields[i].subjectList[j].branchMajor : null,
                                "type": "major"
                            }
                            const a = await dispatch(createSubject(subjectData))
                            newSubjectList.push(a.payload.data._id)
                        } else {
                            if (viewedAllowcatedFields[i].subjectList[j].status.includes(SUBJECT_EDITED)) {
                                const updatedData = {
                                    "name": viewedAllowcatedFields[i].subjectList[j].name,
                                    "subjectCode": viewedAllowcatedFields[i].subjectList[j].subjectCode,
                                    "credit": viewedAllowcatedFields[i].subjectList[j].credits,
                                    "description": viewedAllowcatedFields[i].subjectList[j].description,
                                }
                                const a = await dispatch(updateSubject({ subjectID: viewedAllowcatedFields[i].subjectList[j]._id, updatedData }))
                                newSubjectList.push(a.payload.data._id)
                            } else {
                                const subjectIndex = importedSubjectsList.findIndex(subject => subject._id === viewedAllowcatedFields[i].subjectList[j]._id)
                                if (subjectIndex !== -1) {
                                    const a = importedSubjectsList[subjectIndex]
                                    const b = viewedAllowcatedFields[i].subjectList[j]
                                    if ((a.name !== b.name) || (a.credit !== b.credits) || (a.subjectCode !== b.subjectCode) || (a.isCompulsory !== b.isCompulsory) || (a.description !== b.description)) {
                                        let subjectData = {
                                            "name": viewedAllowcatedFields[i].subjectList[j].name,
                                            "subjectCode": viewedAllowcatedFields[i].subjectList[j].subjectCode,
                                            "credit": viewedAllowcatedFields[i].subjectList[j].credits,
                                            "isCompulsory": viewedAllowcatedFields[i].subjectList[j].isCompulsory,
                                            "description": viewedAllowcatedFields[i].subjectList[j].description,
                                            "branchMajor": viewedAllowcatedFields[i].subjectList[j].branchMajor !== undefined ? viewedAllowcatedFields[i].subjectList[j].branchMajor : null,
                                            "type": "major"
                                        }
                                        const a = await dispatch(createSubject(subjectData))
                                        newSubjectList.push(a.payload.data._id)
                                    } else if ((a.name === b.name) && (a.credit === b.credits) && (a.subjectCode === b.subjectCode) && (a.isCompulsory === b.isCompulsory) && (a.description === b.description)) {
                                        newSubjectList.push(a._id)
                                    }
                                }
                                else newSubjectList.push(viewedAllowcatedFields[i].subjectList[j]._id)
                            }
                        }
                    }
                      newFieldList.push({
                        ...viewedAllowcatedFields[i],
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
                      "electiveSubjectList": field.electiveSubjectList,
                    }
                  })
                }
                
                const update_field_conatainer = await dispatch(updateAllowcate({allowcateId:viewedAllowcatedFieldsID, fieldData}))
                const bootcampData = {
                  "major": "651ea4fac9a4c12da715528f",
                  "author": userData.id,
                  "name": viewedBootcamp.bootcampName,
                  "year": 2023,
                  "totalCredit": viewedBootcamp.totalCredits,
                  "draft": false,
                  "allocation": update_field_conatainer.payload.data._id,
                  "detail": viewedSemesterList.map((semester, index) => {
                    return {
                      semester: `Semester ${index + 1}`,
                      subjectList: semester.map((subject) => {
                        return newFieldList[subject.fieldIndex].subjectList[subject.subjectIndex]
                      })
                    }
                  })
                }

                await dispatch(updateBootcamp({bootcampID:viewedBootcamp.id,bootcampData }))
                openNotification(NOTI_SUCCESS, NOTI_SUCCESS_TITLE, NOTI_UPDATE_BOOTCAMP_SUCCESS)
                dispatch(updateLoading(false))
                setIsUpdated(false)
                // dispatch(resetAll())

            } catch (e) {
                dispatch(updateLoading(false))
            }


        } else {
            dispatch(updateLoading(false))
            openNotification(NOTI_ERROR, NOTI_ERROR_TITLE, NOTI_UPDATE_BOOTCAMP_MISS_INFO)
        }
        setErrorMessage(tempErrorMessage)
    }

    const handleResetBootcamp = async (data) => {
        dispatch(updateLoading(true))
        let bootcampName = data.name
        let totalCredits = parseInt(data.totalCredit)
        let completeTotalCredits = data.totalCredit
        let allowcateFields = []
        let semesterSubjectList = []
        let semesterList = [[]]
        const tempAllowcateFields = await dispatch(getAllowcatById(data.allocation))
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
                        status:[SUBJECT_ADDED_IMPORT],
                        branchMajor: subject.branchMajor !== undefined ? subject.branchMajor !== null ? subject.branchMajor : null : null,
                        _id: subject._id
                    }
                    tempSubjectList.push(subject)
                    return a
                }),
                electiveSubjectList: field.electiveSubjectList
            }
        })

        semesterList = data.detail.map((semester, index) => {
            return semester.subjectList.map((subject) => {
                const semesterSubjectListIndex = semesterSubjectList.findIndex(sSubject => sSubject._id === subject)
                semesterSubjectList[semesterSubjectListIndex].semester = index
                const a = semesterSubjectList[semesterSubjectListIndex]
                return {
                    ...a,
                    semesterSubjectListIndex
                }
            })
        })
        dispatch(updateViewedAllocatedField({data:allowcateFields, id:data.allocation}))
        dispatch(updateViewedBootcamp({
            id: data._id,
            bootcampName,
            totalCredits,
            completeTotalCredits
        }))
        await dispatch(getMajorById(data.major))
        dispatch(updateViewedSubjectList(tempSubjectList))
        dispatch(updateViewedSemesterList(semesterList))
        dispatch(updateViewedSemesterSubjectLis(semesterSubjectList))
        dispatch(updateLoading(false))
        openNotification(NOTI_SUCCESS, NOTI_RESET_SUCCESS_TITLE, NOTI_RESET_SUCCESS_INFO)
    }
    return (
        <div>
            <AddSubjectToSemesterModal setIsUpdated={setIsUpdated} type={"view"} selectedSemester={selectedSemester} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
            <ProDescriptions
                actionRef={actionRef}

                // bordered
                dataSource={viewedBootcamp}
                editable={{
                    onSave: (updatedField, data) => {

                        if (updatedField === "bootcampName") {
                            dispatch(updateViewedBootcampName(data.bootcampName))
                        } else if (updatedField === "totalCredits") {
                            dispatch(updateViewedBootcampTotalCredits(parseInt(data.totalCredits)))
                        }
                        setIsUpdated(true)
                    }
                }}
                columns={[
                    {
                        title: 'Bootcamp Name',
                        key: 'bootcampName',
                        dataIndex: 'bootcampName',
                        ellipsis: true,
                        render: (a) => {
                            return <div style={{ display: 'flex', flexDirection: "column" }}>
                                {a}
                                {(errorMessage.bootcampName && viewedBootcamp.bootcampName === "") ?
                                    <span style={{ color: "red" }}>{NO_BOOTCAMP_NAME}</span>
                                    :
                                    <></>
                                }

                            </div>
                        },
                        fieldProps: {
                            placeholder: "Enter Bootcamp Name"
                        }
                    },
                    {
                        title: 'Total Credits',
                        key: 'totalCredits',
                        dataIndex: 'totalCredits',
                        ellipsis: true,
                        fieldProps: {
                            placeholder: "Enter Total Credits"
                        },
                        render: (a) => {
                            return <div style={{ display: 'flex', flexDirection: "column" }}>
                                {a}
                                {(errorMessage.totalCredits && viewedBootcamp.totalCredits <= 0) ?
                                    <span style={{ color: "red" }}>{NO_BOOTCAMP_TOTAL_CREDITS}</span>
                                    :
                                    <></>
                                }

                            </div>
                        }
                    },
                    {
                        title: 'Completed Total Credits',
                        key: 'completeTotalCredits',
                        dataIndex: 'completeTotalCredits',
                        render: (a) => {
                            return <div>
                                {a}
                                {(errorMessage.completeTotalCredits && viewedBootcamp.totalCredits !== viewedBootcamp.completeTotalCredits) ?
                                    <span>{VIEW_NOT_EQUAL_TOTAL_CREDITS}</span>
                                    :
                                    <></>
                                }

                            </div>
                        },
                        ellipsis: true,
                        editable: false,
                        contentStyle: {
                            color: viewedBootcamp.totalCredits !== viewedBootcamp.completeTotalCredits ? "red" : ""
                        }

                    },
                ]}
            >

            </ProDescriptions>
            <ProCard
                collapsible
                ref={positionRef}
                bodyStyle={{ paddingTop: 0, paddingBottom: 25 }}
                bordered
                hoverable
                title={<div>
                    Allowcate of Credits
                    {errorMessage.allowcate.length > 0 ? !errorMessage.allowcate[0].data ? <div style={{ color: "red" }}>{errorMessage.allowcate[0].message}<WarningOutlined style={{ color: "red", marginLeft: 10 }} /></div> : <WarningOutlined style={{ color: "red", marginLeft: 10 }} /> : ""}
                </div>
                }
                extra={
                    <div style={{ display: "flex" }}>
                        <span style={{ marginRight: 30, display: "flex", flexDirection: "column" }}>
                            <span >Total allowcated credits: <span style={{ fontWeight: "bold" }}>{sumTotalAllowcatedCredits()}</span></span>
                            {errorMessage.allowcate.length > 0 ? errorMessage.allowcate[0].data ? errorMessage.allowcate[0].data.isEqualTotalCredits === false ? <span style={{ color: "red" }}>**{NOT_CORRECT_CREDITS}</span> : "" : "" : ""}
                        </span>
                        <Button
                            type='primary'
                            onClick={() => {
                                dispatch(addBigFieldToViewedFields())
                                setAddBigFieldIndex(viewedAllowcatedFields.length)
                                if (scrollX > positionRef.current.offsetHeight) {
                                    window.scrollTo({
                                        top: positionRef.current.offsetHeight,
                                        behavior: "smooth"
                                    })
                                } else {
                                    window.scrollTo({
                                        top: scrollX,
                                        behavior: "smooth"
                                    })
                                }
                                setIsUpdated(true)

                            }}
                        >
                            Add Field
                        </Button>
                    </div>
                }
            >
                {renderAllowcate()}
            </ProCard>
            <ProCard subTitle={errorMessage.compulsory.length > 0 ? <WarningOutlined style={{ color: "red", marginLeft: 5 }} /> : ""} collapsible bodyStyle={{ paddingTop: 0, paddingBottom: 25 }} style={{ marginTop: 20 }} bordered hoverable title="Compulsory Subject">
                {renderFieldSubject("compulsory")}
            </ProCard>
            <ProCard subTitle={errorMessage.elective.length > 0 || errorMessage.electiveGroup.length > 0 ? <WarningOutlined style={{ color: "red", marginLeft: 5 }} /> : ""} collapsible bodyStyle={{ paddingTop: 0, paddingBottom: 25 }} style={{ marginTop: 20 }} bordered hoverable title="Elective Subject">
                {renderFieldSubject("elective")}
            </ProCard>
            <ProCard
                
                subTitle={<div>
                    {errorMessage.remainning || errorMessage.planning.length > 0 ? <WarningOutlined style={{ color: "red", marginLeft: 5 }} /> : ""}
                    {errorMessage.remainning ? <span style={{ color: "red", marginLeft: 5 }}>**{SUBJECT_STILL_REMAIN}</span> : ""}
                </div>}
                extra={<Button onClick={() => {
                    dispatch(addSemesterToViewedSemesterList())
                    setIsUpdated(true)
                }} type='primary'>Add Semester</Button>} collapsible bodyStyle={{ paddingTop: 0, paddingBottom: 25, paddingInline:0 }} style={{ marginTop: 20 }} bordered hoverable title="Semester Plan">
                {renderSemester()}
            </ProCard>
            <div style={{ marginTop: 30 }}>
                <Button disabled={isUpdated ? false : true} onClick={handleSaveChange} type='primary'>Save Change</Button>
                <Button onClick={() => {handleResetBootcamp(history.state.viewedBootcampData)}} style={{ marginLeft: 15 }}>Reset</Button>
            </div>
        </div>
    )
}

export default BootcampDetail