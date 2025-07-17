import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Clientformedit() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingClient, setEditingClient] = useState(null);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const FILE_BASE_URL = 'https://skilviu.com/uploads/';

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await axios.get('https://skilviu.com/backend/api/v1/clientforms');
        const clientArray = res.data?.data?.data || [];
        setClients(clientArray);
      } catch (err) {
        console.error('Failed to fetch clients:', err);
        setError('Failed to load clients.');
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const handleEditClick = (client) => {
    setEditingClient({ ...client });
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setEditingClient({
      ...editingClient,
      [name]: files?.[0] || value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingClient?.id) return;

    try {
      setSaving(true);
      const formData = new FormData();

      const allowedFields = [
        'company_name', 'email', 'phone', 'location', 'website',
        'gst_number', 'contact_name', 'designation', 'contact_email',
        'contact_phone', 'company_logo', 'sla_document'
      ];

      allowedFields.forEach((key) => {
        const value = editingClient[key];
        if (value instanceof File) {
          formData.append(key, value);
        } else if (typeof value === 'string' && value.trim() !== '' && !['company_logo', 'sla_document'].includes(key)) {
          formData.append(key, value);
        }
      });

      await axios.post(
        `https://skilviu.com/backend/api/v1/clientforms/${editingClient.id}?_method=PUT`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      alert('Client updated successfully!');
      setEditingClient(null);
      window.location.reload();
    } catch (err) {
      console.error('Update failed:', err);
      if (err.response?.status === 422 && err.response.data?.errors) {
        const errors = Object.values(err.response.data.errors).flat().join('\n');
        alert('Validation Errors:\n' + errors);
      } else {
        alert('Failed to update client.');
      }
    } finally {
      setSaving(false);
    }
  };

  const closeModal = () => setEditingClient(null);

  if (loading) return <p className="p-4">Loading client data...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6 text-blue-800">Client List</h1>

      <table className="w-full table-auto text-sm border shadow rounded">
        <thead className="bg-blue-700 text-white">
          <tr>
            <th className="px-4 py-2 text-left">Company</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Phone</th>
            <th className="px-4 py-2 text-left">Location</th>
            <th className="px-4 py-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody className="text-gray-800">
          {clients.map((client) => (
            <tr key={client.id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2">{client.company_name}</td>
              <td className="px-4 py-2">{client.email}</td>
              <td className="px-4 py-2">{client.phone}</td>
              <td className="px-4 py-2">{client.location}</td>
              <td className="px-4 py-2">
                <button
                  onClick={() => handleEditClick(client)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-3xl max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Edit Client: {editingClient.company_name}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <input type="text" name="company_name" value={editingClient.company_name || ''} onChange={handleChange} placeholder="Company Name" className="p-2 border rounded col-span-2" required />
              <input type="email" name="email" value={editingClient.email || ''} onChange={handleChange} placeholder="Company Email" className="p-2 border rounded" />
              <input type="text" name="phone" value={editingClient.phone || ''} onChange={handleChange} placeholder="Phone" className="p-2 border rounded" />
              <input type="text" name="location" value={editingClient.location || ''} onChange={handleChange} placeholder="Location" className="p-2 border rounded col-span-2" />
              <input type="url" name="website" value={editingClient.website || ''} onChange={handleChange} placeholder="Website" className="p-2 border rounded col-span-2" />
              <input type="text" name="gst_number" value={editingClient.gst_number || ''} onChange={handleChange} placeholder="GST Number" className="p-2 border rounded" />
              <input type="text" name="contact_name" value={editingClient.contact_name || ''} onChange={handleChange} placeholder="Contact Name" className="p-2 border rounded" />
              <input type="text" name="designation" value={editingClient.designation || ''} onChange={handleChange} placeholder="Designation" className="p-2 border rounded" />
              <input type="email" name="contact_email" value={editingClient.contact_email || ''} onChange={handleChange} placeholder="Contact Email" className="p-2 border rounded" />
              <input type="text" name="contact_phone" value={editingClient.contact_phone || ''} onChange={handleChange} placeholder="Contact Phone" className="p-2 border rounded" />

              <div className="col-span-2">
                <label className="block mb-1 text-sm font-medium">Company Logo</label>
                {editingClient.company_logo && typeof editingClient.company_logo === 'string' && (
                  <img
                    src={`${FILE_BASE_URL}${editingClient.company_logo}`}
                    alt="Company Logo"
                    className="mb-2 h-16 object-contain border rounded"
                  />
                )}
                <input
                  type="file"
                  name="company_logo"
                  accept=".jpg,.jpeg,.png,.svg"
                  onChange={handleChange}
                  className="p-2 border rounded w-full"
                />
              </div>

              <div className="col-span-2">
                <label className="block mb-1 text-sm font-medium">SLA Document (PDF only)</label>
                {editingClient.sla_document && typeof editingClient.sla_document === 'string' && (
                  <a
                    href={`${FILE_BASE_URL}${editingClient.sla_document}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline block mb-2"
                  >
                    View Current SLA PDF
                  </a>
                )}
                <input
                  type="file"
                  name="sla_document"
                  accept=".pdf"
                  onChange={handleChange}
                  className="p-2 border rounded w-full"
                />
              </div>

              <div className="col-span-2 flex justify-end gap-3 mt-4">
                <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
                  {saving ? 'Saving...' : 'Update Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Clientformedit;
