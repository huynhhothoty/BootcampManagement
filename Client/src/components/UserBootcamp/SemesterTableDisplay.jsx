import { ProCard } from '@ant-design/pro-components';
import { Badge, Button, Dropdown, Input, Space, Table, Tag } from 'antd';
import React, { useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { DeleteOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import {
    deleteSemesterFromViewedSemesterList,
    deleteSubjectFromViewedSemster,
} from '../../redux/subject/subject';
import { deleteConfirmConfig } from '../../util/ConfirmModal/confirmConfig';
import { editElectiveGroupToViewedField } from '../../redux/allocate/allowcate';
import { AutogenAllSubjectCode } from '../../util/AutogenSubjectCode/autogenSubjectCode';

const SemesterTableDisplay = ({
    semesterIndex,
    subjectList,
    confirmModal,
    setIsModalOpen,
    setSelectedSemester,
    setIsUpdated,
    totalSemester,
}) => {
    const dispatch = useDispatch();
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

    const expandedRowRender = (branch) => {
        const columns = [
            {
                title: 'Subject Code',
                dataIndex: '',
                key: 'subjectCode',
                width: '10%',
                render: (text, row) => {
                    if (!row.isBranch && !row.isGroup)
                        if (row.isAutoCreateCode) {
                            if (row.semester !== undefined) {
                                return AutogenAllSubjectCode(row);
                            }
                        } else return text;
                    else return '';
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
                ellipsis: true,
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
                                                editElectiveGroupToViewedField({
                                                    fieldIndex: row.fieldIndex,
                                                    groupData,
                                                    groupIndex: row.groupIndex,
                                                })
                                            );
                                            setIsUpdated(true);
                                        } else {
                                            dispatch(
                                                deleteSubjectFromViewedSemster({
                                                    semester: semesterIndex,
                                                    inSemesterSubjectIndex: row.key,
                                                    fieldIndex: row.fieldIndex,
                                                    subjectIndex: row.subjectIndex,
                                                })
                                            );
                                            setIsUpdated(true);
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
        subjectList.forEach((subject) => {
            if (subject.branchMajor === branch._id) {
                data.push(subject);
            }
        });
        return <Table columns={columns} dataSource={data} pagination={false} />;
    };

    const columns = [
        {
            title: 'Subject Code',
            dataIndex: 'subjectCode',
            key: 'subjectCode',
            width: '10%',
            render: (text, row) => {
                if (!row.isBranch && !row.isGroup)
                    if (row.isAutoCreateCode) {
                        if (row.semester !== undefined) {
                            return AutogenAllSubjectCode(row);
                        }
                    } else return text;
                else return '';
            },
        },
        {
            title: 'Subject Name',
            dataIndex: 'name',
            key: 'name',
            width: '30%',
            ...getColumnSearchProps('name'),
            render: (text, record) => {
                if (record.isBranch) {
                    return <span style={{ fontWeight: 'bold' }}>{text}</span>;
                }
                return text;
            },
        },

        {
            title: 'Type',
            dataIndex: 'isCompulsory',
            key: 'isCompulsory',
            width: '10%',
            render: (value, record) => {
                if (record.isBranch) {
                    return '';
                }
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
            ellipsis: true,
        },

        {
            title: '',
            width: '8%',
            dataIndex: '',
            key: '',
            render: (_, row) => {
                if (row.isBranch) return <></>;
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
                                            editElectiveGroupToViewedField({
                                                fieldIndex: row.fieldIndex,
                                                groupData,
                                                groupIndex: row.groupIndex,
                                            })
                                        );
                                        setIsUpdated(true);
                                    } else {
                                        dispatch(
                                            deleteSubjectFromViewedSemster({
                                                semester: semesterIndex,
                                                inSemesterSubjectIndex: row.key,
                                                fieldIndex: row.fieldIndex,
                                                subjectIndex: row.subjectIndex,
                                            })
                                        );
                                        setIsUpdated(true);
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
    return (
        <ProCard
            bodyStyle={{ paddingInline: 0 }}
            extra={
                <div>
                    <Button
                        type='primary'
                        onClick={() => {
                            setIsModalOpen(true);
                            setSelectedSemester(semesterIndex);
                        }}
                    >
                        Add Subject
                    </Button>
                    <Button
                        danger
                        disabled={totalSemester === 1 ? true : false}
                        style={{ marginLeft: 20 }}
                        onClick={async () => {
                            const confirmed = await confirmModal.confirm(
                                deleteConfirmConfig
                            );
                            if (confirmed) {
                                dispatch(
                                    deleteSemesterFromViewedSemesterList(semesterIndex)
                                );
                                setIsUpdated(true);
                            }
                        }}
                    >
                        Delete Semester
                    </Button>
                </div>
            }
            collapsible
            title={
                <span style={{ fontWeight: 'bold', fontSize: 25 }}>{`Semester ${
                    semesterIndex + 1
                }`}</span>
            }
            bordered
        >
            <Table
                expandable={{
                    expandedRowRender,
                    rowExpandable: (record) => record.branchCode !== undefined,
                }}
                pagination={false}
                columns={columns}
                dataSource={subjectList.filter(
                    (subject) =>
                        subject.branchMajor === undefined || subject.branchMajor === null
                )}
            />
        </ProCard>
    );
};

export default SemesterTableDisplay;
