import { useApplicationsStore } from '../../store/useApplicationsStore';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { formatKsh, getMeanGradeColour } from '../../lib/utils';

const ApplicationsTable = () => {
  const { applications, updateApplicationStatus } = useApplicationsStore();
  const navigate = useNavigate();

  const pendingUploads = applications.filter((app) => app.status === 'Pending');

  const handleApprove = (id: number) => {
    updateApplicationStatus(id, 'Approved');
    toast.success('Term results approved');
  };

  const handleReject = (id: number) => {
    updateApplicationStatus(id, 'Rejected');
    toast.error('Term results rejected');
  };

  return (
    <div className="space-y-8">
      <p className="text-gray-600 dark:text-gray-400">
        Review student-submitted term results and fees
      </p>

      {pendingUploads.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-16 text-center border border-gray-100 dark:border-gray-800">
          <p className="text-lg text-gray-500">No pending uploads at the moment</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800/80">
                <tr>
                  <th className="px-6 py-4 text-left font-medium">Student</th>
                  <th className="px-6 py-4 text-left font-medium">Level</th>
                  <th className="px-6 py-4 text-left font-medium">Term</th>
                  <th className="px-6 py-4 text-left font-medium">Mean Grade</th>
                  <th className="px-6 py-4 text-left font-medium">Next Fees</th>
                  <th className="px-6 py-4 text-center font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {pendingUploads.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                    <td className="px-6 py-4 font-medium">{app.studentName}</td>
                    <td className="px-6 py-4">{app.schoolLevel}</td>
                    <td className="px-6 py-4">
                      {app.currentTermResults.split(' - ')[0]}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-bold ${getMeanGradeColour(app.meanGrade)}`}>
                        {app.meanGrade}
                      </span>
                      <span className="text-xs text-gray-500 ml-1">({app.meanScore}%)</span>
                    </td>
                    <td className="px-6 py-4">{formatKsh(app.amountRequested)}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-center flex-wrap">
                        <button
                          onClick={() => handleApprove(app.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 rounded-xl text-xs font-medium hover:bg-emerald-200 transition"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(app.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 rounded-xl text-xs font-medium hover:bg-red-200 transition"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Reject
                        </button>
                        <button
                          onClick={() => navigate(`/admin/student/${app.id}`)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-emerald-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-xs font-medium transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationsTable;
