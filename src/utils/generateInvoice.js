import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateInvoice = (order) => {
  if (!order) return;

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // ----- Document Header -----
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(20, 20, 20);
  doc.text("Artistic", 14, 22);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(120, 120, 120);
  doc.text("Premium Art Commissions", 14, 29);

  // Invoice Title (right-aligned)
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(20, 20, 20);
  doc.text("Invoice", pageWidth - 14, 22, { align: "right" });

  // Order Details (right-aligned)
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 80);
  doc.text(`Order ID: #${order._id.slice(-8).toUpperCase()}`, pageWidth - 14, 30, { align: "right" });
  doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString("en-IN")}`, pageWidth - 14, 36, { align: "right" });
  doc.text(`Status: ${order.status.replace("_", " ").toUpperCase()}`, pageWidth - 14, 42, { align: "right" });

  // Divider
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.5);
  doc.line(14, 50, pageWidth - 14, 50);

  // ----- Billed To -----
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(120, 120, 120);
  doc.text("BILLED TO", 14, 60);

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(20, 20, 20);
  doc.text(order.name || "Customer", 14, 67);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 80);
  doc.setFontSize(9);
  doc.text(order.email || "", 14, 73);
  doc.text(order.phone || "", 14, 79);
  const splitAddress = doc.splitTextToSize(order.address || "", 90);
  doc.text(splitAddress, 14, 85);

  // ----- Order Details Table -----
  autoTable(doc, {
    startY: 98,
    margin: { left: 14, right: 14 },
    head: [["Order Details", "Value"]],
    body: [
      ["Art Style", order.artStyle || "-"],
      ["Frame Option", order.frameOption || "-"],
      ["Special Instructions", order.instructions || "None"],
    ],
    theme: "grid",
    headStyles: {
      fillColor: [30, 30, 30],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
      cellPadding: 5,
    },
    styles: {
      fontSize: 9,
      cellPadding: 5,
      textColor: [40, 40, 40],
      lineColor: [220, 220, 220],
      lineWidth: 0.3,
    },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 55, fillColor: [248, 248, 248] },
      1: { cellWidth: "auto" },
    },
  });

  // ----- Payment Summary Table -----
  const paymentStartY = doc.lastAutoTable.finalY + 12;

  autoTable(doc, {
    startY: paymentStartY,
    margin: { left: 14, right: 14 },
    head: [["Payment Item", "Transaction ID", "Amount", "Status"]],
    body: [
      [
        "Base Price (Total)",
        "-",
        `Rs. ${Number(order.totalPrice).toLocaleString("en-IN")}`,
        "-",
      ],
      [
        "Advance Payment (25%)",
        order.transactionId || "N/A",
        `Rs. ${Number(order.advanceAmount).toLocaleString("en-IN")}`,
        order.isAdvancePaid ? "Paid" : "Pending",
      ],
      [
        "Balance Payment (75%)",
        order.balanceTransactionId || "N/A",
        `Rs. ${Number(order.totalPrice - order.advanceAmount).toLocaleString("en-IN")}`,
        order.isFullPaid ? "Paid" : "Pending",
      ],
    ],
    theme: "grid",
    headStyles: {
      fillColor: [30, 30, 30],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
      cellPadding: 5,
    },
    styles: {
      fontSize: 9,
      cellPadding: 5,
      textColor: [40, 40, 40],
      lineColor: [220, 220, 220],
      lineWidth: 0.3,
    },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 55, fillColor: [248, 248, 248] },
      1: { cellWidth: 50, textColor: [100, 100, 100] },
      2: { cellWidth: 35, halign: "right", fontStyle: "bold" },
      3: { cellWidth: 28, halign: "center" },
    },
    didParseCell: (data) => {
      if (data.column.index === 3 && data.section === "body") {
        if (data.cell.raw === "Paid") {
          data.cell.styles.textColor = [22, 163, 74];
          data.cell.styles.fontStyle = "bold";
        } else if (data.cell.raw === "Pending") {
          data.cell.styles.textColor = [220, 38, 38];
          data.cell.styles.fontStyle = "bold";
        }
      }
    },
  });

  // ----- Footer -----
  const pageHeight = doc.internal.pageSize.height;
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.3);
  doc.line(14, pageHeight - 24, pageWidth - 14, pageHeight - 24);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(150, 150, 150);
  doc.text("Thank you for your business with Artistic!", 14, pageHeight - 16);
  doc.text(`© ${new Date().getFullYear()} Artistic. All rights reserved.`, pageWidth - 14, pageHeight - 16, { align: "right" });

  // Save the PDF
  doc.save(`Invoice_Artistic_${order._id.slice(-8).toUpperCase()}.pdf`);
};
