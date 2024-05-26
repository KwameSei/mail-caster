import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { Auth } from './screens';
import 'react-toastify/dist/ReactToastify.css';
import './App.css'

function App() {

  return (
    <div className='app'>
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='colored'
      />
      <Routes>
        <Route path='/' element={<Auth />} />
      </Routes>
    </div>
  )
}

export default App;
