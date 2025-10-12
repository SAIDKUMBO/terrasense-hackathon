import React from 'react'
import { Link } from 'react-router-dom'
import NavBar from '../components/NavBar'


export default function Home(){
return (
<div>
<NavBar />
<header className="container mx-auto p-8 text-center">
<h1 className="text-4xl font-bold">LandGuard — TerraSense</h1>
<p className="mt-4 text-lg text-slate-600">Report and monitor land degradation to help communities and policymakers act faster.</p>
<div className="mt-6">
<Link to="/signup" className="px-4 py-2 bg-green-600 text-white rounded">Get Started</Link>
<Link to="/dashboard" className="ml-4 px-4 py-2 border rounded">View Dashboard</Link>
</div>
</header>
</div>
)
}