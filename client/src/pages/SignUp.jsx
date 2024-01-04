import React from 'react'
import {Link} from 'react-router-dom'

const SignUp = () => {
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form className='flex flex-col gap-4'>
        <input type='text' placeholder='username' id='username' className='p-3 border rounded-lg' />
        <input type='email' placeholder='email' id='email' className='p-3 border rounded-lg' />
        <input type='password' placeholder='password' id='password' className='p-3 border rounded-lg' />
        <button className='uppercase bg-slate-700 p-3 text-white rounded-lg hover:opacity-90 disabled:opacity-70'>Sign Up</button>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Have an account? </p>
        <Link to='/sign-in'><span className='text-blue-700'>Sign in</span></Link>
      </div>
    </div>
  )
}

export default SignUp