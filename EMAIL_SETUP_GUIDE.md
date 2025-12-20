# 📧 Email Notification Setup Guide

## 🎯 **Goal**: Get email notifications when users join your waitlist

## ✅ **Quick Setup with EmailJS (5 minutes)**

### **Step 1: Create EmailJS Account**
1. Go to [EmailJS.com](https://www.emailjs.com)
2. Click "Sign Up" and create a free account
3. Verify your email address

### **Step 2: Connect Your Email Service**
1. In EmailJS dashboard, click "Email Services"
2. Click "Add New Service"
3. Choose your email provider:
   - **Gmail** (recommended)
   - **Outlook**
   - **Yahoo**
   - Or any other email service
4. Follow the connection steps
5. **Copy your Service ID** (looks like: `service_abc123`)

### **Step 3: Create Email Template**
1. Click "Email Templates" in EmailJS dashboard
2. Click "Create New Template"
3. **Template Name**: `Waitlist Notification`
4. **Template Content**:

```
Subject: 🎬 New Filmmaker Tools Waitlist Signup!

Hi Govinda,

Great news! Someone just joined your filmmaker tools waitlist:

📧 Email: {{user_email}}
⏰ Time: {{signup_time}}
🌐 Source: {{source}}
🔗 Website: {{website_url}}

Total signups so far: Check your admin panel at {{website_url}}/admin.html

Best regards,
Your Website
```

5. Click "Save"
6. **Copy your Template ID** (looks like: `template_xyz789`)

### **Step 4: Get Public Key**
1. Go to "Account" → "General"
2. Find "Public Key" section
3. **Copy your Public Key** (looks like: `abc123XYZ`)

### **Step 5: Update Your Website**
Open `script.js` and replace these values:

```javascript
const EMAILJS_CONFIG = {
    serviceId: 'service_abc123',      // Your Service ID from Step 2
    templateId: 'template_xyz789',    // Your Template ID from Step 3
    publicKey: 'abc123XYZ'           // Your Public Key from Step 4
};
```

### **Step 6: Test It!**
1. Save your changes
2. Open your website
3. Try joining the waitlist with your email
4. Check your inbox for the notification!

## 🎉 **What You'll Get**

**Every time someone joins your waitlist:**
- ✅ **Instant email notification** to your inbox
- ✅ **User's email address**
- ✅ **Signup timestamp**
- ✅ **Source information**
- ✅ **Link to admin panel**

## 🔧 **Free Limits**
- **200 emails per month** (free tier)
- **Upgrade available** if you need more

## 🚨 **Important Notes**

1. **Keep your keys secure** - don't share them publicly
2. **Test thoroughly** before going live
3. **Check spam folder** initially
4. **EmailJS works client-side** - no backend needed!

## 🆘 **Troubleshooting**

**Not receiving emails?**
- Check spam/junk folder
- Verify Service ID, Template ID, and Public Key
- Check browser console for errors
- Make sure email service is properly connected

**Template variables not working?**
- Use exact variable names: `{{user_email}}`, `{{signup_time}}`
- Check template syntax in EmailJS dashboard

## 🔄 **Alternative: Formspree (Even Easier)**

If EmailJS seems complex, try Formspree:

1. Go to [Formspree.io](https://formspree.io)
2. Create account and new form
3. Get form endpoint URL
4. Replace waitlist code with simple form submission

**Formspree Code:**
```javascript
// Replace the entire waitlist function with this:
const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email, source: 'filmmaker-tools' })
});
```

## 📊 **Bonus: Analytics**

Both services provide:
- ✅ Submission analytics
- ✅ Export capabilities
- ✅ Spam protection
- ✅ Integration options

Choose the one that feels easier for you!