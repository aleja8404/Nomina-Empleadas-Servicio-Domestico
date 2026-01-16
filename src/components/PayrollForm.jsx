import React, { useState, useEffect } from 'react';
import { Calculator, FileText, Download } from 'lucide-react';
import { generatePayrollPDF } from '../utils/pdfGenerator';
import { usePayrollStore } from '../store';

const PayrollForm = ({ employees, onSave }) => {
    const { registerLoanPayment } = usePayrollStore(); // Get access to store action
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [formData, setFormData] = useState({
        periodStart: '1 ENE',
        periodEnd: '15 ENE',
        year: '2026',
        daysWorked: 15,
        loanDeduction: 0,
        bonus: 0,
        severance: 0,
        severanceInterest: 0,
    });

    const [calculations, setCalculations] = useState({
        salaryEarned: 0,
        netPay: 0,
    });

    const employee = employees.find(e => e.id === Number(selectedEmployee));

    // Auto-calculate Severance Interest
    useEffect(() => {
        if (formData.severance > 0) {
            setFormData(prev => ({ ...prev, severanceInterest: prev.severance * 0.12 }));
        } else {
            setFormData(prev => ({ ...prev, severanceInterest: 0 }));
        }
    }, [formData.severance]);

    useEffect(() => {
        if (employee) {
            const baseSalary = employee.salary;
            const salaryEarned = (baseSalary / 30) * formData.daysWorked;
            const totalDevengos = salaryEarned + formData.bonus + formData.severance + formData.severanceInterest;
            const netPay = totalDevengos - formData.loanDeduction;

            setCalculations({
                salaryEarned,
                netPay
            });
        }
    }, [formData, employee]);

    const handleGenerate = () => {
        if (!employee) return;

        // Calculate new loan balance for PDF display
        const currentLoanBalance = (employee.loanTotal || 0) - (employee.loanPaid || 0);
        const newLoanBalance = currentLoanBalance - formData.loanDeduction;

        const fullData = {
            employeeName: employee.name,
            role: employee.role,
            baseSalary: employee.salary,
            ...formData,
            ...calculations,
            loanTotal: employee.loanTotal,
            loanDate: employee.loanDate,
            loanBalance: newLoanBalance, // Pass the AFTER deduction balance
            periodStart: formData.periodStart,
            periodEnd: `${formData.periodEnd} DE ${formData.year}`
        };

        generatePayrollPDF(fullData);

        // Commit the loan payment
        if (formData.loanDeduction > 0) {
            registerLoanPayment(employee.id, formData.loanDeduction);
        }

        if (onSave) onSave(fullData);
    };

    const InputGroup = ({ label, type = "text", value, onChange, prefix }) => (
        <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
            <div className="relative">
                {prefix && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">{prefix}</span>
                    </div>
                )}
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    className={`block w-full ${prefix ? 'pl-8' : 'px-3'} py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none`}
                />
            </div>
        </div>
    );

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                    <Calculator size={20} />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Generar Volante</h2>
            </div>

            <div className="p-6 grid gap-6">
                {/* Employee Selection */}
                <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Seleccionar Empleada</label>
                    <select
                        className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        value={selectedEmployee}
                        onChange={(e) => setSelectedEmployee(e.target.value)}
                    >
                        <option value="">-- Seleccionar --</option>
                        {employees.map(emp => (
                            <option key={emp.id} value={emp.id}>{emp.name}</option>
                        ))}
                    </select>
                </div>

                {employee && (
                    <div className="animate-in fade-in slide-in-from-top-4 duration-300 space-y-6">
                        {/* Loan Info Banner */}
                        {(employee.loanTotal > 0 && (employee.loanTotal - (employee.loanPaid || 0)) > 0) && (
                            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg flex justify-between items-center text-sm">
                                <span className="text-yellow-800 font-medium">Deuda Pendiente:</span>
                                <span className="font-bold text-yellow-900">
                                    {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(employee.loanTotal - (employee.loanPaid || 0))}
                                </span>
                            </div>
                        )}

                        <div className="grid grid-cols-3 gap-4">
                            <InputGroup
                                label="Inicio Periodo"
                                value={formData.periodStart}
                                onChange={(e) => setFormData({ ...formData, periodStart: e.target.value })}
                            />
                            <InputGroup
                                label="Fin Periodo"
                                value={formData.periodEnd}
                                onChange={(e) => setFormData({ ...formData, periodEnd: e.target.value })}
                            />
                            <InputGroup
                                label="Año"
                                value={formData.year}
                                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                            />
                        </div>

                        <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 grid grid-cols-2 gap-4">
                            <InputGroup
                                label="Días Laborados"
                                type="number"
                                value={formData.daysWorked}
                                onChange={(e) => setFormData({ ...formData, daysWorked: Number(e.target.value) })}
                            />
                            <div className="flex flex-col justify-center">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Sueldo Calculado</label>
                                <div className="text-lg font-mono font-medium text-blue-700">
                                    {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(calculations.salaryEarned)}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputGroup
                                label="Abono a Préstamo"
                                type="number"
                                prefix="$"
                                value={formData.loanDeduction}
                                onChange={(e) => setFormData({ ...formData, loanDeduction: Number(e.target.value) })}
                            />
                            <InputGroup
                                label="Prima Semestral"
                                type="number"
                                prefix="$"
                                value={formData.bonus}
                                onChange={(e) => setFormData({ ...formData, bonus: Number(e.target.value) })}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputGroup
                                label="Cesantias"
                                type="number"
                                prefix="$"
                                value={formData.severance}
                                onChange={(e) => setFormData({ ...formData, severance: Number(e.target.value) })}
                            />
                            <InputGroup
                                label="Int. Cesantias (12%)"
                                type="number"
                                prefix="$"
                                value={formData.severanceInterest}
                                onChange={(e) => setFormData({ ...formData, severanceInterest: Number(e.target.value) })}
                            />
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Neto a Pagar</p>
                                <p className="text-3xl font-bold text-gray-900">
                                    {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(calculations.netPay)}
                                </p>
                            </div>

                            <button
                                onClick={handleGenerate}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg shadow-blue-200 transition-all active:scale-95"
                            >
                                <Download size={20} />
                                Descargar Volante
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PayrollForm;
