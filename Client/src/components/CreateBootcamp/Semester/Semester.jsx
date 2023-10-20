import { SearchOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { Button, Input, Space, Table, Card, Divider, Tag, Row, Col } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { deleteSemester, removeSubjectFromSemester } from '../../../redux/CreateBootcamp/createBootCamp';
import { MISSING_SUBJECT_IN_SEMESTER } from '../../../util/constants/errorMessage';
import { deleteConfirmConfig } from '../../../util/ConfirmModal/confirmConfig';

const Semester = ({error,totalSemester,setIsModalOpen, subjectList, semesterIndex, setSelectedSemester, confirmModal}) => {
   
    const dispatch = useDispatch()
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [data,setData] = useState([])
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
            dataIndex: 'credits',
            key: 'credits',
            width: '5%',

        },
       
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description'
        },

        {
            title: 'Action',
            width: '8%',
            render: (_,data) => (
                <Row>
                    <Col span={12}>
                    <Button type='default' danger 
                    onClick={async () => {
                        const confirmed = await confirmModal.confirm(deleteConfirmConfig)
                        if(confirmed)
                        dispatch(removeSubjectFromSemester({subjestIndex: data.key,semesterIndex, semesterSubjectListIndex: data.semesterSubjectListIndex}))
                    }}
                    >
                        <DeleteOutlined />
                    </Button>
                    </Col>
                    <Col span={12}>
                    
                    </Col>
                </Row>
            ),
        },
    ];

    const handleSemesterClick = () => {
        setSelectedSemester(semesterIndex)
        setIsModalOpen(true)
    }

    const {allowcateFields} = useSelector(store => store.createBootCamp)

    const getSemesterData = () => {
        let newSubjectArray = [];

        subjectList.forEach((subject,index) => {
            newSubjectArray.push({
                ...allowcateFields[subject.fieldIndex].subjectList[subject.subjectIndex],
                semesterSubjectListIndex:subject.semesterSubjectListIndex,
                key:index
            })
        })
        return newSubjectArray
    }

  
    
    return (
        <Card
            hoverable
            style={{
                width: "100%",
            }}
        >
            <div style={{display:"flex", justifyContent:"space-between"}}>
                <h2>Semester {semesterIndex + 1}</h2>
                <div>
                <Button type="primary" onClick={handleSemesterClick}>
                    Add Subject
                </Button>
                {
                    totalSemester > 1 ?
                    <Button style={{marginLeft:16}} type='default' danger 
                    onClick={async () => {
                        const confirmed = await confirmModal.confirm(deleteConfirmConfig)
                        if(confirmed)
                        dispatch(deleteSemester(semesterIndex))
                    }}
                    >
                        Delete Semester
                </Button>
                :
                <></>
                }
                
                </div>
            </div>
            {(error && subjectList.length ===0) ? <div style={{ color: "red", marginTop: 10}}>**{MISSING_SUBJECT_IN_SEMESTER}</div> : ""}
            <Divider />
            <Table columns={columns} dataSource={getSemesterData()} />;
        </Card>
    )
}

export default Semester