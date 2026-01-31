import { useState, useEffect } from 'react';
import { WorkflowService } from '../../services/workflowService';
import { toast } from 'react-hot-toast';

export default function WorkflowBuilder() {
  const [workflows, setWorkflows] = useState([]);
  const [form, setForm] = useState({ name: '', type: 'leave', steps: [] });
  const [editing, setEditing] = useState(null);
  const [stepForm, setStepForm] = useState({ approverId: '', role: '', order: 1 });

  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {
    try {
      const data = await WorkflowService.getByType('leave');
      setWorkflows(data);
    } catch (error) {
      toast.error('Failed to load workflows');
    }
  };

  const addStep = () => {
    setForm({ ...form, steps: [...form.steps, { ...stepForm, status: 'pending' }] });
    setStepForm({ approverId: '', role: '', order: form.steps.length + 2 });
  };

  const removeStep = (index) => {
    setForm({ ...form, steps: form.steps.filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await WorkflowService.update(editing, form);
        toast.success('Workflow updated');
      } else {
        await WorkflowService.create(form);
        toast.success('Workflow created');
      }
      setForm({ name: '', type: 'leave', steps: [] });
      setEditing(null);
      loadWorkflows();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete workflow?')) return;
    try {
      await WorkflowService.delete(id);
      toast.success('Workflow deleted');
      loadWorkflows();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Workflow Builder</h2>
      
      <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Workflow Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border p-2 mr-2"
            required
          />
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="border p-2"
          >
            <option value="leave">Leave</option>
            <option value="overtime">Overtime</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <div className="mb-4 p-3 bg-gray-50 rounded">
          <h3 className="font-bold mb-2">Approval Steps</h3>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Approver ID"
              value={stepForm.approverId}
              onChange={(e) => setStepForm({ ...stepForm, approverId: e.target.value })}
              className="border p-2"
            />
            <input
              type="text"
              placeholder="Role"
              value={stepForm.role}
              onChange={(e) => setStepForm({ ...stepForm, role: e.target.value })}
              className="border p-2"
            />
            <button type="button" onClick={addStep} className="bg-green-500 text-white px-3 py-1 rounded">
              Add Step
            </button>
          </div>
          <div className="space-y-2">
            {form.steps.map((step, i) => (
              <div key={i} className="flex items-center gap-2 p-2 bg-white rounded">
                <span>Step {step.order}: {step.role} ({step.approverId})</span>
                <button
                  type="button"
                  onClick={() => removeStep(i)}
                  className="text-red-500 ml-auto"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {editing ? 'Update' : 'Create'}
        </button>
        {editing && (
          <button
            type="button"
            onClick={() => { setEditing(null); setForm({ name: '', type: 'leave', steps: [] }); }}
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
            <th className="p-2 border">Type</th>
            <th className="p-2 border">Steps</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {workflows.map((workflow) => (
            <tr key={workflow.$id}>
              <td className="p-2 border">{workflow.name}</td>
              <td className="p-2 border">{workflow.type}</td>
              <td className="p-2 border">{workflow.steps.length} steps</td>
              <td className="p-2 border">{workflow.status}</td>
              <td className="p-2 border">
                <button
                  onClick={() => { setEditing(workflow.$id); setForm(workflow); }}
                  className="text-blue-500 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(workflow.$id)}
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
