export const getDepartmentIndex = (departmentList,deparmentChildId) => {
    let departmentIndexData = []
    departmentList.forEach((department,index) => {
        let departmentChildIndex = department.list.findIndex(departmentChild => departmentChild._id === deparmentChildId)
        if(departmentChildIndex !== -1)
            departmentIndexData = [department._id,department.list[departmentChildIndex]._id]
    })

    return departmentIndexData
}