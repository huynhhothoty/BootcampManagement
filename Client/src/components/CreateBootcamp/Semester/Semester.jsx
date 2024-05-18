import { SearchOutlined, DeleteOutlined, WarningOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { Button, Input, Space, Table, Card, Divider, Tag, Row, Col, Tooltip } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
    deleteSemester,
    editGroup,
    removeSubjectFromSemester,
} from '../../../redux/CreateBootcamp/createBootCamp';
import {
    MISSING_SUBJECT_IN_SEMESTER,
    WARNING_OUT_OF_CREDITS,
} from '../../../util/constants/errorMessage';
import { deleteConfirmConfig } from '../../../util/ConfirmModal/confirmConfig';
import {
    AutogenAllSubjectCode,
    getFirstAutogenSubjectIndex,
} from '../../../util/AutogenSubjectCode/autogenSubjectCode';

const Semester = ({
    error,
    totalSemester,
    setIsModalOpen,
    subjectList,
    semesterIndex,
    setSelectedSemester,
    confirmModal,
}) => {
    const dispatch = useDispatch();
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [data, setData] = useState([]);
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
    const columns = [
        {
            title: 'Subject Code',
            dataIndex: 'subjectCode',
            key: 'subjectCode',
            width: '15%',
            render: (text, row) => {
                if (!row.isGroup && !row.isBranch) {
                    if (row.isAutoCreateCode) {
                        if (row.semester !== undefined && row.semester !== null ) {
                            return AutogenAllSubjectCode(row);
                        }
                    } else return text;
                } else return '';
            },
        },
        {
            title: 'Subject Name',
            dataIndex: 'name',
            key: 'name',
            width: '20%',
            ...getColumnSearchProps('name'),
            render: (text, record) => {
                if (record.isBranch) {
                    return <span style={{ fontWeight: 'bold' }}>{text}</span>;
                }
                return text;
            },
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
            dataIndex: 'type',
            width: '10%',
            render: (_, { isCompulsory, isBranch }) => {
                if (isBranch) {
                    return '';
                }
                return (
                    <>
                        {isCompulsory ? (
                            <Tag color={'volcano'}>Compusory</Tag>
                        ) : (
                            <Tag color={'green'}>Elective</Tag>
                        )}
                    </>
                );
            },
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
        },

        {
            title: 'Action',
            width: '8%',
            render: (_, data) => {
                if (data.isBranch) {
                    return <></>;
                }
                return (
                    <Row>
                        <Col span={12}>
                            <Button
                                type='default'
                                danger
                                onClick={async () => {
                                    const confirmed = await confirmModal.confirm(
                                        deleteConfirmConfig
                                    );
                                    if (confirmed)
                                        if (data.isGroup) {
                                            const groupData = {
                                                credit: data.credits,
                                                semester: null,
                                                branchMajor: null,
                                            };
                                            dispatch(
                                                editGroup({
                                                    fieldIndex: data.fieldIndex,
                                                    groupData,
                                                    groupIndex: data.groupIndex,
                                                })
                                            );
                                        } else
                                            dispatch(
                                                removeSubjectFromSemester({
                                                    subjestIndex: data.key,
                                                    semesterIndex,
                                                    semesterSubjectListIndex:
                                                        data.semesterSubjectListIndex,
                                                })
                                            );
                                }}
                            >
                                <DeleteOutlined />
                            </Button>
                        </Col>
                        <Col span={12}></Col>
                    </Row>
                );
            },
        },
    ];
    const expandedRowRender = (branch) => {
        const columns = [
            {
                title: 'Subject Code',
                dataIndex: 'subjectCode',
                key: 'subjectCode',
                width: '15%',
                render: (text, row) => {
                    if (!row.isGroup && !row.isBranch) {
                        if (row.isAutoCreateCode) {
                            if (row.semester !== undefined && row.semester !== null) {
                                return AutogenAllSubjectCode(row);
                            }
                        } else return text;
                    } else return '';
                },
            },
            {
                title: 'Subject Name',
                dataIndex: 'name',
                key: 'name',
                width: '20%',
                ...getColumnSearchProps('name'),
            },

            {
                title: 'Type',
                dataIndex: 'isCompulsory',
                key: 'isCompulsory',
                width: '10%',
                render: (value) => {
                    return (
                        <Tag color={value ? 'volcano' : 'green'}>
                            {value ? 'Compulsory' : 'Elective'}
                        </Tag>
                    );
                },
            },
            {
                title: 'Credits',
                dataIndex: 'credits',
                key: 'credits',
                ...getColumnSearchProps('credits'),
            },
            {
                title: 'Description',
                dataIndex: 'description',
                key: 'description',
            },

            {
                title: '',
                width: '8%',
                dataIndex: '',
                key: '',
                render: (_, row) => {
                    return (
                        <div>
                            <Button
                                danger
                                style={{ color: 'red' }}
                                onClick={async () => {
                                    const confirmed = await confirmModal.confirm(
                                        deleteConfirmConfig
                                    );
                                    if (confirmed) {
                                        if (row.isGroup) {
                                            const groupData = {
                                                credit: row.credits,
                                                semester: null,
                                                branchMajor: null,
                                            };
                                            dispatch(
                                                editGroup({
                                                    fieldIndex: row.fieldIndex,
                                                    groupData,
                                                    groupIndex: row.groupIndex,
                                                })
                                            );
                                        } else {
                                            dispatch(
                                                removeSubjectFromSemester({
                                                    subjestIndex: row.key,
                                                    semesterIndex,
                                                    semesterSubjectListIndex:
                                                        row.semesterSubjectListIndex,
                                                })
                                            );
                                        }
                                    }
                                }}
                            >
                                <DeleteOutlined />
                            </Button>
                        </div>
                    );
                },
            },
        ];
        const data = [];
        allowcateFields.forEach((field, fIndex) => {
            field.electiveSubjectList.forEach((group, gIndex) => {
                if (group.branchMajor !== undefined) {
                    if (group.branchMajor !== null)
                        if (group.branchMajor._id) {
                            if (group.branchMajor._id === branch._id) {
                                if (group.semester === semesterIndex) {
                                    data.unshift({
                                        name: `${field.fieldName} ${gIndex + 1}`,
                                        isCompulsory: false,
                                        credits: group.credit,
                                        isBranch: false,
                                        isGroup: true,
                                        branchMajor: group.branchMajor?._id
                                            ? group.branchMajor._id
                                            : group.branchMajor,
                                        semester: group.semester,
                                        fieldIndex: fIndex,
                                        groupIndex: gIndex,
                                    });
                                }
                            }
                        } else {
                            if (group.branchMajor === branch._id) {
                                if (group.semester === semesterIndex) {
                                    data.unshift({
                                        name: `${field.fieldName} ${gIndex + 1}`,
                                        isCompulsory: false,
                                        credits: group.credit,
                                        isBranch: false,
                                        isGroup: true,
                                        branchMajor: group.branchMajor?._id
                                            ? group.branchMajor._id
                                            : group.branchMajor,
                                        semester: group.semester,
                                        fieldIndex: fIndex,
                                        groupIndex: gIndex,
                                    });
                                }
                            }
                        }
                }
            });
        });
        subjectList.forEach((subject, index) => {
            if (
                allowcateFields[subject.fieldIndex].subjectList[subject.subjectIndex]
                    .branchMajor === branch._id
            ) {
                data.push({
                    ...allowcateFields[subject.fieldIndex].subjectList[
                        subject.subjectIndex
                    ],
                    semesterSubjectListIndex: subject.semesterSubjectListIndex,
                    key: index,
                });
            }
        });
        return <Table columns={columns} dataSource={data} pagination={false} />;
    };
    const handleSemesterClick = () => {
        setSelectedSemester(semesterIndex);
        setIsModalOpen(true);
    };

    const { allowcateFields } = useSelector((store) => store.createBootCamp);
    const { viewedMajor } = useSelector((store) => store.major);

    const getSemesterData = () => {
        let newSubjectArray = [];

        subjectList.forEach((subject, index) => {
            if (
                allowcateFields[subject.fieldIndex].subjectList[subject.subjectIndex]
                    .branchMajor === undefined ||
                allowcateFields[subject.fieldIndex].subjectList[subject.subjectIndex]
                    .branchMajor === null
            ) {
                newSubjectArray.push({
                    ...allowcateFields[subject.fieldIndex].subjectList[
                        subject.subjectIndex
                    ],
                    semesterSubjectListIndex: subject.semesterSubjectListIndex,
                    isBranch: false,
                    isGroup: false,
                    key: index,
                    indexAutogenSubjectCode: getFirstAutogenSubjectIndex(
                        subject.fieldIndex,
                        subject.subjectIndex,
                        allowcateFields
                    ),
                });
            }
        });
        allowcateFields.forEach((field, fIndex) => {
            field.electiveSubjectList.forEach((group, gIndex) => {
                if (group.branchMajor === undefined || group.branchMajor === null)
                    if (group.semester === semesterIndex) {
                        newSubjectArray.unshift({
                            name: `${field.fieldName} ${gIndex + 1}`,
                            isCompulsory: false,
                            credits: group.credit,
                            isBranch: false,
                            isGroup: true,
                            branchMajor: group.branchMajor?._id
                                ? group.branchMajor._id
                                : group.branchMajor,
                            semester: group.semester,
                            fieldIndex: fIndex,
                            groupIndex: gIndex,
                        });
                    }
            });
        });
        if (semesterIndex >= 4)
            if (viewedMajor) {
                viewedMajor.branchMajor.forEach((branch, index) => {
                    newSubjectArray.unshift({
                        ...branch,
                        key: branch._id,
                        isBranch: true,
                        isGroup: false,
                    });
                });
            }

        return newSubjectArray;
    };

    const countTotalCredits = () => {
        let totalCredits = 0;
        subjectList.forEach((subject, index) => {
            if (
                allowcateFields[subject.fieldIndex].subjectList[subject.subjectIndex]
                    .branchMajor === undefined ||
                allowcateFields[subject.fieldIndex].subjectList[subject.subjectIndex]
                    .branchMajor === null
            ) {
                totalCredits +=
                    allowcateFields[subject.fieldIndex].subjectList[subject.subjectIndex]
                        .credits;
            }
        });
        allowcateFields.forEach((field, fIndex) => {
            field.electiveSubjectList.forEach((group, gIndex) => {
                if (group.branchMajor === undefined || group.branchMajor === null)
                    if (group.semester === semesterIndex) {
                        totalCredits += group.credit;
                    }
            });
        });
        return totalCredits;
    };

    return (
        <Card
            hoverable
            style={{
                width: '100%',
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', gap: 8 }}>
                    <h2>Semester {semesterIndex + 1} - Total Credit: </h2>
                    {countTotalCredits() <= 30 ? (
                        <h2 style={{ color: '#5cb85c' }}>{countTotalCredits()}</h2>
                    ) : (
                        <Tooltip title={WARNING_OUT_OF_CREDITS}>
                            <h2 style={{ color: '#f7b217' }}>
                                {countTotalCredits()} <WarningOutlined />
                            </h2>
                        </Tooltip>
                    )}
                </span>

                <div>
                    <Button type='primary' onClick={handleSemesterClick}>
                        Add Subject
                    </Button>
                    {totalSemester > 1 ? (
                        <Button
                            style={{ marginLeft: 16 }}
                            type='default'
                            danger
                            onClick={async () => {
                                const confirmed = await confirmModal.confirm(
                                    deleteConfirmConfig
                                );
                                if (confirmed) dispatch(deleteSemester(semesterIndex));
                            }}
                        >
                            Delete Semester
                        </Button>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
            {error ? (
                <div style={{ color: 'red', marginTop: 10 }}>
                    **{MISSING_SUBJECT_IN_SEMESTER}
                </div>
            ) : (
                ''
            )}
            <Divider />
            <Table
                expandable={{
                    expandedRowRender,
                    rowExpandable: (record) => record.branchCode !== undefined,
                }}
                columns={columns}
                dataSource={getSemesterData()}
            />
        </Card>
    );
};

export default Semester;
