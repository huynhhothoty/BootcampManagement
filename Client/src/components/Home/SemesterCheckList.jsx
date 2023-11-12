import React, { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space } from 'antd';
import SemesterCheckListTable from './SemesterCheckListTable';
import { useSelector } from 'react-redux';
const { Option } = Select;

const SemesterCheckList = ({ setOpen, open, drawerData }) => {
  const { viewedMajor } = useSelector(store => store.major)
  const [checkList, setCheckList] = useState([])
  const {
    semesterList,
    allocation
  } = drawerData
  const onClose = () => {
    setOpen(false);
  };

  const renderSemester = () => {

    const a = semesterList.map((semester, index) => {
      let subjectList = []


      subjectList = semester.subjectList.map((subject, sindex) => {
        const newSubject = {
          ...subject,
          isBranch: false,
          isGroup: false,
          key: subject._id,
          index: sindex
        }

        return newSubject
      })
      allocation.forEach((field, fIndex) => {
        field.electiveSubjectList.forEach((group, gIndex) => {
          if (group.semester === index) {
            const newGroup = {
              name: `${field.name} ${gIndex + 1}`,
              isCompulsory: false,
              credits: group.credit,
              isBranch: false,
              isGroup: true,
              branchMajor: group.branchMajor?._id ? group.branchMajor._id : group.branchMajor,
              semester: group.semester,
              fieldIndex: fIndex,
              groupIndex: gIndex,
              tracking: group.tracking,
              key: `group-${fIndex}-${gIndex}`
            }

            subjectList.unshift(newGroup)
          }
        })
      })
      viewedMajor.branchMajor.forEach((branch, index) => {
        subjectList.unshift({
          ...branch,
          key: branch._id,
          isBranch: true,
          isGroup: false,
        })
      })


      return (<SemesterCheckListTable checkList={checkList} setCheckList={setCheckList} subjectList={subjectList} semesterIndex={index} branchList={viewedMajor.branchMajor} />)
    })

    return a
  }
  useEffect(() => {
    let tempSubjectCheckList = []
    allocation.forEach((field, fIndex) => {
      field.electiveSubjectList.forEach((group, gIndex) => {
          const newGroup = {
            name: `${field.name} ${gIndex + 1}`,
            isCompulsory: false,
            credits: group.credit,
            isBranch: false,
            isGroup: true,
            branchMajor: group.branchMajor?._id ? group.branchMajor._id : group.branchMajor,
            semester: group.semester,
            fieldIndex: fIndex,
            groupIndex: gIndex,
            tracking: group.tracking,
            key: `group-${fIndex}-${gIndex}`
          }
          tempSubjectCheckList.push(newGroup)
      })
    })
    semesterList.forEach((semester, index) => {
      
      semester.subjectList.forEach((subject, sindex) => {
        let tracking = false
        if(semester.trackingList.includes(subject._id)) tracking = true
        const newSubject = {
          ...subject,
          isBranch: false,
          isGroup: false,
          key: subject._id,
          index: sindex,
          tracking
        }
        tempSubjectCheckList.push(newSubject)
      })




    })
    setCheckList(tempSubjectCheckList)
  }, [open])
  console.log(checkList)
  return (
    <>

      <Drawer
        title="Create a new account"
        width='50%'
        onClose={onClose}
        open={open}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={() => {
              console.log(checkList)
              onClose()
            }} type="primary">
              Submit
            </Button>
          </Space>
        }
      >
        {renderSemester()}
      </Drawer>
    </>
  );
}

export default SemesterCheckList