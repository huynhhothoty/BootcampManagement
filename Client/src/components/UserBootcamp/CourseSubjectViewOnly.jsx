import { Table } from 'antd';
import React from 'react'
import { useSelector } from 'react-redux';

const CourseSubjectViewOnly = ({isCompulsory}) => {
    const { viewedAllowcatedFields } = useSelector(store => store.allowcate)
    const columns = [
        {
          title: 'No',
          dataIndex: 'name',
          key: 'name',
          width:"5%",
          render: (text,data,index) => (index + 1),
          align:'center'
        },
        {
          title: 'Course ID',
          dataIndex: 'subjectCode',
          key: 'subjectCode',
          width:"20%",
        },
        {
          title: 'Course Name',
          dataIndex: 'name',
          key: 'name',
        },
        {
            title: 'Credits',
            dataIndex: 'credits',
            key: 'credits',
            width:"5%",
            align:'center'
          },
      
      ];
     const getFieldSubjectList = () => {
        return viewedAllowcatedFields.map((field,index) => {
            let tempSubjectList = []
            tempSubjectList = field.subjectList.filter((subject) => subject.isCompulsory === isCompulsory)
            return (<div style={{marginBottom: 25}}>
                <span style={{fontWeight:"bold", fontSize:20}}>{index + 1}. {field.fieldName}</span>
                <Table style={{marginTop:10}} columns={columns} dataSource={tempSubjectList} bordered pagination={false}/>
            </div>)
        })
     }
  return (
    <div style={{ width: '80%', marginInline: "auto" }}>
        {getFieldSubjectList()}
    {/* <Table columns={columns} dataSource={viewedAllowcatedFields} bordered/> */}
    </div>
  )
}

export default CourseSubjectViewOnly