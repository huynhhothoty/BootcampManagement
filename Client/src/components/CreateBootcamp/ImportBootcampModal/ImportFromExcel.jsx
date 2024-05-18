import { Button, Upload, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons';
import { importBootcampFromExcelFile } from '../../../util/api/bootcamp/bootcampApi';
import { USER_TOKEN } from '../../../util/constants/sectionStorageKey';
const userToken = sessionStorage.getItem(USER_TOKEN);
const ImportFromExcel = ({importFunc,style}) => {
    const props = {
        name: 'excelFile',
        multiple: true,
        action: importBootcampFromExcelFile,
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        onChange(info) {
          if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
            console.log(info.file.response.data)
            importFunc(info.file.response.data)
          } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
          }
        },
      };
  return (
    <Upload {...props}>
    <Button icon={<UploadOutlined />} style={style}>Import with Excel File</Button>
  </Upload>
  )
}

export default ImportFromExcel