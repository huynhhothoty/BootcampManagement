import { useState, useRef } from 'react';
import { Modal, Divider, Table, Tag, Button, Space, Input } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';


  

const ImportSubjectModal = ({ isModalOpen, setIsModalOpen,setImportedSubject}) => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [selectedSubject, setSelectedSubject] = useState(null)
    const [selectedRowKeys, setSelectedRowKeys] = useState("")
    const [error,setError] = useState(false)
    const { allSubjectList } = useSelector(store => store.subject)
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
            dataIndex: 'credit',
            key: 'credit',
            width: '5%',

        },
        {
            title: 'Tags',
            key: 'tags',
            dataIndex: 'tags',
            width: '10%',
            render: (_, { isCompulsory }) => (
                <>
                    {isCompulsory ? (<Tag color={"volcano"} >
                                Compusory
                            </Tag>):(<Tag color={"green"}>
                            Elective
                            </Tag>)}
                    
                </>
            ),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description'
        },
    ]

    const rowSelection = {
        selectedRowKeys: selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRowKeys(selectedRowKeys);
            setSelectedSubject(selectedRows)
            setError(false)
        },
      };

    const handleCancel = () => {
        setIsModalOpen(false);
        setSelectedRowKeys('')
        setSelectedSubject(null)
        setError(false)
      };

    const handleImportSubject = () => {
        if(selectedSubject) {
            setImportedSubject(selectedSubject[0])
        }setError(true)
        setIsModalOpen(false);
        setSelectedRowKeys('')
        setSelectedSubject(null)

    }
      return (
        <>
          <Modal width={1000} onOk={handleImportSubject} title="Import a Subject" open={isModalOpen} onCancel={handleCancel}>
          <div>
         
            {error ? <div style={{color:"red"}}>** You need to choose a subject</div> : ""}
          <Divider />
    
          <Table
            rowSelection={{
              type: "radio",
              ...rowSelection,
            }}
            columns={columns}
            dataSource={allSubjectList}
          />
        </div>
    
          </Modal>
        </>
      )
}

export default ImportSubjectModal