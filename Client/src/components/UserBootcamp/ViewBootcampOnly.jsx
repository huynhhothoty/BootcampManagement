import React from 'react'
import { Tabs } from 'antd';
import AllowcateTableViewOnly from './AllowcateTableViewOnly';
import CourseSubjectViewOnly from './CourseSubjectViewOnly';
import SemesterViewOnly from './SemesterViewOnly';

const onChange = (key) => {
   
  };
 
const ViewBootcampOnly = () => {

    const items = [
        {
          key: '1',
          label: 'Allocation of credits',
          children: <AllowcateTableViewOnly/>,
        },
        {
          key: '2',
          label: 'Compulsory Course Subjects',
          children: <CourseSubjectViewOnly isCompulsory={true}/>,
        },
        {
          key: '3',
          label: 'Elective Course Subjects',
          children: <CourseSubjectViewOnly isCompulsory={false}/>,
        },
        {
            key: '4',
            label: 'Planning',
            children: <SemesterViewOnly/>,
          },
      ];
  return (
    <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
  )
}

export default ViewBootcampOnly