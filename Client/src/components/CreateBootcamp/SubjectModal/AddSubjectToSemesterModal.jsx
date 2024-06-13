import React, { useEffect, useRef, useState } from 'react';
import {
    Modal,
    Divider,
    Radio,
    Table,
    Input,
    Space,
    Button,
    Row,
    Col,
    Tag,
    Dropdown,
    Tooltip,
} from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import {
    addSubjectsToSemester,
    editGroup,
    editSubject,
    editSubjectBranchMajor,
} from '../../../redux/CreateBootcamp/createBootCamp';
import { addSubjectToViewedSemster } from '../../../redux/subject/subject';
import {
    editElectiveGroupToViewedField,
    editSubjestViewedFields,
    updateAllowcateSubjectListSemester,
} from '../../../redux/allocate/allowcate';

const AddSubjectToSemesterModal = ({
    isModalOpen,
    setIsModalOpen,
    selectedSemester,
    type,
    setIsUpdated,
}) => {
    const { viewedMajor } = useSelector((store) => store.major);
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
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
            close,
        }) => (
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
                    onChange={(e) =>
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type='primary'
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size='small'
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size='small'
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type='link'
                        size='small'
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
                        type='link'
                        size='small'
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
                setSelectedRows([]);
            }
        },
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRowKeys(selectedRowKeys);
            setSelectedRows(selectedRows);
        },
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
            width: '8%',
        },
        {
            title: 'Type',
            key: 'type',
            filters: [
                { text: 'Compulsory', value: true },
                { text: 'Elective', value: false },
            ],
            filterSearch: true,
            onFilter: (value, record) => record.isCompulsory === value,
            dataIndex: 'type',
            width: '10%',
            render: (_, { isCompulsory }) => (
                <>
                    {isCompulsory ? (
                        <Tag color={'volcano'}>Compusory</Tag>
                    ) : (
                        <Tag color={'green'}>Elective</Tag>
                    )}
                </>
            ),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
            render: (text) => (
                <Tooltip title={text} placement="topLeft">
                    {text}
                </Tooltip>
            )
        },
    ];

    const dispatch = useDispatch();
    const { semesterSubjectList, allowcateFields,branchMajorSemester } = useSelector(
        (store) => store.createBootCamp
    );
    const { viewedAllowcatedFields } = useSelector((store) => store.allowcate);

    const { viewedSemesterList, viewedSemesterSubjectList } = useSelector(
        (store) => store.subject
    );
    const [data, setData] = useState([]);

    const getData = () => {
        const tempSubjectList = [];
        if (type === 'create') {
            semesterSubjectList.forEach((subject, index) => {
                if (
                    allowcateFields[subject.fieldIndex].subjectList[subject.subjectIndex]
                        .isCompulsory === true
                )
                    if (subject.semester === null) {
                        tempSubjectList.push({
                            ...allowcateFields[subject.fieldIndex].subjectList[
                                subject.subjectIndex
                            ],
                            isGroup: false,
                            key: index,
                        });
                    }
            });

            allowcateFields.forEach((field, fIndex) => {
                field.electiveSubjectList.forEach((group, gIndex) => {
                    if (group.semester === null) {
                        tempSubjectList.push({
                            ...group,
                            key: `${fIndex}${gIndex}group`,
                            name: `${field?.fieldName} ${gIndex + 1}`,
                            isGroup: true,
                            groupIndex: gIndex,
                            fieldIndex: fIndex,
                        });
                    }
                });
            });
        } else if (type === 'view') {
            viewedSemesterSubjectList.forEach((subject, index) => {
                if (subject.semester === null) {
                    if (
                        viewedAllowcatedFields[subject.fieldIndex].subjectList[
                            subject.subjectIndex
                        ].isCompulsory === true
                    )
                        tempSubjectList.push({
                            ...viewedAllowcatedFields[subject.fieldIndex].subjectList[
                                subject.subjectIndex
                            ],
                            key: index,
                            isGroup: false,
                        });
                }
            });
            viewedAllowcatedFields.forEach((field, fIndex) => {
                field.electiveSubjectList.forEach((group, gIndex) => {
                    if (group.semester === null) {
                        tempSubjectList.push({
                            ...group,
                            key: `${fIndex}${gIndex}group`,
                            name: `${field?.fieldName} ${gIndex + 1}`,
                            isGroup: true,
                            groupIndex: gIndex,
                            fieldIndex: fIndex,
                        });
                    }
                });
            });
        }
        return tempSubjectList;
    };
    const handleCancel = () => {
        setIsModalOpen(false);
        setSelectedRowKeys([]);
        setSelectedRows([]);
    };

    const handleOk = () => {
        let addSubjecList = [];
        if (type === 'create') {
            selectedRows.forEach((row) => {
                if (row.isGroup === false) {
                    const tempSubjectSemesterData = semesterSubjectList[row.key];
                    addSubjecList.push({
                        ...tempSubjectSemesterData,
                        semesterSubjectListIndex: row.key,
                        semester: selectedSemester,
                    });
                } else {
                    const groupData = {
                        credit: row.credit,
                        semester: selectedSemester,
                        branchMajor: null,
                    };
                    dispatch(
                        editGroup({
                            fieldIndex: row.fieldIndex,
                            groupData,
                            groupIndex: row.groupIndex,
                        })
                    );
                }
            });
            dispatch(addSubjectsToSemester(addSubjecList));
        } else if (type === 'view') {
            let addSubjecList = [];
            selectedRows.forEach((row) => {
                if (row.isGroup === false) {
                    const tempSubjectSemesterData = viewedSemesterSubjectList[row.key];
                    addSubjecList.push({
                        ...tempSubjectSemesterData,
                        semesterSubjectListIndex: row.key,
                        semester: selectedSemester,
                    });
                } else {
                    const groupData = {
                        credit: row.credit,
                        semester: selectedSemester,
                        branchMajor: null,
                    };
                    dispatch(
                        editElectiveGroupToViewedField({
                            fieldIndex: row.fieldIndex,
                            groupData,
                            groupIndex: row.groupIndex,
                        })
                    );
                }
            });
            dispatch(addSubjectToViewedSemster(addSubjecList));
            dispatch(updateAllowcateSubjectListSemester(addSubjecList));
            setIsUpdated(true);
        }
        setIsModalOpen(false);
        setSelectedRowKeys([]);
        setSelectedRows([]);
    };

    const handleAddToBranch = (branchData) => {
        if (type === 'create') {
            let addSubjecList = [];
            selectedRows.forEach((row) => {
                if (row.isGroup === false) {
                    const tempSubjectSemesterData = semesterSubjectList[row.key];
                    let newSubject =
                        allowcateFields[tempSubjectSemesterData.fieldIndex].subjectList[
                            tempSubjectSemesterData.subjectIndex
                        ];
                    newSubject = {
                        ...newSubject,
                        branchMajor: branchData._id,
                    };

                    dispatch(
                        editSubjectBranchMajor({
                            fieldIndex: tempSubjectSemesterData.fieldIndex,
                            subjectIndex: tempSubjectSemesterData.subjectIndex,
                            subject: newSubject,
                        })
                    );
                    addSubjecList.push({
                        ...tempSubjectSemesterData,
                        semesterSubjectListIndex: row.key,
                        semester: selectedSemester,
                    });
                } else {
                    const groupData = {
                        credit: row.credit,
                        semester: selectedSemester,
                        branchMajor: branchData._id,
                    };
                    dispatch(
                        editGroup({
                            fieldIndex: row.fieldIndex,
                            groupData,
                            groupIndex: row.groupIndex,
                        })
                    );
                }
            });

            dispatch(addSubjectsToSemester(addSubjecList));
        } else if (type === 'view') {
            let addSubjecList = [];
            selectedRows.forEach((row) => {
                if (row.isGroup === false) {
                    const tempSubjectSemesterData = viewedSemesterSubjectList[row.key];
                    let newSubject =
                        viewedAllowcatedFields[tempSubjectSemesterData.fieldIndex]
                            .subjectList[tempSubjectSemesterData.subjectIndex];
                    newSubject = {
                        ...newSubject,
                        branchMajor: branchData._id,
                    };

                    dispatch(
                        editSubjestViewedFields({
                            fieldIndex: tempSubjectSemesterData.fieldIndex,
                            subjectIndex: tempSubjectSemesterData.subjectIndex,
                            subject: newSubject,
                        })
                    );
                    addSubjecList.push({
                        ...tempSubjectSemesterData,
                        semesterSubjectListIndex: row.key,
                        semester: selectedSemester,
                    });
                } else {
                    const groupData = {
                        credit: row.credit,
                        semester: selectedSemester,
                        branchMajor: branchData._id,
                    };
                    dispatch(
                        editElectiveGroupToViewedField({
                            fieldIndex: row.fieldIndex,
                            groupData,
                            groupIndex: row.groupIndex,
                        })
                    );
                }
            });

            dispatch(addSubjectToViewedSemster(addSubjecList));
            setIsUpdated(true);
        }
        setIsModalOpen(false);
        setSelectedRowKeys([]);
        setSelectedRows([]);
    };

    useEffect(() => {
        setData(getData());
    }, [
        semesterSubjectList,
        viewedSemesterSubjectList,
        viewedAllowcatedFields,
        allowcateFields,
    ]);

    const createDropdownBranch = () => {
        let newViewedMajor = [...viewedMajor.branchMajor];
        newViewedMajor = newViewedMajor.reverse();
        return newViewedMajor.map((branch) => {
            return {
                key: branch._id,
                label: (
                    <a
                        onClick={() => {
                            handleAddToBranch(branch);
                        }}
                    >
                        {branch.name}
                    </a>
                ),
            };
        });
    };

    return (
        <>
            <Modal
                centered
                footer={(a) => (
                    <>
                        {a}
                        {selectedSemester >= branchMajorSemester && (
                            <Dropdown
                                menu={{
                                    items: createDropdownBranch(),
                                }}
                                placement='bottomRight'
                                trigger={['click']}
                                arrow
                            >
                                <Button style={{ marginLeft: 10 }} type='primary'>
                                    Add to Specialization
                                </Button>
                            </Dropdown>
                        )}
                    </>
                )}
                okText={'Add'}
                cancelText={'Cancel'}
                width={1200}
                title={`Add Subject to Semester ${selectedSemester + 1}`}
                open={isModalOpen}
                onCancel={handleCancel}
                onOk={handleOk}
            >
                <div>
                    <Divider />

                    <Table
                        rowSelection={{
                            type: 'checkbox',
                            ...rowSelection,
                        }}
                        columns={columns}
                        dataSource={data}
                    />
                </div>
            </Modal>
        </>
    );
};

export default AddSubjectToSemesterModal;
