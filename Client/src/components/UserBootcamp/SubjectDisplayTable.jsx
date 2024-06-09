import {
    EditableProTable,
    ProCard,
    ProForm,
    ProFormDependency,
    ProFormDigit,
} from '@ant-design/pro-components';
import { Button, Input, Space, Table, Tag, Popconfirm, InputNumber, Tooltip } from 'antd';
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import SubjectModal from '../CreateBootcamp/SubjectModal/SubjectModal';
import { deleteConfirmConfig } from '../../util/ConfirmModal/confirmConfig';
import {
    removeImportedSubject,
    removeSubjectFromField,
} from '../../redux/subject/subject';
import {
    addNewElectiveGroupToViewedField,
    deleteElectiveGroupToViewedField,
    deleteSubjectFromViewedFields,
    editElectiveGroupToViewedField,
    updateViewedFieldCredits,
    updateViewedSmallFieldCreditsWithDelete,
    updateViewedSmallFieldElectiveCredits,
    updateViewedSmallFieldElectiveCreditsWithDelete,
} from '../../redux/allocate/allowcate';
import { updateCompleteCreditsToViewedBootcamp } from '../../redux/bootcamp/bootcamp';
import {
    VIEW_GROUP_CREDITS_NOT_EQUAL_TOTAL_CREDITS,
    VIEW_NOT_EQUAL_CREDITS_IN_SUBJECTLIST,
} from '../../util/constants/errorMessage';
import {
    AutogenAllSubjectCode,
    padZero,
} from '../../util/AutogenSubjectCode/autogenSubjectCode';
import ElectiveGroupModal from '../CreateBootcamp/Electivegroup/ElectiveGroupModal';

