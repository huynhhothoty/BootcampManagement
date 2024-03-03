import { UploadOutlined } from '@ant-design/icons';
import { Button, message, Upload } from 'antd';
const props = {
  name: 'excelFile',
  multiple: false,
  action: 'http://localhost:3000/api/import',
  headers: {
    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MTAxMWQzMjcwZjRiZGM2M2RiMzQwOSIsImlhdCI6MTcwNTkwNDQ0NSwiZXhwIjoxNzA2MTYzNjQ1fQ.eiz_abq_M_npKKHoxthq099CgO6mssekhCKWDyOqQrs`,
  },
  onChange(info) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
      console.log(info.file)
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

const TestComp = () => {
  return (
    <Upload {...props}>
    <Button icon={<UploadOutlined />}>Click to Upload</Button>
  </Upload>
  )
}

export default TestComp