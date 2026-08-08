import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

// Configure nodemailer transporter
// You'll need to set these environment variables in .env file
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail", // Default to gmail
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASSWORD, // Your email password or app-specific password
    },
  });
};

// POST /api/contact - Send contact form email
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    // Check if email configuration is set
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.error("Email configuration missing in environment variables");
      return res.status(500).json({
        success: false,
        message: "Email service is not configured. Please contact administrator.",
      });
    }

    const transporter = createTransporter();

    // Email to admin
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">New Contact Form Message</h1>
          </div>
          
          <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #667eea; margin-bottom: 20px; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Contact Details</h2>
            
            <div style="margin-bottom: 15px;">
              <strong style="color: #333; display: inline-block; width: 100px;">Name:</strong>
              <span style="color: #666;">${name}</span>
            </div>
            
            <div style="margin-bottom: 15px;">
              <strong style="color: #333; display: inline-block; width: 100px;">Email:</strong>
              <a href="mailto:${email}" style="color: #667eea; text-decoration: none;">${email}</a>
            </div>
            
            ${
              phone
                ? `
            <div style="margin-bottom: 15px;">
              <strong style="color: #333; display: inline-block; width: 100px;">Phone:</strong>
              <span style="color: #666;">${phone}</span>
            </div>
            `
                : ""
            }
            
            <div style="margin-bottom: 15px;">
              <strong style="color: #333; display: inline-block; width: 100px;">Subject:</strong>
              <span style="color: #666;">${subject}</span>
            </div>
            
            <h3 style="color: #667eea; margin-top: 25px; margin-bottom: 15px;">Message:</h3>
            <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #667eea; border-radius: 5px; color: #333; line-height: 1.6;">
              ${message.replace(/\n/g, "<br>")}
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #999; font-size: 12px;">
              <p>This email was sent from the Cartify contact form</p>
              <p>Timestamp: ${new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>
      `,
    };

    // Confirmation email to user
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Thank you for contacting Cartify",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Thank You for Reaching Out!</h1>
          </div>
          
          <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <p style="color: #333; font-size: 16px; line-height: 1.6;">Hi ${name},</p>
            
            <p style="color: #333; font-size: 16px; line-height: 1.6;">
              Thank you for contacting Cartify! We've received your message and our team will get back to you within 24 hours.
            </p>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <h3 style="color: #667eea; margin-top: 0; margin-bottom: 15px;">Your Message Summary:</h3>
              <p style="color: #666; margin: 5px 0;"><strong>Subject:</strong> ${subject}</p>
              <p style="color: #666; margin: 5px 0;"><strong>Message:</strong></p>
              <p style="color: #666; margin: 10px 0; padding: 10px; background-color: white; border-radius: 5px;">
                ${message.replace(/\n/g, "<br>")}
              </p>
            </div>
            
            <p style="color: #333; font-size: 16px; line-height: 1.6;">
              In the meantime, feel free to explore our products and special offers.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}/products" 
                 style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 16px;">
                Browse Products
              </a>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center;">
              <p style="color: #333; margin-bottom: 10px;">Connect with us:</p>
              <div style="margin: 15px 0;">
                <span style="color: #666; margin: 0 10px;">📧 support@cartify.com</span>
                <span style="color: #666; margin: 0 10px;">📞 +1 (555) 123-4567</span>
              </div>
            </div>
            
            <div style="text-align: center; color: #999; font-size: 12px; margin-top: 20px;">
              <p>© ${new Date().getFullYear()} Cartify. All rights reserved.</p>
            </div>
          </div>
        </div>
      `,
    };

    // Send both emails
    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(userMailOptions);

    res.status(200).json({
      success: true,
      message: "Message sent successfully! We'll get back to you soon.",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send message. Please try again later.",
      error: error.message,
    });
  }
});

export default router;
