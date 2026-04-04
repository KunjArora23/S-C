import nodemailer from 'nodemailer';

function parseRecipients() {
  const recipients = (process.env.CONTACT_RECIPIENTS || '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);

  if (recipients.length > 0) return recipients;
  return ['kunjhacker@gmail.com', 'ashivam605@gmail.com'];
}

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function submitContactForm(req, res) {
  try {
    const {
      inquiryType,
      fullName,
      email,
      phone,
      countryCode,
      country,
      adults,
      children,
      startDate,
      endDate,
      destinations,
      hotelCategory,
      interests,
      specialRequests,
    } = req.body;

    if (!fullName || !email || !phone || !country || !startDate || !endDate || !hotelCategory) {
      return res.status(400).json({ message: 'Please fill all required fields.' });
    }

    const destinationList = Array.isArray(destinations)
      ? destinations.filter(Boolean)
      : typeof destinations === 'string' && destinations.trim()
      ? [destinations.trim()]
      : [];

    if (destinationList.length === 0) {
      return res.status(400).json({ message: 'Please select at least one destination.' });
    }

    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpUser || !smtpPass) {
      return res.status(500).json({ message: 'Email service is not configured on server.' });
    }

    const transporter = createTransporter();
    const recipients = parseRecipients();

    const subject = `New Contact Enquiry - ${inquiryType || 'Custom Package'} - ${fullName}`;

    const textBody = [
      'New enquiry received from contact form:',
      '',
      `Inquiry Type: ${inquiryType || 'Custom Package'}`,
      `Full Name: ${fullName}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      `Country Code: ${countryCode || ''}`,
      `Country: ${country}`,
      `Adults: ${adults || ''}`,
      `Children: ${children || ''}`,
      `Start Date: ${startDate}`,
      `End Date: ${endDate}`,
      `Destinations: ${destinationList.join(', ')}`,
      `Hotel Category: ${hotelCategory}`,
      `Interests: ${interests || '-'}`,
      `Special Requests: ${specialRequests || '-'}`,
    ].join('\n');

    const htmlBody = `
      <h2>New Contact Enquiry</h2>
      <p><strong>Inquiry Type:</strong> ${inquiryType || 'Custom Package'}</p>
      <p><strong>Full Name:</strong> ${fullName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Country Code:</strong> ${countryCode || ''}</p>
      <p><strong>Country:</strong> ${country}</p>
      <p><strong>Adults:</strong> ${adults || ''}</p>
      <p><strong>Children:</strong> ${children || ''}</p>
      <p><strong>Start Date:</strong> ${startDate}</p>
      <p><strong>End Date:</strong> ${endDate}</p>
      <p><strong>Destinations:</strong> ${destinationList.join(', ')}</p>
      <p><strong>Hotel Category:</strong> ${hotelCategory}</p>
      <p><strong>Interests:</strong> ${interests || '-'}</p>
      <p><strong>Special Requests:</strong> ${specialRequests || '-'}</p>
    `;

    await transporter.sendMail({
      from: process.env.MAIL_FROM || smtpUser,
      to: recipients.join(','),
      replyTo: email,
      subject,
      text: textBody,
      html: htmlBody,
    });

    return res.status(200).json({ message: 'Enquiry sent successfully.' });
  } catch (error) {
    console.error('Failed to send contact enquiry email:', error.message);
    return res.status(500).json({ message: 'Failed to submit enquiry. Please try again.' });
  }
}
