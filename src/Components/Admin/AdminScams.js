import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminScams() {
  const [scams, setScams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScams();
  }, []);

  const fetchScams = async () => {
    try {
      const res = await axios.get("https://skilviu.com/backend/api/v1/scams");
      setScams(res.data.data);
    } catch (error) {
      console.error("Error fetching scams:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center py-8">Loading...</p>;

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-2xl font-semibold mb-6">Reported Job Scams</h2>

      {/* DESKTOP VIEW: Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">First Name</th>
              <th className="px-4 py-2 border">Last Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Phone</th>
              <th className="px-4 py-2 border">Issue</th>
              <th className="px-4 py-2 border">Proof</th>
              <th className="px-4 py-2 border">Submitted At</th>
            </tr>
          </thead>
          <tbody>
            {scams.map((scam) => (
              <tr key={scam.id} className="text-sm">
                <td className="px-4 py-2 border">{scam.first_name}</td>
                <td className="px-4 py-2 border">{scam.last_name}</td>
                <td className="px-4 py-2 border">{scam.email}</td>
                <td className="px-4 py-2 border">{scam.phone_number}</td>
                <td className="px-4 py-2 border max-w-[250px] break-words">
                  {scam.issue_description}
                </td>
                <td className="px-4 py-2 border text-center">
                  {scam.proof_file ? (
                    <a
                      href={scam.proof_file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      View File
                    </a>
                  ) : (
                    "No file"
                  )}
                </td>
                <td className="px-4 py-2 border">
                  {new Date(scam.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE VIEW: Cards */}
      <div className="grid gap-4 md:hidden">
        {scams.map((scam) => (
          <div
            key={scam.id}
            className="border rounded-lg p-4 shadow-sm bg-white"
          >
            <p>
              <span className="font-semibold">First Name: </span>
              {scam.first_name}
            </p>
            <p>
              <span className="font-semibold">Last Name: </span>
              {scam.last_name}
            </p>
            <p>
              <span className="font-semibold">Email: </span>
              {scam.email}
            </p>
            <p>
              <span className="font-semibold">Phone: </span>
              {scam.phone_number}
            </p>
            <p className="mt-2">
              <span className="font-semibold">Issue: </span>
              {scam.issue_description}
            </p>
            <p className="mt-2">
              <span className="font-semibold">Proof: </span>
              {scam.proof_file ? (
                <a
                  href={scam.proof_file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View File
                </a>
              ) : (
                "No file"
              )}
            </p>
            <p className="mt-2 text-sm text-gray-600">
              <span className="font-semibold">Submitted At: </span>
              {new Date(scam.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminScams;
