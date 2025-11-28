// EmailJS Configuration Template
// EmailJS is used to send email confirmations for orders
// Sign up at https://www.emailjs.com/ (free tier available)

window.EMAILJS_PUBLIC_KEY = "YOUR_EMAILJS_PUBLIC_KEY_HERE";
window.EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID_HERE";
window.EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID_HERE";

// Setup Instructions:
// 1. Visit https://www.emailjs.com/ and sign up for a free account
// 2. Go to Account > API Keys and copy your Public Key
// 3. Create an Email Service:
//    - Dashboard > Email Services > Create New Service
//    - Choose Gmail, Outlook, or any email provider
//    - Complete the setup and note the Service ID
// 4. Create an Email Template:
//    - Dashboard > Email Templates > Create New Template
//    - Use these template variables:
//      - {{to_email}}, {{to_name}}
//      - {{order_token}}, {{order_number}}
//      - {{pickup_time}}, {{order_items}}, {{order_total}}
//      - {{college}}, {{cafeteria}}, {{pickup_location}}
//    - Note the Template ID
// 5. Paste all three values into this file

// Once configured, order confirmations will be automatically sent via email!
// Keep these credentials secure - add this file to .gitignore!
