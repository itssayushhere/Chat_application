import { BrowserRouter , Routes, Route} from 'react-router-dom'
import Login from '../Auth/Login'
import App from '../App'
import Register from '../Auth/Register'


const Routers = () => {
  return (
    <BrowserRouter>
    <Routes>
        <Route path='/' element={<Login/>} />
        <Route path='/chatapp' element={<App/>} />
        <Route path='/register' element={<Register/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default Routers