// @ts-nocheck

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, Download, Edit, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { downloadInvoicePDF } from "./invoicePdf";
import { api } from "../../utils/axiosInstance";
import endPointApi from "../../utils/endPointApi";

const Estimate = () => {
  const navigate = useNavigate();
  const [estimates, setEstimates] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Static data for testing
  const staticEstimates = [
    {
      _id: "1",
      id: "1",
      customerName: "John Doe",
      invoiceNumber: "EST-001",
      date: "2024-01-15",
      state: "Pending",
    },
    {
      _id: "2",
      id: "2",
      customerName: "Jane Smith",
      invoiceNumber: "EST-002",
      date: "2024-01-16",
      state: "Approved",
    },
    {
      _id: "3",
      id: "3",
      customerName: "Bob Johnson",
      invoiceNumber: "EST-003",
      date: "2024-01-17",
      state: "Rejected",
    },
    {
      _id: "4",
      id: "4",
      customerName: "Alice Williams",
      invoiceNumber: "EST-004",
      date: "2024-01-18",
      state: "Pending",
    },
    {
      _id: "5",
      id: "5",
      customerName: "Charlie Brown",
      invoiceNumber: "EST-005",
      date: "2024-01-19",
      state: "Approved",
    },
  ];

  // 🔹 Get all customers
  const getCustomers = async () => {
    try {
      setLoading(true);
      const res = await api.get(`${endPointApi.getAllEstimate}`);

      if (res.data) {
        setEstimates(res.data.data || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCustomers();
  }, []);

  // 🔹 View estimate
  const handleView = (id) => {
    navigate(`/estimate/view/${id}`);
  };

  const handleDownload = (estimate: any) => {
    // downloadInvoicePDF(estimate, estimate.invoiceNumber);
    navigate(`/estimate/download/${estimate}`);
  };

  // 🔹 Edit estimate
  const handleEdit = (id) => {
    console.log("Editing estimate:", id);
    navigate(`/estimate/edit/${id}`);
  };

  // 🔹 Delete estimate
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this customer?"
    );
    if (!confirmDelete) return;

    try {
      const res = await api.delete(`${endPointApi.deleteEstimate}/${id}`);

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
        <h2 className="text-xl font-semibold">Estimate List</h2>
        <button
          onClick={() => navigate("/estimate/add")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Estimate
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Sr.</th>
              <th className="border p-2">Customer Name</th>
              <th className="border p-2">Estimate Number</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">State</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center p-4">
                  Loading...
                </td>
              </tr>
            ) : estimates.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-4">
                  No estimate found
                </td>
              </tr>
            ) : (
              estimates.map((item, index) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="border p-2 text-center">{index + 1}</td>
                  <td className="border p-2">{item.customerName}</td>
                  <td className="border p-2">{item.estimateNumber}</td>
                  <td className="border p-2">
                    {" "}
                    {new Date(item.date).toLocaleDateString("en-GB")}
                  </td>
                  <td className="border p-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        item.state === "Approved"
                          ? "bg-green-100 text-green-800"
                          : item.state === "Rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {item.state}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="border p-2">
                    <div className="flex items-center justify-center gap-2">
                      {/* View */}
                      <button
                        onClick={() => handleView(item.id)}
                        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      {/* Download */}
                      <button
                        onClick={() => handleDownload(item.id)}
                        className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => handleEdit(item.id)}
                        className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
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

export default Estimate;

function EstimateDownload() {
  // Sample items array - aap yahan multiple items add kar sakte ho
  const items = [
    {
      sr: 1,
      description: "645/16 SQMM SOLCAB\nEARTHING ALLUMINIUM\nCABLE",
      hsn: "85446020",
      quantity: "1800 MTR",
      rate: "12.5",
      tax: "18.00%",
      igst: "4,050.00",
      amount: "22,500.00",
    },
    {
      sr: 2,
      description: "Item 2 description",
      hsn: "12345678",
      quantity: "100 PCS",
      rate: "50",
      tax: "18.00%",
      igst: "900.00",
      amount: "5,900.00",
    },
  ];

  const handleDownloadPDF = async () => {
    // Create a clean version for PDF
    const printContent = document.getElementById('invoice-content');
    const originalBody = document.body.innerHTML;
    
    // Temporarily replace body with just invoice content
    document.body.innerHTML = printContent.outerHTML;
    
    // Trigger print
    window.print();
    
    // Restore original content
    setTimeout(() => {
      document.body.innerHTML = originalBody;
      window.location.reload();
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Download Button */}
      <div className="max-w-4xl mx-auto mb-4">
        <button
          onClick={handleDownloadPDF}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 print:hidden"
        >
          Download PDF
        </button>
      </div>

      {/* Invoice Container */}
      <div id="invoice-content" className="max-w-4xl mx-auto bg-white p-8 shadow-lg print:shadow-none">
        {/* Header Section */}
        <div className="mb-6">
          <div className="grid grid-cols-2 mb-4">
            {/* Company Details */}
            <div>
              <h1 className="text-xl font-bold mb-2">TATHASTU ENERGY</h1>
              <p className="text-sm leading-relaxed">
                FLOOR, PLOT NO. 40, Ar Mall
                <br />
                Mota Varachha,
                <br />
                SURAT, Gujarat
                <br />
                India - 394210
              </p>
              <p className="text-sm mt-2">Phone: 7069929196</p>
              <p className="text-sm font-semibold mt-2">GSTN: 24DAFPG4786M1Z9</p>
            </div>

            {/* Logo */}
            <div className="flex items-center justify-end">
              <div className="w-32 h-32 bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                Logo
              </div>
            </div>
          </div>

          {/* Horizontal Line after first part */}
          <div className="border-t border-black my-6"></div>

          {/* Estimate Details and Buyer Details */}
          <div className="grid grid-cols-2 gap-8 mb-6">
            {/* Left Column - Estimate Details */}
            <div className="space-y-2">
              <div className="flex">
                <span className="font-semibold w-40">Estimate Date:</span>
                <span>31/12/2025</span>
              </div>
              <div className="flex">
                <span className="font-semibold w-40">Place of Supply:</span>
                <span>Maharashtra</span>
              </div>
              <div className="mt-4">
                <div className="flex">
                  <span className="font-semibold w-40">Estimate#</span>
                  <span className="text-lg font-bold">EST003684</span>
                </div>
              </div>
            </div>

            {/* Right Column - Buyer Details */}
            <div className="text-right">
              <h3 className="font-bold mb-2">Buyer Details</h3>
              <p className="text-sm leading-relaxed">
                <span className="font-semibold">OVER SCORE</span>
                <br />
                H.NO 178/261, MADNANAND COLONY,
                <br />
                Umarga Main Road, Surat
                <br />
                Johan
                <br />
                +91 98745 98765
              </p>
              <p className="text-sm font-semibold mt-2">GSTN: 27BOVPS4587J1ZR</p>
            </div>
          </div>

          {/* Horizontal Line after second part */}
          <div className="border-t border-black"></div>
        </div>

        {/* Items Table */}
        <div className="mb-1">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-black">
                <th className="text-left p-2 text-sm font-bold">Sr.</th>
                <th className="text-left p-2 text-sm font-bold">
                  Items & Description
                </th>
                <th className="text-left p-2 text-sm font-bold">HSN/SAC</th>
                <th className="text-left p-2 text-sm font-bold">Quantity</th>
                <th className="text-left p-2 text-sm font-bold">Rate</th>
                <th className="text-left p-2 text-sm font-bold">Tax</th>
                <th className="text-left p-2 text-sm font-bold">IGST (₹)</th>
                <th className="text-left p-2 text-sm font-bold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="border-b border-gray-300">
                  <td className="p-2 text-sm align-top">{item.sr}</td>
                  <td className="p-2 text-sm align-top whitespace-pre-line">
                    {item.description}
                  </td>
                  <td className="p-2 text-sm align-top">{item.hsn}</td>
                  <td className="p-2 text-sm align-top">{item.quantity}</td>
                  <td className="p-2 text-sm align-top">{item.rate}</td>
                  <td className="p-2 text-sm align-top">{item.tax}</td>
                  <td className="p-2 text-sm align-top">{item.igst}</td>
                  <td className="p-2 text-sm align-top">{item.amount}</td>
                </tr>
              ))}
              {/* Empty rows for spacing */}
              <tr style={{ height: "40px" }}>
                <td colSpan="8"></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Total Section */}
        <div className="grid grid-cols-2 gap-8 mb-4">
          {/* Bank Details */}
          <div>
            <h3 className="font-bold mb-2">Bank Details</h3>
            <p className="text-sm">Name: TATHASTU ENERGY</p>
            <p className="text-sm">Account No: 258741259685</p>
            <p className="text-sm">Bank: HDFC BANK</p>
            <p className="text-sm">ISFC: HDFC1003888</p>
            <p className="text-sm">Branch: KAMREJ, Surat</p>
          </div>

          {/* Amount Details */}
          <div>
            <div className="flex justify-between p-2 border-b border-gray-400">
              <span className="font-semibold">Sub Total</span>
              <span>₹ 22,500.00</span>
            </div>
            <div className="flex justify-between p-2 border-b border-gray-400">
              <span className="font-semibold">IGST @ 18%</span>
              <span>₹ 4,050.00</span>
            </div>
            <div className="flex justify-between p-2 border-b-2 border-black">
              <span className="font-bold text-lg">Total</span>
              <span className="font-bold text-lg">₹ 26,550.00</span>
            </div>
            <div className="p-2">
              <p className="text-sm font-semibold">Total In Words:</p>
              <p className="text-sm">Twenty-six thousand five hundred fifty</p>
            </div>
          </div>
        </div>

        {/* Signature */}
        <div className="text-right mt-12">
          <p className="font-bold">For, TATHASTU ENERGY</p>
          <div className="mt-16"></div>
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body {
            margin: 0 !important;
            padding: 0 !important;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          @page {
            margin: 0.5cm;
            size: A4;
          }
          html, body {
            width: 210mm;
            height: 297mm;
          }
          #invoice-content {
            box-shadow: none !important;
            margin: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}