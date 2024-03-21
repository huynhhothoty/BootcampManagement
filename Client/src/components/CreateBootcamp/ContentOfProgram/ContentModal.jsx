import { Modal } from "antd"


const ContentModal = ({isModalOpen,handleCancel,childComponent}) => {
  return (
    <Modal width={"80%"} title="Subject List" open={isModalOpen}  onOk={handleCancel} onCancel={handleCancel}  footer={(_, { OkBtn, CancelBtn }) => (
        <>
          <OkBtn />
        </>
      )}>
    {childComponent}
  </Modal>

  )
}

export default ContentModal