// @ts-nocheck

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Invoice = () => {
    const navigate = useNavigate();
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(false);

    // 🔹 Get all invoices
    const getInvoice = async () => {
        try {
            setLoading(true);
            const res = await axios.get(
                "http://localhost:3688/api/v1/invoice/getall"
            );

            if (res.data?.success) {
                setInvoices(res.data.data || []);
            }
        } catch (error) {
            console.error(error);
            // alert("Failed to fetch invoices ❌");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getInvoice();
    }, []);

    // 🔹 Delete customer
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this invoice?"
        );
        if (!confirmDelete) return;

        try {
            const res = await axios.delete(
                `http://localhost:3688/api/v1/invoice/delete/${id}`
            );
            console.log("ressss", res);

            if (res.data) {
                alert("Invoice deleted successfully ✅");
                getInvoice(); // refresh list
            }
        } catch (error) {
            console.error(error);
            alert("Delete failed ❌");
        }
    };
    return (
        <div className="p-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Estimate List</h2>
                <button
                    onClick={() => navigate("/invoice/add")}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    + Add Invoice
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full border border-gray-300">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border p-2">#</th>
                            <th className="border p-2">Customer Name</th>
                            <th className="border p-2">Invoice Number</th>
                            <th className="border p-2">Order Number</th>
                            <th className="border p-2">Date</th>
                            <th className="border p-2">State</th>
                            <th className="border p-2">Items</th>
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
                        ) : invoices.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center p-4">
                                    No invoice found
                                </td>
                            </tr>
                        ) : (
                            invoices.map((item, index) => (
                                <tr key={item._id}>
                                    <td className="border p-2 text-center">
                                        {index + 1}
                                    </td>
                                    <td className="border p-2">{item.customerName}</td>
                                    <td className="border p-2">{item.invoiceNumber}</td>
                                    <td className="border p-2">{item.orderNumber}</td>
                                    <td className="border p-2">{item.date}</td>
                                    <td className="border p-2">{item.state}</td>

                                    {/* Actions */}
                                    <td className="border p-2 text-center space-x-2">
                                        <button
                                            onClick={() =>
                                                navigate(`/invoice/edit/${item.id}`)
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
    )
}

export default Invoice