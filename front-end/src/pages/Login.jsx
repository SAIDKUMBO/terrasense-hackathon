import React, { useState } from 'react'
import API, { setToken } from '../lib/api'
import { useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'


export default function Login(){
const [email,setEmail]=useState('')
const [password,setPassword]=useState('')
const nav = useNavigate()


const submit = async e => {
e.preventDefault()
try{
const res = await API.post('/auth/login', { email, password })
localStorage.setItem('token', res.data.token)
setToken(res.data.token)
nav('/dashboard')
}catch(err){
alert(err.response?.data?.message || 'Login failed')
}
}


return (
<>
<NavBar />
<div className="container mx-auto p-6 max-w-md">
<h2 className="text-2xl mb-4">Login</h2>
<form onSubmit={submit} className="space-y-3 bg-white p-4 rounded shadow">
<input required className="w-full p-2 border" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
<input required type="password" className="w-full p-2 border" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
<button className="w-full p-2 bg-blue-600 text-white rounded">Login</button>
</form>
</div>
</>
)
}