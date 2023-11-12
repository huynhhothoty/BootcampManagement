import { ProCard } from '@ant-design/pro-components'
import { Badge, Button, Dropdown, Input, Space, Table, Tag } from 'antd';
import React, { useEffect, useRef, useState } from 'react'
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { DeleteOutlined } from '@ant-design/icons';

const ExpandedBranchMajor = ({ branch, subjectList, selectedBranchList, setCheckedSubjectBranch, checkedSubjectBranch, checkList, setCheckList }) => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
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
            const index = checkedSubjectBranch.findIndex((fbranch) => fbranch._id === branch._id)
            checkedSubjectBranch[index].checkedSubjectList = selectedRows
            setCheckedSubjectBranch([...checkedSubjectBranch])
            setSelectedRowKeys(selectedRowKeys);
            setSelectedRows(selectedRows)
        }
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
        },

        {
            title: 'Type',
            dataIndex: 'isCompulsory',
            key: 'isCompulsory',
            width: '20%',
            render: (value) => {
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
       


    ]
    const data = [];
    subjectList.forEach((subject) => {
        if (subject.branchMajor === branch._id) {
            data.push(subject)
        }
    })

    const markCheckedForSubjectInBranch = () => {
        let needMarkIdList = []
        if (selectedBranchList.length > 0)
            subjectList.forEach((subject) => {
                if (subject.branchMajor !== undefined) {
                    if (subject.branchMajor === branch._id) {
                        needMarkIdList.push(subject.key)
                    }
                }
            })
        return needMarkIdList
    }
    const markCheckedForSubjectInBranchRow = () => {
        let needMarkIdList = []
        if (selectedBranchList.length > 0)
            subjectList.forEach((subject) => {
                if (subject.branchMajor !== undefined) {
                    if (subject.branchMajor === branch._id) {
                        needMarkIdList.push(subject)
                    }
                }
            })
        return needMarkIdList
    }
    useEffect(() => {

        const index = checkedSubjectBranch.findIndex((fbranch) => fbranch._id === branch._id)
        if(checkedSubjectBranch[index].checkedSubjectList.length > markCheckedForSubjectInBranchRow().length) {
            checkedSubjectBranch[index].checkedSubjectList.forEach((subject) => {
                const index = checkList.findIndex((trackingSubject) => trackingSubject.key === subject.key)
                if(index !== -1) checkList[index].tracking = false
            })
        }
        else if(checkedSubjectBranch[index].checkedSubjectList.length < markCheckedForSubjectInBranchRow().length) {
            markCheckedForSubjectInBranchRow().forEach((subject) => {
                const index = checkList.findIndex((trackingSubject) => trackingSubject.key === subject.key)
                if(index !== -1) checkList[index].tracking = true
            })
        }
        setCheckList([...checkList])
        checkedSubjectBranch[index].checkedSubjectList = markCheckedForSubjectInBranchRow()
        setCheckedSubjectBranch([...checkedSubjectBranch])
        setSelectedRowKeys(markCheckedForSubjectInBranch())
        setSelectedRows(markCheckedForSubjectInBranchRow())
    }, [selectedBranchList])
    return (
        <Table rowSelection={{
            type: "checkbox",
            ...rowSelection,
        }} columns={columns} dataSource={data} pagination={false} />
    )
}

export default ExpandedBranchMajor