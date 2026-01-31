import { useState, useEffect } from 'react';
import { TenantService } from '../../services/tenantService';
import { toast } from 'react-hot-toast';

export default function TenantManagement() {
  const [tenants, setTenants] = useState([]);
  const [form, setForm] = useState({ name: '', domain: '', settings: {} });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    loadTenants();
  }, []);

  const loadTenants = async () => {
    try {
      const data = await TenantService.getAll();
      setTenants(data);
    } catch (error) {
      toast.error('Failed to load tenants');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await TenantService.update(editing, form);
        toast.success('Tenant updated');
      } else {
        await TenantService.create(form);
        toast.success('Tenant created');
      }
      setForm({ name: '', domain: '', settings: {} });
      setEditing(null);
      loadTenants();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete tenant?')) return;
    try {
      await TenantService.delete(id);
      toast.success('Tenant deleted');
      loadTenants();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Tenant Management</h2>
      
      <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded">
        <input
          type="text"
          placeholder="Tenant Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-2 mr-2"
          required
        />
        <input
          type="text"
          placeholder="Domain"
          value={form.domain}
          onChange={(e) => setForm({ ...form, domain: e.target.value })}
          className="border p-2 mr-2"
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {editing ? 'Update' : 'Create'}
        </button>
        {editing && (
          <button
            type="button"
            onClick={() => { setEditing(null); setForm({ name: '', domain: '', settings: {} }); }}
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
            <th className="p-2 border">Domain</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tenants.map((tenant) => (
            <tr key={tenant.$id}>
              <td className="p-2 border">{tenant.name}</td>
              <td className="p-2 border">{tenant.domain}</td>
              <td className="p-2 border">{tenant.status}</td>
              <td className="p-2 border">
                <button
                  onClick={() => { setEditing(tenant.$id); setForm(tenant); }}
                  className="text-blue-500 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(tenant.$id)}
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
