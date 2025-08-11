import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ProjectManager from './admin/ProjectManager';
import SkillManager from './admin/SkillManager';
import BlogManager from './admin/BlogManager';

export default function Admin() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');

  function handleLogout() {
    logout();
    navigate('/');
  }

  function renderContent() {
    switch (activeSection) {
      case 'projects':
        return <ProjectManager />;
      case 'skills':
        return <SkillManager />;
      case 'blog':
        return <BlogManager />;
      case 'resume':
        return <div className="text-center py-16">Resume Management (coming soon)</div>;
      default:
        return (
          <div className="text-center py-16">
            <h2 className="text-xl font-medium mb-4">Welcome to Admin Dashboard</h2>
            <p className="text-gray-600">Select a section to manage your portfolio content.</p>
          </div>
        );
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Welcome, {user?.username}</span>
            <button
              onClick={handleLogout}
              className="px-3 py-2 border rounded hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen">
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveSection('dashboard')}
                  className={`w-full text-left px-3 py-2 rounded ${
                    activeSection === 'dashboard' 
                      ? 'bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveSection('projects')}
                  className={`w-full text-left px-3 py-2 rounded ${
                    activeSection === 'projects' 
                      ? 'bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  Projects
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveSection('skills')}
                  className={`w-full text-left px-3 py-2 rounded ${
                    activeSection === 'skills' 
                      ? 'bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  Skills
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveSection('blog')}
                  className={`w-full text-left px-3 py-2 rounded ${
                    activeSection === 'blog' 
                      ? 'bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  Blog
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveSection('resume')}
                  className={`w-full text-left px-3 py-2 rounded ${
                    activeSection === 'resume' 
                      ? 'bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  Resume
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        <main className="flex-1">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}


