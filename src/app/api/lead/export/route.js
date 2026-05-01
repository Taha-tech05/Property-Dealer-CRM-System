import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Lead from "@/models/Lead";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        await connectDB();

        const { searchParams } = new URL(req.url);
        const format = searchParams.get("format") || "xlsx";

        const leads = await Lead.find({})
            .populate("assignedTo", "name email")
            .sort({ createdAt: -1 })
            .lean();

        const rows = leads.map((l) => ({
            Name: l.name,
            Email: l.email,
            Phone: l.phone || "",
            "Property Interest": l.propertyInterest || "",
            "Budget (Rs)": l.budget,
            Source: l.source || "",
            Status: l.status,
            Priority: l.score,
            "Assigned To": l.assignedTo?.name || "Unassigned",
            "Follow-up Date": l.followUpDate
                ? new Date(l.followUpDate).toLocaleDateString()
                : "",
            Notes: l.notes || "",
            "Created At": new Date(l.createdAt).toLocaleString(),
        }));

        if (format === "xlsx") {
            // Dynamic import so it only loads when needed
            const XLSX = await import("xlsx");
            const worksheet = XLSX.utils.json_to_sheet(rows);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");

            // Column widths
            worksheet["!cols"] = [
                { wch: 20 }, { wch: 28 }, { wch: 16 }, { wch: 22 },
                { wch: 14 }, { wch: 18 }, { wch: 14 }, { wch: 10 },
                { wch: 20 }, { wch: 14 }, { wch: 30 }, { wch: 20 },
            ];

            const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
            return new NextResponse(buffer, {
                status: 200,
                headers: {
                    "Content-Type":
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    "Content-Disposition": `attachment; filename="leads-${Date.now()}.xlsx"`,
                },
            });
        }

        // PDF — return print-ready HTML
        const tableRows = rows
            .map(
                (r) => `
      <tr>
        <td>${r.Name}</td><td>${r.Email}</td><td>${r.Phone}</td>
        <td>${r["Property Interest"]}</td><td>Rs ${Number(r["Budget (Rs)"]).toLocaleString()}</td>
        <td>${r.Source}</td><td>${r.Status}</td><td>${r.Priority}</td>
        <td>${r["Assigned To"]}</td><td>${r["Follow-up Date"]}</td>
        <td>${r.Notes}</td><td>${r["Created At"]}</td>
      </tr>`
            )
            .join("");

        const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<title>Leads Export</title>
<style>
  body { font-family: Arial, sans-serif; font-size: 11px; color: #111; }
  h1 { font-size: 18px; margin-bottom: 8px; }
  p { color: #555; margin-bottom: 12px; }
  table { width: 100%; border-collapse: collapse; }
  th { background: #1c212c; color: #fff; padding: 6px 8px; text-align: left; font-size: 10px; }
  td { padding: 5px 8px; border-bottom: 1px solid #e5e7eb; }
  tr:nth-child(even) td { background: #f9fafb; }
  @media print { button { display: none; } }
</style>
</head>
<body>
<h1>PropCRM — Leads Export</h1>
<p>Generated: ${new Date().toLocaleString()} &nbsp;|&nbsp; Total: ${rows.length} leads</p>
<button onclick="window.print()" style="margin-bottom:16px;padding:8px 16px;background:#c9a84c;border:none;border-radius:6px;cursor:pointer;font-weight:bold">🖨 Print / Save as PDF</button>
<table>
  <thead>
    <tr>
      <th>Name</th><th>Email</th><th>Phone</th><th>Property</th><th>Budget</th>
      <th>Source</th><th>Status</th><th>Priority</th><th>Assigned To</th>
      <th>Follow-up</th><th>Notes</th><th>Created</th>
    </tr>
  </thead>
  <tbody>${tableRows}</tbody>
</table>
</body>
</html>`;

        return new NextResponse(html, {
            status: 200,
            headers: {
                "Content-Type": "text/html; charset=utf-8",
                "Content-Disposition": `inline; filename="leads-${Date.now()}.html"`,
            },
        });
    } catch (error) {
        console.error("Export error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
