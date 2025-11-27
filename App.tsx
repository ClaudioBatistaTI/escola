import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { StudentList } from './components/StudentList';
import { CourseList } from './components/CourseList';
import { TeacherList } from './components/TeacherList';
import { ClassList } from './components/ClassList';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'students':
        return <StudentList />;
      case 'teachers':
        return <TeacherList />;
      case 'classes':
        return <ClassList />;
      case 'courses':
        return <CourseList />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="max-w-7xl mx-auto animate-fade-in">
        {renderContent()}
      </div>
    </Layout>
  );
};

export default App;