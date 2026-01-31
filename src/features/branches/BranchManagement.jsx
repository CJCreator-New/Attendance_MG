import { useState, useEffect } from 'react';
import { BranchService } from '../../services/branchService';
import { TenantService } from '../../services/tenantService';
import { toast } from 'react-hot-toast';

export default function BranchManagement() {
  const [branches, setBranches] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [form, setForm] = useState({ name: '', code: '', location: '', tenantId: '' });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [tenantsData] = await Promise.all([TenantService.getAll()]);
      setTenants(tenantsData);
      if (tenantsData.length > 0) {
        const branchesData = await BranchService.getByTenant(tenantsData[0].$id);
        setBranches(branchesData);
        setForm(f => ({ ...f, tenantId: tenantsData[0].$id }));
      }
    } catch (error) {
      toast.error('Failed to load data');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await BranchService.update(editing, form);
        toast.success('Branch updated');
      } else {
        await BranchService.create(form);
        toast.success('Branch created');
      }
      setForm({ name: '', code: '', location: '', tenantId: form.tenantId });
      setEditing(null);
      loadData();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete branch?')) return;
    try {
      await BranchService.delete(id);
      toast.success('Branch deleted');
      loadData();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Branch Management</h2>
      
      <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded">
        <select
          value={form.tenantId}
          onChange={(e) => setForm({ ...form, tenantId: e.target.value })}
          className="border p-2 mr-2"
          required
        >
          <option value="">Select Tenant</option>
          {tenants.map(t => <option key={t.$id} value={t.$id}>{t.name}</option>)}
        </select>
        <input
          type="text"
          placeholder="Branch Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-2 mr-2"
          required
        />
        <input
          type="text"
          placeholder="Code"
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
          className="border p-2 mr-2"
          required
        />
        <input
          type="text"
          placeholder="Location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          className="border p-2 mr-2"
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {editing ? 'Update' : 'Create'}
        </button>
        {editing && (
          <button
            type="button"
            onClick={() => { setEditing(null); setForm({ name: '', code: '', location: '', tenantId: form.tenantId }); }}
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
            <th className="p-2 border">Code</th>
            <th className="p-2 border">Location</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {branches.map((branch) => (
            <tr key={branch.$id}>
              <td className="p-2 border">{branch.name}</td>
              <td className="p-2 border">{branch.code}</td>
              <td className="p-2 border">{branch.location}</td>
              <td className="p-2 border">{branch.status}</td>
              <td className="p-2 border">
                <button
                  onClick={() => { setEditing(branch.$id); setForm(branch); }}
                  className="text-blue-500 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(branch.$id)}
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
