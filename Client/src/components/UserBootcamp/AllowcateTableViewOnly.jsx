import React from 'react'
import { Col, Row, Space, Table, Tag,Typography } from 'antd';
import { useSelector } from 'react-redux';
const { Column, ColumnGroup } = Table;

const AllowcateTableViewOnly = ({compareData, isMain}) => {
    const { viewedAllowcatedFields } = useSelector(store => store.allowcate)
    const getCustomAllowcatedField = () => {
        let dataRender = []
        if(compareData && !isMain){
            dataRender = compareData.allowcateFields
        }else {
            dataRender = viewedAllowcatedFields
        }
        let customAllocate = []
        let allFieldCompulsoryCredits = 0
        let allFieldElectiveCredits = 0
        let allFieldtotalName = ''
        customAllocate = dataRender.map((field,index) => {
            if(index < dataRender.length - 1)
                allFieldCompulsoryCredits += field.compulsoryCredits
            allFieldElectiveCredits += field.electiveCredits
            return {
                ...field,
                key:index,
                totalCredits: field.compulsoryCredits + field.electiveCredits,
                children: field.smallField.map((sfield) => {
                    return {
                        ...sfield,
                        totalCredits: sfield.compulsoryCredits + sfield.electiveCredits,
                    }
                })
            }
        })
        customAllocate.push({
            fieldName:'Military Education',
            children: [],
            totalCredits: '165 Hours',
            isMilitary: true,
            colSpan: 3
        })
        customAllocate.push({
            fieldName:'Total Program Credits',
            compulsoryCredits: allFieldCompulsoryCredits,
            electiveCredits: allFieldElectiveCredits,
            totalCredits:  allFieldCompulsoryCredits + allFieldElectiveCredits
        })
        
        return customAllocate
    }
    return (
        <div style={{ width: compareData ? '100%' : '60%', marginInline: "auto" }}>
            
            <Table dataSource={getCustomAllowcatedField()} bordered pagination={false} scroll={{

          }} expandable={{
                defaultExpandAllRows: true
            }}>
                <Column title="Name" dataIndex="fieldName" key="fieldName" render={(value, data) => {
                    if (data.children)
                        return <p style={{ fontWeight: "bold" }}>{value}</p>
                    else return <p style={{ textAlign:'end' }}>{value}</p>
                }}
                />
                <ColumnGroup title="Credits">
                    <Column title="Total" dataIndex="totalCredits" key="totalCredits" width={"10%"} align='center' render={(value, data) => {
                    if (data.children)
                        return <p style={{ fontWeight: "bold" }}>{value}</p>
                    else return value
                }}/>
                    <Column title="Compulsory" dataIndex="compulsoryCredits" key="compulsoryCredits" width={"12%"} align='center' render={(value, data) => {
                    if (data.children)
                        return <p style={{ fontWeight: "bold" }}>{value}</p>
                    else return value
                }}/>
                    <Column title="Elective" dataIndex="electiveCredits" key="electiveCredits" width={"10%"} align='center' render={(value, data) => {
                    if (data.children)
                        return <p style={{ fontWeight: "bold" }}>{value}</p>
                    else return value
                }}/>
                </ColumnGroup>
            </Table>
        </div>

    )
}

export default AllowcateTableViewOnly