import React, { useEffect, useRef, useState } from 'react';
import { Modal, Divider, Radio, Table, Input, Space, Button, Row, Col } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { addSubjectsToSemester } from '../../../redux/CreateBootcamp/createBootCamp';


 
const AddSubjectToSemesterModal = ({isModalOpen,setIsModalOpen,selectedSemester}) => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
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

    const rowSelection = {
        selectedRowKeys: selectedRowKeys,
        onSelectAll: (selected, selectedRows, changeRows) => {
          if (selectedRowKeys.length !== 0) {
            setSelectedRowKeys([]);
          }
        },
        onChange: (selectedRowKeys, selectedRows) => {
          setSelectedRowKeys(selectedRowKeys);
        }
      };

      const columns = [
        {
            title: 'Subject Code',
            dataIndex: 'subjectCode',
            key: 'subjectCode',
            width: '15%',
            ...getColumnSearchProps('subjectCode'),
        },
        {
            title: 'Subject Name',
            dataIndex: 'name',
            key: 'name',
            width: '20%',
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Credits',
            dataIndex: 'credits',
            key: 'credits',
            width: '5%',

        },
       
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description'
        },

        
    ];

    const dispatch = useDispatch()
    const {semesterSubjectList,allowcateFields} = useSelector(store => store.createBootCamp)
    const [data,setData] = useState([])

    const getData = () => {
        const tempSubjectList = []
        semesterSubjectList.forEach((subject,index) => {
            if(subject.semester === null){
                tempSubjectList.push({
                    ...allowcateFields[subject.fieldIndex].subjectList[subject.subjectIndex],
                    key:index
                })
            }
        })
     
        return tempSubjectList
    }
    const handleCancel = () => {
        setIsModalOpen(false);
        setSelectedRowKeys([])
    };

    const handleOk = () => {
        dispatch(addSubjectsToSemester({
            subjectIndexArr: selectedRowKeys,
            semester: selectedSemester
        }))
        setIsModalOpen(false);
        setSelectedRowKeys([])
    }

    useEffect(() => {
        setData(getData())
    },[semesterSubjectList])

      return (
        <>
          <Modal width={1000} title={`Add Subject to Semester ${selectedSemester}`} open={isModalOpen} onCancel={handleCancel} onOk={handleOk}>
          <div>
         
    
          <Divider />
    
          <Table
            rowSelection={{
              type: "checkbox",
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

export default AddSubjectToSemesterModal