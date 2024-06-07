import { Modal } from "antd"
import { useEffect, useState } from "react"


const ContentModal = ({isModalOpen,handleCancel,children}) => {
  const [tempComponent,setTempComponent] = useState(<></>)
  useEffect(() => {
    setTempComponent(children)
  },[children])
  return (
    <Modal width={"80%"} title="Subject List" open={isModalOpen}  onOk={handleCancel} onCancel={handleCancel}  footer={(_, { OkBtn, CancelBtn }) => (
        <>
          <OkBtn />
        </>
      )}>
    {tempComponent}
  </Modal>

  )
}

export default ContentModal