import { SearchOutlined, DeleteOutlined, EditOutlined, SwapOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';
import {
    Button,
    Input,
    Space,
    Table,
    Card,
    Divider,
    Tag,
    Row,
    Col,
    InputNumber,
    Popconfirm,
    Tooltip,
    Checkbox,
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
    addNewGroup,
    changeUseSmallFieldName,
    deleteGroup,
    editGroup,
    removeSubject,
    updateDragData,
    updateFieldCredits,
    updateSmallFieldCreditsWithDelete,
    updateSmallFieldElectiveCredits,
    updateSmallFieldElectiveCreditsWithDelete
} from '../../../redux/CreateBootcamp/createBootCamp';
import {
    NOT_EQUAL_CREDITS,
    NOT_EQUAL_OR_HIGER_CREDITS,
    VIEW_GROUP_CREDITS_NOT_EQUAL_TOTAL_CREDITS,
} from '../../../util/constants/errorMessage';
import { deleteConfirmConfig } from '../../../util/ConfirmModal/confirmConfig';
import { removeImportedSubject } from '../../../redux/subject/subject';
import {
    AutogenAllSubjectCode,
    padZero,
} from '../../../util/AutogenSubjectCode/autogenSubjectCode';
import ElectiveGroupModal from '../Electivegroup/ElectiveGroupModal';
import { DragSortTable } from '@ant-design/pro-components';

const ContentOfField = ({
    error,
    field,
    type,
    setIsSubjectModalOpen,
    setSubjestModalData,
    index,
    confirmModal,
    groupError,
    isLastField,
    handleOpenSwapModal
}) => {
    const dispath = useDispatch();
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [groupCredits, setGroupCredits] = useState(0);
    const [electiveGroupModalOpen, setElectiveGroupModalOpen] = useState(false)
    const [electiveGroupModalData, setElectiveGroupModalData] = useState(null)
    const { semesterSubjectList, semesterList, allowcateFields } = useSelector(store => store.createBootCamp)
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const creditsLabel = () => {
        let totalActureSubjectCredits = 0;
        field.subjectList.forEach((subject) => {
            if (subject.isCompulsory === (type === 'Compulsory' ? true : false)) {
                totalActureSubjectCredits += subject.credits;
            }
        });
        if (type === 'Compulsory') {
            return (
                <span
                    style={{
                        color: '#5cb85c'
                    }}
                >
                    {totalActureSubjectCredits}
                </span>
            );
        } else
            return (
                <span
                    style={{
                        color:
                            totalActureSubjectCredits >= field.electiveCredits
                                ? '#5cb85c'
                                : 'red',
                    }}
                >
                    {totalActureSubjectCredits}/{field.electiveCredits}
                </span>
            );
    };

    const groupCreditsLabel = () => {
        let totalActureSubjectCredits = 0;
        field.electiveSubjectList.forEach((group) => {
            totalActureSubjectCredits += group.credit;
        });

        return (
            <span
                style={{
                    color: '#5cb85c'
                }}
            >
                {totalActureSubjectCredits}
            </span>
        );
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
            title: 'Sort',
            dataIndex: 'sort',
            width: 60,
            className: 'drag-visible',
        },
        {
            title: 'Subject Code',
            dataIndex: 'subjectCode',
            key: 'subjectCode',
            width: '15%',
            render: (text, row) => {
                if (row.isAutoCreateCode) {
                    if (type === 'Elective') {
                        return AutogenAllSubjectCode(row);
                    } else {
                        if (row.semester !== null && row.semester !== undefined) {
                            return AutogenAllSubjectCode(row);
                        }
                    }

                } else return text;
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
            title: 'Credits',
            dataIndex: 'credits',
            key: 'credits',
            width: '8%',
        },
        {
            title: 'Field Groups',
            dataIndex: 'allocateChildId',
            key: 'credits',
            width: '12%',
            filters: field.smallField.map((field, index) => {
                return {
                    text: field?.fieldName,
                    value: index,
                }
            }),
            onFilter: (value, record) => record.allocateChildId === value,
            render: (text, row) => {
                return field.smallField[row.allocateChildId]?.fieldName
            }
        },

        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
            // render: (text) => (
            //     <Tooltip title={text} placement="topLeft">
            //         {text}
            //     </Tooltip>
            // )
        },

        {
            title: 'Action',
            width: 200,
            align: 'center',
            render: (_, data) => (

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                        disabled={isLastField}
                        type='default'
                        onClick={() => {
                            setSubjestModalData({
                                type: 'edit',
                                fieldIndex: index,
                                modalName: `Edit Subject`,
                                sujectType: type,
                                subjectData: data,
                                isCreateBootcamp: true,
                                isViewBootcamp: false,
                                fieldData: field,
                            });
                            setIsSubjectModalOpen(true);
                        }}
                    >
                        <EditOutlined />
                    </Button>
                    <Button
                     disabled={isLastField}
                        type='default'
                        onClick={() => {
                            handleOpenSwapModal({ fieldIndex: index, subjectData: data })
                        }}
                    >
                        <SwapOutlined />
                    </Button>
                    <Button
                     disabled={isLastField}
                        type='default'
                        danger
                        onClick={async () => {
                            const confirmed = await confirmModal.confirm(
                                deleteConfirmConfig
                            );
                            if (confirmed) {
                                dispath(
                                    updateSmallFieldCreditsWithDelete({
                                        fieldIndex: index,
                                        subjectIndex: data.index,
                                        type,
                                    })
                                )

                                if (data._id) {
                                    dispath(removeImportedSubject(data._id));
                                }
                                dispath(updateFieldCredits(index))
                                dispath(
                                    removeSubject({
                                        fieldIndex: index,
                                        subjectIndex: data.index,
                                        type,
                                    })
                                );

                            }
                        }}
                    >
                        <DeleteOutlined />
                    </Button>

                </div>
            ),
        },
    ];
    const electiveColumns = [
        {
            title: 'Course Name',
            render: (_, record) => {
                if (field.isElectiveNameBaseOnBigField) {
                    let smallFieldGroupList = field.electiveSubjectList.map((group, index) => {
                        return {
                            ...group,
                            index
                        }
                    })
                    smallFieldGroupList = smallFieldGroupList.filter(group => group.allocateChildId === record.allocateChildId)
                    let keyIndex = smallFieldGroupList.findIndex(group => group.index === record.index)
                    return `${field.smallField[record.allocateChildId]?.fieldName} ${keyIndex + 1}`
                }
                return `${field?.fieldName} ${record.key + 1}`;
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
                <a key='edit' onClick={() => handleOpenElectiveGroupModal({
                    ...row,
                    courseName: `${field?.fieldName} ${row.index + 1}`
                })}>Edit</a>
                ,
                <a
                    style={{ color: 'red', marginLeft: 20 }}
                    key='delete'
                    onClick={async () => {
                        const confirmed = await confirmModal.confirm(deleteConfirmConfig);
                        if (confirmed) {
                            dispath(updateSmallFieldElectiveCreditsWithDelete({ fieldIndex: index, groupIndex: row.index }))
                            dispath(updateFieldCredits(index))
                            dispath(
                                deleteGroup({ fieldIndex: index, groupIndex: row.index })
                            );
                        }
                    }}
                >
                    Delete
                </a>,
            ],
        },
    ];
    const [data, setData] = useState([]);

    const getData = () => {
        //let tempData = field.subjectList.filter((subject) => subject.isCompulsory === (type === "Compulsory" ? true : false))
        let tempData = [];
        field.subjectList.forEach((subject, index) => {
            if (subject.isCompulsory === (type === 'Compulsory' ? true : false)) {
                tempData.push({
                    ...subject,
                    index,
                    key: index,
                    indexAutogenSubjectCode: padZero(
                        field.firstIndexSubjectCode + index + 1
                    ),
                });
            }
        });
        return tempData;
    };
    useEffect(() => {
        setData(getData());
    }, [field]);

    const handleOpenElectiveGroupModal = (data) => {
        setElectiveGroupModalData(data)
        setElectiveGroupModalOpen(true)
    }
    const handleCloseElectiveGroupModal = () => {
        setElectiveGroupModalData(null)
        setElectiveGroupModalOpen(false)
    }
    const handleSubjectModalOpen = () => {
        setSubjestModalData({
            type: 'add',
            fieldIndex: index,
            modalName: `Add Subject to "${field?.fieldName}" field`,
            sujectType: type,
            subjectData: null,
            isCreateBootcamp: true,
            isViewBootcamp: false,
            fieldData: field,
        });
        setIsSubjectModalOpen(true);
    };
    const handleEditGroup = (editedData) => {
        const groupData = {
            credit: editedData.credit,
            semester: editedData.semester,
            branchMajor: editedData.branchMajor,
            allocateChildId: editedData.allocateChildId
        };
        dispath(updateSmallFieldElectiveCredits({
            groupIndex: editedData.index,
            groupData,
            fieldIndex: index
        }))
        dispath(updateFieldCredits(index))
        dispath(
            editGroup({
                fieldIndex: index,
                groupData,
                groupIndex: editedData.index,
            })
        );
    }
    const handleAddGroup = (addedData) => {
        const groupData = {
            credit: addedData.credit,
            semester: null,
            branchMajor: null,
            allocateChildId: addedData.allocateChildId
        };
        dispath(updateSmallFieldElectiveCredits({
            groupIndex: null,
            groupData,
            fieldIndex: index
        }))
        dispath(updateFieldCredits(index))
        dispath(addNewGroup({ fieldIndex: index, groupData }));
    };
    const handleDragSort = (beforeIndex, afterIndex, newDataSource) => {
        dispath(updateDragData({
            fieldIndex: index,
            beforeIndex: data[beforeIndex].index,
            afterIndex: data[afterIndex].index
        }))
        setData(newDataSource)
        // console.log(beforeIndex)
        // console.log(afterIndex)
        // console.log(newDataSource)
    }

    const handleCheckChangeGroupName = (e) => {
        dispath(changeUseSmallFieldName({
            fieldIndex: index,
            checked: e.target.checked
        }))
    }

    return (
        <>
            <ElectiveGroupModal open={electiveGroupModalOpen} handleCancel={handleCloseElectiveGroupModal} modalData={electiveGroupModalData} fieldData={field} handleAddGroup={handleAddGroup} handleEditGroup={handleEditGroup} />
            <Card
                hoverable
                style={{
                    width: '100%',
                    marginBottom: 16,
                }}
            >
                {type === 'Elective' && !isLastField ? (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                                <h2>
                                    {field?.fieldName} Course List - Total Group Credits:{' '}
                                    {groupCreditsLabel()}
                                </h2>
                                <h4 style={{ color: '#1677ff' }}>
                                    Note: For each course, Please choose 1 subject in the list
                                    below
                                </h4>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                                <Button
                                    type='primary'

                                    onClick={() => handleOpenElectiveGroupModal(null)}
                                >
                                    Add New Course
                                </Button>
                                <Checkbox onChange={handleCheckChangeGroupName} defaultChecked={field.isElectiveNameBaseOnBigField}>Use Small Field Name</Checkbox>
                            </div>



                        </div>
                        <Divider />
                        <Table
                            style={{ marginBottom: 20 }}
                            columns={electiveColumns}
                            dataSource={field.electiveSubjectList.map((group, gIndex) => ({
                                ...group,
                                key: gIndex,
                                index: gIndex,
                            }))}
                        />
                    </>
                ) : (
                    <></>
                )}
                {type === 'Elective' ? !isLastField ? (
                    <Row>
                        <Col span={1}></Col>
                        <Col span={23}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <h2>
                                    {field?.fieldName} Subject List - Total Subject Credits:{' '}
                                    {creditsLabel()}
                                </h2>
                                <Button type='primary' onClick={handleSubjectModalOpen} disabled={isLastField}>
                                    Add Subject
                                </Button>
                            </div>
                            {error ? (
                                <div style={{ color: 'red', marginTop: 10 }}>
                                    **
                                    {type === 'Compulsory'
                                        ? NOT_EQUAL_CREDITS
                                        : NOT_EQUAL_OR_HIGER_CREDITS}
                                </div>
                            ) : (
                                ''
                            )}

                            <Divider />
                            <DragSortTable columns={columns} dataSource={data} search={false} pagination={false} dragSortKey="sort" rowKey="key" onDragSortEnd={handleDragSort} options={false} />
                        </Col>
                    </Row>
                ) : (<></>) : (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <h2>
                                {field?.fieldName} Subject List - Total Subject Credits:{' '}
                                {creditsLabel()}
                            </h2>
                            <Button type='primary' onClick={handleSubjectModalOpen} disabled={isLastField}>
                                Add Subject
                            </Button>
                        </div>
                        {error ? (
                            <div style={{ color: 'red', marginTop: 10 }}>
                                **
                                {type === 'Compulsory'
                                    ? NOT_EQUAL_CREDITS
                                    : NOT_EQUAL_OR_HIGER_CREDITS}
                            </div>
                        ) : (
                            ''
                        )}

                        <Divider />
                        <DragSortTable columns={columns} dataSource={data} search={false} pagination={false} dragSortKey="sort" rowKey="key" onDragSortEnd={handleDragSort} options={false} />
                    </>
                )}
            </Card>
        </>
    );
};

export default ContentOfField;
