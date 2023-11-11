
import { DragSortTable } from '@ant-design/pro-components';
import { message } from 'antd';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { dragSortSemester } from '../../redux/subject/subject';

const columns = [
  {
    title: '',
    dataIndex: 'sort',
    width: "3%",
    className: 'drag-visible',
  },
  {
    title: '',
    dataIndex: 'component',
    className: 'drag-visible',

  },
  
];


const DraggableSemesterTable = ({semesterCardList}) => {
  const dispatch = useDispatch()
  const { viewedSemesterList, viewedSemesterSubjectList } = useSelector(store => store.subject)
    const handleDragSortEnd = (
      beforeIndex,
    ) => {
      let newSemesterList = []
      let changedSubjectSemesterIndexList = null
      newSemesterList = beforeIndex.map((item) => {
        return viewedSemesterList[item.index]
      })
      newSemesterList = newSemesterList.map((subjectList,index) => {
        let beforeIndex = -1
        let afterIndex = -1
        const a = subjectList.map((subject) => {
          if(subject.semester !== index){
            beforeIndex = subject.semester
            afterIndex = index
            return {
              ...subject,
              semester: index
            }
          }else return subject
        })
        if(beforeIndex !== -1 && afterIndex !== -1){
          if(changedSubjectSemesterIndexList === null){
            changedSubjectSemesterIndexList = {
              [beforeIndex]: afterIndex
            }
          }else changedSubjectSemesterIndexList = {
            ...changedSubjectSemesterIndexList,
            [beforeIndex]: afterIndex
          }
        }
        return a
      })
      let newViewedSemesterSubjectList = [...viewedSemesterSubjectList]
      newViewedSemesterSubjectList = newViewedSemesterSubjectList.map((subject) => {
        if(changedSubjectSemesterIndexList[subject.semester] !== undefined){
          return {
            ...subject,
            semester: changedSubjectSemesterIndexList[subject.semester]
          }
        }
        return subject
      })
      dispatch(dragSortSemester({newSemesterList,newViewedSemesterSubjectList}))
      message.success('Change semester Success');
    };
  
    return (
      <DragSortTable
        style={{marginTop:20}}
        search={false}
        showHeader={false}
        options={false}
        columns={columns}
        rowKey="key"
        pagination={false}
        dataSource={semesterCardList}
        dragSortKey="sort"
        onDragSortEnd={handleDragSortEnd}
      />
    );
}

export default DraggableSemesterTable