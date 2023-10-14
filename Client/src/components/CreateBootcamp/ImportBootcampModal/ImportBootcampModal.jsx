import React, { useState } from 'react';
import { Modal, Divider, Radio, Table } from 'antd';

const columns = [
    {
      title: 'BootCamp Name',
      dataIndex: 'bootCampName',
    },
    {
      title: 'Specialist Subject Credits',
      dataIndex: 'specialistCredits',
    },
    {
      title: 'General Credits',
      dataIndex: 'generalCredits',
    },
  ];
  const data = [
    {
      key: '1',
      bootCampName: 'Bootcamp 2022',
      specialistCredits: 100,
      generalCredits: 30,
    },
    {
      key: '2',
      bootCampName: 'Bootcamp 2021',
      specialistCredits: 90,
      generalCredits: 20,
    },
    {
      key: '3',
      bootCampName: 'Bootcamp 2023',
      specialistCredits: 70,
      generalCredits: 20,
    },
    {
      key: '4',
      bootCampName: 'Bootcamp 2020',
      specialistCredits: 100,
      generalCredits: 20,
    },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User',
      // Column configuration not to be checked
      name: record.name,
    }),
  };

const ImportBootcampModal = ({isModalOpen, setIsModalOpen}) => {
 

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <Modal width={1000} title="Import a bootcamp" open={isModalOpen} onCancel={handleCancel}>
      <div>
     

      <Divider />

      <Table
        rowSelection={{
          type: "radio",
          ...rowSelection,
        }}
        columns={columns}
        dataSource={data}
      />
    </div>

      </Modal>
    </>
  )
}

export default ImportBootcampModal