import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const svgToPng = (svg: string, width = 300, height = 150): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d")!;
    const img = new Image();

    img.onload = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/png"));
    };

    img.src = "data:image/svg+xml;base64," + btoa(svg);
  });
};

const LOGO_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="300" height="120">
  <rect width="300" height="120" fill="#0B5ED7"/>
  <text x="150" y="50" font-size="28" text-anchor="middle"
    fill="white" font-family="Arial" font-weight="bold">
    BHAKTI SOLAR
  </text>
  <text x="150" y="80" font-size="16"
    text-anchor="middle" fill="white" font-family="Arial">
    ENERGY
  </text>
</svg>
`;

const STAMP_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
  <circle cx="100" cy="100" r="90"
    stroke="red" stroke-width="6" fill="none"/>
  <text x="100" y="95" font-size="18"
    text-anchor="middle" fill="red" font-weight="bold">
    BHAKTI SOLAR
  </text>
  <text x="100" y="120" font-size="14"
    text-anchor="middle" fill="red">
    AUTHORIZED
  </text>
</svg>
`;


/* =========================
   SVG → BASE64
========================= */
const svgToBase64 = (svg: string) =>
  `data:image/svg+xml;base64,${btoa(svg)}`;

/* =========================
   NUMBER TO WORDS (Simple)
========================= */
const numberToWords = (num: number) =>
  `${num.toFixed(2)} Rupees Only`;

export const downloadInvoicePDF = async (
  invoiceData: any,
  invoiceNumber: string
) => {
  const doc = new jsPDF("p", "mm", "a4");

  const PAGE_WIDTH = doc.internal.pageSize.getWidth();
  const PAGE_HEIGHT = doc.internal.pageSize.getHeight();
  const MARGIN = 15;

  // ✅ Convert SVG to PNG
  const logoPng = await svgToPng(LOGO_SVG, 300, 120);
  const stampPng = await svgToPng(STAMP_SVG, 200, 200);

  /* ---------- HEADER ---------- */
  doc.addImage(logoPng, "PNG", MARGIN, 10, 45, 18);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("BHAKTI SOLAR ENERGY", PAGE_WIDTH / 2, 18, { align: "center" });

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(
    "Surat, Gujarat | GSTN: 24AAFPG8779R1ZY",
    PAGE_WIDTH / 2,
    24,
    { align: "center" }
  );

  doc.setFontSize(18);
  doc.text("TAX INVOICE", PAGE_WIDTH - MARGIN, 20, { align: "right" });

  /* ---------- DETAILS ---------- */
  doc.setFontSize(10);
  doc.text(`Invoice No: ${invoiceNumber}`, MARGIN, 40);
  doc.text(`Date: ${invoiceData.date}`, MARGIN, 46);
  doc.text(`State: ${invoiceData.state}`, MARGIN, 52);

  doc.text("Bill To:", PAGE_WIDTH - 70, 40);
  doc.text(invoiceData.customerName, PAGE_WIDTH - 70, 46);

  /* ---------- TABLE ---------- */
  autoTable(doc, {
    startY: 60,
    head: [["#", "Item", "Qty", "Rate", "Amount"]],
    body: invoiceData.items?.map((i: any, idx: number) => [
      idx + 1,
      i.item,
      i.qty,
      `₹ ${i.rate}`,
      `₹ ${(i.qty * i.rate).toFixed(2)}`
    ]),
    theme: "grid",
    styles: { fontSize: 9 }
  });

  const finalY = (doc as any).lastAutoTable.finalY + 8;

  /* ---------- TOTAL ---------- */
  const subTotal = invoiceData.items?.reduce(
    (s: number, i: any) => s + i.qty * i.rate,
    0
  );

  const cgst = subTotal * 0.09;
  const sgst = subTotal * 0.09;
  const total = subTotal + cgst + sgst;

  doc.text(`Sub Total: ₹ ${subTotal?.toFixed(2)}`, PAGE_WIDTH - 70, finalY);
  doc.text(`CGST 9%: ₹ ${cgst?.toFixed(2)}`, PAGE_WIDTH - 70, finalY + 6);
  doc.text(`SGST 9%: ₹ ${sgst?.toFixed(2)}`, PAGE_WIDTH - 70, finalY + 12);

  doc.setFont("helvetica", "bold");
  doc.text(`TOTAL: ₹ ${total?.toFixed(2)}`, PAGE_WIDTH - 70, finalY + 20);

  /* ---------- STAMP ---------- */
  doc.addImage(stampPng, "PNG", PAGE_WIDTH - 60, finalY + 30, 40, 40);
  doc.text("Authorized Signatory", PAGE_WIDTH - 60, finalY + 75);

  /* ---------- FOOTER ---------- */
  doc.setFontSize(8);
  doc.text(
    "Page 1 of 1",
    PAGE_WIDTH / 2,
    PAGE_HEIGHT - 8,
    { align: "center" }
  );

  /* ---------- SAVE ---------- */
  doc.save(`Invoice_${invoiceNumber}.pdf`);
};

