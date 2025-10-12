import React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'


export default function MapView({ reports }){
const center = reports.length ? [reports[0].location.coordinates[1] || 0, reports[0].location.coordinates[0] || 0] : [0,0]


return (
<div className="bg-white p-2 rounded shadow">
<MapContainer center={center} zoom={6} style={{ height: '60vh', width: '100%' }} id="map">
<TileLayer
attribution='&copy; OpenStreetMap contributors'
url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
/>
{reports.map(r=>{
const [lng, lat] = r.location.coordinates
return (
<Marker key={r._id} position={[lat, lng]}>
<Popup>
<div>
<strong>{r.title}</strong>
<div className="text-sm">{r.description}</div>
<div className="text-xs">Severity: {r.severity}</div>
{r.photoUrl && <img src={`${import.meta.env.VITE_API_URL?.replace('/api','') || ''}${r.photoUrl}`} alt="photo" style={{width: '100%', marginTop: 6}} />}
</div>
</Popup>
</Marker>
)
})}
</MapContainer>
</div>
)
}