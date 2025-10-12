import React, { useState } from 'react'
import API from '../lib/api'


export default function ReportForm({ onSuccess }){
const [title,setTitle]=useState('')
const [description,setDescription]=useState('')
const [severity,setSeverity]=useState('low')
const [lat,setLat]=useState('')
const [lng,setLng]=useState('')
const [photo,setPhoto]=useState(null)


const submit = async e =>{
e.preventDefault()
const fd = new FormData()
fd.append('title', title)
fd.append('description', description)
fd.append('severity', severity)
fd.append('lat', lat)
fd.append('lng', lng)
if (photo) fd.append('photo', photo)
try{
await API.post('/reports', fd)
alert('Report submitted')
setTitle(''); setDescription(''); setPhoto(null); setLat(''); setLng('')
onSuccess?.()
}catch(err){ console.error(err); alert(err.response?.data?.message || 'Submit failed') }
}


return (
<div className="bg-white p-4 rounded shadow">
<h3 className="font-bold mb-2">Submit Report</h3>
<form onSubmit={submit} className="space-y-2">
<input className="w-full p-2 border" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required />
<textarea className="w-full p-2 border" placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
<select className="w-full p-2 border" value={severity} onChange={e=>setSeverity(e.target.value)}>
<option value="low">Low</option>
<option value="medium">Medium</option>
<option value="high">High</option>
</select>
<div className="flex gap-2">
<input className="w-1/2 p-2 border" placeholder="Lat (e.g., -1.2921)" value={lat} onChange={e=>setLat(e.target.value)} />
<input className="w-1/2 p-2 border" placeholder="Lng (e.g., 36.8219)" value={lng} onChange={e=>setLng(e.target.value)} />
</div>
<input type="file" accept="image/*" onChange={e=>setPhoto(e.target.files?.[0])} />
<button className="w-full p-2 bg-green-600 text-white rounded">Submit</button>
</form>
</div>
)
}