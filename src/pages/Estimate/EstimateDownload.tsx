import { useEffect, useRef } from "react";
import html2pdf from "html2pdf.js";

export default function EstimateDownload({
  estimateId,
  onDone,
}: {
  estimateId: string;
  onDone: () => void;
}
) {
  const hasDownloaded = useRef(false); 
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

const handleDownloadPDF = () => {
  const element: any = document.getElementById("invoice-content");

  const options: any = {
    margin: 10,
    filename: `Estimate-${estimateId}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
    },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait",
    },
  };

  html2pdf().set(options).from(element).save().then(() => onDone());
};

  useEffect(() => {
    if (hasDownloaded.current) return; // ✅ PREVENT DOUBLE CALL
    hasDownloaded.current = true;

    setTimeout(handleDownloadPDF, 300);
  }, []);
  return (
  <div className="min-h-screen bg-gray-100 p-4">
      {/* Download Button */}
      {/* <div className="max-w-4xl mx-auto mb-4">
        <button
          onClick={handleDownloadPDF}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 print:hidden"
        >
          Download PDF
        </button>
      </div> */}

      {/* Invoice Container */}
      <div
        id="invoice-content"
        className="max-w-4xl mx-auto bg-white p-8 shadow-lg print:shadow-none"
      >
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
            <div className="flex items-center justify-end">
              <img src="/logo.png" alt="Logo" className="h-50 w-50" />
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
                +91 98745 98765
              </p>
              <p className="text-sm font-semibold mt-2">
                GSTN: 27BOVPS4587J1ZR
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
          <p className="font-bold">For, TEST ENERGY</p>
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
