const { query } = require('../config/database');
const { validateInput, contactSchema } = require('../utils/validation-utils');
const nodemailer = require('nodemailer');

const submitContact = async (req, res) => {
    try {
        const clientIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        const validation = validateInput(req.body, contactSchema);

        if (!validation.valid) {
            return res.status(400).json({ success: false, error: 'Validation failed', details: validation.errors });
        }

        const { name, email, phone, company, service, message } = validation.value;

        await query(
            'INSERT INTO contact_submissions (name, email, phone, company, service, message, ip_address) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, email, phone || null, company || null, service || null, message, clientIp]
        );

        if (process.env.SMTP_HOST && process.env.SMTP_USER) {
            try {
                const transporter = nodemailer.createTransport({
                    host: process.env.SMTP_HOST,
                    port: parseInt(process.env.SMTP_PORT, 10) || 587,
                    secure: false,
                    auth: {
                        user: process.env.SMTP_USER,
                        pass: process.env.SMTP_PASS,
                    },
                });

                await transporter.sendMail({
                    from: process.env.EMAIL_FROM,
                    to: process.env.EMAIL_TO,
                    subject: `New Contact Form Submission from ${name}`,
                    html: `
                        <h2>New Contact Form Submission</h2>
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
                        <p><strong>Company:</strong> ${company || 'N/A'}</p>
                        <p><strong>Service:</strong> ${service || 'N/A'}</p>
                        <p><strong>Message:</strong></p>
                        <p>${message.replace(/\n/g, '<br>')}</p>
                    `,
                });
            } catch (emailError) {
                console.error('Email sending error:', emailError);
            }
        }

        return res.json({
            success: true,
            message: 'Thank you for contacting us. We will get back to you soon!',
        });
    } catch (error) {
        console.error('Contact form error:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

const getSubmissions = async (req, res) => {
    try {
        const submissions = await query('SELECT * FROM contact_submissions ORDER BY created_at DESC');
        return res.json({ success: true, data: submissions });
    } catch (error) {
        console.error('Fetch submissions error:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

module.exports = {
    submitContact,
    getSubmissions
};
