import React, { useEffect, useState } from 'react';
import { Student, SchoolClass } from '../types';
import { db } from '../services/database';
import { generateStudentReport } from '../services/geminiService';
import { Edit2, Trash2, Plus, Search, BrainCircuit, X, Save } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const StudentList: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Partial<Student>>({});
  const [isEditing, setIsEditing] = useState(false);
  
  // AI State
  const [aiReport, setAiReport] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [selectedStudentForAi, setSelectedStudentForAi] = useState<Student | null>(null);

  const fetchData = async () => {
    setLoading(true);
    const [studentsData, classesData] = await Promise.all([
      db.getStudents(),
      db.getClasses()
    ]);
    setStudents(studentsData);
    setClasses(classesData);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && editingStudent.id) {
      await db.updateStudent(editingStudent.id, editingStudent);
    } else {
      await db.addStudent({
        name: editingStudent.name!,
        email: editingStudent.email!,
        age: Number(editingStudent.age!),
        classId: editingStudent.classId!, // Foreign Key
        enrollmentDate: new Date().toISOString().split('T')[0],
        status: 'Ativo',
        notes: editingStudent.notes || ''
      });
    }
    setIsModalOpen(false);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este aluno?')) {
      await db.deleteStudent(id);
      fetchData();
    }
  };

  const openAddModal = () => {
    setEditingStudent({});
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (student: Student) => {
    setEditingStudent(student);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const openAiModal = async (student: Student) => {
    setSelectedStudentForAi(student);
    setAiReport('');
    setIsAiModalOpen(true);
    setAiLoading(true);
    // Student passed here already has className resolved via DB Join
    const report = await generateStudentReport(student);
    setAiReport(report);
    setAiLoading(false);
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Alunos</h2>
          <p className="text-gray-500">Gerenciamento de matrículas e informações.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg flex items-center shadow-lg transform active:scale-95 transition-all"
        >
          <Plus className="w-5 h-5 mr-2" /> Novo Aluno
        </button>
      </header>

      {/* Search and Filter */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input 
          type="text" 
          placeholder="Buscar por nome ou email..." 
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
           <div className="p-8 text-center text-gray-500">Carregando lista de alunos...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Aluno</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Turma</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredStudents.length === 0 ? (
                   <tr>
                     <td colSpan={4} className="p-8 text-center text-gray-500">Nenhum aluno encontrado.</td>
                   </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center">
                          <img src={student.avatarUrl} alt={student.name} className="w-10 h-10 rounded-full mr-3 object-cover border border-gray-200" />
                          <div>
                            <div className="font-medium text-gray-900">{student.name}</div>
                            <div className="text-sm text-gray-500">{student.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-600">
                        {/* Display resolved name */}
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                          {student.className}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          student.status === 'Ativo' ? 'bg-green-100 text-green-700' : 
                          student.status === 'Inativo' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                         <button 
                          onClick={() => openAiModal(student)}
                          title="Análise IA"
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        >
                          <BrainCircuit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => openEditModal(student)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(student.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">{isEditing ? 'Editar Aluno' : 'Novo Aluno'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                <input required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                  value={editingStudent.name || ''} onChange={e => setEditingStudent({...editingStudent, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input required type="email" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                  value={editingStudent.email || ''} onChange={e => setEditingStudent({...editingStudent, email: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Idade</label>
                   <input required type="number" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                     value={editingStudent.age || ''} onChange={e => setEditingStudent({...editingStudent, age: Number(e.target.value)})} />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Turma</label>
                   {/* Dropdown for Classes (Foreign Key Selection) */}
                   <select 
                     required
                     className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                     value={editingStudent.classId || ''} 
                     onChange={e => setEditingStudent({...editingStudent, classId: e.target.value})}>
                     <option value="">Selecione a Turma</option>
                     {classes.map(cls => (
                       <option key={cls.id} value={cls.id}>{cls.name}</option>
                     ))}
                   </select>
                </div>
              </div>
              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                 <select className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                   value={editingStudent.status || 'Ativo'} 
                   onChange={e => setEditingStudent({...editingStudent, status: e.target.value as any})}>
                   <option value="Ativo">Ativo</option>
                   <option value="Inativo">Inativo</option>
                   <option value="Pendente">Pendente</option>
                 </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                <textarea className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none h-20" 
                  value={editingStudent.notes || ''} onChange={e => setEditingStudent({...editingStudent, notes: e.target.value})} />
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

      {/* AI Report Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 bg-slate-900 bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden animate-fade-in-up">
            <div className="bg-purple-600 px-6 py-4 flex justify-between items-center text-white">
              <div className="flex items-center">
                <BrainCircuit className="w-6 h-6 mr-3" />
                <h3 className="text-lg font-bold">Conselheiro Pedagógico IA</h3>
              </div>
              <button onClick={() => setIsAiModalOpen(false)} className="text-purple-100 hover:text-white"><X className="w-6 h-6" /></button>
            </div>
            
            <div className="p-8 overflow-y-auto flex-1">
              <div className="mb-4 pb-4 border-b border-gray-100">
                <h4 className="text-gray-500 text-sm uppercase tracking-wide">Analizando aluno:</h4>
                <p className="text-xl font-bold text-gray-800">{selectedStudentForAi?.name}</p>
                <p className="text-sm text-gray-500">{selectedStudentForAi?.className}</p>
              </div>

              {aiLoading ? (
                <div className="space-y-4 py-8">
                  <div className="flex items-center justify-center space-x-3 text-purple-600">
                    <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                    <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <p className="text-center text-gray-500">Gerando relatório de desempenho e sugestões...</p>
                </div>
              ) : (
                <div className="prose prose-purple max-w-none text-gray-700">
                  <ReactMarkdown>{aiReport}</ReactMarkdown>
                </div>
              )}
            </div>
            
            <div className="bg-gray-50 p-4 flex justify-end">
              <button onClick={() => setIsAiModalOpen(false)} className="px-5 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};