import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import LoginPage from './pages/Login'

function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
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
