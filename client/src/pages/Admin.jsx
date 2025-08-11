import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Admin() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <button onClick={handleLogout} className="px-3 py-2 rounded border">Logout</button>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card title="Projects" description="Manage portfolio projects" />
        <Card title="Skills" description="Manage skills" />
        <Card title="Blog" description="Write and manage posts" />
        <Card title="Resume" description="Upload and manage resume" />
      </div>
    </div>
  )
}

function Card({ title, description }) {
  return (
    <div className="p-4 border rounded-md">
      <h2 className="font-medium">{title}</h2>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
      <div className="mt-3">
        <button className="px-3 py-1 rounded bg-brand-600 text-white text-sm">Open</button>
      </div>
    </div>
  )
}


