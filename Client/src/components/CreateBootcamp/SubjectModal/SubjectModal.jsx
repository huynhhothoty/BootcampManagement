import {
    Button,
    Cascader,
    Col,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Modal,
    Row,
    Select,
    Switch,
} from 'antd';
import ImportSubjectModal from '../ImportSubjectModal/ImportSubjectModal';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addSubject, editSubject, updateFieldCredits, updateSmallFieldCompulsoryCredits } from '../../../redux/CreateBootcamp/createBootCamp';
import dayjs from 'dayjs';
import subject, {
    addSubjectToViewedSemsterSubjectList,
    getAllSubject,
    updateWithNormalImportSubject,
} from '../../../redux/subject/subject';
import {
    addToViewedFields,
    editSubjestViewedFields,
    updateViewedFieldCredits,
    updateViewedSmallFieldCompulsoryCredits,
} from '../../../redux/allocate/allowcate';
import { updateCompleteCreditsToViewedBootcamp } from '../../../redux/bootcamp/bootcamp';
import { getDepartmentIndex } from '../../../util/GetDepartmentIndex/GetDepartmentIndex';
import { SUBJECT_EDITED } from '../../../util/constants/subjectStatus';
import { getDepartmentById, getMajorById, updateDepartmentList, updateViewedMajor } from '../../../redux/major/major';
const { Option } = Select;
const SubjectModal = ({
    isModalOpen,
    setIsModalOpen,
    subjectModalData,
    setIsUpdated,
}) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [isImportSubjectModalOpen, setIsImportSubjectModalOpen] = useState(false);
    const [autoIDYear, setAutoIDYear] = useState(
        dayjs(`${new Date().getFullYear()}/01/01`)
    );
    const [autoID, setAutoID] = useState('');
    const [importedSubject, setImportedSubject] = useState(null);
    const [isAutogenSubjectCode, setIsAutogenSubjectCode] = useState(true);
    const [departmentChooseList, setDepartmentChooseList] = useState([]);
    const [fieldChildList, setFieldChildList] = useState([]);

    const { viewedAllowcatedFields } = useSelector((store) => store.allowcate);
    const { departmentList,viewedMajor } = useSelector((store) => store.major);

    const handleCancel = () => {
        setAutoID('');
        setAutoIDYear(dayjs(`${new Date().getFullYear()}/01/01`));
        form.resetFields();
        setIsModalOpen(false);
    };

    const handleOpenImportModal = () => {
        setIsImportSubjectModalOpen(true);
        dispatch(
            getAllSubject(subjectModalData.sujectType === 'Compulsory' ? true : false)
        );
    };

    const handleSubmit = (a) => {
        if (subjectModalData.type === 'edit') {
            const { subjectData } = subjectModalData;
            let newSubject = {};
            newSubject = {
                ...subjectData,
                name: a.name,
                subjectCode: a.subjectCode,
                credits: a.credits,
                description: a.description,
                shortFormName: a.shortFormName,
                departmentChild: a.departmentChild[1],
                isAutoCreateCode: isAutogenSubjectCode,
                allocateChildId: a.allocateChildId
            };
            if (subjectModalData.isCreateBootcamp) {
                dispatch(updateSmallFieldCompulsoryCredits({
                    fieldIndex: subjectModalData.fieldIndex,
                    subject: newSubject,
                    subjectIndex: subjectModalData.subjectData.index,
                    updateFieldCompulsoryCredits: newSubject.credits
                }))
                dispatch(updateFieldCredits(subjectModalData.fieldIndex))
                dispatch(
                    editSubject({
                        fieldIndex: subjectModalData.fieldIndex,
                        subjectIndex: subjectModalData.subjectData.index,
                        subject: newSubject,
                    })
                );
            }


            else if (subjectModalData.isViewBootcamp) {
                if (newSubject['status']) {
                    if (!newSubject['status'].includes(SUBJECT_EDITED))
                        newSubject['status'] = [...newSubject['status'], SUBJECT_EDITED];
                } else newSubject['status'] = [SUBJECT_EDITED];
                dispatch(updateViewedSmallFieldCompulsoryCredits({
                    fieldIndex: subjectModalData.fieldIndex,
                    subjectIndex: subjectModalData.subjectData.index,
                    subject: newSubject,
                }))
                dispatch(updateViewedFieldCredits(subjectModalData.fieldIndex))
                dispatch(
                    editSubjestViewedFields({
                        fieldIndex: subjectModalData.fieldIndex,
                        subjectIndex: subjectModalData.subjectData.index,
                        subject: newSubject,
                    })
                );

                if (subjectModalData.sujectType === 'Compulsory') {
                    dispatch(
                        updateCompleteCreditsToViewedBootcamp(subjectData.credits * -1)
                    );
                    dispatch(updateCompleteCreditsToViewedBootcamp(a.credits));
                }
                setIsUpdated(true);
            }
        } else if (subjectModalData.type === 'add') {
            const newSubject = {
                ...a,
                isCompulsory: subjectModalData.sujectType === 'Compulsory' ? true : false,
                isAutoCreateCode: isAutogenSubjectCode,
                departmentChild: a.departmentChild[1],
            };
            if (subjectModalData.isCreateBootcamp) {
                dispatch(updateSmallFieldCompulsoryCredits({
                    fieldIndex: subjectModalData.fieldIndex,
                    subject: newSubject,
                    subjectIndex: null,
                    updateFieldCompulsoryCredits: newSubject.credits
                }))
                dispatch(updateFieldCredits(subjectModalData.fieldIndex))
                dispatch(
                    addSubject({
                        fieldIndex: subjectModalData.fieldIndex,
                        subject: newSubject,
                        type: subjectModalData.sujectType,
                    })
                );
            }

            else if (subjectModalData.isViewBootcamp) {
                dispatch(updateViewedSmallFieldCompulsoryCredits({
                    fieldIndex: subjectModalData.fieldIndex,
                    subjectIndex: null,
                    subject: newSubject,
                }))
                dispatch(updateViewedFieldCredits(subjectModalData.fieldIndex))
                dispatch(
                    addToViewedFields({
                        fieldIndex: subjectModalData.fieldIndex,
                        subject: newSubject,
                        type: subjectModalData.sujectType,
                    })
                );
                dispatch(
                    addSubjectToViewedSemsterSubjectList({
                        fieldIndex: subjectModalData.fieldIndex,
                        semester: null,
                        subjectIndex:
                            viewedAllowcatedFields[subjectModalData.fieldIndex]
                                .subjectList.length,
                    })
                );
                if (subjectModalData.sujectType === 'Compulsory') {
                    dispatch(updateCompleteCreditsToViewedBootcamp(a.credits));
                }

                setIsUpdated(true);
            }
        }

        setImportedSubject(null);
        form.resetFields();
        setAutoID('');
        setAutoIDYear(dayjs(`${new Date().getFullYear()}/01/01`));
        setIsModalOpen(false);
    };
    useEffect(() => {
        if (subjectModalData.type === 'edit') {
            const {
                subjectCode,
                name,
                credits,
                description,
                shortFormName,
                isAutoCreateCode,
                departmentChild,
                allocateChildId
            } = subjectModalData.subjectData;
            form.setFieldsValue({
                subjectCode,
                name,
                credits,
                description,
                shortFormName,
                allocateChildId
            });
            if (departmentChild) {
                form.setFieldValue(
                    'departmentChild',
                    getDepartmentIndex(departmentList, departmentChild)
                );
            }
            setIsAutogenSubjectCode(isAutoCreateCode);
        }
    }, [subjectModalData]);
    useEffect(() => {
        form.setFieldsValue({
            subjectCode: importedSubject?.subjectCode,
            name: importedSubject?.name,
            credits: importedSubject?.credit,
            description: importedSubject?.description,
        });
    }, [importedSubject]);

    useEffect(() => {
        let tempDepartmentChooseList = [];
        if (departmentList) {
            tempDepartmentChooseList = departmentList.map((department) => {
                return {
                    value: department._id,
                    label: department.name,
                    children: department.list.map((subDepartment) => {
                        return {
                            value: subDepartment._id,
                            label: subDepartment.name,
                        };
                    }),
                };
            });
        }
        setDepartmentChooseList(tempDepartmentChooseList);
    }, [departmentList]);

    useEffect(() => {
        (async () => {
            if(isModalOpen){
                if(viewedMajor){
                    const majorRes = await dispatch(getMajorById(viewedMajor._id))
                        
                    await dispatch(updateViewedMajor(majorRes.payload.data))
                    await dispatch(updateDepartmentList(majorRes.payload.data.department))
                    
                }
               
            }
        })()
       
    },[isModalOpen])
    useEffect(() => {
        if (subjectModalData.fieldData) {
            setFieldChildList(subjectModalData.fieldData.smallField.map((sfield, sfieldIndex) => {
                return {
                    value: sfieldIndex,
                    label: sfield?.fieldName
                }
            }))
        }

    }, [subjectModalData.fieldData])
    return (
        <>
            <Modal
                centered
                footer={false}
                title={subjectModalData.modalName}
                open={isModalOpen}
                onCancel={handleCancel}
            >
                <ImportSubjectModal
                    setImportedSubject={setImportedSubject}
                    isModalOpen={isImportSubjectModalOpen}
                    setIsModalOpen={setIsImportSubjectModalOpen}
                    importingType={subjectModalData.sujectType}
                />
                <Button
                    onClick={handleOpenImportModal}
                    style={{ marginBottom: 16, marginTop: 5 }}
                    type='dashed'
                >
                    Import Subject
                </Button>
                <Form form={form} layout='vertical' onFinish={handleSubmit}>
                    <Row gutter={16}>
                        <Col span={24}>
                            <div
                                style={{
                                    alignItems: 'center',
                                    display: 'flex',
                                    marginBottom: 10,
                                }}
                            >
                                <Switch
                                    checked={isAutogenSubjectCode}
                                    onChange={(value) => {
                                        setIsAutogenSubjectCode(value);
                                    }}
                                />
                                <span style={{ fontWeight: 'bold', marginLeft: 10 }}>
                                    Auto create Subject Code
                                </span>
                            </div>
                            <Form.Item
                                name='shortFormName'
                                label='Shortened name'
                                style={!isAutogenSubjectCode ? { display: 'none' } : {}}
                            >
                                <Input placeholder='Please enter a Subject Shortened name' />
                            </Form.Item>
                            <Form.Item
                                name='subjectCode'
                                label='Subject Code'
                                style={isAutogenSubjectCode ? { display: 'none' } : {}}
                            >
                                <Input placeholder='Please enter a Subject Shortened name' />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name='name'
                                label='Subject Name'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter Subject Name',
                                    },
                                ]}
                            >
                                <Input placeholder='Please enter Subject Name' />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name='credits'
                                label='Credits'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please select number of credits',
                                    },
                                ]}
                            >
                                <InputNumber
                                    min={0}
                                    // max={20}
                                    style={{ width: '100%' }}
                                    placeholder='Number of credits'
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name='description'
                                label='Description'
                                rules={[
                                    {
                                        required: true,
                                        message: 'please enter url description',
                                    },
                                ]}
                            >
                                <Input.TextArea
                                    rows={4}
                                    placeholder='please enter url description'
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Form.Item
                                name='departmentChild'
                                label='Department'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please choose 1 department',
                                    },
                                ]}
                            >
                                <Cascader options={departmentChooseList} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Form.Item
                                name='allocateChildId'
                                label='Field Group'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please choose 1 child field',
                                    },
                                ]}
                            >
                                <Select options={fieldChildList} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Form.Item
                                style={{ display: 'flex', justifyContent: 'flex-end' }}
                            >
                                <Button
                                    style={{ marginRight: 16 }}
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </Button>
                                <Button type='primary' htmlType='submit' >
                                    {subjectModalData.type === 'edit' ? 'Edit' : 'Add'}
                                </Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    );
};

export default SubjectModal;
