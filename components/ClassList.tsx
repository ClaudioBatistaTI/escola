import React, { useEffect, useState } from 'react';
import { SchoolClass } from '../types';
import { db } from '../services/database';
import { Trash2, Plus, School, Calendar, X } from 'lucide-react';

export const ClassList: React.FC = () => {
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClass, setNewClass] = useState<Partial<SchoolClass>>({});

  const loadClasses = async () => {
    const data = await db.getClasses();
    setClasses(data);
  };

  useEffect(() => { loadClasses(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await db.addClass({ name: newClass.name!, year: Number(newClass.year!) });
    setIsModalOpen(false);
    loadClasses();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Excluir turma?')) {
      await db.deleteClass(id);
      loadClasses();
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Turmas</h2>
          <p className="text-gray-500">Gestão das salas e anos letivos.</p>
        </div>
        <button onClick={() => { setNewClass({}); setIsModalOpen(true); }} className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-indigo-700">
          <Plus className="w-5 h-5 mr-2" /> Nova Turma
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {classes.map(cls => (
          <div key={cls.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center group">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <School className="w-5 h-5 text-indigo-500" />
                <h3 className="text-lg font-bold text-gray-800">{cls.name}</h3>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="w-4 h-4 mr-1" /> Ano: {cls.year}
              </div>
            </div>
            <button onClick={() => handleDelete(cls.id)} className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:bg-red-50 rounded transition-all">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-sm overflow-hidden">
             <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
              <h3 className="font-bold">Nova Turma</h3>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium block mb-1">Nome da Turma</label>
                <input required placeholder="Ex: 3º Ano B" className="w-full p-2 border rounded" value={newClass.name || ''} onChange={e => setNewClass({...newClass, name: e.target.value})} />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Ano Letivo</label>
                <input required type="number" placeholder="2024" className="w-full p-2 border rounded" value={newClass.year || ''} onChange={e => setNewClass({...newClass, year: Number(e.target.value)})} />
              </div>
              <button type="submit" className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Salvar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};