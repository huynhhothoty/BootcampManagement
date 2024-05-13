import React, { useEffect, useRef, useState } from 'react';
import { SearchOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table } from 'antd';
import Highlighter from 'react-highlight-words';
import BranchMajorDetailModal from './BranchMajorDetailModal';

const BranchMajorList = ({ branchList,handleChange }) => {
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


    const [modalOpen, setModalOpen] = useState(false)
    const [modalData, setModalData] = useState(null)
    const [modalType, setModalType] = useState('add')

    const handleOpenModal = (data) => {
        if (data) {
            setModalData(data)
            setModalType('edit')
        } else {
            setModalData(null)
            setModalType('add')
        }
        setModalOpen(true)
    }

    const handleCloseModal = () => {
        setModalData(null)
        setModalType('add')
        setModalOpen(false)
    }

   

    const columns = [
        {
            title: 'Specialization Name',
            dataIndex: 'name',
            key: 'name',
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Specialization Code',
            dataIndex: 'branchCode',
            key: 'code',
            width: '30%',
            align: 'center',
            ...getColumnSearchProps('code'),
        },
        {
            title: 'Action',
            key: 'action',
            width: '13%',
            align: 'center',
            render: (_, rows, index) => {
                return (<div style={{ display: 'flex', justifyContent: "center", gap: 10 }}>
                    <Button icon={<EditOutlined />} onClick={() => handleOpenModal({...rows,index})}/>
                    <Button danger icon={<DeleteOutlined />} />


                </div>)
            }
        },
    ];

    useEffect(() => {
        setData(branchList)
    }, [branchList])
    return (
        <>
            <BranchMajorDetailModal open={modalOpen} modalType={modalType} modalData={modalData} onClose={handleCloseModal} onSubmit={handleChange}/>
            <div style={{ display: 'flex', flexDirection: "column", gap: 10, }}>
                <Button style={{ alignSelf: 'flex-end' }} icon={<PlusOutlined />} type='primary' onClick={() => handleOpenModal()}>Add</Button>
                <Table columns={columns} dataSource={data} bordered />
            </div>

        </>
    )
}

export default BranchMajorList