import { Outlet, useNavigate } from "react-router-dom"
import { useEffect, useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UnorderedListOutlined,
  HomeOutlined,
  PlusCircleOutlined,
  UserOutlined, 
  DownOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { Layout, Menu, Button, theme, Dropdown } from 'antd';
import { useDispatch, useSelector } from "react-redux";
import { getUserDraft } from "../../redux/CreateBootcamp/createBootCamp";
import { USER_DATA, USER_TOKEN } from "../../util/constants/sectionStorageKey";
import { setFirstUserData } from "../../redux/authentication/authentication";
import { Avatar, Space } from 'antd';
const { Header, Sider, Content } = Layout;



const Main = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { userData } = useSelector(store => store.authentication)
  const [collapsed, setCollapsed] = useState(false);
  const [headerTitle, setheaderTitle] = useState("Home");

  const handleLogout = () => {
    sessionStorage.removeItem(USER_TOKEN)
    sessionStorage.removeItem(USER_DATA)
    navigate("/login")
  }

  const items = [
    {
      label: <span onClick={handleLogout} style={{ color: "red" }}><LogoutOutlined style={{ marginRight: 20 }} /> Logout</span>,
      key: '0',
    },

  ]

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
        navigate('/createbootcamp')
        setheaderTitle('Create Bootcamp')
        break;

      case '3':
        navigate('/userbootcamp')
        setheaderTitle('My Bootcamp')
        break;

      default:
        break;
    }
  }

  useEffect(() => {
    (async () => {
      const userToken = sessionStorage.getItem(USER_TOKEN)

      if (userToken) {

        let userData = sessionStorage.getItem(USER_DATA)
        userData = JSON.parse(userData)
        dispatch(setFirstUserData(userData))
        await dispatch(getUserDraft(userData.id))

      }
      else {
        navigate('/login')
      }
    })()
  }, [])


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
              icon: <UnorderedListOutlined />,
              label: 'My Bootcamp',
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <div style={{
            display: "flex",
          }}>
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
          </div>
          <Dropdown
            menu={{
              items,
            }}
            trigger={['click']}
          >
            <div style={{ marginRight: 20, cursor: "pointer" }}>
              <Avatar size="large" icon={<UserOutlined />} />
              <span style={{ marginInline: 10 }}>{userData?.name}</span>
              <DownOutlined />
            </div>
          </Dropdown>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>

  )
}

export default Main