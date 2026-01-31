// Email service using Appwrite Functions or external API
export class EmailService {
  static async sendEmail(to, subject, body) {
    try {
      // In production, integrate with Appwrite Functions or SendGrid/AWS SES
      console.log('Email sent:', { to, subject, body });
      return { success: true };
    } catch (error) {
      console.error('Email failed:', error);
      return { success: false, error: error.message };
    }
  }

  static async sendLeaveApprovalEmail(employee, leave) {
    return await this.sendEmail(
      employee.email,
      'Leave Request Approved',
      `Your leave request from ${leave.startDate} to ${leave.endDate} has been approved.`
    );
  }

  static async sendLeaveRejectionEmail(employee, leave, reason) {
    return await this.sendEmail(
      employee.email,
      'Leave Request Rejected',
      `Your leave request has been rejected. Reason: ${reason}`
    );
  }

  static async sendSalarySlipEmail(employee, month, pdfUrl) {
    return await this.sendEmail(
      employee.email,
      `Salary Slip - ${month}`,
      `Your salary slip for ${month} is ready. Download: ${pdfUrl}`
    );
  }

  static async sendAttendanceReminder(employee) {
    return await this.sendEmail(
      employee.email,
      'Attendance Reminder',
      'Please mark your attendance for today.'
    );
  }
}
