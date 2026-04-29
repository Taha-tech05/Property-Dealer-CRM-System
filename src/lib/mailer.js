import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail app password
  },
});

export async function sendNewLeadEmail(lead) {
  await transporter.sendMail({
    from: `"PropCRM" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `New Lead: ${lead.name}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;background:#1c212c;color:#fff;padding:24px;border-radius:12px">
        <h2 style="color:#eab308">New Lead Received</h2>
        <table style="width:100%;border-collapse:collapse;margin-top:16px">
          <tr><td style="color:#9ca3af;padding:8px 0">Name</td><td>${lead.name}</td></tr>
          <tr><td style="color:#9ca3af;padding:8px 0">Email</td><td>${lead.email}</td></tr>
          <tr><td style="color:#9ca3af;padding:8px 0">Phone</td><td>${lead.phone}</td></tr>
          <tr><td style="color:#9ca3af;padding:8px 0">Budget</td><td>Rs ${lead.budget?.toLocaleString()}</td></tr>
          <tr><td style="color:#9ca3af;padding:8px 0">Property</td><td>${lead.propertyInterest}</td></tr>
          <tr><td style="color:#9ca3af;padding:8px 0">Source</td><td>${lead.source}</td></tr>
        </table>
      </div>
    `,
  });
}

export async function sendAssignmentEmail(lead, agent) {
  await transporter.sendMail({
    from: `"PropCRM" <${process.env.EMAIL_USER}>`,
    to: agent.email,
    subject: `Lead Assigned to You: ${lead.name}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;background:#1c212c;color:#fff;padding:24px;border-radius:12px">
        <h2 style="color:#eab308">Lead Assigned to You</h2>
        <p style="color:#9ca3af">Hi ${agent.name}, a new lead has been assigned to you.</p>
        <table style="width:100%;border-collapse:collapse;margin-top:16px">
          <tr><td style="color:#9ca3af;padding:8px 0">Name</td><td>${lead.name}</td></tr>
          <tr><td style="color:#9ca3af;padding:8px 0">Email</td><td>${lead.email}</td></tr>
          <tr><td style="color:#9ca3af;padding:8px 0">Phone</td><td>${lead.phone}</td></tr>
          <tr><td style="color:#9ca3af;padding:8px 0">Budget</td><td>Rs ${lead.budget?.toLocaleString()}</td></tr>
          <tr><td style="color:#9ca3af;padding:8px 0">Property</td><td>${lead.propertyInterest}</td></tr>
        </table>
        <a href="${process.env.NEXTAUTH_URL}/agent" style="display:inline-block;margin-top:20px;background:#eab308;color:#000;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:bold">
          View Lead
        </a>
      </div>
    `,
  });
}