import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Login from './pages/Login'
import Admin from './pages/Admin'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './context/AuthContext'

function App() {
  const { token, logout } = useAuth();

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <header className="sticky top-0 z-10 backdrop-blur bg-white/60 dark:bg-gray-950/60 border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link to="/" className="text-lg font-semibold">ADHY</Link>
            <nav className="flex items-center gap-6 text-sm">
              <Link to="/projects" className="hover:text-brand-600">Projects</Link>
              <Link to="/skills" className="hover:text-brand-600">Skills</Link>
              <Link to="/blog" className="hover:text-brand-600">Blog</Link>
              <Link to="/contact" className="hover:text-brand-600">Contact</Link>
              {token ? (
                <div className="flex items-center gap-3">
                  <Link to="/admin" className="px-3 py-1 bg-brand-600 text-white rounded hover:bg-brand-700">Admin</Link>
                  <button onClick={logout} className="px-3 py-1 border rounded hover:bg-gray-50">Logout</button>
                </div>
              ) : (
                <Link to="/login" className="px-3 py-1 bg-brand-600 text-white rounded hover:bg-brand-700">Login</Link>
              )}
            </nav>
          </div>
        </header>

        <main className="flex-1">
          <Routes>
            <Route
              path="/"
              element={
                <section className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10 items-center">
                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">Adhy</h1>
                    <p className="text-brand-600 font-medium mb-4">B-Tech IT Student | MERN Developer | Lifelong Learner</p>
                    <p className="text-gray-600 dark:text-gray-300 mb-8">I build modern web apps with the MERN stack, focusing on clean design, performance, and delightful UX.</p>
                    <div className="flex gap-3">
                      <a href="#projects" className="px-4 py-2 rounded bg-brand-600 text-white hover:bg-brand-700">View Projects</a>
                      <a href="#contact" className="px-4 py-2 rounded border border-gray-300 dark:border-gray-700">Contact Me</a>
                    </div>
                  </div>
                  <div className="h-60 md:h-80 rounded-xl bg-gradient-to-br from-brand-100 to-brand-300 dark:from-brand-900 dark:to-brand-700" />
                </section>
              }
            />
            <Route path="/projects" element={<div className="max-w-6xl mx-auto px-4 py-16">Projects (coming soon)</div>} />
            <Route path="/skills" element={<div className="max-w-6xl mx-auto px-4 py-16">Skills (coming soon)</div>} />
            <Route path="/blog" element={<div className="max-w-6xl mx-auto px-4 py-16">Blog (coming soon)</div>} />
            <Route path="/contact" element={<div className="max-w-6xl mx-auto px-4 py-16">Contact (coming soon)</div>} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
          </Routes>
        </main>

        <footer className="border-t border-gray-200 dark:border-gray-800 py-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} ADHY
        </footer>
      </div>
    </BrowserRouter>
  )
}

export default App