const SubjectDisplayTable = ({
    addToDeletedList,
    groupError,
    type,
    fieldName,
    fieldIndex,
    subjectList,
    totalCredits,
    confirmModal,
    setIsUpdated,
    error,
    electiveSubjectList,
    firstIndex,
    field
}) => {
    const formRef = useRef();
    const dispatch = useDispatch();
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [groupCredits, setGroupCredits] = useState(0);
    const { viewedAllowcatedFields } = useSelector((store) => store.allowcate);
    const { viewedSemesterList, viewedSemesterSubjectList } = useSelector(store => store.subject)
    const [electiveGroupModalOpen, setElectiveGroupModalOpen] = useState(false)
    const [electiveGroupModalData, setElectiveGroupModalData] = useState(null)
    const [subjectModalData, setSubjestModalData] = useState({
        type: '',
        fieldIndex: '',
        modalName: '',
        sujectType: '',
        subjectData: null,
        isCreateBootcamp: false,
        isViewBootcamp: true,
    });
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
                if (type === 'elective') {
                    if (row.isAutoCreateCode) {
                        return AutogenAllSubjectCode(row);
                    } else return text;
                } else {
                    if (row.semester !== undefined) {
                        if (row.isAutoCreateCode) {
                            return AutogenAllSubjectCode(row);
                        } else return text;
                    }
                }
                return '';
            },
        },

        {
            title: 'Subject Name',
            dataIndex: 'name',
            valueType: 'name',
            width: '20%',
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Type',
            key: 'isCompulsory',
            dataIndex: 'isCompulsory',
            editable: false,
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
            valueType: 'digit',
            fieldProps: {
                placeholder: 'Credits',
            },
            width: '8%',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            valueType: 'textarea',
            fieldProps: {
                placeholder: 'Description',
            },
            ellipsis: true,
            render: (text) => (
                <Tooltip title={text} placement="topLeft">
                    {text}
                </Tooltip>
            )
        },

        {
            title: '',
            valueType: 'option',
            width: '12%',
            render: (_, row) => [
                <a
                    key='edit'
                    onClick={() => {
                        setSubjestModalData({
                            type: 'edit',
                            fieldIndex: fieldIndex,
                            modalName: `Edit subject ${row.name}`,
                            sujectType: type === 'compulsory' ? 'Compulsory' : 'Elective',
                            subjectData: row,
                            isCreateBootcamp: false,
                            isViewBootcamp: true,
                            fieldData: field,
                        });
                        setIsModalOpen(true);
                    }}
                >
                    Edit
                </a>,
                <a
                    style={{ color: 'red', marginLeft: 20 }}
                    key='delete'
                    onClick={async () => {
                        const confirmed = await confirmModal.confirm(deleteConfirmConfig);
                        if (confirmed) {
                            // viewedSemesterSubjectList.forEach((subject) => {
                            //     if(subject.fieldIndex === fieldIndex && subject.subjectIndex > row.fieldSubjectListIndex)
                            //         console.log(subject)
                            // })
                            dispatch(updateViewedSmallFieldCreditsWithDelete({
                                fieldIndex,
                                subjectIndex: row.fieldSubjectListIndex,
                                type,
                            }))
                            dispatch(
                                removeSubjectFromField({
                                    fieldIndex,
                                    subjectIndex: row.fieldSubjectListIndex,
                                })
                            );
                            dispatch(
                                deleteSubjectFromViewedFields({
                                    fieldIndex,
                                    subjectIndex: row.fieldSubjectListIndex,
                                })
                            );
                            if (type === 'compulsory')
                                dispatch(
                                    updateCompleteCreditsToViewedBootcamp(
                                        row.credits * -1
                                    )
                                );
                            if (row._id) addToDeletedList(row._id);
                            setIsUpdated(true);
                        }
                    }}
                >
                    Delete
                </a>,
            ],
        },
    ];
    const electiveColumns = [
        {
            title: 'Group Name',
            render: (_, record) => {
                if(field.isElectiveNameBaseOnBigField){
                    let smallFieldGroupList = field.electiveSubjectList.map((group,index) => {
                        return {
                            ...group,
                            index
                        }
                    })
                    smallFieldGroupList = smallFieldGroupList.filter(group => group.allocateChildId === record.allocateChildId)
                    let keyIndex = smallFieldGroupList.findIndex(group => group.index === record.index)
                    return `${field.smallField[record.allocateChildId].fieldName} ${keyIndex + 1}`
                }
                return `${fieldName} ${record.key + 1}`;
            },
            width: '55%',
        },

        {
            title: 'Credits',
            dataIndex: 'credit',
            valueType: 'digit',
            fieldProps: {
                placeholder: 'Credits',
            },
            width: '40%',
        },

        {
            title: '',
            valueType: 'option',
            width: '5%',
            render: (_, row) => [

                <a key='edit' onClick={() => { handleOpenElectiveGroupModal({
                    ...row,
                    courseName: `${field.fieldName} ${row.index + 1}`
                }) }}>
                    Edit
                </a>
                ,

                <a
                    style={{ color: 'red', marginLeft: 20 }}
                    key='delete'
                    onClick={async () => {
                        const confirmed = await confirmModal.confirm(deleteConfirmConfig);
                        if (confirmed) {
                            dispatch(updateViewedSmallFieldElectiveCreditsWithDelete({
                                fieldIndex,
                                groupIndex: row.key,
                            }))
                            dispatch(updateViewedFieldCredits(fieldIndex))
                            dispatch(
                                deleteElectiveGroupToViewedField({
                                    fieldIndex,
                                    groupIndex: row.key,
                                })
                            );
                            dispatch(updateCompleteCreditsToViewedBootcamp(row.credit));
                            setIsUpdated(true);
                        }
                    }}
                >
                    Delete
                </a>,
            ],
        },
    ];

    const handleOpenElectiveGroupModal = (data) => {
        setElectiveGroupModalData(data)
        setElectiveGroupModalOpen(true)
    }
    const handleCloseElectiveGroupModal = () => {
        setElectiveGroupModalData(null)
        setElectiveGroupModalOpen(false)
    }
    const handleAddGroup = (addedData) => {
        const groupData = {
            credit: addedData.credit,
            semester: null,
            branchMajor: null,
            allocateChildId: addedData.allocateChildId
        };
        dispatch(updateViewedSmallFieldElectiveCredits({
            groupIndex: null,
            groupData,
            fieldIndex
        }))
        dispatch(updateViewedFieldCredits(fieldIndex))
        dispatch(
            addNewElectiveGroupToViewedField(
                {
                    fieldIndex,
                    groupData,
                }
            )
        );
        // dispatch(
        //     updateCompleteCreditsToViewedBootcamp(subjectData.credits * -1)
        // );
        dispatch(updateCompleteCreditsToViewedBootcamp(groupData.credit));
    };
    const handleEditGroup = (editedData,oldData) => {
        const groupData = {
            credit: editedData.credit,
            semester: editedData.semester,
            branchMajor: editedData.branchMajor,
            allocateChildId: editedData.allocateChildId
        };
        dispatch(updateViewedSmallFieldElectiveCredits({
            groupIndex: editedData.index,
            groupData,
            fieldIndex
        }))
        dispatch(updateViewedFieldCredits(fieldIndex))
        dispatch(
            editElectiveGroupToViewedField({
                fieldIndex,
                groupData,
                groupIndex: editedData.index,
            })
        );
        dispatch(
            updateCompleteCreditsToViewedBootcamp(oldData.credit * -1)
        );
        dispatch(updateCompleteCreditsToViewedBootcamp(groupData.credit));
    }
    return (
        <>
            <ElectiveGroupModal open={electiveGroupModalOpen} handleCancel={handleCloseElectiveGroupModal} modalData={electiveGroupModalData} fieldData={field} handleAddGroup={handleAddGroup} handleEditGroup={handleEditGroup} />
            <SubjectModal
                setIsUpdated={setIsUpdated}
                subjectModalData={subjectModalData}
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
            />
            <ProCard
                collapsible
                title={
                    <span style={{ fontWeight: 'bold', fontSize: 25 }}>{fieldName}</span>
                }
                bordered
                subTitle={
                    error ? (
                        <span style={{ color: 'red' }}>
                            **{VIEW_NOT_EQUAL_CREDITS_IN_SUBJECTLIST}
                        </span>
                    ) : (
                        ''
                    )
                }
                style={{ marginTop: 18 }}
            >
                <div
                    style={{
                        margin: 'auto',
                    }}
                >
                    {type === 'elective' ? (
                        <ProCard
                            subTitle={
                                groupError ? (
                                    <div style={{ color: 'red' }}>
                                        **{VIEW_GROUP_CREDITS_NOT_EQUAL_TOTAL_CREDITS}
                                    </div>
                                ) : (
                                    <></>
                                )
                            }
                            collapsible={true}
                            title={
                                <h3 style={{ marginRight: 20 }}>
                                    Elective Subject Group
                                </h3>
                            }
                        >
                            <ProForm
                                formRef={formRef}
                                initialValues={{
                                    table: electiveSubjectList,
                                }}
                                submitter={false}
                            >
                                <ProFormDependency name={['table']}>
                                    {({ table }) => {
                                        const info = table.reduce(
                                            (pre, item) => {
                                                return {
                                                    totalSubjectCredits:
                                                        pre.totalSubjectCredits +
                                                        item.credit,
                                                };
                                            },
                                            { totalSubjectCredits: 0 }
                                        );
                                        return (
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 16,
                                                    paddingBlockEnd: 16,
                                                }}
                                            >
                                                <div style={{ flex: 1 }}>
                                                    Total Subject Credits:{' '}
                                                    {electiveSubjectList.reduce(
                                                        (total, item) => {
                                                            return total + item?.credit;
                                                        },
                                                        0
                                                    )}
                                                </div>
                                                <div
                                                    style={{
                                                        flex: 2,
                                                        display: 'flex',
                                                        justifyContent: 'flex-end',
                                                    }}
                                                >
                                                    {/* <Popconfirm
                                                        title='Credits'
                                                        onOpenChange={() =>
                                                            setGroupCredits(0)
                                                        }
                                                        description={
                                                            <InputNumber
                                                                value={groupCredits}
                                                                onChange={(value) =>
                                                                    setGroupCredits(value)
                                                                }
                                                            />
                                                        }
                                                        onConfirm={() => {
                                                            const groupData = {
                                                                credit: groupCredits,
                                                                semester: null,
                                                                branchMajor: null,
                                                            };
                                                            dispatch(
                                                                addNewElectiveGroupToViewedField(
                                                                    {
                                                                        fieldIndex,
                                                                        groupData,
                                                                    }
                                                                )
                                                            );
                                                            setGroupCredits(0);
                                                            setIsUpdated(true);
                                                        }}
                                                        onCancel={() =>
                                                            setGroupCredits(0)
                                                        }
                                                        okText='Add'
                                                        cancelText='Cancel'
                                                    > */}
                                                    <Button
                                                        type='primary'
                                                        onClick={() => { handleOpenElectiveGroupModal(null) }}
                                                    >
                                                        Add New Group
                                                    </Button>
                                                    {/* </Popconfirm> */}
                                                </div>
                                            </div>
                                        );
                                    }}
                                </ProFormDependency>
                                <Table
                                    columns={electiveColumns}
                                    dataSource={electiveSubjectList.map(
                                        (subject, index) => ({
                                            ...subject,
                                            index,
                                            key: index,
                                        })
                                    )}
                                />
                            </ProForm>
                        </ProCard>
                    ) : (
                        <></>
                    )}

                    <ProCard
                        collapsible={true}
                        title={<h3 style={{ marginRight: 20 }}>Subject List</h3>}
                    >
                        <ProForm
                            formRef={formRef}
                            initialValues={{
                                table: subjectList,
                            }}
                            submitter={false}
                        >
                            <ProFormDependency name={['table']}>
                                {({ table }) => {
                                    const info = table.reduce(
                                        (pre, item) => {
                                            return {
                                                totalSubjectCredits:
                                                    pre.totalSubjectCredits +
                                                    item?.credits,
                                            };
                                        },
                                        { totalSubjectCredits: 0 }
                                    );
                                    return (
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 16,
                                                paddingBlockEnd: 16,
                                            }}
                                        >

                                            <div style={{ flex: 1 }}>
                                                Total Subject Credits:{' '}
                                                {viewedAllowcatedFields[
                                                    fieldIndex
                                                ].subjectList.reduce((total, item) => {
                                                    if (
                                                        item.isCompulsory ===
                                                        (type === 'compulsory'
                                                            ? true
                                                            : false)
                                                    )
                                                        return total + item?.credits;
                                                    else return total + 0;
                                                }, 0)}
                                            </div>
                                            <div
                                                style={{
                                                    flex: 2,
                                                    display: 'flex',
                                                    justifyContent: 'flex-end',
                                                }}
                                            >
                                                <Button
                                                    type='primary'
                                                    onClick={() => {
                                                        setSubjestModalData({
                                                            type: 'add',
                                                            fieldIndex: fieldIndex,
                                                            modalName: `Add new subject to ${fieldName} field`,
                                                            sujectType:
                                                                type === 'compulsory'
                                                                    ? 'Compulsory'
                                                                    : 'Elective',
                                                            subjectData: null,
                                                            isCreateBootcamp: false,
                                                            isViewBootcamp: true,
                                                            fieldData: field,
                                                        });
                                                        setIsModalOpen(true);
                                                    }}
                                                >
                                                    Add Subject
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                }}
                            </ProFormDependency>
                            <Table
                                columns={columns}
                                dataSource={subjectList.map((subject, index) => {
                                    return {
                                        ...subject,
                                        index: subject.fieldSubjectListIndex,
                                        key: index,
                                        indexAutogenSubjectCode: padZero(
                                            firstIndex + index + 1
                                        ),
                                    };
                                })}
                            />
                        </ProForm>
                    </ProCard>
                </div>
            </ProCard>
        </>
    );
};

export default SubjectDisplayTable;
