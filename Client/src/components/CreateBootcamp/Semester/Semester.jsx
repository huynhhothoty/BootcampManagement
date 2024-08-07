import { SearchOutlined, DeleteOutlined, WarningOutlined,MenuOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { Button, Input, Space, Table, Card, Divider, Tag, Row, Col, Tooltip } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
    deleteSemester,
    editGroup,
    removeGroupFromSemeter,
    removeSubjectFromSemester,
    swapSubjectInSemester,
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
import { DragSortTable } from '@ant-design/pro-components';

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
            title: 'Sort',
            dataIndex: 'sort',
            width:60,
            className: 'drag-visible',
        },
        {
            title: 'STT',
            dataIndex: 'key',
            width: '5%',
            render: (text,row) => {
                if(row.isBranch || row.isGroup) return ''
                else return text + 1
            }
        },
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
                                            dispatch(
                                                removeGroupFromSemeter({
                                                    fieldIndex: data.fieldIndex,
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
         const data = [];
       
        allowcateFields.forEach((field, fIndex) => {
            field.electiveSubjectList.forEach((group, gIndex) => {
              
                if (group.branchMajor !== undefined && group.branchMajor !== null) {
                    if (group.branchMajor._id) {
                        
                            if (group.semester === semesterIndex) {
                               
                                data.unshift({
                                    name: (() => {
                                        if(field.isElectiveNameBaseOnBigField){
                                            let smallFieldGroupList = field.electiveSubjectList.map((ggroup,index) => {
                                                return {
                                                    ...ggroup,
                                                    index
                                                }
                                            })
                                            smallFieldGroupList = smallFieldGroupList.filter(ggroup => ggroup.allocateChildId === group.allocateChildId)
                                            let keyIndex = smallFieldGroupList.findIndex(ggroup => ggroup.index === gIndex)
                                            return `${field.smallField[group.allocateChildId].fieldName} ${keyIndex + 1}`
                                        }
                                        return `${field?.fieldName} ${gIndex + 1}`
                                    })(),
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
                                    trueData: group
                                });
                            }
                        
                    } else {
                            if (group.semester === semesterIndex) {
                            
                                data.unshift({
                                    name: (() => {
                                        if(field.isElectiveNameBaseOnBigField){
                                            let smallFieldGroupList = field.electiveSubjectList.map((ggroup,index) => {
                                                return {
                                                    ...ggroup,
                                                    index
                                                }
                                            })
                                            smallFieldGroupList = smallFieldGroupList.filter(ggroup => ggroup.allocateChildId === group.allocateChildId)
                                            let keyIndex = smallFieldGroupList.findIndex(ggroup => ggroup.index === gIndex)
                                            return `${field.smallField[group.allocateChildId].fieldName} ${keyIndex + 1}`
                                        }
                                        return `${field?.fieldName} ${gIndex + 1}`
                                    })(),
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
                                    trueData: group
                                });
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
        const columns = [
            {
                title: 'STT',
                dataIndex: 'key',
                width: '5%',
                render: (text,row) => {
                    if(row.isBranch || row.isGroup) return ''
                    else return text + 1
                }
            },
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
                ellipsis: true,
                render: (text) => (
                    <Tooltip title={text} placement="topLeft">
                        {text}
                    </Tooltip>
                )
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
                                            dispatch(
                                                removeGroupFromSemeter({
                                                    fieldIndex: row.fieldIndex,
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

       
        return <Table columns={columns} dataSource={data} pagination={false} />;
    };
    const handleSemesterClick = () => {
        setSelectedSemester(semesterIndex);
        setIsModalOpen(true);
    };

    const { allowcateFields, branchMajorSemester } = useSelector((store) => store.createBootCamp);
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
            }else{
                if(viewedMajor){
                    let belongBranchMajorIndex = viewedMajor.branchMajor.findIndex(branch => branch._id === allowcateFields[subject.fieldIndex].subjectList[subject.subjectIndex]
                        .branchMajor)
                    if(belongBranchMajorIndex === -1){
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
                    }else {
                        if(viewedMajor.branchMajor[belongBranchMajorIndex].isActive === false){
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
                    }
                }
                
            }
        });
        allowcateFields.forEach((field, fIndex) => {
            
            field.electiveSubjectList.forEach((group, gIndex) => {

                if (group.branchMajor === undefined || group.branchMajor === null)
                    if (group.semester === semesterIndex) {
                        newSubjectArray.unshift({
                            name: (() => {
                                if(field.isElectiveNameBaseOnBigField){
                                    let smallFieldGroupList = field.electiveSubjectList.map((ggroup,index) => {
                                        return {
                                            ...ggroup,
                                            index
                                        }
                                    })
                                    smallFieldGroupList = smallFieldGroupList.filter(ggroup => ggroup.allocateChildId === group.allocateChildId)
                                    let keyIndex = smallFieldGroupList.findIndex(ggroup => ggroup.index === gIndex)
                                    return `${field.smallField[group.allocateChildId].fieldName} ${keyIndex + 1}`
                                }
                                return `${field?.fieldName} ${gIndex + 1}`
                            })(),
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
                            trueData: group
                        });
                    }
                if (typeof group.branchMajor === 'string') {
                    if(viewedMajor){
                        let belongBranchMajorIndex = viewedMajor.branchMajor.findIndex(branch => branch._id === group.branchMajor)
                        if(belongBranchMajorIndex === -1){
                            if (group.semester === semesterIndex) {
                                newSubjectArray.unshift({
                                    name: (() => {
                                        if(field.isElectiveNameBaseOnBigField){
                                            let smallFieldGroupList = field.electiveSubjectList.map((ggroup,index) => {
                                                return {
                                                    ...ggroup,
                                                    index
                                                }
                                            })
                                            smallFieldGroupList = smallFieldGroupList.filter(ggroup => ggroup.allocateChildId === group.allocateChildId)
                                            let keyIndex = smallFieldGroupList.findIndex(ggroup => ggroup.index === gIndex)
                                            return `${field.smallField[group.allocateChildId].fieldName} ${keyIndex + 1}`
                                        }
                                        return `${field?.fieldName} ${gIndex + 1}`
                                    })(),
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
                                    trueData: group
                                });
                            }
                        }else {
                            if(viewedMajor.branchMajor[belongBranchMajorIndex].isActive === false){
                                if (group.semester === semesterIndex) {
                                    newSubjectArray.unshift({
                                        name: (() => {
                                            if(field.isElectiveNameBaseOnBigField){
                                                let smallFieldGroupList = field.electiveSubjectList.map((ggroup,index) => {
                                                    return {
                                                        ...ggroup,
                                                        index
                                                    }
                                                })
                                                smallFieldGroupList = smallFieldGroupList.filter(ggroup => ggroup.allocateChildId === group.allocateChildId)
                                                let keyIndex = smallFieldGroupList.findIndex(ggroup => ggroup.index === gIndex)
                                                return `${field.smallField[group.allocateChildId].fieldName} ${keyIndex + 1}`
                                            }
                                            return `${field?.fieldName} ${gIndex + 1}`
                                        })(),
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
                                        trueData: group
                                    });
                                }
                            }
                        }
                    }
                }
            });
        });
        if (semesterIndex >= branchMajorSemester)
            if (viewedMajor) {
                viewedMajor?.branchMajor?.forEach((branch, index) => {
                    let totalCredits = 0;
                    allowcateFields.forEach((field, fIndex) => {
                        field.electiveSubjectList.forEach((group, gIndex) => {
                            if (group.branchMajor !== undefined && group.branchMajor !== null) {   
                                if (group.semester === semesterIndex) {
                                    totalCredits += group.credit
                                }
                                
                            }
                        })
                    })
                    subjectList.forEach((subject, index) => {
                        if (
                            allowcateFields[subject.fieldIndex].subjectList[subject.subjectIndex]
                                .branchMajor === branch._id
                        ) {
                            totalCredits += allowcateFields[subject.fieldIndex].subjectList[
                                subject.subjectIndex
                            ].credits
                        }
                    });
                    if(branch.isActive === true)
                        newSubjectArray.unshift({
                            ...branch,
                            key: branch._id,
                            isBranch: true,
                            isGroup: false,
                            credits: totalCredits
                        });
                });
            }

        return newSubjectArray;
    };

    const renderTooltip = () => {
        let itemMap = []
        if (viewedMajor) {
            viewedMajor?.branchMajor?.forEach((branch, index) => {
                if(branch.isActive === true){
                    let totalCredits = 0
                    allowcateFields.forEach((field, fIndex) => {
                        field.electiveSubjectList.forEach((group, gIndex) => {
                            if (group.branchMajor !== undefined && group.branchMajor !== null) {   
                                if (group.semester === semesterIndex) {
                                    totalCredits += group.credit
                                }
                                
                            }
                        })
                    })
                    subjectList.forEach((subject, index) => {
                        if (
                            allowcateFields[subject.fieldIndex].subjectList[subject.subjectIndex]
                                .branchMajor === branch._id
                        ) {
                            totalCredits += allowcateFields[subject.fieldIndex].subjectList[
                                subject.subjectIndex
                            ].credits
                        }
                    });
                    itemMap.unshift(<div key={index}>{branch.name}: {totalCredits}</div>)
                }
                
            })
        }
        return itemMap
    }

    const countTotalCredits = () => {
        let totalCredits = 0;
        subjectList.forEach((subject, index) => {
            
            if (
                (allowcateFields[subject.fieldIndex].subjectList[subject.subjectIndex]
                    .branchMajor === undefined ||
                allowcateFields[subject.fieldIndex].subjectList[subject.subjectIndex]
                    .branchMajor === null) &&
                subject.fieldIndex !== allowcateFields.length - 1
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

    const handleDragEnd = (beforeIndex, afterIndex,newDataSource) => {
        if(newDataSource[beforeIndex].isBranch === false && newDataSource[afterIndex].isGroup === false){
            dispatch(swapSubjectInSemester({
                semesterIndex,
                beforeIndex: newDataSource[afterIndex].key,
                afterIndex: newDataSource[beforeIndex].key
            }))
        }
    }

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
                    <Tooltip title={<div>{renderTooltip()}</div>}>
                    <InfoCircleOutlined style={{fontSize:18}}/>
                    </Tooltip>
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
            <DragSortTable
                expandable={{
                    expandedRowRender,
                    rowExpandable: (record) => record.branchCode !== undefined,
                }}
                columns={columns}
                dataSource={getSemesterData()}
                pagination={false}
                search={false} 
                dragSortKey="sort"
                rowKey="key"
                options={false}
                onDragSortEnd={handleDragEnd}
                dragSortHandlerRender={(row) => {
                    if(row.isBranch || row.isGroup){
                        return <></>
                    }else {
                        return <MenuOutlined className= "dragSortDefaultHandle" style={{ cursor: 'grab', color: '#999' }} />
                    }
                }}
            />
        </Card>
    );
};

export default Semester;
