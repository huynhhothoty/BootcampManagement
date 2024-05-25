import { Button, Result } from 'antd'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const UnauthorizedPage = () => {
    const navigate = useNavigate()
  return (
    <Result
            status="error"
            title="401"
            subTitle="Sorry, you don't have permission to access this page"
            extra={<Button type="primary" onClick={() => navigate('/')}>Back Home</Button>}
        />
  )
}

export default UnauthorizedPage