import React, { useEffect, useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table } from 'antd';
import Highlighter from 'react-highlight-words';
import { useDispatch } from 'react-redux';
import { queryAllDepartment } from '../../redux/major/major';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import DepartmentModal from '../../components/Department/DepartmentModal';


const AllDepartment = ({ selectedDepartment, isAddModal, handleAddDepartment }) => {
  const dispatch = useDispatch()

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const [data, setData] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const getTableData = async () => {
    const res = await dispatch(queryAllDepartment(''))
    let newData = res.payload.data
    newData = newData.map((department) => {
      return {
        ...department,
        children: department.list.map((child) => {
          return {
            ...child,
            key: child._id,
            isChild: true,
            root: department
          }
        }),
        key: department._id
      }
    })
    setData(newData)
  }

  const columns = [
    {
      title: 'Department Name',
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Department Code',
      dataIndex: 'code',
      key: 'code',
      width: '15%',
      align: 'center',
      ...getColumnSearchProps('code'),
    },
    
  ];

  const actionColumn = {
    title: 'Action',
    key: 'action',
    width: '13%',
    align: 'center',
    render: (_, rows) => {
      return (<div style={{ display: 'flex', justifyContent: "center", gap: 10 }}>
        <Button onClick={() => handleOpenModal(rows)} type='primary'>Edit</Button>
        {!rows.isChild ? <Button onClick={() => handleOpenModal({ ...rows, rootId: rows._id })}>Add</Button> : <></>}

      </div>)
    },

  }

  const [openModal, setOpentModal] = useState(false)
  const [modalData, setModalData] = useState(null)
  const [modalType, setModalType] = useState('add')

  const handleOpenModal = (data) => {
    if (data) {
      setModalData(data)
      if (data.rootId && !data.isChild) setModalType('add')
      else setModalType('edit')
    } else {
      setModalData(null)
      setModalType('add')
    }
    setOpentModal(true)
  }

  const handleCloseModal = () => {
    setOpentModal(false)
  }

  const onSelectChange = (newSelectedRowKeys, newSelectedRows) => {
    setSelectedRowKeys(newSelectedRowKeys);
    handleAddDepartment(newSelectedRows)
  };
  useEffect(() => {
    if (selectedDepartment) {
      setSelectedRowKeys(selectedDepartment)
      setSelectedRows([])
    }
  }, [selectedDepartment])

  useEffect(() => {
    getTableData()
  }, [])

  return <div style={{ display: 'flex', flexDirection: "column", gap: 10, }}>
    <DepartmentModal open={openModal} onClose={handleCloseModal} modalData={modalData} modalType={modalType} reloadTable={getTableData} />
    {!isAddModal ? <Button style={{ alignSelf: 'flex-end' }} icon={<PlusOutlined />} type='primary' onClick={() => handleOpenModal()}>Add Department</Button> : <></>}
    
    <Table
      rowSelection={isAddModal ? {
        selectedRowKeys,
        onChange: onSelectChange,
        getCheckboxProps: (record) => ({
          disabled: selectedDepartment.includes(record._id) || record.isChild,
          
          // Column configuration not to be checked
        })
      } : false}
      columns={isAddModal ? columns : [...columns,actionColumn]}
      dataSource={data}
      bordered
    />
  </div>;
}

export default AllDepartment
