import { Button, Input, Space, Table } from 'antd';
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { exportBootcamp, getAllBootcamp, getBootcampsByUserID, updateViewedBootcamp } from '../../redux/bootcamp/bootcamp';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { getAllowcatById, updateViewedAllocatedField } from '../../redux/allocate/allowcate';
import { updateViewedSemesterList, updateViewedSemesterSubjectLis, updateViewedSubjectList } from '../../redux/subject/subject';
import { updateLoading } from '../../redux/loading/Loading';
import { SUBJECT_ADDED_IMPORT } from '../../util/constants/subjectStatus';
import { getMajorById, updateViewedMajor } from '../../redux/major/major';
import { DownloadOutlined } from '@ant-design/icons';

const AllBootcampTable = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { userData } = useSelector(store => store.authentication)
    const { loading, userBootcampList } = useSelector(store => store.bootcamp)
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [error, setError] = useState(false)
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

    const { setBreadCrumbList } = useOutletContext()

    const handleViewBootcamp = async (data, viewType) => {
        dispatch(updateLoading(true))

        let bootcampName = data.name
        let totalCredits = parseInt(data.totalCredit)
        let completeTotalCredits = data.totalCredit
        let allowcateFields = []
        let semesterSubjectList = []
        let semesterList = [[]]
        const tempAllowcateFields = await dispatch(getAllowcatById(data.allocation))
        let tempSubjectList = []
        allowcateFields = tempAllowcateFields.payload.data.detail.map((field, index) => {
            return {
                compulsoryCredits: field.detail.reduce((accumulator, currentValue) => {
                    return accumulator + currentValue.compulsoryCredit;
                }, 0),
                electiveCredits: field.detail.reduce((accumulator, currentValue) => {
                    return accumulator + currentValue.OptionalCredit;
                }, 0),
                fieldName: field.name,
                smallField: field.detail.map((smallField) => {
                    return {
                        compulsoryCredits: smallField.compulsoryCredit,
                        electiveCredits: smallField.OptionalCredit,
                        fieldName: smallField.name
                    }
                }),
                subjectList: field.subjectList.map((subject, sindex) => {
                    semesterSubjectList.push({
                        fieldIndex: index,
                        subjectIndex: sindex,
                        semester: null,
                        _id: subject._id
                    })
                    const a = {
                        credits: subject.credit,
                        description: subject.description,
                        isCompulsory: subject.isCompulsory,
                        name: subject.name,
                        subjectCode: subject.subjectCode,
                        status: [SUBJECT_ADDED_IMPORT],
                        branchMajor: subject.branchMajor !== undefined ? subject.branchMajor !== null ? subject.branchMajor : null : null,
                        _id: subject._id,
                        shortFormName: subject.shortFormName ? subject.shortFormName : "",
                        isAutoCreateCode: subject.isAutoCreateCode ? subject.isAutoCreateCode : false,
                        departmentChild: subject.departmentChild ? subject.departmentChild : undefined,
                    }
                    tempSubjectList.push(subject)
                    return a
                }),
                electiveSubjectList: field.electiveSubjectList
            }
        })

        semesterList = data.detail.map((semester, index) => {
            return semester.subjectList.map((subject) => {
                const semesterSubjectListIndex = semesterSubjectList.findIndex(sSubject => sSubject._id === subject)
                semesterSubjectList[semesterSubjectListIndex].semester = index
                const a = semesterSubjectList[semesterSubjectListIndex]
                allowcateFields[a.fieldIndex].subjectList[a.subjectIndex]['semester'] = index
                return {
                    ...a,
                    semesterSubjectListIndex
                }
            })
        })
        dispatch(updateViewedAllocatedField({ data: allowcateFields, id: data.allocation }))
        dispatch(updateViewedBootcamp({
            id: data._id,
            bootcampName,
            totalCredits,
            completeTotalCredits
        }))
        await dispatch(getMajorById(data.major))
        dispatch(updateViewedSubjectList(tempSubjectList))
        dispatch(updateViewedSemesterList(semesterList))
        dispatch(updateViewedSemesterSubjectLis(semesterSubjectList))
        dispatch(updateLoading(false))
        setBreadCrumbList([
            {
                title: <a>All Bootcamp</a>,
                onClick: () => {
                    navigate("/userbootcamp")
                    setBreadCrumbList([
                        {
                            title: "All Bootcamp",
                        }
                    ])
                }
            },
            {
                title: data.name
            }
        ])
        navigate("/userbootcamp/viewbootcamp", { state: { viewedBootcampData: data, viewType } })
    }

    const columns = [
        {
            title: 'BootCamp Name',
            dataIndex: 'name',
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Total Credits',
            dataIndex: 'totalCredit',
            ...getColumnSearchProps('totalCredit'),
        },
        {
            title: 'Created Year',
            dataIndex: 'year',
            ...getColumnSearchProps('year'),
        },
        {
            title: '',
            dataIndex: 'year',
            width: '17%',
            render: (_, data) => (
                <div style={{ display: 'flex', justifyContent: "space-between" }}>
                    <Button onClick={() => {
                        handleViewBootcamp(data, 'view')
                    }}>View</Button>
                    <Button type='primary' onClick={() => {
                        handleViewBootcamp(data, 'edit')
                    }}>Edit</Button>
                    <Button type="primary" icon={<DownloadOutlined />} style={{backgroundColor:"#229a59"}} onClick={() => {
                         dispatch(exportBootcamp({bootcampID: data._id, bootcampName: data.name}))
                    }}>
                        Export
                    </Button>
                </div>
            ),
        }
    ];



    useEffect(() => {
        dispatch(getBootcampsByUserID())
    }, [])
    return (
        <Table
            loading={loading}
            columns={columns}
            dataSource={userBootcampList}
        />
    )
}

export default AllBootcampTable