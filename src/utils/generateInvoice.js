import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logoImg from '../assets/logo.png';

export const generateInvoice = async (order) => {
  if (!order) return;

  // Load logo image
  const img = new Image();
  img.src = logoImg;
  await new Promise((resolve) => {
    img.onload = resolve;
    img.onerror = () => {
      console.error("Failed to load logo image");
      resolve(); // Proceed anyway without the image
    };
  });

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Top Left: Logo
  if (img.complete && img.naturalWidth > 0) {
    const imgWidth = 35; // Target width in mm
    const imgHeight = (img.height * imgWidth) / img.width;
    doc.addImage(img, 'PNG', 14, 12, imgWidth, imgHeight);
  } else {
    // Fallback if image fails to load
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(60, 60, 60);
    doc.text("Artistic", 14, 20);
  }

  // Top Right: NO. 000001
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(60, 60, 60);
  doc.text(`NO. ${order._id.slice(-6).toUpperCase()}`, pageWidth - 14, 20, { align: "right" });

  // Big INVOICE
  doc.setFontSize(15);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(20, 20, 20);
  doc.text("INVOICE", 14, 45);

  // Date
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Date: ", 14, 60);
  doc.setFont("helvetica", "normal");
  const dateStr = new Date(order.createdAt).toLocaleDateString("en-GB", { day: '2-digit', month: 'long', year: 'numeric' });
  doc.text(dateStr, 25, 60);

  // Billed to:
  doc.setFont("helvetica", "bold");
  doc.text("Billed to:", 14, 75);
  doc.setFont("helvetica", "normal");
  doc.text(order.name.toLowerCase().replace(/\b\w/g, l => l.toUpperCase()) || "Customer", 14, 82);
  
  const address = order.address || "Adoni, Kurnool, Andhra Pradesh - 518301";
  const splitAddress = doc.splitTextToSize(address, 80);
  doc.text(splitAddress, 14, 87);
  
  // Calculate Y position based on address lines
  const emailY = 87 + (splitAddress.length * 5);
  doc.text(order.email || "artistic.official12@gmail.com", 14, emailY);

  // From:
  const fromX = pageWidth / 2 + 10;
  doc.setFont("helvetica", "bold");
  doc.text("From:", fromX, 75);
  doc.setFont("helvetica", "normal");
  doc.text("Artistic", fromX, 82);
  doc.text("Adoni, Kurnool, Andhra Pradesh - 518301", fromX, 87);
  doc.text("artistic.official12@gmail.com", fromX, 92);

  // Table
  autoTable(doc, {
    startY: 110,
    margin: { left: 14, right: 14 },
    head: [["Item", "Quantity", "Price", "Amount"]],
    body: [
      [order.artStyle || "Art Style", "1", `Rs. ${Number(order.totalPrice || 0).toLocaleString("en-IN")}`, `Rs. ${Number(order.totalPrice || 0).toLocaleString("en-IN")}`],
      ...(order.frameOption ? [[order.frameOption, "1", "Rs. 0", "Rs. 0"]] : []),
    ],
    theme: "plain",
    headStyles: {
      fillColor: [230, 230, 230],
      textColor: [40, 40, 40],
      fontStyle: "bold",
      fontSize: 10,
      cellPadding: { top: 6, bottom: 6, left: 4, right: 4 },
    },
    styles: {
      fontSize: 10,
      cellPadding: 4,
      textColor: [60, 60, 60],
    },
    columnStyles: {
      0: { cellWidth: 80, halign: 'left' },
      1: { cellWidth: 30, halign: 'center' },
      2: { cellWidth: 30, halign: 'left' },
      3: { cellWidth: 30, halign: 'left' },
    },
  });

  // Total Line
  const finalY = doc.lastAutoTable.finalY + 5;

  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.5);
  doc.line(14, finalY, pageWidth - 14, finalY);

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(20, 20, 20);
  
  // Calculate exact X position of Amount column
  let amountColX = pageWidth - 42; // safe fallback
  if (
    doc.lastAutoTable && 
    doc.lastAutoTable.columns && 
    doc.lastAutoTable.columns[3] && 
    typeof doc.lastAutoTable.columns[3].x === 'number'
  ) {
    amountColX = doc.lastAutoTable.columns[3].x + 4; // x + left cellPadding
  } else if (
    doc.lastAutoTable &&
    doc.lastAutoTable.settings &&
    doc.lastAutoTable.settings.margin
  ) {
    // If we can't get the exact column X, we can use the default calculated position
    amountColX = pageWidth - 14 - 32 + 4; // pageWidth - rightMargin - scaledWidth + padding
  }

  doc.text("Total", amountColX - 10, finalY + 8, { align: "right" });
  doc.text(`Rs. ${Number(order.totalPrice || 0).toLocaleString("en-IN")}`, amountColX, finalY + 8, { align: "left" });

  doc.line(14, finalY + 12, pageWidth - 14, finalY + 12);

  // Payment method and Note
  const payY = finalY + 25;
  doc.setFont("helvetica", "bold");
  doc.text("Payment method:", 14, payY);
  doc.setFont("helvetica", "normal");
  doc.text(order.isAdvancePaid ? "Online" : "Cash", 45, payY);

  doc.setFont("helvetica", "bold");
  doc.text("Note:", 14, payY + 7);
  doc.setFont("helvetica", "normal");
  doc.text("Thank you for choosing us!", 26, payY + 7);

  // Bottom Shapes
  // Light gray wave (left)
  doc.setFillColor(204, 204, 204); 
  doc.ellipse(10, pageHeight - 10, 80, 50, 'F');
  
  // Dark gray wave (right and bottom)
  doc.setFillColor(77, 77, 77); 
  doc.ellipse(pageWidth/2 + 20, pageHeight + 20, 150, 60, 'F');

  // Save the PDF
  doc.save(`Invoice_Artistic_${order._id.slice(-8).toUpperCase()}.pdf`);
};
