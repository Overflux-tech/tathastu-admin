import { useEffect, useState } from "react";
import endPointApi from "../../utils/endPointApi";
import { api } from "../../utils/axiosInstance";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { MoveLeft } from "lucide-react";
import { numberToWords } from "../../utils/helper";

export default function EstimateView() {
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
    estimateNumber: "",
    date: null as Date | null,
    state: "",
    subTotal: 0,
    totalTax: 0,
    grandTotal: 0,
    items: [
      {
        item: { name: "", unit: "", hsn: "", id: "" },
        description: "",
        qty: 0,
        rate: 0,
        taxRate: 0,
        igst: 0,
        sgst: 0,
        cgst: 0,
        total: 0,
        taxableAmount: 0,
      },
    ],
  });

  useEffect(() => {
    if (!id) return;

    const fetchEstimate = async () => {
      try {
        const res = await api.get(`${endPointApi.getByIdEstimate}/${id}`);
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
          estimateNumber: data.estimateNumber || "",
          // date: data.date ? data.date.split("T")[0] : "",
          date: data.date ? new Date(data.date) : null,
          state: data.state || "",
          subTotal: data.subTotal || 0,
          totalTax: data.totalTax || 0,
          grandTotal: data.grandTotal || 0,
          items: data.items || [],
        });
      } catch (error) {
        toast.error("Failed to load estimate");
        console.error(error);
      }
    };

    fetchEstimate();
  }, [id]);

  return (
    <>
      <div className="mb-4">
        <button
          onClick={() => navigate("/estimate")} // goes back to previous page
          className="flex items-center text-blue-600 hover:text-blue-800 font-semibold"
        >
          <span className="mr-2">
            <MoveLeft />
          </span>{" "}
          Back to Estimates
        </button>
      </div>
      <div id="estimate-pdf" className="max-w-4xl mx-auto bg-white p-8">
        {/* Header Section */}
        <div className="">
          <div className="grid grid-cols-2">
            {/* Company Details */}
            <div>
              <h1 className="text-xl font-bold mb-2">TEST ENERGY</h1>
              <p className="text-sm leading-relaxed">
                30 Pitt Street, Sydney Harbour Marriot
                <br />
                Canberra,
                <br />
                SURAT, Gujarat - 394210
                <br />
              </p>
              <p className="text-sm mt-1">Phone: 7069929000</p>
              <p className="text-sm font-semibold mt-1">
                GSTN: 24DAFPG4786M8Z9
              </p>
            </div>

            {/* Invoice Type */}
            <div className="flex justify-end">
              <img src="/logo1.jpg" alt="Logo" className="h-60 w-60" />
            </div>
          </div>

          {/* Horizontal Line after first part */}
          <div className="border-t-1 border-black mb-4"></div>

          {/* Estimate Details and Buyer Details */}
          <div className="grid grid-cols-2 gap-8 mb-6">
            {/* Left Column - Estimate Details */}
            <div className="space-y-2">
              <div className="flex">
                <span className="font-semibold w-40">Estimate Date:</span>
                <span>
                  {formData.date ? new Date(formData.date).toLocaleDateString() : ""}
                </span>

              </div>
              <div className="flex">
                <span className="font-semibold w-40">Place of Supply:</span>
                <span>{formData?.state}</span>
              </div>
              <div className="mt-4">
                <div className="flex">
                  <span className="font-semibold w-40">Estimate#</span>
                  <span className="text-lg font-bold">
                    {formData?.estimateNumber}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column - Buyer Details */}
            <div className="text-right">
              <h3 className="font-bold mb-2">Buyer Details</h3>
              <p className="text-sm leading-relaxed">
                <span className="font-semibold">
                  {formData.customer?.name || ""}
                </span>
                <br />
                {formData.customer?.address || ""}
                <br />
                {formData.customer?.city || ""}, {formData.customer?.state || ""}
                <br />
                +91 {formData.customer?.mobile || ""}
              </p>
              <p className="text-sm font-semibold mt-2">
                GSTN: {formData.customer?.gst_number || ""}
              </p>
            </div>
          </div>

          {/* Horizontal Line after second part */}
          <div className="border-t-1 border-black"></div>
        </div>

        {/* Items Table */}
        <div className="mb-1">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-1 border-black">
                <th className="text-left p-2 text-sm font-bold">Sr.</th>
                <th className="text-left p-2 text-sm font-bold">
                  Items & Description
                </th>
                <th className="text-left p-2 text-sm font-bold">HSN/SAC</th>
                <th className="text-left p-2 text-sm font-bold">Quantity</th>
                <th className="text-left p-2 text-sm font-bold">Rate</th>
                <th className="text-left p-2 text-sm font-bold">Tax</th>
                {/* <th className="text-left p-2 text-sm font-bold">IGST (₹)</th> */}
                {/* {formData.state === "Gujarat" && (
                  <>
                    <th className="text-left p-2 text-sm font-bold">
                      CGST (₹)
                    </th>
                    <th className="text-left p-2 text-sm font-bold">
                      SGST (₹)
                    </th>
                  </>
                )} */}
                {formData.state === "Gujarat" ? (
                  <>
                    <th className="text-left p-2 text-sm font-bold">CGST (₹)</th>
                    <th className="text-left p-2 text-sm font-bold">SGST (₹)</th>
                  </>
                ) : (
                  <th className="text-left p-2 text-sm font-bold">IGST (₹)</th>
                )}
                <th className="text-left p-2 text-sm font-bold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {formData?.items.map((item, index) => (
                <tr key={index} className="border-b border-gray-300">
                  <td className="p-2 text-sm align-top">{index + 1}</td>
                  <td className="p-2 text-sm align-top whitespace-pre-line">
                    {/* {item.item?.name} */}
                    {item.description ? `${item.description}` : ""}
                  </td>
                  <td className="p-2 text-sm align-top">{item.item?.hsn}</td>
                  <td className="p-2 text-sm align-top">{item.qty}</td>
                  <td className="p-2 text-sm align-top">{item.rate}</td>
                  <td className="p-2 text-sm align-top">{item.taxRate}.00 %</td>
                  {/* <td className="p-2 text-sm align-top">{item.igst}</td> */}

                  {formData.state === "Gujarat" ? (
                    <>
                      <td className="p-2 text-sm">{item.cgst}</td>
                      <td className="p-2 text-sm">{item.sgst}</td>
                    </>
                  ) : (
                    <td className="p-2 text-sm">{item.igst}</td>
                  )}
                  <td className="p-2 text-sm align-top">{item.taxableAmount}.00</td>
                </tr>
              ))}
              {/* Empty rows for spacing */}
              <tr style={{ height: "40px" }}>
                <td colSpan={8}></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Total Section */}
        <div className="grid grid-cols-2 gap-8 mb-4">
          {/* Bank Details */}
          <div className="mt-16">
            <h3 className="font-bold mb-2">Bank Details</h3>
            <p className="text-sm">Name: TEST ENERGY</p>
            <p className="text-sm">Account No: 258741259685</p>
            <p className="text-sm">Bank: HDFC BANK</p>
            <p className="text-sm">ISFC: HDFC1003888</p>
            <p className="text-sm">Branch: KAMREJ, Surat</p>
          </div>

          {/* Amount Details */}
          <div>
            <div className="flex justify-between p-2 border-b border-gray-400">
              <span className="font-semibold">Sub Total</span>
              <span>₹ {formData?.subTotal}.00</span>
            </div>
            <div className="flex justify-between p-2 border-b border-gray-400">
              <span className="font-semibold">IGST @ 18%</span>
              <span>₹ {formData?.totalTax}.00</span>
            </div>
            <div className="flex justify-between p-2 border-b-2 border-black">
              <span className="font-bold text-lg">Total</span>
              <span className="font-bold text-lg">
                ₹ {formData?.grandTotal}.00
              </span>
            </div>
            <div className="p-2">
              <p className="text-sm font-semibold">Total In Words:</p>
              <p className="text-sm"> {numberToWords(formData?.grandTotal)}</p>
            </div>
          </div>
        </div>

        {/* Signature */}
        <div className="text-right mt-12">
          <p className="font-bold">For, TEST ENERGY</p>
          <div className="mt-16"></div>
        </div>
      </div>
    </>
  );
}
