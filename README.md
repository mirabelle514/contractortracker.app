# Contractor Tracker App - Professional Time & Invoice Management

A modern, feature-rich web application for tracking work hours, managing clients, creating professional invoices, and calculating taxes. Built with React, Vite, and Tailwind CSS.

![Contractor Tracker App](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Vite](https://img.shields.io/badge/Vite-7.0.1-purple)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-38B2AC)

## Features

### **Time Tracking**

- **Manual hour entry** with date, time, and description
- **Client assignment** for organized billing
- **Custom hourly rates** per client or default rate
- **Status management** (pending → approved → invoiced)
- **Past hours archive** for invoiced work

### **Client Management**

- **Complete client profiles** with contact information
- **Individual hourly rates** per client
- **Client-specific invoices** and reporting
- **Easy client switching** when adding hours

### **Invoice System**

- **Professional PDF invoices** with client details
- **Custom invoice numbering** (e.g., CLIENT-001, INV-2024-001)
- **Editable invoices** - modify numbers, dates, and remove hours
- **Invoice status tracking** (pending/paid)
- **Automatic calculations** for totals and taxes

### **Manager Approval**

- **Email manager** for hours approval
- **Pre-filled email templates** with pending hours summary
- **Manager email configuration** in settings
- **Professional approval workflow**

### **Reporting & Analytics**

- **Quarterly tax calculations** with due dates
- **Comprehensive PDF reports** with summaries
- **Client breakdown** and earnings analysis
- **Export/Import** data backup functionality

### **Security & Data**

- **Password protection** for app access
- **Local storage** for data persistence
- **Regular backup reminders** (7-day intervals)
- **Data export/import** for safekeeping

## Quick Start

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/hours-tracker.git
   cd hours-tracker
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**

   ```
   http://localhost:5173
   ```

## Usage Guide

### First Time Setup

1. **Set App Password** - Create a password to protect your data
2. **Add Default Rate** - Set your standard hourly rate
3. **Add Manager Email** - For approval requests
4. **Add Clients** - Create client profiles with contact info

### Daily Workflow

1. **Add Hours** - Log your work with descriptions
2. **Approve Hours** - Mark hours as approved
3. **Email Manager** - Send approval requests
4. **Create Invoices** - Generate invoices from approved hours
5. **Download PDFs** - Send professional invoices to clients
6. **Track Payments** - Mark invoices as paid

### Advanced Features

- **Edit Invoices** - Modify invoice numbers, dates, and contents
- **Remove Hours** - Take hours out of invoices if needed
- **Export Data** - Regular backups to JSON files
- **Generate Reports** - PDF summaries for accounting

## Technology Stack

- **Frontend**: React 18.2.0
- **Build Tool**: Vite 7.0.1
- **Styling**: Tailwind CSS 3.4.17
- **Icons**: Heroicons
- **PDF Generation**: jsPDF
- **Date Handling**: date-fns
- **File Operations**: file-saver

## Project Structure

```jsx
hours-tracker/
├── src/
│   ├── App.jsx              # Main application component
│   ├── App.css              # Global styles
│   ├── index.css            # Tailwind CSS imports
│   └── main.jsx             # Application entry point
├── public/
│   └── vite.svg             # App icon
├── dist/                    # Production build
├── package.json             # Dependencies and scripts
├── tailwind.config.js       # Tailwind configuration
├── postcss.config.js        # PostCSS configuration
├── vite.config.js           # Vite configuration
└── README.md                # This file
```

## Deployment

### Your Hosting Account

1. **Build for production**

   ```bash
   npm run build
   ```

2. **Upload files** from `dist/` folder to GoDaddy File Manager
3. **Access your app** at your domain

### Other Hosting Options

- **Netlify**: Drag and drop `dist/` folder
- **Vercel**: Connect GitHub repository
- **GitHub Pages**: Deploy from repository
- **Any static hosting**: Upload `dist/` contents

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

## Configuration

### Environment Variables

No environment variables required - everything is client-side!

### Customization

- **Colors**: Modify Tailwind classes in components
- **Styling**: Update `src/App.css` for custom styles
- **Features**: Add new functionality in `src/App.jsx`

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Security Features

- **Password Protection**: App-level authentication
- **Local Storage**: Data stays on your device
- **No Server**: No data sent to external servers
- **Export Backups**: Regular data backups recommended

## Contributing

1. **Fork the repository**
2. **Create a feature branch**

   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Commit your changes**

   ```bash
   git commit -m 'Add amazing feature'
   ```

4. **Push to the branch**

   ```bash
   git push origin feature/amazing-feature
   ```

5. **Open a Pull Request**

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **React Team** for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework
- **Heroicons** for the beautiful icons
- **Vite** for the fast build tool

## Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/hours-tracker/issues)
- **Documentation**: Check the code comments and this README
- **Deployment**: See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

## Roadmap

- [ ] **Cloud Sync** - Optional cloud storage
- [ ] **Team Features** - Multi-user support
- [ ] **API Integration** - Connect to accounting software
- [ ] **Mobile App** - Native mobile application
- [ ] **Advanced Reports** - More detailed analytics
- [ ] **Time Tracking** - Real-time timer functionality

---

**Built with ❤️ for freelancers, consultants, and small businesses**

**Star this repository if you find it helpful!**
