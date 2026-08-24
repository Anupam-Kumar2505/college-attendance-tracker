import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../common/Input.jsx';
import Button from '../common/Button.jsx';
import Alert from '../common/Alert.jsx';
import FileUpload from './FileUpload.jsx';
import { leaveApi } from '../../api/leaveApi.js';
import { Send, Calendar, CheckCircle2, Tag } from 'lucide-react';

const REASON_CATEGORIES = [
  'Medical',
  'Sports & Athletics',
  'Academic Conference / Seminar',
  'Technical Event / Hackathon',
  'Placement / Campus Interview',
  'Family Emergency',
  'Institutional / Department Duty'
];

export const LeaveApplicationForm = ({ onSuccess }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    category: ''
  });

  const [proofFile, setProofFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { startDate, endDate, category } = formData;

    // Validate inputs
    if (!startDate) {
      setError('Start Date is required');
      return;
    }
    if (!endDate) {
      setError('End Date is required');
      return;
    }
    if (startDate > endDate) {
      setError('Start Date must be before or equal to End Date');
      return;
    }

    if (!category || !category.trim()) {
      setError('Please select a Category');
      return;
    }

    if (!proofFile) {
      setError('Proof PDF document is mandatory. You cannot submit without a valid PDF.');
      return;
    }

    try {
      setLoading(true);
      const data = new FormData();
      data.append('startDate', startDate);
      data.append('endDate', endDate);
      data.append('reason', category.trim()); // stores category
      data.append('details', ''); // No details required
      data.append('proofFile', proofFile);

      await leaveApi.submitLeaveApplication(data);

      setSuccess(true);
      if (onSuccess) {
        onSuccess();
      } else {
        setTimeout(() => {
          navigate('/student/applications');
        }, 1500);
      }
    } catch (err) {
      setError(err.message || 'Failed to submit leave application');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="glass-panel p-8 rounded-2xl text-center space-y-4 max-w-lg mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-100">Leave Application Submitted</h3>
        <p className="text-sm text-slate-400">
          Your leave application has been recorded under <span className="text-brand-300 font-semibold">{formData.category}</span>. It will automatically apply across all your scheduled lectures from{' '}
          <span className="text-slate-200 font-semibold">{formData.startDate}</span> to{' '}
          <span className="text-slate-200 font-semibold">{formData.endDate}</span>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* Date Range Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Start Date"
          name="startDate"
          type="date"
          value={formData.startDate}
          onChange={handleChange}
          required
          icon={Calendar}
          helperText="Inclusive first day of leave"
        />

        <Input
          label="End Date"
          name="endDate"
          type="date"
          value={formData.endDate}
          onChange={handleChange}
          required
          icon={Calendar}
          helperText="Inclusive last day of leave"
        />
      </div>

      {/* Category Selector */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-brand-400" />
          <span>Category <span className="text-rose-400">*</span></span>
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="w-full bg-slate-900/80 border border-slate-700 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/25 text-slate-100 text-sm rounded-xl px-3.5 py-2.5 outline-none transition-all cursor-pointer"
        >
          <option value="">Select Category...</option>
          {REASON_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Mandatory File Upload Section */}
      <FileUpload
        file={proofFile}
        onFileSelect={setProofFile}
        error={!proofFile && error.includes('PDF') ? error : ''}
      />

      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          icon={Send}
          className="w-full"
        >
          Submit Leave Application
        </Button>
      </div>
    </form>
  );
};

export default LeaveApplicationForm;
