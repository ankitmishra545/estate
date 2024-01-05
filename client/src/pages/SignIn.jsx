import React, { useState } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';

const SignIn = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error} = useSelector(state => state.user)

  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  const handleSubmit = async(e) => {
    e.preventDefault();    
    try {
      dispatch(signInStart())
      const res = await fetch('/api/auth/signin',{
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      const data = await res.json();
      if( data.success === false){
        dispatch(signInFailure(data.message))
        return
      }
      dispatch(signInSuccess(data))
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error.message))
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type='email' placeholder='email' id='email' className='p-3 border rounded-lg'  onChange={handleChange} />
        <input type='password' placeholder='password' id='password' className='p-3 border rounded-lg' onChange={handleChange}  />
        <button disabled={loading} className='uppercase bg-slate-700 p-3 text-white rounded-lg hover:opacity-90 disabled:opacity-70'>{loading ? 'Loading...' : 'Sign in'}</button>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Dont Have an account? </p>
        <Link to='/sign-up'><span className='text-blue-700'>Sign up</span></Link>
      </div>
      {error && <p className='text-red-500 mt-5 '>{error}</p>}
    </div>
  )
}

export default SignIn