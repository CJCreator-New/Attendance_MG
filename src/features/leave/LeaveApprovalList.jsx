import { Check, X, Clock } from 'lucide-react';
import { format } from 'date-fns';

export const LeaveApprovalList = ({ applications, onApprove, onReject }) => {
  const getStatusBadge = (status) => {
    const badges = {
      Pending: 'bg-amber-100 text-amber-700',
      Approved: 'bg-green-100 text-green-700',
      Rejected: 'bg-red-100 text-red-700'
    };
    return badges[status] || badges.Pending;
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold text-gray-900">Leave Requests</h2>
        <p className="text-sm text-gray-600 mt-1">Review and approve leave applications</p>
      </div>

      <div className="divide-y">
        {applications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>No pending leave requests</p>
          </div>
        ) : (
          applications.map((app) => (
            <div key={app.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{app.employeeName}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(app.status)}`}>
                      {app.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {app.leaveType} • {app.days} day{app.days > 1 ? 's' : ''}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    {format(new Date(app.startDate), 'MMM dd, yyyy')} - {format(new Date(app.endDate), 'MMM dd, yyyy')}
                  </p>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{app.reason}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Applied on {format(new Date(app.appliedOn), 'MMM dd, yyyy')}
                  </p>
                </div>

                {app.status === 'Pending' && (
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => onApprove(app.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => onReject(app.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
