import {
    EditableProTable,
    ProCard,
    ProForm,
    ProFormDependency,
    ProFormDigit,
} from '@ant-design/pro-components';
import { Button, Input, Space, Table, Tag } from 'antd';
import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';

const SubjectDisplayTable = ({type,fieldName,fieldIndex,subjectList, totalCredits}) => {
  const formRef = useRef();
  const actionRef = useRef();

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

  const columns = [
    {
      title: 'Subject Name',
      dataIndex: 'name',
      valueType: 'name',
      width:"20%",
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Type',
      key: 'isCompulsory',
      dataIndex: 'isCompulsory',
      editable:false,
      width:"10%",
      render: (value) => {
        return <Tag color={value ? 'volcano' : 'green'}>{value ? "Compulsory" : "Elective"}</Tag>
      }
    },
    {
      title: 'Credits',
      dataIndex: 'credits',
      valueType: 'digit',
      fieldProps:{
        placeholder:"Credits"
      },
      width:"8%"
    },
    {
      title: 'Description',
      dataIndex: 'description',
      valueType: 'textarea',
      fieldProps:{
        placeholder:"Description"
      },
    },
   
    {
      title: '',
      valueType: 'option',
      width: "5%",
      render: (_, row) => [
        
        <a
          key="edit"
          onClick={() => {
            actionRef.current?.startEditable(row.id);
          }}
        >
          Edit
        </a>,
       
      ],
    },
  ];

    return (
        <ProCard collapsible title={<span style={{fontWeight:"bold", fontSize:25}}>{fieldName}</span>} bordered style={{marginTop:18}}>
      <div
        style={{
          margin: 'auto',
        }}
      >
        <ProForm
           
          formRef={formRef}
          initialValues={{
            table:subjectList
          }}
          submitter={false}
        >
          <ProFormDependency name={['table']}>
            {({ table }) => {
              const info = table.reduce(
                (pre, item) => {
                  return {
                    totalSubjectCredits:
                      pre.totalSubjectCredits + item?.credits
                  };
                },
                { totalSubjectCredits: 0},
              );
              return (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    paddingBlockEnd: 16,
                  }}
                >
                  <div style={{ flex: 1 }}>Allowcated Credits: {totalCredits}</div>
                  <div style={{ flex: 1 }}>Total Subject Credits: {info.totalSubjectCredits}</div>
                  <div style={{ flex: 2, display:"flex",justifyContent:"flex-end" }}>
                    <Button type='primary'>Add Subject</Button>
                  </div>
                </div>
              );
            }}
          </ProFormDependency>
          <Table columns={columns} dataSource={subjectList} />
        </ProForm>
      </div>
    </ProCard>
    )
}

export default SubjectDisplayTable