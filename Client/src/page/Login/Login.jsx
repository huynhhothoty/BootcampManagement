import { Button, Checkbox, Form, Input } from 'antd';

const Login = () => {
  const onFinish = (values) => {
    console.log('Success:', values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <div className="background-container">
      <div className="background-image"></div>
      <div className="login-form-container">
        <div className="login-form-header">
          <h1>Welcom back</h1>
          <p>Login to the Dashboard</p>
        </div>
        <Form
          name="basic"
          className='login-form'
          style={{
            maxWidth: 600,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: 'Please input your username!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="remember"
            valuePropName="checked"
           
          >
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item>
            
            <Button style={{width:"100%"}} type="primary" htmlType="submit">
              Login
            </Button>
         
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default Login