// @ts-nocheck

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../utils/axiosInstance";
import endPointApi from "../../utils/endPointApi";

const Customer = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Get all customers
  const getCustomers = async () => {
    try {
      setLoading(true);
      const res = await api.get(`${endPointApi.getAllCustomer}`);

      if (res.data?.success) {
        setCustomers(res.data.data || []);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to fetch customers ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCustomers();
  }, []);

  // 🔹 Delete customer
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this customer?"
    );
    if (!confirmDelete) return;

    try {
      const res = await api.delete(`${endPointApi.deleteCustomer}/${id}`);

      if (res.data) {
        toast.success(res.data.message);
        getCustomers(); // refresh list
      }
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Customer List</h2>
        <button
          onClick={() => navigate("/customer/add")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Customer
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Sr.</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Mobile</th>
              <th className="border p-2">City</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center p-4">
                  Loading...
                </td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-4">
                  No customers found
                </td>
              </tr>
            ) : (
              customers.map((item, index) => (
                <tr key={item._id}>
                  <td className="border p-2 text-center">{index + 1}</td>
                  <td className="border p-2">{item.name}</td>
                  <td className="border p-2">{item.email || "-"}</td>
                  <td className="border p-2">{item.mobile}</td>
                  <td className="border p-2">{item.city}</td>

                  {/* Actions */}
                  <td className="border p-2 text-center space-x-2">
                    <button
                      onClick={() => navigate(`/customer/edit/${item.id}`)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customer;
