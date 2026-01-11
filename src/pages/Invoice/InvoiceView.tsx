import { useEffect, useState } from "react";
import endPointApi from "../../utils/endPointApi";
import { api } from "../../utils/axiosInstance";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { MoveLeft } from "lucide-react";
import { numberToWords } from "../../utils/helper";

export default function InvoiceView() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    customer: {
      id: "",
      name: "",
      mobile: "",
      email: "",
      gst_number: "",
      address: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
    },
    invoiceNo: "",
    orderNo: "",
    date: null as Date | null,
    state: "",
    subTotal: 0,
    totalTax: 0,
    grandTotal: 0,
    items: [] as any[],
  });

  useEffect(() => {
    if (!id) return;

    const fetchInvoice = async () => {
      try {
        const res = await api.get(`${endPointApi.getByIdInvoice}/${id}`);
        const data = res.data.data;

        setFormData({
          customer: {
            id: data.customerId?.id || "",
            name: data.customerId?.name || "",
            mobile: data.customerId?.mobile || "",
            email: data.customerId?.email || "",
            gst_number: data.customerId?.gst_number || "",
            address: data.customerId?.address || "",
            city: data.customerId?.city || "",
            state: data.customerId?.state || "",
            country: data.customerId?.country || "",
            pincode: data.customerId?.pincode || "",
          },
          invoiceNo: data.invoiceNo || "",
          orderNo: data.orderNo || "",
          date: data.date ? new Date(data.date) : null,
          state: data.state || "",
          subTotal: data.subTotal || 0,
          totalTax: data.totalTax || 0,
          grandTotal: data.grandTotal || 0,
          items: data.items || [],
        });
      } catch (error) {
        toast.error("Failed to load invoice");
        console.error(error);
      }
    };

    fetchInvoice();
  }, [id]);

  return (
    <>
      <div className="mb-4">
        <button
          onClick={() => navigate("/invoice")}
          className="flex items-center text-blue-600 hover:text-blue-800 font-semibold"
        >
          <span className="mr-2">
            <MoveLeft />
          </span>
          Back to Invoices
        </button>
      </div>

      <div id="invoice-pdf" className="max-w-4xl mx-auto bg-white p-8">
        {/* Header */}
        <div className="grid grid-cols-2">
          <div>
            <h1 className="text-xl font-bold mb-2">TEST ENERGY</h1>
            <p className="text-sm leading-relaxed">
              30 Pitt Street, Sydney Harbour Marriot
              <br />
              SURAT, Gujarat - 394210
            </p>
            <p className="text-sm mt-1">Phone: 7069929000</p>
            <p className="text-sm font-semibold mt-1">
              GSTN: 24DAFPG4786M8Z9
            </p>
          </div>
          <div className="flex justify-end">
            <img src="/logo1.jpg" alt="Logo" className="h-40 w-40" />
          </div>
        </div>

        <div className="border-t border-black my-4" />

        <div className="grid grid-cols-2 gap-8 mb-6">
          <div className="space-y-2">
            <div className="flex">
              <span className="font-semibold w-40">Invoice Date:</span>
              <span>
                {formData.date
                  ? formData.date.toLocaleDateString()
                  : ""}
              </span>
            </div>
            <div className="flex">
              <span className="font-semibold w-40">Place of Supply:</span>
              <span>{formData.state}</span>
            </div>
            <div className="mt-4 flex">
              <span className="font-semibold w-40">Invoice#</span>
              <span className="text-lg font-bold">{formData.invoiceNo}</span>
            </div>
          </div>

          <div className="text-right">
            <h3 className="font-bold mb-2">Buyer Details</h3>
            <p className="text-sm leading-relaxed">
              <span className="font-semibold">{formData.customer.name}</span>
              <br />
              {formData.customer.address}
              <br />
              {formData.customer.city}, {formData.customer.state}
              <br />
              +91 {formData.customer.mobile}
            </p>
            <p className="text-sm font-semibold mt-2">
              GSTN: {formData.customer.gst_number}
            </p>
          </div>
        </div>

        <div className="border-t border-black" />

        {/* Items */}
        <table className="w-full border-collapse mt-2">
          <thead>
            <tr className="border-b border-black">
              <th className="p-2 text-left text-sm">Sr.</th>
              <th className="p-2 text-left text-sm">Items & Description</th>
              <th className="p-2 text-left text-sm">HSN</th>
              <th className="p-2 text-left text-sm">Qty</th>
              <th className="p-2 text-left text-sm">Rate</th>
              <th className="p-2 text-left text-sm">Tax</th>
              {formData.state === "Gujarat" ? (
                <>
                  <th className="p-2 text-left text-sm">CGST</th>
                  <th className="p-2 text-left text-sm">SGST</th>
                </>
              ) : (
                <th className="p-2 text-left text-sm">IGST</th>
              )}
              <th className="p-2 text-left text-sm">Amount</th>
            </tr>
          </thead>
          <tbody>
            {formData.items.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="p-2 text-sm">{index + 1}</td>
                <td className="p-2 text-sm">{item.description}</td>
                <td className="p-2 text-sm">{item.item?.hsn}</td>
                <td className="p-2 text-sm">{item.qty}</td>
                <td className="p-2 text-sm">{item.rate}</td>
                <td className="p-2 text-sm">{item.taxRate}%</td>
                {formData.state === "Gujarat" ? (
                  <>
                    <td className="p-2 text-sm">{item.cgst}</td>
                    <td className="p-2 text-sm">{item.sgst}</td>
                  </>
                ) : (
                  <td className="p-2 text-sm">{item.igst}</td>
                )}
                <td className="p-2 text-sm">{item.taxableAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="grid grid-cols-2 gap-8 mt-6">
          <div />

          <div>
            <div className="flex justify-between p-2 border-b">
              <span>Sub Total</span>
              <span>₹ {formData.subTotal}.00</span>
            </div>
            <div className="flex justify-between p-2 border-b">
              <span>Total Tax</span>
              <span>₹ {formData.totalTax}.00</span>
            </div>
            <div className="flex justify-between p-2 border-b-2 border-black">
              <span className="font-bold">Grand Total</span>
              <span className="font-bold">₹ {formData.grandTotal}.00</span>
            </div>
            <div className="p-2">
              <p className="text-sm font-semibold">Total In Words:</p>
              <p className="text-sm">
                {numberToWords(formData.grandTotal)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
