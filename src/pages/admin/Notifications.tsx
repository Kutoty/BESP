import { useApplicationsStore } from '../../store/useApplicationsStore';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useScholarsStore } from '../../store/useScholarsStore';

const Notifications = () => {
  const { applications, updateApplicationStatus } = useApplicationsStore();
  const { getScholarByEmail } = useScholarsStore();
  const navigate = useNavigate();

  const pendingUploads = applications.filter((app) => app.status === 'Pending');

  const handleApprove = (id: number) => {
    updateApplicationStatus(id, 'Approved');
    toast.success('Upload approved');
  };

  const handleReject = (id: number) => {
    updateApplicationStatus(id, 'Rejected');
    toast.error('Upload rejected');
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="flex items-center gap-3">
        <Bell className="w-7 h-7 text-emerald-600" />
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Notifications
        </h1>
      </div>

      {pendingUploads.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-16 text-center border border-gray-100 dark:border-gray-800">
          <Bell className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No new notifications</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingUploads.map((upload) => (
            <div
              key={upload.id}
              className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800"
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {upload.studentName}
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {upload.school} · {upload.currentTermResults}
                  </p>
                </div>
                <span className="text-xs bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 px-2.5 py-1 rounded-full shrink-0">
                  New Upload
                </span>
              </div>

              <div className="mt-5 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handleApprove(upload.id)}
                  className="flex-1 py-2.5 bg-emerald-600 text-white rounded-2xl flex items-center justify-center gap-2 text-sm font-medium hover:bg-emerald-700 transition"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </button>
                <button
                  onClick={() => handleReject(upload.id)}
                  className="flex-1 py-2.5 border border-red-200 text-red-600 rounded-2xl flex items-center justify-center gap-2 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-950/30 transition"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
                <button
                  onClick={() => {
                    const scholar = getScholarByEmail(upload.email);
                    if (scholar) navigate(`/admin/scholar/${scholar.id}`);
                    else navigate(`/admin/student/${upload.id}`);
                  }}
                  className="flex-1 py-2.5 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
