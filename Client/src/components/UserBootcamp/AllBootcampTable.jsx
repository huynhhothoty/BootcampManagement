import { Button, Input, Space, Table } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    exportBootcamp,
    getAllBootcamp,
    getBootcampsByUserID,
    queryAllBootcamp,
    updateViewedBootcamp,
} from '../../redux/bootcamp/bootcamp';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
    getAllowcatById,
    updateViewedAllocatedField,
} from '../../redux/allocate/allowcate';
import {
    updateViewedSemesterList,
    updateViewedSemesterSubjectLis,
    updateViewedSubjectList,
} from '../../redux/subject/subject';
import { updateLoading } from '../../redux/loading/Loading';
import { SUBJECT_ADDED_IMPORT } from '../../util/constants/subjectStatus';
import { getMajorById, queryAllMajor, updateViewedMajor } from '../../redux/major/major';
import { DownloadOutlined } from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-components';
import { copyObjectWithKeyRename, objectToQueryString } from '../../util/TableParamHandle/tableParamHandle';

const AllBootcampTable = ({isModal,selectedRowKeys,setSelectedRowKeys,setSelectedBootcamp, viewingBootcampId, viewedMajorId}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userData } = useSelector((store) => store.authentication);
    const { loading, userBootcampList } = useSelector((store) => store.bootcamp);
    const [error, setError] = useState(false);



    const { setBreadCrumbList } = useOutletContext();

    const handleViewBootcamp = async (data, viewType) => {
        dispatch(updateLoading(true));

        let bootcampName = data.name;
        let totalCredits = parseInt(data.totalCredit);
        let completeTotalCredits = data.totalCredit;
        let allowcateFields = [];
        let semesterSubjectList = [];
        let semesterList = [[]];
        const tempAllowcateFields = await dispatch(getAllowcatById(data.allocation));

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
                        fieldName: smallField.name,
                    };
                }),
                subjectList: field.subjectList.map((subject, sindex) => {
                    semesterSubjectList.push({
                        fieldIndex: index,
                        subjectIndex: sindex,
                        semester: null,
                        _id: subject._id,
                    });
                    const a = {
                        credits: subject.credit,
                        description: subject.description,
                        isCompulsory: subject.isCompulsory,
                        name: subject.name,
                        subjectCode: subject.subjectCode,
                        status: [SUBJECT_ADDED_IMPORT],
                        branchMajor:
                            subject.branchMajor !== undefined
                                ? subject.branchMajor !== null
                                    ? subject.branchMajor
                                    : null
                                : null,
                        _id: subject._id,
                        shortFormName: subject.shortFormName ? subject.shortFormName : '',
                        isAutoCreateCode: subject.isAutoCreateCode
                            ? subject.isAutoCreateCode
                            : false,
                        departmentChild: subject.departmentChild
                            ? subject.departmentChild
                            : undefined,
                        allocateChildId: (subject.allocateChildId !== undefined && subject.allocateChildId !== null) ? field.detail.findIndex(sField => sField._id === subject.allocateChildId) : null,
                    };

                    return a;
                }),
                electiveSubjectList:  field.electiveSubjectList.map((group) => {
                    let newGroupData = { ...group }
                    if (newGroupData.allocateChildId !== undefined && newGroupData.allocateChildId !== null) {
                      newGroupData.allocateChildId = field.detail.findIndex(sField => sField._id === newGroupData.allocateChildId)
                    }
                    return newGroupData
                  }),
            };
        });
        semesterList = data.detail.map((semester, index) => {
            return semester.subjectList.map((subject) => {
                const semesterSubjectListIndex = semesterSubjectList.findIndex(
                    (sSubject) => sSubject._id === subject
                );

                semesterSubjectList[semesterSubjectListIndex].semester = index;
                const a = semesterSubjectList[semesterSubjectListIndex];
                allowcateFields[a.fieldIndex].subjectList[a.subjectIndex]['semester'] =
                    index;

                return {
                    ...a,
                    semesterSubjectListIndex,
                };
            });
        });
        dispatch(
            updateViewedAllocatedField({ data: allowcateFields, id: data.allocation })
        );
        dispatch(
            updateViewedBootcamp({
                id: data._id,
                bootcampName,
                totalCredits,
                completeTotalCredits,
                major:data.major
            })
        );
        await dispatch(getMajorById(data.major));
        dispatch(updateViewedSemesterList(semesterList));
        dispatch(updateViewedSemesterSubjectLis(semesterSubjectList));
        dispatch(updateLoading(false));
        setBreadCrumbList([
            {
                title: <a>All Bootcamp</a>,
                onClick: () => {
                    navigate('/userbootcamp');
                    setBreadCrumbList([
                        {
                            title: 'All Bootcamp',
                        },
                    ]);
                },
            },
            {
                title: data.name,
            },
        ]);
        navigate('/userbootcamp/viewbootcamp', {
            state: { viewedBootcampData: data, viewType },
        });
    };

    const columns = [
        {
            title: 'BootCamp Name',
            dataIndex: 'name',
            copyable: true,
            ellipsis: true,
        },
        {
            title: 'Total Credits',
            dataIndex: 'totalCredit',
            ellipsis: true,
        },
        {
            title: 'Created Year',
            dataIndex: 'year',
            ellipsis: true,
            valueType:'dateYear',
            render: (text,row) => {
                return row.year
            }
        },
        {
            title: 'Major',
            dataIndex: 'major',
            valueType:'select',
            hideInTable:true,
            request: async () => {
                const majorRes = await dispatch(queryAllMajor('isActive=true'))
                let dataList = majorRes.payload.data.map((major) => {
                    return {
                        label: major.name,
                        value: major._id
                    }
                })
                return dataList
            },
            hideInSearch: viewedMajorId ? true : false
        },
        {
            title: '',
            dataIndex: '',
            width: '17%',
            hideInSearch: true,
            hideInTable: isModal,
            render: (_, data) => (
                <Space style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                        onClick={() => {
                            handleViewBootcamp(data, 'view');
                        }}
                    >
                        View
                    </Button>
                    <Button
                        type='primary'
                        onClick={() => {
                            handleViewBootcamp(data, 'edit');
                        }}
                    >
                        Edit
                    </Button>
                    <Button
                        type='primary'
                        icon={<DownloadOutlined />}
                        style={{ backgroundColor: '#229a59' }}
                        onClick={() => {
                            dispatch(
                                exportBootcamp({
                                    bootcampID: data._id,
                                    bootcampName: data.name,
                                })
                            );
                        }}
                    >
                        Export
                    </Button>
                </Space>
            ),
        },
    ];

    const rowSelection = {
        selectedRowKeys: selectedRowKeys,
        onChange: async (selectedRowKeys, selectedRows) => {
            setSelectedRowKeys(selectedRowKeys);
            // const a = await handleGetCompareBootcampData(selectedRows[0])
            setSelectedBootcamp(selectedRows[0]);
        },
    };


    useEffect(() => {
        dispatch(getBootcampsByUserID());
    }, []);
    return <div>
        <ProTable
            cardBordered
            tableAlertRender={false}
            columnsState={{
                persistenceKey: 'pro-table-singe-demos',
                persistenceType: 'localStorage',
                defaultValue: {
                    option: { fixed: 'right', disable: true },
                },
            }}
            rowSelection={isModal ? {
                type: 'radio',
                ...rowSelection,
                getCheckboxProps: (record) => ({
                    disabled: record._id === viewingBootcampId,
                    // Column configuration not to be checked
                  })
            }: false}
            rowKey="key"
            search={{
                labelWidth: 'auto',

            }} 
            columns={columns} 
            request={async (params) => {
                let newParams = copyObjectWithKeyRename(params)
                newParams = {
                    ...newParams,
                    isActive: true
                }
                let queryString = objectToQueryString(newParams)
             
                const res = await dispatch(queryAllBootcamp(queryString))
                let newData = res.payload.data.map((bootcamp) => {
                    return {
                        ...bootcamp,
                        key: bootcamp._id
                    }
                })
                return {
                    data: newData,
                    success: true,
                    total: res.payload.total,
                }
            }}
            params={viewedMajorId ? {
                major: viewedMajorId
            }: null}
            options={{
                setting: {
                    listsHeight: 400,
                },
            }}
            pagination={{
                pageSize: 10,
            }}
            dateFormatter="string"
            />
    </div>;
};

export default AllBootcampTable;
