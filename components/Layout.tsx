import React, { ReactNode, useState } from 'react';
import { LayoutDashboard, Users, BookOpen, Menu, X, GraduationCap, School, Briefcase } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Alunos', icon: Users },
    { id: 'teachers', label: 'Professores', icon: Briefcase },
    { id: 'classes', label: 'Turmas', icon: School },
    { id: 'courses', label: 'Disciplinas', icon: BookOpen },
  ];

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white shadow-xl z-20">
        <div className="flex items-center justify-center h-20 border-b border-slate-800">
          <GraduationCap className="h-8 w-8 text-indigo-400 mr-2" />
          <h1 className="text-xl font-bold tracking-wider">ESCOLA 360</h1>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-indigo-600 text-white shadow-lg translate-x-1'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center">
          &copy; 2024 Escola 360 System
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-slate-900 text-white h-16 flex items-center justify-between px-4 z-30 shadow-md">
        <div className="flex items-center">
          <GraduationCap className="h-6 w-6 text-indigo-400 mr-2" />
          <span className="font-bold">Escola 360</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-slate-900 z-20 pt-16 animate-fade-in">
          <nav className="flex flex-col p-4 space-y-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center px-4 py-4 rounded-lg text-lg ${
                  activeTab === item.id
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <item.icon className="h-6 w-6 mr-4" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto md:p-8 p-4 pt-20 md:pt-8 relative">
        {children}
      </main>
    </div>
  );
};