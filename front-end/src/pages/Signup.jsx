import React, { useState } from 'react'
import API, { setToken } from '../lib/api'
import { useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'


export default function Signup(){
const [name,setName]=useState('')
const [email,setEmail]=useState('')
const [password,setPassword]=useState('')
const nav = useNavigate()


const submit = async e => {
e.preventDefault()
try{
const res = await API.post('/auth/signup', { name, email, password })
localStorage.setItem('token', res.data.token)
setToken(res.data.token)
nav('/dashboard')
}catch(err){
alert(err.response?.data?.message || 'Signup failed')
}
}


return (
<>
<NavBar />
<div className="container mx-auto p-6 max-w-md">
<h2 className="text-2xl mb-4">Sign up</h2>
<form onSubmit={submit} className="space-y-3 bg-white p-4 rounded shadow">
<input required className="w-full p-2 border" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
<input required className="w-full p-2 border" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
<input required type="password" className="w-full p-2 border" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
<button className="w-full p-2 bg-green-600 text-white rounded">Create account</button>
</form>
</div>
</>
)
}