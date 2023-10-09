import Login from './page/Login/Login'
import './sass/main.scss'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Main from './template/Main/Main'
import Home from './page/Home/Home'
import CreateBootcamp from './page/CreateBootcamp/CreateBootcamp'
function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Main />}>
          <Route path="" element={<Home />} />
          <Route path="/createBootcamp" element={<CreateBootcamp />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
