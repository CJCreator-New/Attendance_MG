import { useState, useEffect } from 'react';
import { ShiftService } from '../../services/shiftService';
import { BranchService } from '../../services/branchService';
import { toast } from 'react-hot-toast';

export default function ShiftManagement() {
  const [shifts, setShifts] = useState([]);
  const [branches, setBranches] = useState([]);
  const [form, setForm] = useState({ name: '', startTime: '', endTime: '', branchId: '', overtimeRules: {} });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const branchesData = await BranchService.getByTenant('default');
      setBranches(branchesData);
      if (branchesData.length > 0) {
        const shiftsData = await ShiftService.getByBranch(branchesData[0].$id);
        setShifts(shiftsData);
        setForm(f => ({ ...f, branchId: branchesData[0].$id }));
      }
    } catch (error) {
      toast.error('Failed to load data');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await ShiftService.update(editing, form);
        toast.success('Shift updated');
      } else {
        await ShiftService.create(form);
        toast.success('Shift created');
      }
      setForm({ name: '', startTime: '', endTime: '', branchId: form.branchId, overtimeRules: {} });
      setEditing(null);
      loadData();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete shift?')) return;
    try {
      await ShiftService.delete(id);
      toast.success('Shift deleted');
      loadData();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Shift Management</h2>
      
      <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded">
        <select
          value={form.branchId}
          onChange={(e) => setForm({ ...form, branchId: e.target.value })}
          className="border p-2 mr-2"
          required
        >
          <option value="">Select Branch</option>
          {branches.map(b => <option key={b.$id} value={b.$id}>{b.name}</option>)}
        </select>
        <input
          type="text"
          placeholder="Shift Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-2 mr-2"
          required
        />
        <input
          type="time"
          placeholder="Start Time"
          value={form.startTime}
          onChange={(e) => setForm({ ...form, startTime: e.target.value })}
          className="border p-2 mr-2"
          required
        />
        <input
          type="time"
          placeholder="End Time"
          value={form.endTime}
          onChange={(e) => setForm({ ...form, endTime: e.target.value })}
          className="border p-2 mr-2"
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {editing ? 'Update' : 'Create'}
        </button>
        {editing && (
          <button
            type="button"
            onClick={() => { setEditing(null); setForm({ name: '', startTime: '', endTime: '', branchId: form.branchId, overtimeRules: {} }); }}
            className="ml-2 bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        )}
      </form>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Start Time</th>
            <th className="p-2 border">End Time</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {shifts.map((shift) => (
            <tr key={shift.$id}>
              <td className="p-2 border">{shift.name}</td>
              <td className="p-2 border">{shift.startTime}</td>
              <td className="p-2 border">{shift.endTime}</td>
              <td className="p-2 border">{shift.status}</td>
              <td className="p-2 border">
                <button
                  onClick={() => { setEditing(shift.$id); setForm(shift); }}
                  className="text-blue-500 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(shift.$id)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
