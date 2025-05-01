import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/Login'
import InventoryPage from './pages/Inventory'

function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LoginPage />} /> {/*in-add ko lang ito dahil nag error sa browser ko pag walang nakalagay sa "/" */}
          <Route
            path='/login'
            element={
              <LoginPage />
            }
          />
          <Route 
            path='/inventory'
            element={
              <InventoryPage />
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
