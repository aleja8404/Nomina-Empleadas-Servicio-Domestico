import React, { useState } from 'react';
import { LayoutDashboard, Users, Calculator, FileText } from 'lucide-react';
import EmployeeList from './components/EmployeeList';
import PayrollForm from './components/PayrollForm';
import { usePayrollStore } from './store';

function App() {
  const { employees, updateEmployee } = usePayrollStore();
  const [activeTab, setActiveTab] = useState('payroll');

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-900">
      {/* Sidebar / Navigation */}
      <div className="fixed inset-y-0 left-0 w-64 bg-slate-900 text-white shadow-xl z-10 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 p-2 rounded-lg">
              <FileText size={24} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">Nómina App</h1>
              <p className="text-xs text-slate-400">Gestión de Volantes</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2 flex-1">
          <button
            onClick={() => setActiveTab('payroll')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'payroll' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Calculator size={20} />
            <span className="font-medium">Generar Volante</span>
          </button>

          <button
            onClick={() => setActiveTab('employees')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'employees' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Users size={20} />
            <span className="font-medium">Empleadas</span>
          </button>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <p className="text-xs text-slate-500 text-center">v1.0.0 - 2026</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="md:ml-64 p-4 md:p-8">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {activeTab === 'payroll' ? 'Generar Volante de Pago' : 'Gestión de Empleadas'}
            </h2>
            <p className="text-gray-500 mt-1">
              {activeTab === 'payroll' ? 'Calcula y descarga los volantes de nómina.' : 'Administra la información de tu personal.'}
            </p>
          </div>

          <div className="md:hidden">
            {/* Mobile menu button placeholder if needed */}
          </div>
        </header>

        <main className="max-w-4xl mx-auto">
          {activeTab === 'payroll' && (
            <PayrollForm employees={employees} />
          )}

          {activeTab === 'employees' && (
            <EmployeeList employees={employees} onUpdate={updateEmployee} />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
