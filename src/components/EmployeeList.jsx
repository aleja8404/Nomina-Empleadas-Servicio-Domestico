import React, { useState } from 'react';
import { Users, Edit2, Check, X } from 'lucide-react';

const EmployeeList = ({ employees, onUpdate }) => {
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});

    const startEdit = (employee) => {
        setEditingId(employee.id);
        setEditForm({ ...employee });
    };

    const saveEdit = () => {
        onUpdate(editingId, editForm);
        setEditingId(null);
    };

    const cancelEdit = () => {
        setEditingId(null);
    };

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(val);
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <Users size={20} />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Empleadas</h2>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
                            <th className="p-4 font-semibold">Nombre</th>
                            <th className="p-4 font-semibold">Cargo</th>
                            <th className="p-4 font-semibold">Salario Base</th>
                            <th className="p-4 font-semibold">Préstamo Activo</th>
                            <th className="p-4 font-semibold text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {employees.map((emp) => (
                            <tr key={emp.id} className="hover:bg-gray-50/80 transition-colors">
                                {editingId === emp.id ? (
                                    <>
                                        <td className="p-4">
                                            <input
                                                type="text"
                                                value={editForm.name}
                                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </td>
                                        <td className="p-4">
                                            <input
                                                type="text"
                                                value={editForm.role}
                                                onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                                                className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </td>
                                        <td className="p-4">
                                            <input
                                                type="number"
                                                value={editForm.salary}
                                                onChange={(e) => setEditForm({ ...editForm, salary: Number(e.target.value) })}
                                                className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </td>
                                        <td className="p-4 align-top min-w-[200px]">
                                            <div className="space-y-2 bg-yellow-50 p-2 rounded-md border border-yellow-100">
                                                <p className="text-xs font-bold text-yellow-700 uppercase">Datos de Préstamo</p>
                                                <div>
                                                    <label className="text-xs text-gray-500 block">Total Prestado</label>
                                                    <input
                                                        type="number"
                                                        value={editForm.loanTotal || 0}
                                                        onChange={(e) => setEditForm({ ...editForm, loanTotal: Number(e.target.value) })}
                                                        className="w-full p-1 border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 text-xs"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs text-gray-500 block">Fecha (YYYY.MM.DD)</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Ej: 2025.10.01"
                                                        value={editForm.loanDate || ''}
                                                        onChange={(e) => setEditForm({ ...editForm, loanDate: e.target.value })}
                                                        className="w-full p-1 border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 text-xs"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs text-gray-500 block">Pagado Hasta Hoy</label>
                                                    <input
                                                        type="number"
                                                        value={editForm.loanPaid || 0}
                                                        onChange={(e) => setEditForm({ ...editForm, loanPaid: Number(e.target.value) })}
                                                        className="w-full p-1 border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 text-xs"
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={saveEdit} className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors">
                                                    <Check size={18} />
                                                </button>
                                                <button onClick={cancelEdit} className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors">
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td className="p-4 font-medium text-gray-900">{emp.name}</td>
                                        <td className="p-4 text-gray-600">{emp.role}</td>
                                        <td className="p-4 font-mono text-gray-700">{formatCurrency(emp.salary)}</td>
                                        <td className="p-4">
                                            {(emp.loanTotal > 0 && (emp.loanTotal - (emp.loanPaid || 0)) > 0) && (
                                                <div className="text-xs bg-yellow-100 text-yellow-800 p-2 rounded border border-yellow-200 inline-block">
                                                    <div><span className="font-bold">Deuda:</span> {formatCurrency(emp.loanTotal - (emp.loanPaid || 0))}</div>
                                                    <div className="text-yellow-600 font-mono text-[10px] mt-1">{emp.loanDate}</div>
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => startEdit(emp)}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EmployeeList;
