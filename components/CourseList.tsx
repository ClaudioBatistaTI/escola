import React, { useEffect, useState } from 'react';
import { Course, Teacher } from '../types';
import { db } from '../services/database';
import { Edit2, Trash2, Plus, Search, BookOpen, Clock, User, X, Save } from 'lucide-react';

export const CourseList: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Partial<Course>>({});
  const [isEditing, setIsEditing] = useState(false);
  
  const fetchData = async () => {
    setLoading(true);
    const [coursesData, teachersData] = await Promise.all([
      db.getCourses(),
      db.getTeachers()
    ]);
    setCourses(coursesData);
    setTeachers(teachersData);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && editingCourse.id) {
      await db.updateCourse(editingCourse.id, editingCourse);
    } else {
      await db.addCourse({
        name: editingCourse.name!,
        teacherId: editingCourse.teacherId!,
        schedule: editingCourse.schedule!
      });
    }
    setIsModalOpen(false);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este curso? Todas as notas associadas também serão removidas.')) {
      await db.deleteCourse(id);
      fetchData();
    }
  };

  const openAddModal = () => {
    setEditingCourse({});
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (course: Course) => {
    setEditingCourse(course);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const filteredCourses = courses.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.teacherName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Disciplinas</h2>
          <p className="text-gray-500">Gerenciamento da grade curricular e atribuição de professores.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg flex items-center shadow-lg transform active:scale-95 transition-all"
        >
          <Plus className="w-5 h-5 mr-2" /> Nova Disciplina
        </button>
      </header>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input 
          type="text" 
          placeholder="Buscar por disciplina ou professor..." 
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Grid of Courses */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
           <div className="col-span-full p-8 text-center text-gray-500">Carregando cursos...</div>
        ) : filteredCourses.length === 0 ? (
           <div className="col-span-full p-8 text-center text-gray-500">Nenhum curso encontrado.</div>
        ) : (
          filteredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-indigo-50 rounded-lg">
                  <BookOpen className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => openEditModal(course)}
                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(course.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-1">{course.name}</h3>
              
              <div className="space-y-3 mt-4 flex-1">
                <div className="flex items-center text-gray-600 text-sm">
                  <User className="w-4 h-4 mr-2 text-gray-400" />
                  <span>{course.teacherName}</span>
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <Clock className="w-4 h-4 mr-2 text-gray-400" />
                  <span>{course.schedule}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-50">
                <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">Ativo</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">{isEditing ? 'Editar Disciplina' : 'Nova Disciplina'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Disciplina</label>
                <input required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                  placeholder="Ex: Matemática Avançada"
                  value={editingCourse.name || ''} onChange={e => setEditingCourse({...editingCourse, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Professor Responsável</label>
                {/* Dropdown for Teachers (Foreign Key) */}
                <select 
                  required
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={editingCourse.teacherId || ''} 
                  onChange={e => setEditingCourse({...editingCourse, teacherId: e.target.value})}>
                  <option value="">Selecione um Professor</option>
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.name} - {t.specialty}</option>
                  ))}
                </select>
              </div>
              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Horário</label>
                 <input required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                   placeholder="Ex: Seg/Qua 10:00"
                   value={editingCourse.schedule || ''} onChange={e => setEditingCourse({...editingCourse, schedule: e.target.value})} />
              </div>
              
              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center">
                  <Save className="w-4 h-4 mr-2" /> Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};