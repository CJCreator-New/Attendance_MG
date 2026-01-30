import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generatePaySlipPDF = (employee, salaryData, company, month, year) => {
  const doc = new jsPDF();
  
  const branding = JSON.parse(localStorage.getItem('branding') || '{}');
  const primaryColor = branding.primaryColor || '#2563eb';
  const companyName = branding.companyName || company.name;
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Header with branding
  if (branding.logo) {
    try {
      doc.addImage(branding.logo, 'PNG', 15, 10, 30, 30);
    } catch (e) {}
  }
  
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text(companyName, 105, 20, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text(company.branches[0].address, 105, 27, { align: 'center' });
  
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text(`Pay Slip for ${month} ${year}`, 105, 40, { align: 'center' });
  
  // Employee Details
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  const empDetails = [
    ['Employee Name:', employee.name, 'Employee ID:', employee.empId],
    ['Designation:', employee.designation || 'N/A', 'UAN No:', employee.epfNo || 'N/A'],
    ['ESI No:', employee.esiNo || 'N/A', 'Payable Days:', `${salaryData.payableDays} / 31`]
  ];
  
  doc.autoTable({
    startY: 50,
    body: empDetails,
    theme: 'plain',
    styles: { fontSize: 10, cellPadding: 2 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 40 },
      1: { cellWidth: 50 },
      2: { fontStyle: 'bold', cellWidth: 40 },
      3: { cellWidth: 50 }
    }
  });

  // Salary Table
  const salaryTable = [
    ['Particulars', 'Gross', 'Earned', 'Particulars', 'Amount'],
    ['Basic Pay', formatCurrency(employee.gross * 0.5), formatCurrency(salaryData.basic), 'EPF', formatCurrency(salaryData.epf)],
    ['DA', formatCurrency(employee.gross * 0.25), formatCurrency(salaryData.da), 'Professional Tax', formatCurrency(salaryData.profTax)],
    ['HRA', formatCurrency(employee.gross * 0.25), formatCurrency(salaryData.hra), '', ''],
    ['', '', '', '', ''],
    ['Total Earnings', formatCurrency(employee.gross), formatCurrency(salaryData.totalEarnings), 'Total Deductions', formatCurrency(salaryData.totalDeduction)]
  ];

  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 10,
    head: [salaryTable[0]],
    body: salaryTable.slice(1),
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { 
      fillColor: primaryColor.match(/^#([0-9a-f]{6})$/i) 
        ? [parseInt(primaryColor.slice(1,3), 16), parseInt(primaryColor.slice(3,5), 16), parseInt(primaryColor.slice(5,7), 16)]
        : [37, 99, 235], 
      textColor: 255 
    },
    columnStyles: {
      0: { cellWidth: 40 },
      1: { cellWidth: 35, halign: 'right' },
      2: { cellWidth: 35, halign: 'right' },
      3: { cellWidth: 40 },
      4: { cellWidth: 35, halign: 'right' }
    }
  });

  // Net Salary
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text(`Net Salary: ${formatCurrency(salaryData.netSalary)}`, 105, doc.lastAutoTable.finalY + 15, { align: 'center' });

  // Footer
  doc.setFontSize(8);
  doc.setFont(undefined, 'italic');
  doc.text('This is a computer-generated document and does not require a signature.', 105, 280, { align: 'center' });

  return doc;
};

export const downloadPaySlip = (employee, salaryData, company, month, year) => {
  const doc = generatePaySlipPDF(employee, salaryData, company, month, year);
  doc.save(`PaySlip_${employee.empId}_${month}_${year}.pdf`);
};

export const downloadBulkPaySlips = (employees, company, month, year) => {
  const doc = new jsPDF();
  
  employees.forEach((emp, index) => {
    if (index > 0) doc.addPage();
    const tempDoc = generatePaySlipPDF(emp, emp, company, month, year);
    // Copy content from temp doc to main doc
  });
  
  doc.save(`PaySlips_${month}_${year}.pdf`);
};
