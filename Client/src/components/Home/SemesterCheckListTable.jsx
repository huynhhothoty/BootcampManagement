import { ProCard } from '@ant-design/pro-components'
import { Badge, Button, Dropdown, Input, Space, Table, Tag } from 'antd';
import React, { useEffect, useRef, useState } from 'react'
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { DeleteOutlined } from '@ant-design/icons';
import ExpandedBranchMajor from './ExpandedBranchMajor';

const SemesterCheckListTable = ({subjectList,semesterIndex,branchList,checkList,setCheckList}) => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRowss, setSelectedRows] = useState([]);
    const [selectedBranchList, setSelectedBranchList] = useState([])
    const [checkedSubjectBranch, setCheckedSubjectBranch] = useState(branchList.map(branch => {
        return {
            ...branch,
            checkedSubjectList: []
        }
    }))
    
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
                setSelectedRows([])
            }
        },
        onChange: (selectedRowKeys, selectedRows) => {
  
            let branchIDList = []
            selectedRows.forEach(row => {
                if(row.isBranch)
                    branchIDList.push(row.key)
                else{
                    const index = checkList.findIndex((trackingSubject) => trackingSubject.key === row.key)
                    if(selectedRowss.length < selectedRows.length){
                        if(index !== -1) checkList[index].tracking = true
                    }else if(selectedRowss.length > selectedRows.length){
                        if(index !== -1) checkList[index].tracking = false
                    }
                    setCheckList([...checkList])
                }
            })
            setSelectedBranchList(branchIDList)
            setSelectedRowKeys(selectedRowKeys);
            setSelectedRows(selectedRows)
        },
    };

    const expandedRowRender = (branch) => {
      return <ExpandedBranchMajor setCheckList={setCheckList} checkList={checkList} checkedSubjectBranch={checkedSubjectBranch} setCheckedSubjectBranch={setCheckedSubjectBranch} selectedBranchList={selectedBranchList} branch={branch} subjectList={subjectList}/>
    };
    const columns = [
      {
        title: 'Subject Code',
        dataIndex: 'subjectCode',
        key: 'subjectCode',
        width: '25%',
        ...getColumnSearchProps('subjectCode'),
      },
      {
        title: 'Subject Name',
        dataIndex: 'name',
        key: 'name',
        width: '40%',
        ...getColumnSearchProps('name'),
        render: (text,record) => {
          if (record.isBranch) {
            return  <span style={{fontWeight:"bold"}}>{text}</span>
          }
          return text
        }
      },
     
      {
        title: 'Type',
        dataIndex: 'isCompulsory',
        key: 'isCompulsory',
        width: '20%',
        render: (value, record) => {
          if (record.isBranch) {
            return ""
          }
          return <Tag color={value ? "volcano" : "green"}>{value ? "Compulsory" : "Elective"}</Tag>
        }
      },
      {
        title: 'Credits',
        dataIndex: 'credits',
        key: 'credits',
        width: '15%',
        ...getColumnSearchProps('credits'),
  
      },
    
  
     
    ];
   
    useEffect(() => {
        checkedSubjectBranch.forEach(branch => {
            if(branch.checkedSubjectList.length > 0){
                if(!selectedRowKeys.includes(branch._id)){
                    selectedRowKeys.push(branch._id)
                    setSelectedRowKeys([...selectedRowKeys])
                }
                // branch.checkedSubjectList.forEach(() => {

                // })
                // const index = checkList.findIndex((trackingSubject) => trackingSubject.key ===)
            }
        })
    },[checkedSubjectBranch])
  return (
    <ProCard style={{marginBottom: 20}} bodyStyle={{ paddingInline: 0 }} collapsible title={<span style={{ fontWeight: "bold", fontSize: 25 }}>{`Semester ${semesterIndex + 1}`}</span>} bordered>
        <Table expandable={{
          expandedRowRender,
          rowExpandable: record => record.branchCode !== undefined,
          defaultExpandAllRows:true
        }} rowSelection={{
            type: "checkbox",
            ...rowSelection,
        }} columns={columns} dataSource={subjectList.filter(subject => (subject.branchMajor === undefined || subject.branchMajor === null))} />
      </ProCard>
  )
}

export default SemesterCheckListTable