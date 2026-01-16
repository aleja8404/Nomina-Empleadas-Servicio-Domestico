import { useState, useEffect } from 'react';

const INITIAL_EMPLOYEES = [
    { id: 1, name: "Dernai Pacheco", salary: 1040000, role: "Servicio Domestico", loanTotal: 0, loanPaid: 0, loanDate: "" },
    { id: 2, name: "Laliver Hernandez", salary: 1400000, role: "Servicio Domestico", loanTotal: 0, loanPaid: 0, loanDate: "" },
    { id: 3, name: "Nellis Salas", salary: 1400000, role: "Servicio Domestico", loanTotal: 0, loanPaid: 0, loanDate: "" },
];

export const usePayrollStore = () => {
    const [employees, setEmployees] = useState(() => {
        const saved = localStorage.getItem('employees');
        return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
    });

    const [history, setHistory] = useState(() => {
        const saved = localStorage.getItem('payroll_history');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('employees', JSON.stringify(employees));
    }, [employees]);

    useEffect(() => {
        localStorage.setItem('payroll_history', JSON.stringify(history));
    }, [history]);

    const addPayrollEntry = (entry) => {
        setHistory([entry, ...history]);
    };

    const updateEmployee = (id, data) => {
        setEmployees(employees.map(emp => emp.id === id ? { ...emp, ...data } : emp));
    };

    const registerLoanPayment = (id, amount) => {
        setEmployees(employees.map(emp => {
            if (emp.id === id) {
                return { ...emp, loanPaid: (emp.loanPaid || 0) + amount };
            }
            return emp;
        }));
    };

    return {
        employees,
        history,
        addPayrollEntry,
        updateEmployee,
        registerLoanPayment
    };
};
