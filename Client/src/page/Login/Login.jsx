import { Button, Checkbox, Form, Input } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../redux/authentication/authentication';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const { loading } = useSelector((store) => store.authentication);

    const onFinish = async (values) => {
        const a = await dispatch(
            login({
                email: values.email,
                password: values.password,
            })
        );

        if (a.payload.status === 401) {
            setError(a.payload.message);
        }
        if (a.payload.status === 'ok') {
            navigate('/');
        }
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    return (
        <div className='background-container'>
            <div className='background-image'></div>
            <div className='login-form-container'>
                <div className='login-form-header'>
                    <h1>Welcome back</h1>
                    <p>Login to the Dashboard</p>
                </div>
                <Form
                    name='basic'
                    className='login-form'
                    style={{
                        maxWidth: 600,
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete='off'
                    layout='vertical'
                >
                    <p style={{ color: 'red' }}>{error}</p>
                    <Form.Item
                        label='Email'
                        name='email'
                        rules={[
                            {
                                required: true,
                                message: 'Please input your email!',
                            },
                        ]}
                    >
                        <Input size='large' />
                    </Form.Item>

                    <Form.Item
                        label='Password'
                        name='password'
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password!',
                            },
                        ]}
                    >
                        <Input.Password size='large' />
                    </Form.Item>

                    {/* <Form.Item
            name="remember"
            valuePropName="checked"

          >
            <Checkbox>Remember me</Checkbox>
          </Form.Item> */}

                    <Form.Item>
                        <Button
                            size='large'
                            loading={loading}
                            style={{
                                width: '100%',
                            }}
                            type='primary'
                            htmlType='submit'
                        >
                            Login
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default Login;
