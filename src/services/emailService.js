import { Resend } from 'resend';

const getResendClient = () => {
  return new Resend(process.env.RESEND_API_KEY || 're_dummy_key_for_dev');
};

const FROM_EMAIL = 'IGC Union <onboarding@resend.dev>';

export const sendComplaintConfirmationEmail = async (complaint) => {
  try {
    const { email, complaintId, category, department } = complaint;

    const htmlContent = `
      <div style="font-family: sans-serif; line-height: 1.5; color: #333;">
        <p>Hello,</p>
        <p>Your complaint has been successfully received by the IGC Union.</p>
        <p>
          <strong>Complaint ID:</strong> ${complaintId}<br/>
          <strong>Category:</strong> ${category}<br/>
          <strong>Department:</strong> ${department || 'N/A'}
        </p>
        <p>Please don't worry. The union will review your complaint and follow up after the necessary verification.</p>
        <p>Please keep your complaint ID for future reference.</p>
        <p>Regards,<br/>IGC Union</p>
      </div>
    `;

    const textContent = `Hello,

Your complaint has been successfully received by the IGC Union.

Complaint ID: ${complaintId}
Category: ${category}
Department: ${department || 'N/A'}

Please don't worry. The union will review your complaint and follow up after the necessary verification.

Please keep your complaint ID for future reference.

Regards,
IGC Union`;

    const resendClient = getResendClient();
    const { data, error } = await resendClient.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Your complaint has been received | IGC Union',
      html: htmlContent,
      text: textContent,
    });

    if (error) {
      console.error("Student confirmation email failed:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Student confirmation email failed (exception):", error);
    return { success: false, error };
  }
};

export const sendAdminComplaintNotification = async (complaint) => {
  try {
    const { complaintId, category, department, name, anonymous, complaint: complaintText, createdAt } = complaint;
    
    const submittedBy = anonymous ? 'Anonymous' : (name || 'Anonymous');
    const submitDate = new Date(createdAt).toLocaleString('en-IN');

    const htmlContent = `
      <div style="font-family: sans-serif; line-height: 1.5; color: #333;">
        <p>New student complaint received.</p>
        <p>
          <strong>Complaint ID:</strong> ${complaintId}<br/>
          <strong>Category:</strong> ${category}<br/>
          <strong>Department:</strong> ${department || 'N/A'}<br/>
          <strong>Submitted by:</strong> ${submittedBy}<br/>
          <strong>Status:</strong> New<br/>
          <strong>Submitted:</strong> ${submitDate}
        </p>
        <p><strong>Complaint:</strong></p>
        <blockquote style="border-left: 4px solid #eee; margin-left: 0; padding-left: 1rem;">
          ${complaintText}
        </blockquote>
        <p>Please review this complaint from the IGC Union admin panel.</p>
        <p>Regards,<br/>IGC Union</p>
      </div>
    `;

    const textContent = `New student complaint received.

Complaint ID: ${complaintId}
Category: ${category}
Department: ${department || 'N/A'}
Submitted by: ${submittedBy}
Status: New
Submitted: ${submitDate}

Complaint:
${complaintText}

Please review this complaint from the IGC Union admin panel.

Regards,
IGC Union`;

    const resendClient = getResendClient();
    const { data, error } = await resendClient.emails.send({
      from: FROM_EMAIL,
      to: process.env.UNION_ADMIN_EMAIL,
      subject: `New Student Complaint | ${complaintId}`,
      html: htmlContent,
      text: textContent,
    });

    if (error) {
      console.error("Admin notification email failed:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Admin notification email failed (exception):", error);
    return { success: false, error };
  }
};
