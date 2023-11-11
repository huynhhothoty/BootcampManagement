import { SearchOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { useEffect, useRef, useState } from 'react'
import Highlighter from 'react-highlight-words'
import { Button, Input, Space, Table, Card, Divider, Tag, Row, Col, InputNumber, Popconfirm } from 'antd'
import { useDispatch } from 'react-redux'
import { addNewGroup, deleteGroup, editGroup, removeSubject } from '../../../redux/CreateBootcamp/createBootCamp'
import { NOT_EQUAL_CREDITS, NOT_EQUAL_OR_HIGER_CREDITS, VIEW_GROUP_CREDITS_NOT_EQUAL_TOTAL_CREDITS } from '../../../util/constants/errorMessage'
import { deleteConfirmConfig } from '../../../util/ConfirmModal/confirmConfig'
import { removeImportedSubject } from '../../../redux/subject/subject'



const ContentOfField = ({ error, field, type, setIsSubjectModalOpen, setSubjestModalData, index, confirmModal, groupError }) => {
    const dispath = useDispatch()
    const [searchText, setSearchText] = useState('')
    const [searchedColumn, setSearchedColumn] = useState('')
    const searchInput = useRef(null)
    const [groupCredits, setGroupCredits] = useState(0)
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm()
        setSearchText(selectedKeys[0])
        setSearchedColumn(dataIndex)
    }
    const handleReset = (clearFilters) => {
        clearFilters()
        setSearchText('')
    }

    const creditsLabel = () => {

        let totalActureSubjectCredits = 0
        field.subjectList.forEach((subject) => {
            if (subject.isCompulsory === (type === "Compulsory" ? true : false)) {
                totalActureSubjectCredits += subject.credits
            }
        })
        if (type === "Compulsory") {
            return (<span style={{ color: totalActureSubjectCredits === field.compulsoryCredits ? "#5cb85c" : "red" }} >{totalActureSubjectCredits}/{field.compulsoryCredits}</span>)
        } else return (<span style={{ color: totalActureSubjectCredits >= field.electiveCredits ? "#5cb85c" : "red" }} >{totalActureSubjectCredits}/{field.electiveCredits}</span>)
    }

    const groupCreditsLabel = () => {

        let totalActureSubjectCredits = 0
        field.electiveSubjectList.forEach(group => {
            totalActureSubjectCredits += group.credit
        })
       
        return (<span style={{ color: totalActureSubjectCredits === field.electiveCredits ? "#5cb85c" : "red" }} >{totalActureSubjectCredits}/{field.electiveCredits}</span>)
        
    }
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
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
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            })
                            setSearchText(selectedKeys[0])
                            setSearchedColumn(dataIndex)
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close()
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
                setTimeout(() => searchInput.current?.select(), 100)
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
    })

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
            width: '5%',

        },

        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description'
        },

        {
            title: 'Action',
            width: '12%',
            render: (_, data) => (
                <Row>
                    <Col span={12}>
                        <Button type='default' danger onClick={async () => {
                            console.log(data.index)
                            const confirmed = await confirmModal.confirm(deleteConfirmConfig)
                            if (confirmed) {
                                if (data._id) {
                                    dispath(removeImportedSubject(data._id))
                                }
                                dispath(removeSubject({
                                    fieldIndex: index,
                                    subjectIndex: data.index,
                                    type
                                }))
                            }

                        }}>
                            <DeleteOutlined />
                        </Button>
                    </Col>
                    <Col span={12}>
                        <Button type='default' onClick={() => {
                            setSubjestModalData({
                                type: "edit",
                                fieldIndex: index,
                                modalName: `Edit Subject`,
                                sujectType: type,
                                subjectData: data
                            })
                            setIsSubjectModalOpen(true)
                        }}>
                            <EditOutlined />
                        </Button>
                    </Col>
                </Row>
            ),
        },
    ]
    const electiveColumns = [
        {
          title: 'Group Name',
          render: (_, record) => {
            return `${field.fieldName} ${record.key + 1}`
          },
          width: '55%'
        },
    
        {
          title: 'Credits',
          dataIndex: 'credit',
          valueType: 'digit',
          fieldProps: {
            placeholder: "Credits"
          },
          width: "40%"
        },
    
    
        {
          title: '',
          valueType: 'option',
          width: "5%",
          render: (_, row) => [
            <Popconfirm
              title="Edit Credits"
              onOpenChange={() => setGroupCredits(row.credit)}
              description={<InputNumber value={groupCredits} onChange={(value) => setGroupCredits(value)} />}
              onConfirm={() => {
                const groupData = {
                  credit: groupCredits,
                  semester: row.semester,
                  branchMajor: row.branchMajor
                }
                dispath(editGroup({ fieldIndex: index, groupData, groupIndex: row.index }))
                setGroupCredits(0)
              }}
              onCancel={() => setGroupCredits(0)}
              okText="Edit"
              cancelText="Cancel"
            >
              <a
                key="edit"
              >
                Edit
              </a>
            </Popconfirm>
    
            ,
            <a
              style={{ color: "red", marginLeft: 20 }}
              key="delete"
              onClick={async () => {
                const confirmed = await confirmModal.confirm(deleteConfirmConfig)
                if (confirmed) {
                  dispath(deleteGroup({fieldIndex:index, groupIndex: row.index}))
                }
    
              }}
            >
              Delete
            </a>
          ],
        },
      ]
    const [data, setData] = useState([])

    const getData = () => {
        //let tempData = field.subjectList.filter((subject) => subject.isCompulsory === (type === "Compulsory" ? true : false))
        let tempData = []
        field.subjectList.forEach((subject, index) => {
            if (subject.isCompulsory === (type === "Compulsory" ? true : false)) {
                tempData.push({
                    ...subject,
                    index,
                    key: index
                })
            }
        })
        return tempData
    }
    useEffect(() => {
        setData(getData())
    }, [field])


    const handleSubjectModalOpen = () => {
        setSubjestModalData({
            type: "add",
            fieldIndex: index,
            modalName: `Add Subject to "${field.fieldName}" field`,
            sujectType: type,
            subjectData: null,
            isCreateBootcamp: true,
            isViewBootcamp: false
        })
        setIsSubjectModalOpen(true)

    }
    const handleAddGroup = () => {
        const groupData = {
            credit: groupCredits,
            semester: null,
            branchMajor: null
          }
        dispath(addNewGroup({fieldIndex: index, groupData}))
    }

    return (
        <Card
            hoverable
            style={{
                width: "100%",
                marginBottom: 16
            }}
        >
              {type === "Elective" ?
                <>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <h2>{field.fieldName} - Total Group Credits: {groupCreditsLabel()}</h2>
                        <Popconfirm
                              title="Credits"
                              onOpenChange={() => setGroupCredits(0)}
                              description={<InputNumber value={groupCredits} onChange={(value) => setGroupCredits(value)} />}
                              onConfirm={() => {
                                handleAddGroup()
                                setGroupCredits(0)
                              }}
                              onCancel={() => setGroupCredits(0)}
                              okText="Add"
                              cancelText="Cancel"
                            >
                              <Button type='primary' disabled={field.electiveCredits <= 0 ? true : false}>Add New Group</Button>
                            </Popconfirm>
                      
                    </div>
                    {
                        groupError ? <div style={{ color: "red", marginTop: 10 }}>**{VIEW_GROUP_CREDITS_NOT_EQUAL_TOTAL_CREDITS}</div> : ""
                    }
                    <Divider />
                    <Table style={{marginBottom: 20}} columns={electiveColumns} dataSource={field.electiveSubjectList.map((group,gIndex) => ({...group,key: gIndex,index: gIndex}) )} />
                </>
                :
                <></>
            }
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h2>{field.fieldName} - Total Subject Credits: {creditsLabel()}</h2>
                <Button type="primary" onClick={handleSubjectModalOpen}>
                    Add Subject
                </Button>
            </div>
            {
                error ? <div style={{ color: "red", marginTop: 10 }}>**{type === "Compulsory" ? NOT_EQUAL_CREDITS : NOT_EQUAL_OR_HIGER_CREDITS}</div> : ""
            }

            <Divider />
            <Table columns={columns} dataSource={data} />
            
          

        </Card>
    )
}

export default ContentOfField