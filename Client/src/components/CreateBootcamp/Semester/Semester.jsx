import { SearchOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { Button, Input, Space, Table, Card, Divider, Tag, Row, Col } from 'antd';
const data = [
    {
        id: 123456,
        key: '1',
        subjectName: 'Đại số tuyến tính',
        credits: 3,
        description: 'New York No. 1 Lake Park',
        isCompusory: true
    },
    {
        id: 123456,
        key: '2',
        subjectName: 'Toán 1',
        credits: 2,
        description: 'London No. 1 Lake Park',
        isCompusory: false
    },
    {
        id: 123456,
        key: '3',
        subjectName: 'Lý 1',
        credits: 3,
        description: 'Sydney No. 1 Lake Park',
        isCompusory: true
    },
    {
        id: 123456,
        key: '4',
        subjectName: 'Lý 2',
        credits: 3,
        description: 'London No. 2 Lake Park',
        isCompusory: false
    },
];
const Semester = ({setIsModalOpen}) => {
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
            title: 'Subject ID',
            dataIndex: 'id',
            key: 'id',
            width: '15%',
            ...getColumnSearchProps('id'),
        },
        {
            title: 'Subject Name',
            dataIndex: 'subjectName',
            key: 'subjectName',
            width: '20%',
            ...getColumnSearchProps('subjectName'),
        },
        {
            title: 'Credits',
            dataIndex: 'credits',
            key: 'credits',
            width: '5%',

        },
        {
            title: 'Tags',
            key: 'tags',
            dataIndex: 'tags',
            width: '10%',
            render: (_, { isCompusory }) => (
                <>
                    {isCompusory ? (<Tag color={"green"} >
                                Compusory
                            </Tag>):(<Tag color={"volcano"}>
                            Optional
                            </Tag>)}
                    
                </>
            ),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description'
        },

        {
            title: 'Action',
            width: '12%',
            render: (_,data) => (
                <Row>
                    <Col span={12}>
                    <Button type='default' danger>
                        <DeleteOutlined />
                    </Button>
                    </Col>
                    <Col span={12}>
                    <Button type='default' >
                    <EditOutlined />
                    </Button>
                    </Col>
                </Row>
            ),
        },
    ];

    const handleSemesterClick = () => {
        setIsModalOpen(true)
    }
    return (
        <Card
            hoverable
            style={{
                width: "100%",
            }}
        >
            <div style={{display:"flex", justifyContent:"space-between"}}>
                <h2>Semester 1</h2>
                <Button type="primary" onClick={handleSemesterClick}>
                    Add Subject
                </Button>
            </div>
            <Divider />
            <Table columns={columns} dataSource={data} />;
        </Card>
    )
}

export default Semester