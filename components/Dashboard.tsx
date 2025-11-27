import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { DashboardStats } from '../types';
import { db } from '../services/database';
import { Users, GraduationCap, TrendingUp, Book } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const data = await db.getDashboardStats();
      setStats(data);
      setLoading(false);
    };
    fetchStats();
  }, []);

  const chartData = [
    { name: 'Matemática', avg: 75 },
    { name: 'Português', avg: 82 },
    { name: 'História', avg: 68 },
    { name: 'Física', avg: 70 },
    { name: 'Biologia', avg: 88 },
  ];

  if (loading) {
    return <div className="flex justify-center items-center h-full text-indigo-600 animate-pulse">Carregando Dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Visão Geral</h2>
        <p className="text-gray-500">Métricas principais da escola.</p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Alunos" 
          value={stats?.totalStudents || 0} 
          icon={Users} 
          color="bg-blue-500" 
        />
        <StatCard 
          title="Alunos Ativos" 
          value={stats?.activeStudents || 0} 
          icon={GraduationCap} 
          color="bg-green-500" 
        />
        <StatCard 
          title="Média Geral" 
          value={stats?.averageGrade || 0} 
          icon={TrendingUp} 
          color="bg-indigo-500" 
          isPercent 
        />
        <StatCard 
          title="Cursos Ofertados" 
          value={stats?.totalCourses || 0} 
          icon={Book} 
          color="bg-purple-500" 
        />
      </div>

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-700 mb-6">Desempenho Médio por Disciplina</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                cursor={{fill: '#f3f4f6'}}
              />
              <Bar dataKey="avg" radius={[4, 4, 0, 0]} barSize={40}>
                 {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#6366f1' : '#818cf8'} />
                  ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color, isPercent = false }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4 transition-transform hover:scale-[1.02]">
    <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
      <Icon className={`h-8 w-8 ${color.replace('bg-', 'text-')}`} />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <h4 className="text-2xl font-bold text-gray-800">
        {value}{isPercent ? '%' : ''}
      </h4>
    </div>
  </div>
);
