import { Modal,Input } from 'antd'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateElectiveSubjectNote, updateSubjectNote } from '../../redux/subject/subject';
const { TextArea } = Input;

const NoteModal = ({open, handleCancel, modalData}) => {
    const dispatch = useDispatch()
    const {checkSubjectList} = useSelector(store => store.subject)

    const [noteText,setNoteText] = useState('')

    const handleOk = () => {
        if(modalData.isCompulsory){
            let checkListIndex = checkSubjectList.findIndex(subject => subject._id === modalData._id)
            dispatch(updateSubjectNote({
                subjectIndex: checkListIndex,
                note: noteText
            }))
            handleCancel()
        }else {
            dispatch(updateElectiveSubjectNote({
                subjectIndex: modalData.checkListIndex,
                fieldIndex: modalData.fieldIndex,
                note: noteText
            }))
            handleCancel()
        }
        
    }

    useEffect(() => {
        if(modalData){
            setNoteText(modalData.note)
        }
    },[modalData])
  return (
    <Modal title='Edit Note' open={open} onCancel={handleCancel} onOk={handleOk}>
        <TextArea value={noteText} rows={10} placeholder='Enter note...' onChange={(e) => {setNoteText(e.target.value)}}/>
    </Modal>
  )
}

export default NoteModal