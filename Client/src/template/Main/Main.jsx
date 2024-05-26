import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UnorderedListOutlined,
  HomeOutlined,
  PlusCircleOutlined,
  UserOutlined,
  DownOutlined,
  LogoutOutlined,
  ProfileOutlined,
  KeyOutlined,
  BookOutlined,
  BlockOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { Layout, Menu, Button, theme, Dropdown } from 'antd';
import { useDispatch, useSelector } from "react-redux";
import { getUserDraft } from "../../redux/CreateBootcamp/createBootCamp";
import { USER_DATA, USER_TOKEN } from "../../util/constants/sectionStorageKey";
import { setFirstUserData } from "../../redux/authentication/authentication";
import { Avatar, Space } from 'antd';
import ProfileDrawer from "../../components/User/ProfileDrawer";
const { Header, Sider, Content } = Layout;



const Main = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { userData } = useSelector(store => store.authentication)
  const { draftID } = useSelector(store => store.createBootCamp)
  const [collapsed, setCollapsed] = useState(false);
  const [headerTitle, setheaderTitle] = useState("Home");
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerType, setDrawerType] = useState('')

  const handleLogout = () => {
    sessionStorage.removeItem(USER_TOKEN)
    sessionStorage.removeItem(USER_DATA)
    navigate("/login")
  }

  const handleCloseDrawer = () => {
    setDrawerOpen(false)
  }

  const handleOpenDrawer = (type) => {
    setDrawerType(type)
    setDrawerOpen(true)
  }

  const items = [
    {
      label: <span onClick={() => handleOpenDrawer('profile')}><ProfileOutlined style={{ marginRight: 20 }} /> Profile</span>,
      key: '0',
    },
    {
      label: <span onClick={() => handleOpenDrawer('password')}><KeyOutlined  style={{ marginRight: 20 }} /> Change Password</span>,
      key: '1',
    },
    {
      label: <span onClick={handleLogout} style={{ color: "red" }}><LogoutOutlined style={{ marginRight: 20 }} /> Logout</span>,
      key: '2',
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
      case '4':
        navigate('/subject')
        setheaderTitle('All Subject')
        break;
      
      case '5':
        navigate('/department')
        setheaderTitle('All Department')
        break;
      case '6':
        navigate('/major')
        setheaderTitle('All Major')
        break;
      case '7':
        navigate('/user')
        setheaderTitle('All User Account')
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
        if (draftID !== "")
          await dispatch(getUserDraft(userData.id))

      }
      else {
        navigate('/login')
      }
    })()
  }, [])

  const adminOptions = [
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
    {
      key: '4',
      icon: <BookOutlined />,
      label: 'Subject',
    },
    {
      key: '5',
      icon: <BlockOutlined />,
      label: 'Department',
    },
    {
      key: '6',
      icon: <CalendarOutlined />,
      label: 'Major',
    },
    {
      key: '7',
      icon: <UserOutlined />,
      label: 'User',
    },
  ]
  const teacherOptions = [
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
  ]

  useEffect(() => {
    let userData = sessionStorage.getItem(USER_DATA)
    if(userData){
      userData = JSON.parse(userData)
      if(userData.role !== "admin"){
        if(location.pathname !== "/" && location.pathname !== "/createbootcamp" && location.pathname !== "/userbootcamp" && location.pathname !== "/userbootcamp/viewbootcamp"){
          navigate('/unauthorized')
        }
      }
    }
    

  },[location])

  return (

    <Layout id="main-container">
      <ProfileDrawer open={drawerOpen} onClose={handleCloseDrawer} drawerType={drawerType}/>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        {/* <div className="demo-logo-vertical">
          <img src={require("./../assets/logo.png")}/>
        </div> */}
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          onSelect={handleMenuSelect}
          items={userData?.role === "admin" ? adminOptions : teacherOptions}
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