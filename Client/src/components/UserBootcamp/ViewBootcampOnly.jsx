import React, { useState } from 'react'
import { Button, Checkbox, Tabs, Typography } from 'antd';
import AllowcateTableViewOnly from './AllowcateTableViewOnly';
import CourseSubjectViewOnly from './CourseSubjectViewOnly';
import SemesterViewOnly from './SemesterViewOnly';
import ChooseBootcampModal from './ChooseBootcampModal';
import { ScrollSync, ScrollSyncPane } from 'react-scroll-sync';
import { useSelector } from 'react-redux';
const { Title } = Typography

const CompareView = ({ MainComponent, comparingData, anotherProps, isScrollTogether, mainBootcampName }) => {

  return <ScrollSync>
    <div style={{ display: 'flex', position: 'relative', gap: 15, height: '100%' }}>

      <ScrollSyncPane group={isScrollTogether ? null : 'main'}>


        <div style={{ overflow: 'auto', flexGrow: 1 }}>
          <Title level={5}>{mainBootcampName}</Title>
          <section style={{ maxHeight: 500 }}>
            <MainComponent compareData={comparingData} isMain={true} {...anotherProps} />
          </section>
        </div>


      </ScrollSyncPane>

      <ScrollSyncPane group={isScrollTogether ? null : 'second'}>


        <div style={{ overflow: 'auto', flexGrow: 1 }}>
          <Title level={5}>{comparingData.bootcampName}</Title>
          <section style={{ maxHeight: 500 }}>
            <MainComponent compareData={comparingData} isMain={false} {...anotherProps} />
          </section>
        </div>

      </ScrollSyncPane>
    </div>
  </ScrollSync>
}

const ViewBootcampOnly = () => {
  const [openModal, setOpenModal] = useState(false)
  const [comparingData, setComparingData] = useState(null)
  const [isScrollTogether, setIsScrollTogether] = useState(true)
  const { viewedBootcamp } = useSelector(store => store.bootcamp)
  const items = [
    {
      key: '1',
      label: 'Allocation of credits',
      children: comparingData ? <CompareView isScrollTogether={isScrollTogether} MainComponent={AllowcateTableViewOnly} comparingData={comparingData} mainBootcampName={viewedBootcamp.bootcampName} /> : <AllowcateTableViewOnly />,
      style: {
        height: '100%'
      }
    },
    {
      key: '2',
      label: 'Compulsory Course Subjects',
      children: comparingData ? <CompareView isScrollTogether={isScrollTogether} MainComponent={CourseSubjectViewOnly} comparingData={comparingData} anotherProps={{ isCompulsory: true }} mainBootcampName={viewedBootcamp.bootcampName} /> : <CourseSubjectViewOnly isCompulsory={true} />,
    },
    {
      key: '3',
      label: 'Elective Course Subjects',
      children: comparingData ? <CompareView isScrollTogether={isScrollTogether} MainComponent={CourseSubjectViewOnly} comparingData={comparingData} anotherProps={{ isCompulsory: false }} mainBootcampName={viewedBootcamp.bootcampName} /> : <CourseSubjectViewOnly isCompulsory={false} />,
    },
    {
      key: '4',
      label: 'Planning',
      children: comparingData ? <CompareView isScrollTogether={isScrollTogether} MainComponent={SemesterViewOnly} comparingData={comparingData} mainBootcampName={viewedBootcamp.bootcampName} /> : <SemesterViewOnly />,
    },
  ];

  const handleOpenModal = () => {
    setOpenModal(true)
  }
  const handleCloseModal = () => {
    setOpenModal(false)
  }

  const handleChoose = (data) => {
    setComparingData(data)
  }

  const handleStopCompare = () => {
    setComparingData(null)
    setIsScrollTogether(true)
  }
  return (
    <>
      <ChooseBootcampModal open={openModal} handleCancel={handleCloseModal} handleChoose={handleChoose} />
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        {comparingData ?
          <div style={{ display: "flex", gap: 20, alignItems: 'center' }}>
            <Button onClick={handleStopCompare} danger style={{}}>Stop Comparing</Button>
            <Checkbox onChange={(e) => {
              setIsScrollTogether(e.target.checked)
            }} defaultChecked>Scroll Together</Checkbox>
          </div> :
          <Button onClick={handleOpenModal} type='primary'>Compare Curriculum</Button>
        }
      </div>


      <Tabs defaultActiveKey="1" items={items} style={{ height: '85%' }} id={'viewBootcampTab'} />

    </>
  )
}

export default ViewBootcampOnly