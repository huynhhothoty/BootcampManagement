import { ProCard, ProDescriptions } from '@ant-design/pro-components';
import { Divider, Input, Tooltip } from 'antd';
import { useRef } from 'react';
import { LeftOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import AllowcateDisplay from './AllowcateDisplay';
import BigFieldDisplay from './BigFieldDisplay';
import SubjectDisplayTable from './SubjectDisplayTable';
import SemesterTableDisplay from './SemesterTableDisplay';

const BootcampDetail = ({confirmModal}) => {
    const actionRef = useRef();
    const { viewedBootcamp } = useSelector(store => store.bootcamp)
    const { viewedAllowcatedFields } = useSelector(store => store.allowcate)
    console.log(viewedAllowcatedFields)
    const { viewedSemesterList } = useSelector(store => store.subject)
    
    const renderAllowcate = () => {
        return viewedAllowcatedFields.map((field, index) => {
            return (<>
                <Divider />
                <BigFieldDisplay field={field} key={index} index={index} confirmModal={confirmModal}/>
            </>)
        })
    }
    const renderFieldSubject = (type) => {
        return viewedAllowcatedFields.map((field,index) => {
            if(type === "compulsory"){
                const subjectList = []
                field.subjectList.forEach((subject,sindex) => {
                    if(subject.isCompulsory === true){
                        subjectList.push({...subject,fieldSubjectListIndex: sindex,id:subject._id})
                    }
                })
                return <SubjectDisplayTable key={index} fieldName={field.fieldName} fieldIndex={index} subjectList={subjectList} totalCredits={field.compulsoryCredits} type={type}/>
            }else if(type === "elective"){
                const subjectList = []
                field.subjectList.forEach((subject,sindex) => {
                    if(subject.isCompulsory === false){
                        subjectList.push({...subject,fieldSubjectListIndex: sindex,id:subject._id})
                    }
                })
                return <SubjectDisplayTable key={index} fieldName={field.fieldName} fieldIndex={index} subjectList={subjectList} totalCredits={field.electiveCredits} type={type}/>
            }
        })
    }

    const renderSemester = () => {
        return viewedSemesterList.map((semester,index) => {
            let subjectList = []
            subjectList = semester.map((subject) => {
                return viewedAllowcatedFields[subject.fieldIndex].subjectList[subject.subjectIndex]
            })
            return <SemesterTableDisplay key={index} semesterIndex={index} subjectList={subjectList}/>
        })
    }
    return (
        <div>
            <ProDescriptions
                actionRef={actionRef}
                // bordered
                formProps={{
                    onValuesChange: (e, f) => console.log(f),
                }}

                request={async () => {
                    return Promise.resolve({
                        success: true,
                        data: viewedBootcamp,
                    });
                }}
                editable={{}}
                columns={[
                    {
                        title: 'Bootcamp Name',
                        key: 'bootcampName',
                        dataIndex: 'bootcampName',
                        ellipsis: true,
                    },
                    {
                        title: 'Total Credits',
                        key: 'totalCredits',
                        dataIndex: 'totalCredits',
                        ellipsis: true,
                    },

                ]}
            >

            </ProDescriptions>
            <ProCard collapsible bodyStyle={{ paddingTop: 0, paddingBottom: 25 }} bordered hoverable title="Allowcate of Credits">
                {renderAllowcate()}
            </ProCard>
            <ProCard collapsible bodyStyle={{ paddingTop: 0, paddingBottom: 25 }} style={{ marginTop: 20 }} bordered hoverable title="Compulsory Subject">
                {renderFieldSubject("compulsory")}
            </ProCard>
            <ProCard collapsible bodyStyle={{ paddingTop: 0, paddingBottom: 25 }} style={{ marginTop: 20 }} bordered hoverable title="Elective Subject">
            {renderFieldSubject("elective")}
            </ProCard>
            <ProCard collapsible bodyStyle={{ paddingTop: 0, paddingBottom: 25 }} style={{ marginTop: 20 }} bordered hoverable title="Semester Plan">
                {renderSemester()}
            </ProCard>

        </div>
    )
}

export default BootcampDetail