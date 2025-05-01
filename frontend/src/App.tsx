import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/Login'

function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LoginPage />} /> {/*in-add ko lang ito dahil nag error sa browser ko pag walang nakalagay sa "/" */}
          <Route
            path='/login'
            element={
              <>
                <LoginPage />
              </>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
