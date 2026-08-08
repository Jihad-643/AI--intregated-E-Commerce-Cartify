# Email Notification Setup

## Overview
The application now sends automated email notifications for:
1. **Admin notifications** - When users place or cancel orders
2. **User notifications** - When admin changes order status

## Configuration

### Environment Variables (.env)
The following variables are already configured in your `.env` file:

```env
EMAIL_USER=bellshelby77@gmail.com          # Gmail account to send emails from
EMAIL_PASSWORD=ourb pxas rxhs qqir         # Gmail app password
ADMIN_EMAIL=arifbin71@gmail.com            # Admin email to receive notifications
```

### Gmail App Password Setup
The `EMAIL_PASSWORD` is a Gmail App Password (not your regular Gmail password). If you need to generate a new one:

1. Go to your Google Account settings
2. Navigate to Security → 2-Step Verification (must be enabled)
3. Scroll down to "App passwords"
4. Generate a new app password for "Mail"
5. Copy the 16-character password and update `EMAIL_PASSWORD` in `.env`

## Email Notifications

### 1. New Order Notification (to Admin)
**Trigger:** When a user places an order  
**Recipient:** Admin email (ADMIN_EMAIL)  
**Content:**
- Order ID
- Product details
- Customer information
- Total amount
- Order status

### 2. Order Cancellation Notification (to Admin)
**Trigger:** When a user cancels an order  
**Recipient:** Admin email (ADMIN_EMAIL)  
**Content:**
- Order ID
- Product details
- Customer information
- Total amount
- Cancellation notice

### 3. Order Status Update Notification (to User)
**Trigger:** When admin changes order status  
**Recipient:** Customer email  
**Content:**
- Updated status with color coding
- Status-specific message
- Order details
- Delivery address

## Status Messages

When admin updates order status, user receives appropriate messages:
- **Pending:** "Your order has been received and is pending confirmation."
- **Confirmed:** "Your order has been confirmed and will be processed soon."
- **Processing:** "Your order is being processed and prepared for shipment."
- **Shipped:** "Your order has been shipped and is on its way to you."
- **Delivered:** "Your order has been delivered successfully."
- **Cancelled:** "Your order has been cancelled."

## Email Service Details

### Service: Gmail
- Using nodemailer with Gmail SMTP
- Supports HTML email templates
- Async email sending (doesn't block API responses)

### Error Handling
- All email functions are wrapped in try-catch blocks
- Email failures are logged but don't affect API responses
- Uses `.catch()` to prevent email errors from blocking order processing

## Files Modified

1. **backend/config/email.js** - Email service configuration and templates
2. **backend/routes/orders.js** - Integrated email notifications in:
   - POST / (new order creation)
   - PATCH /:id/status (status update)
   - DELETE /:id (order cancellation)

## Testing

To test email notifications:

1. **Test New Order Email:**
   - Place an order from the frontend
   - Check admin email (arifbin71@gmail.com) for notification

2. **Test Cancellation Email:**
   - Cancel a pending order
   - Check admin email for cancellation notice

3. **Test Status Update Email:**
   - Admin changes order status from dashboard
   - Check customer email for status update notification

## Troubleshooting

If emails are not sending:

1. **Check Gmail security:**
   - Ensure 2-Step Verification is enabled
   - Verify app password is correct
   - Check if Gmail is blocking less secure apps

2. **Check server logs:**
   - Look for "Email notification sent" messages
   - Check for error messages in console

3. **Test email credentials:**
   - Try sending a test email manually
   - Verify EMAIL_USER and EMAIL_PASSWORD are correct

4. **Check spam folder:**
   - Automated emails might land in spam initially
   - Mark as "Not Spam" to whitelist

## Customization

To customize email templates, edit `backend/config/email.js`:
- Update HTML styling in the `html` property
- Modify subject lines
- Add more information to email body
- Change colors and layout

## Alternative Email Services

If you want to use a different email service:

1. Update transporter configuration in `email.js`:
```javascript
const transporter = nodemailer.createTransport({
  host: "smtp.example.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});
```

2. Popular alternatives:
   - **Outlook:** service: "outlook"
   - **Yahoo:** service: "yahoo"
   - **Custom SMTP:** Specify host, port, and auth

## Security Notes

- Never commit `.env` file to version control
- Use app passwords instead of regular passwords
- Keep EMAIL_PASSWORD secure
- Regularly rotate app passwords
- Monitor email sending for suspicious activity
