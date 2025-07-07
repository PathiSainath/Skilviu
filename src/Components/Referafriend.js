import React, { useState } from 'react';

function Referafriend() {
  const [formData, setFormData] = useState({
    friendName: '',
    friendContact: '',
    friendEmail: '',
    friendPreferredCompany: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'friendContact') {
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length <= 10) {
        setFormData((prev) => ({ ...prev, [name]: digitsOnly }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Friend referred:', formData);
    // Optionally clear the form
    setFormData({
      friendName: '',
      friendContact: '',
      friendEmail: '',
      friendPreferredCompany: '',
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 sm:p-10">
      <div className="max-w-xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">
          🤝 Refer a Friend
        </h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
          {[ 
            { label: "Friend's Name", name: 'friendName', type: 'text' },
            { label: 'Contact Number', name: 'friendContact', type: 'tel', maxLength: 10 },
            { label: 'Email ID', name: 'friendEmail', type: 'email' },
            { label: 'Preferred Company', name: 'friendPreferredCompany', type: 'text' },
          ].map(({ label, name, type, maxLength }) => (
            <div key={name} className="flex flex-col">
              <label htmlFor={name} className="mb-2 text-sm font-semibold text-gray-700">
                {label}
              </label>
              <input
                id={name}
                name={name}
                type={type}
                value={formData[name]}
                onChange={handleChange}
                maxLength={maxLength}
                className="border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          ))}

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition"
            >
              Submit 
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Referafriend;
