import { Table } from 'antd'
import React from 'react'
import { useSelector } from 'react-redux'
import { AutogenAllSubjectCode } from '../../util/AutogenSubjectCode/autogenSubjectCode'

const SemesterViewOnly = ({compareData, isMain}) => {
    const { viewedSemesterList } = useSelector(store => store.subject)
    const { viewedAllowcatedFields } = useSelector(store => store.allowcate)
    const { viewedMajor } = useSelector(store => store.major)
    const columns = [
        {
            title: '',
            dataIndex: '',
            key: '',
            width:"2%",
            align:'center'
          },
        {
          title: 'No',
          dataIndex: '',
          key: '',
          width:"5%",
          render: (text,data,index) => {
            if(data.branchMajor === null) return (index + 1)
            
          },
          align:'center',
        },
        {
          title: 'Course ID',
          dataIndex: 'subjectCode',
          key: 'subjectCode',
          width:"20%",
          render:(text,row,b) => {
            if(row.isAutoCreateCode){
              if(row.semester !== undefined){
                  return AutogenAllSubjectCode(row,b)
              }
            } else return text
        }
        },
        {
          title: 'Course Name',
          dataIndex: 'name',
          key: 'name',
          render: (text,data,index) => {
            if(data.isBranch) return <span style={{fontWeight:"bold"}}>{text}</span>
            else return text
          }
        },
        {
            title: 'Credits',
            dataIndex: 'credits',
            key: 'credits',
            width:"5%",
            align:'center'
          },
          {
            title: 'Prerequisite',
            dataIndex: '',
            key: '',
            width:"10%",
            align:'center'
          },
      ];

    const getSemesterData = () => {
      let renderAllowcate = []
      let renderSemester = []
      if(compareData && !isMain){
        renderSemester = compareData.semesterList
        renderAllowcate = compareData.allowcateFields
      }else {
        renderAllowcate = viewedAllowcatedFields
        renderSemester = viewedSemesterList
      }
        return renderSemester.map((semester, index) => {
            let subjectList = []
            let subjectBranchMajorList = []

            semester.forEach((subject, sindex) => {
                const subjectData = renderAllowcate[subject.fieldIndex].subjectList[subject.subjectIndex]
                if (subjectData.branchMajor === undefined || subjectData.branchMajor === null) {
                    subjectList.push({
                            ...subjectData,
                            fieldIndex: subject.fieldIndex,
                            subjectIndex: subject.subjectIndex,
                            isBranch: false,
                            isGroup: false,
                            key: sindex
                        })
                }
                if(subjectData.branchMajor !== undefined){
                    if(subjectData.branchMajor !== null){
                        subjectBranchMajorList.push({
                            ...subjectData,
                            fieldIndex: subject.fieldIndex,
                            subjectIndex: subject.subjectIndex,
                            isBranch: false,
                            isGroup: false,
                            key: sindex
                        })
                    }
                }
            })
            renderAllowcate.forEach((field, fIndex) => {
                field.electiveSubjectList.forEach((group, gIndex) => {
                    if (group.semester === index) {

                        subjectList.unshift({
                            name: (() => {
                              if(field.isElectiveNameBaseOnBigField){
                                  let smallFieldGroupList = field.electiveSubjectList.map((ggroup,index) => {
                                      return {
                                          ...ggroup,
                                          index
                                      }
                                  })
                                  smallFieldGroupList = smallFieldGroupList.filter(ggroup => ggroup.allocateChildId === group.allocateChildId)
                                  let keyIndex = smallFieldGroupList.findIndex(ggroup => ggroup.index === gIndex)
                                  return `${field.smallField[group.allocateChildId].fieldName} ${keyIndex + 1}`
                              }
                              return `${field?.fieldName} ${gIndex + 1}`
                          })(),
                            isCompulsory: false,
                            credits: group.credit,
                            isBranch: false,
                            isGroup: true,
                            branchMajor: group.branchMajor?._id ? group.branchMajor._id : group.branchMajor,
                            semester: group.semester,
                            fieldIndex: fIndex,
                            groupIndex: gIndex,
                        })
                    }
                })
            })
            if(subjectBranchMajorList.length > 0)
                viewedMajor.branchMajor?.forEach((branch, index) => {
                    subjectList.unshift({
                        ...branch,
                        key: branch._id,
                        branchMajor:null,
                        isBranch: true,
                        isGroup: false,
                        children: subjectBranchMajorList.filter((branchSubject) => branchSubject.branchMajor === branch._id)
                    })
                })
            return (
                <div style={{marginBottom:30}}>
                    <span style={{fontWeight:"bold", fontSize:20}}>Semester {index + 1}</span>
                    <Table columns={columns} dataSource={subjectList} bordered pagination={false}/>
                </div>
            )
        })
        
    }
   
  return (
    <div  style={{ width: compareData ? '100%' : '80%', marginInline: "auto" }}>
    {getSemesterData()}
    </div>
    // <Table columns={columns} dataSource={viewedAllowcatedFields} bordered/>
  )
}

export default SemesterViewOnly