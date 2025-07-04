# Contractor Tracker App - Deployment Guide

## What You Need

1. **A Hosting Account** (Shared hosting or better)
2. **Domain Name** (optional, but recommended)
3. **File Manager Access** (included with your hosting account)

## Files to Upload

Upload **ALL** files from the `dist` folder to your hosting account:

```jsx
dist/
├── index.html
├── vite.svg
└── assets/
    ├── index-8tcZEzWU.js
    ├── index-C9lDzDRW.css
    ├── index.es-DxvynqtM.js
    ├── html2canvas.esm-BfxBtG_O.js
    └── purify.es-CQJ0hv7W.js
```

## Step-by-Step Deployment

### Step 1: Access Your Hosting File Manager

1. Log into your hosting control panel
2. Find and click on "File Manager" or "cPanel File Manager"
3. Navigate to your website's root directory (usually `public_html`)

### Step 2: Upload Files

1. **Option A - Drag & Drop:**
   - Select all files from your `dist` folder
   - Drag them directly into the File Manager
   - Upload to the root directory

2. **Option B - Upload Button:**
   - Click "Upload" in File Manager
   - Select all files from your `dist` folder
   - Upload to the root directory

### Step 3: Verify Upload

Your file structure should look like this:

```jsx
public_html/
├── index.html
├── vite.svg
└── assets/
    ├── index-8tcZEzWU.js
    ├── index-C9lDzDRW.css
    ├── index.es-DxvynqtM.js
    ├── html2canvas.esm-BfxBtG_O.js
    └── purify.es-CQJ0hv7W.js
```

### Step 4: Test Your App

1. Visit your domain: `https://yourdomain.com`
2. The Contractor Tracker App should load immediately
3. Test all features: adding hours, creating invoices, etc.

## Important Notes

### What Works

- **All features** work exactly as in development
- **Data persistence** using browser localStorage
- **PDF generation** for invoices and reports
- **Email functionality** (opens default email client)
- **Export/Import** data backup features

### Limitations

- **No server-side storage** - data is stored in browser
- **No user accounts** - anyone with access can use the app
- **No real-time sync** - data is local to each device

### Security Considerations

- **Password protection** - set up app password for basic security
- **Regular backups** - use the export feature regularly
- **Private hosting** - consider who has access to your hosting

## Domain Configuration (Optional)

### Custom Domain

1. In your hosting account, go to "Domains" → "Manage"
2. Point your domain to your hosting
3. Wait for DNS propagation (up to 48 hours)

### Subdomain (Recommended)

Create a subdomain like `hours.yourdomain.com`:

1. Go to "Domains" → "Manage" → "DNS"
2. Add a CNAME record: `hours` → `yourdomain.com`
3. Upload files to `public_html/hours/` folder

## Mobile Access

Your app is fully responsive and works on:

- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🔄 Updates & Maintenance

### To Update Your App:

1. Make changes to your local code
2. Run `npm run build` again
3. Upload the new `dist` files to replace old ones
4. Clear browser cache if needed

### Regular Maintenance:

- **Backup data** monthly using export feature
- **Check for updates** to dependencies
- **Monitor hosting** for any issues

## Troubleshooting

### App Won't Load

- Check file paths in `index.html`
- Verify all files uploaded correctly
- Clear browser cache

### Features Not Working

- Check browser console for errors
- Ensure JavaScript is enabled
- Try different browser

### PDF Generation Issues

- Check browser permissions
- Ensure pop-ups are allowed
- Try downloading in incognito mode

## Support

If you encounter issues:

1. Check browser console for error messages
2. Verify all files uploaded correctly
3. Test in different browsers
4. Contact your hosting provider support for hosting issues

## Success

Once deployed, you'll have a professional hours tracking app accessible from anywhere with an internet connection!

---

**Your Contractor Tracker App is now ready for professional use!**