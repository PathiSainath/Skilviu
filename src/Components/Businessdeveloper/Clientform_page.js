import React, { useEffect, useState } from 'react';

function Clientform_page() {
  const [formData, setFormData] = useState({
    company_name: '',
    website: '',
    email: '',
    phone: '',
    location: '',
    company_logo: '',
    gst_number: '',
    sla_document: '',
    contact_name: '',
    designation: '',
    contact_email: '',
    contact_phone: '',
    contact_Name2: '',
    Designation2: '',
    contact_Email2: '',
    contact_Mobile2: '',
  });

  const [clients, setClients] = useState([]);
  const [errors, setErrors] = useState({});
  const [companyLogo, setCompanyLogo] = useState(null);
  const [slaFile, setSlaFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch all clients
  useEffect(() => {
    async function fetchClients() {
      try {
        const res = await fetch('https://skilviu.com/backend/api/v1/clientforms/dropdown');
        const data = await res.json();
        setClients(data); // ✅ No slice — fetch all
      } catch (error) {
        console.error('Failed to fetch clients:', error);
      }
    }

    fetchClients();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === 'company_logo') {
      setCompanyLogo(files[0]);
    } else if (name === 'sla_document') {
      setSlaFile(files[0]);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    const requiredFields = [
       'company_name', 'email', 'phone', 'location', 
      'gst_number', 'contact_name', 'designation',
      'contact_email', 'contact_phone'
    ];
    
    requiredFields.forEach(field => {
      if (!formData[field]?.trim()) {
        newErrors[field] = 'This field is required';
      }
    });

    if (!formData.website.trim()) {
      newErrors.website = 'Website is required';
    } else if (!/^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\S*)?$/.test(formData.website)) {
      newErrors.website = 'Please enter a valid website URL';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact_email)) {
      newErrors.contact_email = 'Please enter a valid email';
    }

    if (!/^\d{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Phone must be at least 10 digits';
    }

    if (!/^\d{10,}$/.test(formData.contact_phone)) {
      newErrors.contact_phone = 'Phone must be at least 10 digits';
    }

    if (!companyLogo) {
      newErrors.company_logo = 'Company logo is required';
    }

    if (!slaFile) {
      newErrors.sla_document = 'SLA document is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();

      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (companyLogo) formDataToSend.append('company_logo', companyLogo);
      if (slaFile) formDataToSend.append('sla_document', slaFile);

      const response = await fetch('https://skilviu.com/backend/api/v1/clientforms', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit form');
      }

      setFormData({
       
        company_name: '',
        website: '',
        email: '',
        phone: '',
        location: '',
        company_logo: '',
        gst_number: '',
        sla_document: '',
        contact_name: '',
        designation: '',
        contact_email: '',
        contact_phone: '',
        contact_Name2: '',
        Designation2: '',
        contact_Email2: '',
        contact_Mobile2: '',
      });
      setCompanyLogo(null);
      setSlaFile(null);
      setErrors({});

      alert('Form submitted successfully!');
    } catch (error) {
      console.error('Submission error:', error);
      alert(error.message || 'Error submitting form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Updated: No digit limit
  const numberOnlyProps = {
    inputMode: 'numeric',
    pattern: '\\d*',
    onKeyDown: (e) => {
      if (
        !/[0-9]/.test(e.key) &&
        !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)
      ) {
        e.preventDefault();
      }
    },
    onInput: (e) => {
      e.target.value = e.target.value.replace(/\D/g, '');
    },
  };

  return (
    <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-3xl p-10 mt-12">
      <header className="flex items-center space-x-4 mb-10">
        <h2 className="text-3xl font-extrabold text-gray-900"> 📋 Client Details</h2>
      </header>

      <form onSubmit={handleSubmit} className="space-y-12" encType="multipart/form-data" noValidate>
        {/* Company Information Section */}
        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-2">
            🏢 Company Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 mb-2">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                id="company_name"
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                placeholder="Company Name"
                className={`w-full rounded-lg border px-5 py-3 text-gray-900 text-base placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                    errors.company_name ? 'border-red-500' : 'border-gray-300'
                  }`}
              />
              {errors.company_name && (
                <p className="mt-1 text-sm text-red-600">{errors.company_name}</p>
              )}
            </div>

            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                Website <span className="text-red-500">*</span>
              </label>
              <input
                id="website"
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="www.example.com"
                className={`w-full rounded-lg border px-5 py-3 text-gray-900 text-base placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                    errors.website ? 'border-red-500' : 'border-gray-300'
                  }`}
              />
              {errors.website && (
                <p className="mt-1 text-sm text-red-600">{errors.website}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Id <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@example.com"
                className={`w-full rounded-lg border px-5 py-3 text-gray-900 text-base placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="company_logo" className="block text-sm font-medium text-gray-700 mb-2">
                Company Logo <span className="text-red-500">*</span>
              </label>
              <input
                id="company_logo"
                type="file"
                name="company_logo"
                accept="image/*"
                onChange={handleFileChange}
                className={`w-full rounded-lg border px-3 py-2 text-gray-700
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition cursor-pointer ${
                    errors.company_logo ? 'border-red-500' : 'border-gray-300'
                  }`}
              />
              {errors.company_logo && (
                <p className="mt-1 text-sm text-red-600">{errors.company_logo}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Contact Number <span className="text-red-500">*</span>
              </label>
              <input
                id="phone"
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="10-digit Mobile"
                {...numberOnlyProps}
                className={`w-full rounded-lg border px-5 py-3 text-gray-900 text-base placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>
          </div>

          {/* Location, GST Number and SLA Upload Section */}
          <div className="grid grid-cols-1 gap-8 mt-10">
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                id="location"
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="City, State"
                className={`w-full rounded-lg border px-5 py-3 text-gray-900 text-base placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                    errors.location ? 'border-red-500' : 'border-gray-300'
                  }`}
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
              <div>
                <label htmlFor="gst_number" className="block text-sm font-medium text-gray-700 mb-2">
                  GST Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="gst_number"
                  type="text"
                  name="gst_number"
                  value={formData.gst_number}
                  onChange={handleChange}
                  placeholder="GSTIN"
                  className={`w-full rounded-lg border px-5 py-3 text-gray-900 text-base placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                      errors.gst_number ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
                {errors.gst_number && (
                  <p className="mt-1 text-sm text-red-600">{errors.gst_number}</p>
                )}
              </div>

              <div>
                <label htmlFor="sla_document" className="block text-sm font-medium text-gray-700 mb-2">
                  SLA Document <span className="text-red-500">*</span>
                </label>
                <input
                  id="sla_document"
                  type="file"
                  name="sla_document"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className={`w-full rounded-lg border px-5 py-3 text-gray-900 text-base placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                      errors.sla_document ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
                {errors.sla_document && (
                  <p className="mt-1 text-sm text-red-600">{errors.sla_document}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Accepted formats: PDF, DOC, DOCX. Max size: 2MB.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Person Details Section */}
        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-2">
            📞 Contact Person Details
          </h3>

          {/* Contact Person 1 & 2 Details */}
          <div className="flex space-x-12 mt-10">
            {/* Contact Person 1 (Left Side) */}
            <div className="space-y-4 w-full">
              <h4 className="text-lg font-medium text-gray-800">Contact Person 1<span className="text-red-500">*</span></h4>
              <div>
                <label htmlFor="contact_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="contact_name"
                  type="text"
                  name="contact_name"
                  value={formData.contact_name}
                  onChange={handleChange}
                  placeholder="Name"
                  className={`w-full rounded-lg border px-5 py-3 text-gray-900 text-base placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                      errors.contact_name ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
                {errors.contact_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.contact_name}</p>
                )}
              </div>
              <div>
                <label htmlFor="designation" className="block text-sm font-medium text-gray-700 mb-2">
                  Designation <span className="text-red-500">*</span>
                </label>
                <input
                  id="designation"
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  placeholder="Designation"
                  className={`w-full rounded-lg border px-5 py-3 text-gray-900 text-base placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                      errors.designation ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
                {errors.designation && (
                  <p className="mt-1 text-sm text-red-600">{errors.designation}</p>
                )}
              </div>
              <div>
                <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Id <span className="text-red-500">*</span>
                </label>
                <input
                  id="contact_email"
                  type="email"
                  name="contact_email"
                  value={formData.contact_email}
                  onChange={handleChange}
                  placeholder="email@example.com"
                  className={`w-full rounded-lg border px-5 py-3 text-gray-900 text-base placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                      errors.contact_email ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
                {errors.contact_email && (
                  <p className="mt-1 text-sm text-red-600">{errors.contact_email}</p>
                )}
              </div>
              <div>
                <label htmlFor="contact_phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number (WhatsApp) <span className="text-red-500">*</span>
                </label>
                <input
                  id="contact_phone"
                  type="text"
                  name="contact_phone"
                  value={formData.contact_phone}
                  onChange={handleChange}
                  placeholder="10-digit Mobile"
                  {...numberOnlyProps}
                  className={`w-full rounded-lg border px-5 py-3 text-gray-900 text-base placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                      errors.contact_phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
                {errors.contact_phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.contact_phone}</p>
                )}
              </div>
            </div>

            {/* Contact Person 2 (Right Side) */}
            <div className="space-y-4 w-full">
              <h4 className="text-lg font-medium text-gray-800">Contact Person 2 (Optional)</h4>
              <div>
                <label htmlFor="contact_Name2" className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  id="contact_Name2"
                  type="text"
                  name="contact_Name2"
                  value={formData.contact_Name2}
                  onChange={handleChange}
                  placeholder="Name"
                  className="w-full rounded-lg border border-gray-300 px-5 py-3 text-gray-900 text-base placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
              <div>
                <label htmlFor="Designation2" className="block text-sm font-medium text-gray-700 mb-2">
                  Designation
                </label>
                <input
                  id="Designation2"
                  type="text"
                  name="Designation2"
                  value={formData.Designation2}
                  onChange={handleChange}
                  placeholder="Designation"
                  className="w-full rounded-lg border border-gray-300 px-5 py-3 text-gray-900 text-base placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
              <div>
                <label htmlFor="contact_Email2" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Id
                </label>
                <input
                  id="contact_Email2"
                  type="email"
                  name="contact_Email2"
                  value={formData.contact_Email2}
                  onChange={handleChange}
                  placeholder="email@example.com"
                  className="w-full rounded-lg border border-gray-300 px-5 py-3 text-gray-900 text-base placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
              <div>
                <label htmlFor="contact_Mobile2" className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number (WhatsApp)
                </label>
                <input
                  id="contact_Mobile2"
                  type="text"
                  name="contact_Mobile2"
                  value={formData.contact_Mobile2}
                  onChange={handleChange}
                  placeholder="10-digit Mobile"
                  {...numberOnlyProps}
                  className="w-full rounded-lg border border-gray-300 px-5 py-3 text-gray-900 text-base placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>
          </div>
        </section>

        <div className="flex justify-end mt-8">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 transition font-semibold rounded-xl px-10 py-3 shadow-lg text-white focus:outline-none focus:ring-4 focus:ring-blue-400"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Clientform_page;

