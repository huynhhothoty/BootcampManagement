import { useState, useRef } from 'react';
import { Modal, Divider, Table, Tag, Button, Space, Input } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import AllSubject from '../../../page/Subject/AllSubject';

const ImportSubjectModal = ({ isModalOpen, setIsModalOpen, setImportedSubject, importingType }) => {
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [error, setError] = useState(false);

    const handleCancel = () => {
        setIsModalOpen(false);
        setSelectedRowKeys([]);
        setSelectedSubject(null);
        setError(false);
    };

    const handleImportSubject = () => {
        if (selectedSubject) {
            setImportedSubject(selectedSubject[0]);
            setError(false);
            setIsModalOpen(false);
            setSelectedRowKeys([]);
            setSelectedSubject(null);
        }else {
            setError(true);
        }
        
    };
    return (
        <>
            <Modal
                centered
                width={1200}
                okText={'Ok'}
                cancelText={'Cancel'}
                onOk={handleImportSubject}
                title='Import a Subject'
                open={isModalOpen}
                onCancel={handleCancel}
            >
                <div>
                    {error ? (
                        <div style={{ color: 'red' }}>
                            ** You need to choose a subject
                        </div>
                    ) : (
                        ''
                    )}
                    <Divider />
                    <AllSubject isSelect={true} importingType={importingType} setSelectedSubject={setSelectedSubject} selectedRowKeys={selectedRowKeys} setSelectedRowKeys={setSelectedRowKeys}/>
                    {/* <Table
                        rowSelection={{
                            type: 'radio',
                            ...rowSelection,
                        }}
                        columns={columns}
                        dataSource={allSubjectList}
                    /> */}
                </div>
            </Modal>
        </>
    );
};

export default ImportSubjectModal;
