import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { setToken } from '../lib/api'


export default function NavBar(){
const nav = useNavigate()
const logout = ()=>{
localStorage.removeItem('token')
setToken(null)
nav('/')
}
return (
<nav className="bg-white shadow p-4">
<div className="container mx-auto flex items-center justify-between">
<Link to="/" className="font-bold text-xl">LandGuard</Link>
<div className="space-x-4">
<Link to="/dashboard" className="text-sm">Dashboard</Link>
<button onClick={logout} className="text-sm text-red-600">Logout</button>
</div>
</div>
</nav>
)
}