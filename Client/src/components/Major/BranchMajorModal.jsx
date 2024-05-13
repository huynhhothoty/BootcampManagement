import { Button, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import BranchMajorList from './BranchMajorList'
import { useDispatch } from 'react-redux'
import { addBranchMajor, updateBranchMajor, updateMajor } from '../../redux/major/major'


const BranchMajorModal = ({ branchList, open, handleClose,majorId, handleUpdate, reloadTable }) => {
    const dispatch = useDispatch()
    const [updatedList, setUpdatedList] = useState([])
    const [addedList, setAddedList] = useState([])
    const [loading,setLoading] = useState(false)

    const handleChange = (data,type) => {
        if(type === 'edit'){
            let tempUpdatedList = [...updatedList]
            tempUpdatedList.push(data)
            setUpdatedList(tempUpdatedList)

            let newBranchList = [...branchList]
            newBranchList[data.index].name = data.name
            newBranchList[data.index].branchCode = data.branchCode
            handleUpdate(newBranchList)
        }else if(type === 'add'){
            let tempAddedList = [...addedList]
            tempAddedList.push(data)
            setAddedList(tempAddedList)
            let newBranchList = [...branchList, data]
            handleUpdate(newBranchList)
        }
    }

    const handleUpdateBranchMajor = async (data) => {
        let branchMajorId = data._id
        let updatedData = {
            name: data.name,
            branchCode: data.branchCode
        }
        await dispatch(updateBranchMajor({branchId: branchMajorId, data: updatedData}))
    }

    const handleCreateBranchMajor = async (data) => {
        const res = await dispatch(addBranchMajor(data))
        return res.payload.data._id
    }

    const handleOk = async () => {
        setLoading(true)
        if(updatedList.length > 0){
            for (let i = 0; i < updatedList.length; i++) {
                const updatedBranch = updatedList[i];
                await handleUpdateBranchMajor(updatedBranch)
            }
        }
        if(addedList.length > 0){
            let newBranchIds = []
            for (let i = 0; i < addedList.length; i++) {
                const addedBranch = addedList[i];
                const newId = await handleCreateBranchMajor(addedBranch)
                newBranchIds.push(newId)
            }
            let oldBranchIds = branchList.map(branch => branch._id)
            await dispatch(updateMajor({majorId: majorId, data: {branchMajor: [...oldBranchIds, ...newBranchIds]}}))
        }
        reloadTable()
        handleClose()
        setLoading(false)
    }

    useEffect(() => {
        setUpdatedList([])
        setAddedList([])
    }, [open])

    return (
        <Modal title="All Department's Specialization" open={open} onCancel={handleClose} width={1000} onOk={handleOk} okButtonProps={{loading:loading}}>
            
                <BranchMajorList branchList={branchList} handleChange={handleChange}/>
          
        </Modal>
    )
}

export default BranchMajorModal