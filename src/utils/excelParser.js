import * as XLSX from 'xlsx';
import DOMPurify from 'dompurify';
import { excelSerialToDate } from './dateUtils';
import { EXCEL_CONSTANTS } from '../constants';

export const parseAttendanceExcel = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }

    if (!file.name.match(/\.(xlsx|xls|csv)$/)) {
      reject(new Error('Invalid file format. Please upload Excel or CSV file.'));
      return;
    }

    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        
        // Check for corrupted file
        if (!data || data.length === 0) {
          reject(new Error('File is empty or corrupted'));
          return;
        }
        
        let workbook;
        try {
          workbook = XLSX.read(data, { type: 'array', cellDates: true });
        } catch (xlsxError) {
          reject(new Error('File is corrupted or not a valid Excel file'));
          return;
        }
        
        if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
          reject(new Error('Excel file is empty'));
          return;
        }

        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '', raw: false });

        if (!jsonData || jsonData.length < 4) {
          reject(new Error('Invalid Excel format: insufficient data'));
          return;
        }

        const month = jsonData[0]?.[0]?.replace('SALARY FOR THE  MONTH OF ', '') || 'Unknown';

        // Sanitize month string to prevent XSS
        const sanitizedMonth = DOMPurify.sanitize(month, { ALLOWED_TAGS: [] });

        const dateRow = jsonData[1];
        if (!dateRow) {
          reject(new Error('Invalid Excel format: missing date row'));
          return;
        }

        const dates = [];
        for (let i = EXCEL_CONSTANTS.DATE_ROW_START; i < Math.min(EXCEL_CONSTANTS.DATE_ROW_END, dateRow.length); i++) {
          if (dateRow[i]) {
            const date = typeof dateRow[i] === 'number' ? excelSerialToDate(dateRow[i]) : new Date(dateRow[i]);
            if (isNaN(date.getTime()) || date.getFullYear() < 2000 || date.getFullYear() > 2100) {
              reject(new Error(`Invalid date at column ${i}: ${dateRow[i]}`));
              return;
            }
            dates.push(date);
          }
        }

        if (dates.length === 0) {
          reject(new Error('No valid dates found in Excel file'));
          return;
        }

        const dayRow = jsonData[2];
        const days = [];
        for (let i = EXCEL_CONSTANTS.DATE_ROW_START; i < Math.min(EXCEL_CONSTANTS.DATE_ROW_END, dayRow?.length || 0); i++) {
          if (dayRow?.[i]) days.push(dayRow[i]);
        }

        const employees = [];
        for (let i = EXCEL_CONSTANTS.DATA_START_ROW; i < jsonData.length; i++) {
          const row = jsonData[i];
          if (!row[0]) continue;

          try {
            const attendance = [];
            for (let j = EXCEL_CONSTANTS.DATE_ROW_START; j < Math.min(EXCEL_CONSTANTS.DATE_ROW_END, row.length); j++) {
              attendance.push(row[j] || '');
            }

            employees.push({
              sno: row[0],
              empId: DOMPurify.sanitize(String(row[1] || ''), { ALLOWED_TAGS: [] }),
              epfNo: DOMPurify.sanitize(String(row[2] || ''), { ALLOWED_TAGS: [] }),
              esiNo: DOMPurify.sanitize(String(row[3] || ''), { ALLOWED_TAGS: [] }),
              name: DOMPurify.sanitize(String(row[4] || ''), { ALLOWED_TAGS: [] }),
              gross: parseFloat(row[5]) || 0,
              openingCL: parseFloat(row[EXCEL_CONSTANTS.OPENING_CL_COLUMN]) || 8,
              presentDays: parseFloat(row[6]) || 0,
              paidHoliday: parseFloat(row[7]) || 0,
              weekOff: parseFloat(row[8]) || 0,
              onDuty: parseFloat(row[9]) || 0,
              casualLeave: parseFloat(row[10]) || 0,
              lossOfPay: parseFloat(row[11]) || 0,
              payableDays: parseFloat(row[12]) || 0,
              earnedGross: parseFloat(row[13]) || 0,
              basic: parseFloat(row[14]) || 0,
              da: parseFloat(row[15]) || 0,
              hra: parseFloat(row[16]) || 0,
              bonus: parseFloat(row[17]) || 0,
              otherAllowance: parseFloat(row[18]) || 0,
              ot: parseFloat(row[19]) || 0,
              totalEarnings: parseFloat(row[20]) || 0,
              epf: parseFloat(row[21]) || 0,
              esi: parseFloat(row[22]) || 0,
              profTax: parseFloat(row[23]) || 0,
              otherDeduction: parseFloat(row[24]) || 0,
              totalDeduction: parseFloat(row[25]) || 0,
              netSalary: parseFloat(row[26]) || 0,
              attendance
            });
          } catch (rowError) {
            console.warn(`Error parsing row ${i}:`, rowError);
            continue;
          }
        }

        if (employees.length === 0) {
          reject(new Error('No employee data found in Excel file'));
          return;
        }

        resolve({ month: sanitizedMonth, dates, days, employees });
      } catch (error) {
        reject(new Error(`Failed to parse Excel: ${error.message}`));
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file. Please check file permissions.'));
    
    try {
      reader.readAsArrayBuffer(file);
    } catch (error) {
      reject(new Error('Unable to read file. Browser may not support this operation.'));
    }
  });
};
