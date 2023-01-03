import { BrowserRouter, Routes, Route } from 'react-router-dom';

import '../styles/App.css';
import Login from './Login';
import Register from './Register';

function App() {
  return (
    <div className='app'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
