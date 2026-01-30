import { Calendar, TrendingDown, TrendingUp } from 'lucide-react';

export const LeaveBalanceTracker = ({ employee, year = 2026 }) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const leaveData = {
    openingBalance: employee.openingCL || 8,
    monthly: months.map(() => 0),
    totalTaken: employee.casualLeave || 0,
    balance: (employee.openingCL || 8) - (employee.casualLeave || 0)
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{employee.name}</h3>
          <p className="text-sm text-gray-600">{employee.empId}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Balance CL</p>
          <p className="text-2xl font-bold text-blue-600">{leaveData.balance}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Opening Balance</p>
          <p className="text-xl font-bold text-blue-600">{leaveData.openingBalance}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Leave Taken</p>
          <p className="text-xl font-bold text-red-600">{leaveData.totalTaken}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Remaining</p>
          <p className="text-xl font-bold text-green-600">{leaveData.balance}</p>
        </div>
        <div className="bg-amber-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Utilization</p>
          <p className="text-xl font-bold text-amber-600">
            {leaveData.openingBalance > 0 ? Math.round((leaveData.totalTaken / leaveData.openingBalance) * 100) : 0}%
          </p>
        </div>
      </div>

      <div className="border-t pt-4">
        <h4 className="font-semibold text-gray-900 mb-3">Monthly Breakdown - {year}</h4>
        <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
          {months.map((month, idx) => (
            <div key={month} className="text-center">
              <p className="text-xs text-gray-600 mb-1">{month}</p>
              <div className={`w-full h-8 rounded flex items-center justify-center text-sm font-semibold ${
                leaveData.monthly[idx] > 0 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-400'
              }`}>
                {leaveData.monthly[idx] || '-'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
