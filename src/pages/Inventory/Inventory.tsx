// @ts-nocheck
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Inventory = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Get all customers
  const getCustomers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://8560e6af88c8.ngrok-free.app/api/v1/inventory/getall"
      );

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

  // 🔹 Delete inventory
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this inventory?"
    );
    if (!confirmDelete) return;

    try {
      const res = await axios.delete(
        `https://8560e6af88c8.ngrok-free.app/api/v1/inventory/delete/${id}`
      );
console.log("ressss",res);

      if (res.data) {
        alert("Customer deleted successfully ✅");
        getCustomers(); // refresh list
      }
    } catch (error) {
      console.error(error);
      alert("Delete failed ❌");
    }
  };

  const fileInputRef = useRef(null);

  const handleExcelClick = () => {
  fileInputRef.current.click();
};

  const handleExcelUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file); // backend me same key hona chahiye

  try {
    const res = await axios.post(
      "https://8560e6af88c8.ngrok-free.app/api/v1/inventory/upload-excel",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
console.log("resss",res);

    if (res.data) {
      toast.success("Excel uploaded successfully ✅");
    getCustomers();

      // optional: inventory list reload
    } else {
      toast.error("Excel upload failed ❌");
    }
  } catch (error) {
    console.error(error);
    toast.error("Something went wrong ❌");
  }
};

  return (
    <div className="p-4">
      {/* Header */}
    <div className="flex justify-between items-center mb-4">
  <h2 className="text-xl font-semibold">Inventory List</h2>

  {/* Right side buttons */}
  <div className="flex gap-2">
    <button
      onClick={handleExcelClick}
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
    >
      Excel Upload
    </button>
<input
  type="file"
  ref={fileInputRef}
  className="hidden"
  accept=".xlsx,.xls"
  onChange={handleExcelUpload}
/>
    <button
      onClick={() => navigate("/inventory/add")}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      + Add Inventory
    </button>
  </div>
</div>


      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">#</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Hsn</th>
              <th className="border p-2">Unit</th>
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
                  <td className="border p-2 text-center">
                    {index + 1}
                  </td>
                  <td className="border p-2">{item.name}</td>
                  <td className="border p-2">{item.hsn || "-"}</td>
                  <td className="border p-2">{item.unit}</td>

                  {/* Actions */}
                  <td className="border p-2 text-center space-x-2">
                    <button
                      onClick={() =>
                        navigate(`/inventory/edit/${item.id}`)
                      }
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

export default Inventory;
