import { Outlet, useNavigate } from "react-router-dom"
import  { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  HomeOutlined,
  PlusCircleOutlined,
  
} from '@ant-design/icons';
import { Layout, Menu, Button, theme } from 'antd';
const { Header, Sider, Content } = Layout;
const Main = () => {

  const navigate = useNavigate()

  const [collapsed, setCollapsed] = useState(false);
  const [headerTitle, setheaderTitle] = useState("Home");

  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const handleMenuSelect = (item) => {
    switch (item.key) {
      case '1':
        navigate("")
        setheaderTitle('Home')
        break;
      
      case '2': 
        navigate('/createBootcamp')
        setheaderTitle('Create Bootcamp')
        break;

      default:
        break;
    }
  }
  return (

    <Layout id="main-container">
      <Sider trigger={null} collapsible collapsed={collapsed}>
        {/* <div className="demo-logo-vertical">
          <img src={require("./../assets/logo.png")}/>
        </div> */}
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          onSelect={handleMenuSelect}
          items={[
            {
              key: '1',
              icon: <HomeOutlined />,
              label: 'Home',
            },
            {
              key: '2',
              icon: <PlusCircleOutlined />,
              label: 'Create Bootcamp',
            },
            {
              key: '3',
              icon: <UploadOutlined />,
              label: 'nav 3',
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display:"flex",
            alignItems:"center"
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <h2>{headerTitle}</h2>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          <Outlet/>
        </Content>
      </Layout>
    </Layout>

  )
}

export default Main