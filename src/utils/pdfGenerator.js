import jsPDF from 'jspdf';

export const generatePayrollPDF = (data) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const halfHeight = pageHeight / 2;

    // Helper to draw the content twice
    const drawContent = (startY, isCopy) => {
        // Header
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("AMELIA NAVARRO DE BENEDETTI", pageWidth / 2, startY + 10, { align: "center" });

        doc.setFontSize(9);
        doc.text(`BOLETIN DE PAGO DEL ${data.periodStart} AL ${data.periodEnd}`, pageWidth / 2, startY + 15, { align: "center" });
        doc.setFont("helvetica", "normal");
        doc.text("Edificio Navas Apartamento 1701", pageWidth / 2, startY + 19, { align: "center" });

        // Employee Info Left
        let currentY = startY + 30;
        doc.setFont("helvetica", "bold");
        doc.text(data.employeeName.toUpperCase(), 15, currentY);

        currentY += 5;
        doc.setFont("helvetica", "normal");
        doc.text("Cargo:", 15, currentY);
        // Center Role
        doc.setFont("helvetica", "bold");
        doc.text("SERVICIO DOMESTICO", pageWidth / 2, currentY, { align: "center" });

        currentY += 5;
        doc.setFont("helvetica", "normal");
        doc.text("Salario Basico :", 15, currentY);
        doc.setFont("helvetica", "bold");
        doc.text(`$ ${new Intl.NumberFormat('es-CO').format(data.baseSalary)}`, pageWidth / 2, currentY, { align: "center" });

        // Table Header
        currentY += 15;
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");

        const col1 = 25; // Dias Laborados (Center of its column approx)
        const col2 = 80; // Descripcion
        const col3 = 130; // Salario Base
        const col4 = 160; // Devengo
        const col5 = 190; // Descuento

        doc.text("DIAS LABORADOS", col1, currentY, { align: "center" });
        doc.text("DESCRIPCION CONCEPTO", col2, currentY, { align: "center" });
        doc.text("SALARIO BASE", col3, currentY, { align: "right" });
        doc.text("DEVENGO", col4, currentY, { align: "right" });
        doc.text("DESCUENTO", col5, currentY, { align: "right" });

        // Table Content
        currentY += 6;
        doc.setFont("helvetica", "normal");

        // Row 1: Sueldo
        doc.text(data.daysWorked.toString(), col1, currentY, { align: "center" });
        doc.text("SUELDO", 60, currentY); // Left align description
        doc.text(new Intl.NumberFormat('es-CO').format(data.baseSalary), col3, currentY, { align: "right" });
        doc.text(new Intl.NumberFormat('es-CO').format(data.salaryEarned), col4, currentY, { align: "right" });
        doc.text("0", col5, currentY, { align: "right" });

        // Row 2+: Extras/Deductions

        if (data.bonus > 0) {
            currentY += 5;
            doc.text("180", col1, currentY, { align: "center" });
            doc.text("Prima de Servicios", 60, currentY);
            doc.text(new Intl.NumberFormat('es-CO').format(data.baseSalary), col3, currentY, { align: "right" });
            doc.text(new Intl.NumberFormat('es-CO').format(data.bonus), col4, currentY, { align: "right" });
        }

        if (data.severance > 0) {
            currentY += 5;
            doc.text("CESANTIAS", 60, currentY);
            doc.text(new Intl.NumberFormat('es-CO').format(data.severance), col4, currentY, { align: "right" });
        }

        if (data.severanceInterest > 0) {
            currentY += 5;
            doc.text("Intereses Cesantias (12%)", 60, currentY);
            doc.text(new Intl.NumberFormat('es-CO').format(data.severanceInterest), col4, currentY, { align: "right" });
        }

        if (data.loanDeduction > 0) {
            currentY += 7;
            const loanTotalStr = new Intl.NumberFormat('es-CO').format(data.loanTotal || 0);
            const loanDateStr = data.loanDate || '';
            // Use the balance passed from form, or calculate if missing (safeguard)
            const balanceStr = new Intl.NumberFormat('es-CO').format(data.loanBalance !== undefined ? data.loanBalance : ((data.loanTotal || 0) - (data.loanPaid || 0) - data.loanDeduction));

            doc.text(`Préstamo $ ${loanTotalStr} ${loanDateStr}.`, 60, currentY);
            currentY += 4;
            doc.text(`Saldo de Prestamos $ ${balanceStr}`, 60, currentY);

            // Note: The reference image put the deduction in the Discount column for the loan row.
            // It didn't clear the Base Salary column, but usually loan row doesn't have base salary. 
            // I will leave Base Salary column blank for Loan row to be clean, or repeat base? Reference image:
            // "Prestamo... Saldo..." is in Description. "1.000.000" (Base) "100.000" (Descuento).
            // So yes, it shows the LOAN TOTAL as base in the reference? 
            // "Prestamo $ 1.000.000 2025.10.01" -> on Description line.
            // "Saldo de Prestamos $ 500.000" -> on second line of Description.
            // "1.000.000" is in Salario Base column.

            doc.text(new Intl.NumberFormat('es-CO').format(data.loanTotal || 0), col3, currentY, { align: "right" });
            doc.text(new Intl.NumberFormat('es-CO').format(data.loanDeduction), col5, currentY, { align: "right" });
        }

        // Totals
        currentY += 15;
        doc.setFont("helvetica", "bold");
        doc.text("Totales Devengos y Descuentos", 15, currentY);

        const totalDevengos = data.salaryEarned + data.bonus + data.severance + (data.severanceInterest || 0);
        const totalDescuentos = data.loanDeduction;

        doc.text(new Intl.NumberFormat('es-CO').format(totalDevengos), col4, currentY, { align: "right" });
        doc.text(new Intl.NumberFormat('es-CO').format(totalDescuentos), col5, currentY, { align: "right" });

        // NETO
        currentY += 10;
        doc.setFontSize(10);
        doc.text("NETO A PAGAR : $", 150, currentY, { align: "right" });
        doc.text(new Intl.NumberFormat('es-CO').format(data.netPay), 190, currentY, { align: "right" });

        // Footer Signatures
        currentY += 20;
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text("Recibi Conforme: _________________________________", 15, currentY);
        currentY += 6;
        doc.text("C.C. No. : _____________________________", 15, currentY);
    };

    // Draw Top Copy
    drawContent(5);

    // Cut Line
    doc.setLineDash([5, 5], 0);
    doc.line(10, halfHeight, pageWidth - 10, halfHeight);
    doc.setLineDash([]); // Reset

    // Draw Bottom Copy
    drawContent(halfHeight + 5, true);

    doc.save(`Volante_${data.employeeName}_${data.periodEnd.replace(/\s/g, '_')}.pdf`);
};
