// Database utilities and patterns

// Index recommendations
export const DATABASE_INDEXES = {
  attendance: [
    'CREATE INDEX idx_attendance_emp_id ON attendance(employee_id)',
    'CREATE INDEX idx_attendance_date ON attendance(date)',
    'CREATE INDEX idx_attendance_status ON attendance(status)'
  ],
  employees: [
    'CREATE INDEX idx_employee_dept ON employees(department)',
    'CREATE INDEX idx_employee_email ON employees(email)',
    'CREATE INDEX idx_employee_status ON employees(status)'
  ],
  leave: [
    'CREATE INDEX idx_leave_emp_id ON leave_applications(employee_id)',
    'CREATE INDEX idx_leave_status ON leave_applications(status)',
    'CREATE INDEX idx_leave_dates ON leave_applications(start_date, end_date)'
  ]
};

// Transaction wrapper
export const withTransaction = async (callback) => {
  // For future backend implementation
  try {
    const result = await callback();
    return { success: true, data: result };
  } catch (error) {
    console.error('Transaction failed:', error);
    return { success: false, error: error.message };
  }
};

// Migration template
export const createMigration = (name, up, down) => {
  return {
    name,
    timestamp: Date.now(),
    up: async (db) => {
      console.log(`Running migration: ${name}`);
      await up(db);
    },
    down: async (db) => {
      console.log(`Rolling back migration: ${name}`);
      await down(db);
    }
  };
};

// Foreign key constraints
export const FOREIGN_KEYS = {
  attendance_employee: 'ALTER TABLE attendance ADD CONSTRAINT fk_attendance_employee FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE',
  leave_employee: 'ALTER TABLE leave_applications ADD CONSTRAINT fk_leave_employee FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE',
  salary_employee: 'ALTER TABLE salary_records ADD CONSTRAINT fk_salary_employee FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE'
};

// Query builder helpers
export const buildWhereClause = (filters) => {
  const conditions = [];
  const params = [];
  
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null) {
      conditions.push(`${key} = ?`);
      params.push(value);
    }
  }
  
  return {
    where: conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '',
    params
  };
};
