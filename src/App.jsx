import { useState, useEffect } from 'react'
import { format, startOfQuarter, endOfQuarter } from 'date-fns'
import { 
  ClockIcon, 
  CurrencyDollarIcon, 
  DocumentTextIcon, 
  CheckCircleIcon,
  PlusIcon,
  TrashIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  DocumentArrowDownIcon,
  ShieldCheckIcon,
  CloudArrowUpIcon,
  ExclamationTriangleIcon,
  EnvelopeIcon,
  EyeIcon,
  ArchiveBoxIcon,
  PencilIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import jsPDF from 'jspdf'
import { saveAs } from 'file-saver'

function App() {
  const [hours, setHours] = useState([])
  const [invoices, setInvoices] = useState([])
  const [clients, setClients] = useState([])
  const [hourlyRate, setHourlyRate] = useState(50)
  const [showAddHours, setShowAddHours] = useState(false)
  const [showCreateInvoice, setShowCreateInvoice] = useState(false)
  const [showAddClient, setShowAddClient] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [appPassword, setAppPassword] = useState('')
  const [lastBackup, setLastBackup] = useState(null)
  const [showBackupReminder, setShowBackupReminder] = useState(false)
  const [managerEmail, setManagerEmail] = useState('')
  const [activeTab, setActiveTab] = useState('current') // 'current' or 'past'
  const [editingInvoice, setEditingInvoice] = useState(null)
  const [taxRate, setTaxRate] = useState(20) // Default 20%
  const [showTaxSettings, setShowTaxSettings] = useState(false)
  const [newHours, setNewHours] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    hours: '',
    description: '',
    rate: 50,
    clientId: ''
  })
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    address: '',
    hourlyRate: 50
  })

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedHours = localStorage.getItem('hours')
    const savedInvoices = localStorage.getItem('invoices')
    const savedClients = localStorage.getItem('clients')
    const savedRate = localStorage.getItem('hourlyRate')
    const savedAppPassword = localStorage.getItem('appPassword')
    const savedLastBackup = localStorage.getItem('lastBackup')
    const savedManagerEmail = localStorage.getItem('managerEmail')
    
    if (savedHours) setHours(JSON.parse(savedHours))
    if (savedInvoices) setInvoices(JSON.parse(savedInvoices))
    if (savedClients) setClients(JSON.parse(savedClients))
    if (savedRate) setHourlyRate(parseFloat(savedRate))
    if (savedAppPassword) setAppPassword(savedAppPassword)
    if (savedLastBackup) setLastBackup(new Date(savedLastBackup))
    if (savedManagerEmail) setManagerEmail(savedManagerEmail)
    
    // Check if app password is set
    if (savedAppPassword) {
      setShowAuth(true)
    } else {
      setIsAuthenticated(true)
    }
    
    // Check for backup reminder
    checkBackupReminder()
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('hours', JSON.stringify(hours))
    }
  }, [hours, isAuthenticated])

  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('invoices', JSON.stringify(invoices))
    }
  }, [invoices, isAuthenticated])

  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('clients', JSON.stringify(clients))
    }
  }, [clients, isAuthenticated])

  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('hourlyRate', hourlyRate.toString())
    }
  }, [hourlyRate, isAuthenticated])

  useEffect(() => {
    if (appPassword) {
      localStorage.setItem('appPassword', appPassword)
    }
  }, [appPassword])

  useEffect(() => {
    if (lastBackup) {
      localStorage.setItem('lastBackup', lastBackup.toISOString())
    }
  }, [lastBackup])

  useEffect(() => {
    if (managerEmail) {
      localStorage.setItem('managerEmail', managerEmail)
    }
  }, [managerEmail])

  const checkBackupReminder = () => {
    if (!lastBackup) {
      setShowBackupReminder(true)
      return
    }
    
    const daysSinceBackup = (new Date() - lastBackup) / (1000 * 60 * 60 * 24)
    if (daysSinceBackup > 7) {
      setShowBackupReminder(true)
    }
  }

  const handleAuth = () => {
    if (password === appPassword) {
      setIsAuthenticated(true)
      setShowAuth(false)
      setPassword('')
    } else {
      alert('Incorrect password')
    }
  }

  const setupPassword = () => {
    if (password.length < 4) {
      alert('Password must be at least 4 characters')
      return
    }
    setAppPassword(password)
    setIsAuthenticated(true)
    setShowAuth(false)
    setPassword('')
  }

  const exportData = () => {
    const data = {
      hours,
      invoices,
      clients,
      hourlyRate,
      exportDate: new Date().toISOString(),
      version: '1.0'
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    saveAs(blob, `hours-tracker-backup-${format(new Date(), 'yyyy-MM-dd')}.json`)
    
    setLastBackup(new Date())
    setShowBackupReminder(false)
  }

  const importData = (event) => {
    const file = event.target.files[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        
        if (data.hours) setHours(data.hours)
        if (data.invoices) setInvoices(data.invoices)
        if (data.clients) setClients(data.clients)
        if (data.hourlyRate) setHourlyRate(data.hourlyRate)
        
        alert('Data imported successfully!')
      } catch {
        alert('Error importing data. Please check the file format.')
      }
    }
    reader.readAsText(file)
  }

  const generatePDFInvoice = async (invoice) => {
    const client = clients.find(c => c.id === invoice.clientId)
    
    const doc = new jsPDF()
    
    // Header
    doc.setFontSize(24)
    doc.text('INVOICE', 105, 20, { align: 'center' })
    
    doc.setFontSize(12)
    doc.text(`Invoice #: ${invoice.invoiceNumber || invoice.id}`, 20, 40)
    doc.text(`Date: ${invoice.date}`, 20, 50)
    doc.text(`Status: ${invoice.status.toUpperCase()}`, 20, 60)
    
    if (client) {
      doc.text(`Client: ${client.name}`, 20, 80)
      doc.text(`Email: ${client.email}`, 20, 90)
      if (client.address) {
        doc.text(`Address: ${client.address}`, 20, 100)
      }
    }
    
    // Hours table header
    doc.setFontSize(14)
    doc.text('Hours Details', 20, 130)
    
    doc.setFontSize(10)
    doc.text('Date', 20, 145)
    doc.text('Hours', 60, 145)
    doc.text('Description', 80, 145)
    doc.text('Rate', 140, 145)
    doc.text('Amount', 160, 145)
    
    // Hours table
    let yPos = 155
    invoice.hours.forEach((hour) => {
      if (yPos > 250) {
        doc.addPage()
        yPos = 20
      }
      
      doc.text(hour.date, 20, yPos)
      doc.text(hour.hours.toString(), 60, yPos)
      doc.text(hour.description, 80, yPos)
      doc.text(`$${hour.rate}`, 140, yPos)
      doc.text(`$${hour.total.toFixed(2)}`, 160, yPos)
      
      yPos += 10
    })
    
    // Total
    doc.setFontSize(12)
    doc.text(`Total Hours: ${invoice.totalHours}`, 20, yPos + 10)
    doc.text(`Total Amount: $${invoice.totalAmount.toFixed(2)}`, 20, yPos + 20)
    
    // Save PDF
    doc.save(`invoice-${invoice.id}-${invoice.date}.pdf`)
  }

  const generatePDFReport = async () => {
    const doc = new jsPDF()
    
    // Header
    doc.setFontSize(20)
    doc.text('CONTRACTOR TRACKER APP REPORT', 105, 20, { align: 'center' })
    
    doc.setFontSize(12)
    doc.text(`Generated: ${format(new Date(), 'yyyy-MM-dd HH:mm')}`, 20, 35)
    
    // Summary
    doc.setFontSize(16)
    doc.text('Summary', 20, 50)
    
    doc.setFontSize(12)
    doc.text(`Total Hours: ${hours.reduce((sum, h) => sum + h.hours, 0).toFixed(1)}`, 20, 65)
    doc.text(`Total Earnings: $${hours.reduce((sum, h) => sum + h.total, 0).toFixed(2)}`, 20, 75)
    doc.text(`Total Clients: ${clients.length}`, 20, 85)
    doc.text(`Total Invoices: ${invoices.length}`, 20, 95)
    
    // Client breakdown
    doc.setFontSize(16)
    doc.text('Client Breakdown', 20, 115)
    
    let yPos = 130
    clients.forEach(client => {
      const clientHours = hours.filter(h => h.clientId === client.id)
      const clientTotal = clientHours.reduce((sum, h) => sum + h.total, 0)
      
      if (yPos > 250) {
        doc.addPage()
        yPos = 20
      }
      
      doc.setFontSize(12)
      doc.text(`${client.name}: ${clientHours.reduce((sum, h) => sum + h.hours, 0).toFixed(1)}h - $${clientTotal.toFixed(2)}`, 20, yPos)
      yPos += 10
    })
    
    // Recent hours
    doc.addPage()
    doc.setFontSize(16)
    doc.text('Recent Hours', 20, 20)
    
    yPos = 35
    hours.slice(-20).reverse().forEach(hour => {
      if (yPos > 250) {
        doc.addPage()
        yPos = 20
      }
      
      doc.setFontSize(10)
      doc.text(`${hour.date} - ${hour.hours}h - ${hour.description} - $${hour.total.toFixed(2)}`, 20, yPos)
      yPos += 8
    })
    
    // Save PDF
    doc.save(`hours-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`)
  }

  const emailManager = () => {
    if (!managerEmail) {
      alert('Please set your manager email first in the settings.')
      return
    }
    
    const pendingHours = hours.filter(h => h.status === 'pending')
    if (pendingHours.length === 0) {
      alert('No pending hours to send for approval.')
      return
    }
    
    const totalHours = pendingHours.reduce((sum, h) => sum + h.hours, 0)
    const totalAmount = pendingHours.reduce((sum, h) => sum + h.total, 0)
    
    const subject = encodeURIComponent('Hours Approval Request')
    const body = encodeURIComponent(`
Hi,

I have ${pendingHours.length} hours entries pending approval:

Total Hours: ${totalHours.toFixed(1)}h
Total Amount: $${totalAmount.toFixed(2)}

Please review and approve these hours at your convenience.

Thanks!
    `)
    
    window.open(`mailto:${managerEmail}?subject=${subject}&body=${body}`)
  }

  const addClient = () => {
    if (!newClient.name) return
    
    const client = {
      id: Date.now(),
      ...newClient,
      hourlyRate: parseFloat(newClient.hourlyRate)
    }
    
    setClients([...clients, client])
    setNewClient({
      name: '',
      email: '',
      address: '',
      hourlyRate: 50
    })
    setShowAddClient(false)
  }

  const deleteClient = (id) => {
    setClients(clients.filter(c => c.id !== id))
    setHours(hours.map(h => 
      h.clientId === id ? { ...h, clientId: '' } : h
    ))
  }

  const addHours = () => {
    if (!newHours.hours || !newHours.description) return
    
    const selectedClient = clients.find(c => c.id === parseInt(newHours.clientId))
    const rate = selectedClient ? selectedClient.hourlyRate : parseFloat(newHours.rate)
    
    const hoursEntry = {
      id: Date.now(),
      ...newHours,
      hours: parseFloat(newHours.hours),
      rate: rate,
      total: parseFloat(newHours.hours) * rate,
      status: 'pending',
      clientId: newHours.clientId ? parseInt(newHours.clientId) : null
    }
    
    setHours([...hours, hoursEntry])
    setNewHours({
      date: format(new Date(), 'yyyy-MM-dd'),
      hours: '',
      description: '',
      rate: hourlyRate,
      clientId: ''
    })
    setShowAddHours(false)
  }

  const approveHours = (id) => {
    setHours(hours.map(h => 
      h.id === id ? { ...h, status: 'approved' } : h
    ))
  }

  const deleteHours = (id) => {
    setHours(hours.filter(h => h.id !== id))
  }

  const createInvoice = () => {
    const approvedHours = hours.filter(h => h.status === 'approved' && !h.invoiced)
    if (approvedHours.length === 0) return

    const hoursByClient = approvedHours.reduce((acc, hour) => {
      const clientId = hour.clientId || 'no-client'
      if (!acc[clientId]) {
        acc[clientId] = []
      }
      acc[clientId].push(hour)
      return acc
    }, {})

    Object.entries(hoursByClient).forEach(([clientId, clientHours]) => {
      const client = clientId !== 'no-client' ? clients.find(c => c.id === parseInt(clientId)) : null
      
      // Generate unique invoice number
      const existingInvoices = invoices.filter(inv => inv.clientId === (clientId !== 'no-client' ? parseInt(clientId) : null))
      const nextNumber = existingInvoices.length + 1
      const invoiceNumber = client ? `${client.name.replace(/\s+/g, '').toUpperCase()}-${nextNumber.toString().padStart(3, '0')}` : `INV-${nextNumber.toString().padStart(3, '0')}`
      
      const invoice = {
        id: Date.now() + Math.random(),
        invoiceNumber: invoiceNumber,
        date: format(new Date(), 'yyyy-MM-dd'),
        clientId: clientId !== 'no-client' ? parseInt(clientId) : null,
        clientName: client ? client.name : 'No Client',
        hours: clientHours,
        totalHours: clientHours.reduce((sum, h) => sum + h.hours, 0),
        totalAmount: clientHours.reduce((sum, h) => sum + h.total, 0),
        status: 'pending',
        taxAmount: 0
      }

      setInvoices(prev => [...prev, invoice])
    })
    
    // Mark hours as invoiced
    setHours(hours.map(h => 
      approvedHours.some(ah => ah.id === h.id) ? { ...h, invoiced: true } : h
    ))
    
    setShowCreateInvoice(false)
  }

  const markInvoicePaid = (id) => {
    setInvoices(invoices.map(inv => 
      inv.id === id ? { ...inv, status: 'paid', paidDate: format(new Date(), 'yyyy-MM-dd') } : inv
    ))
  }

  const editInvoice = (invoice) => {
    setEditingInvoice(invoice)
  }

  const saveInvoiceEdit = () => {
    if (!editingInvoice) return
    
    // Validate invoice number uniqueness
    const existingInvoice = invoices.find(inv => 
      inv.id !== editingInvoice.id && inv.invoiceNumber === editingInvoice.invoiceNumber
    )
    
    if (existingInvoice) {
      alert('Invoice number already exists. Please use a unique number.')
      return
    }
    
    setInvoices(invoices.map(inv => 
      inv.id === editingInvoice.id ? editingInvoice : inv
    ))
    setEditingInvoice(null)
  }

  const cancelInvoiceEdit = () => {
    setEditingInvoice(null)
  }

  const removeHourFromInvoice = (invoiceId, hourId) => {
    const invoice = invoices.find(inv => inv.id === invoiceId)
    if (!invoice) return
    
    const updatedInvoice = {
      ...invoice,
      hours: invoice.hours.filter(h => h.id !== hourId),
      totalHours: invoice.hours.filter(h => h.id !== hourId).reduce((sum, h) => sum + h.hours, 0),
      totalAmount: invoice.hours.filter(h => h.id !== hourId).reduce((sum, h) => sum + h.total, 0)
    }
    
    setInvoices(invoices.map(inv => 
      inv.id === invoiceId ? updatedInvoice : inv
    ))
    
    // Mark the hour as not invoiced so it can be re-invoiced
    setHours(hours.map(h => 
      h.id === hourId ? { ...h, invoiced: false } : h
    ))
  }

  const calculateQuarterlyTaxes = () => {
    const now = new Date()
    const quarterStart = startOfQuarter(now)
    const quarterEnd = endOfQuarter(now)
    
    const paidInvoices = invoices.filter(inv => 
      inv.status === 'paid' && 
      new Date(inv.paidDate) >= quarterStart && 
      new Date(inv.paidDate) <= quarterEnd
    )
    
    const totalEarnings = paidInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0)
    const taxAmount = totalEarnings * (taxRate / 100)
    
    return { totalEarnings, taxAmount }
  }

  const getClientName = (clientId) => {
    if (!clientId) return 'No Client'
    const client = clients.find(c => c.id === clientId)
    return client ? client.name : 'Unknown Client'
  }

  const pendingHours = hours.filter(h => h.status === 'pending')
  const approvedHours = hours.filter(h => h.status === 'approved' && !h.invoiced)
  const invoicedHours = hours.filter(h => h.invoiced)
  const { totalEarnings, taxAmount } = calculateQuarterlyTaxes()

  // Authentication screen
  if (showAuth && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="text-center">
            <ShieldCheckIcon className="mx-auto h-12 w-12 text-primary-600" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              {appPassword ? 'Enter Password' : 'Set App Password'}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {appPassword ? 'Enter your password to access the app' : 'Set a password to protect your data'}
            </p>
          </div>
          <div className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="Password"
              onKeyPress={(e) => e.key === 'Enter' && (appPassword ? handleAuth() : setupPassword())}
            />
            <button
              onClick={appPassword ? handleAuth : setupPassword}
              className="btn-primary w-full"
            >
              {appPassword ? 'Login' : 'Set Password'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Contractor Tracker App</h1>
              <p className="text-gray-600 text-sm sm:text-base">Track your hours, create invoices, and manage taxes</p>
            </div>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <button
                onClick={exportData}
                className="btn-secondary flex items-center text-sm"
                title="Export Data"
              >
                <ArrowDownTrayIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Export</span>
              </button>
              <label className="btn-secondary flex items-center cursor-pointer text-sm">
                <ArrowUpTrayIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Import</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={importData}
                  className="hidden"
                />
              </label>
              <button
                onClick={generatePDFReport}
                className="btn-primary flex items-center text-sm"
                title="Generate PDF Report"
              >
                <DocumentArrowDownIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Report</span>
              </button>
            </div>
          </div>
        </div>

        {/* Backup Reminder */}
        {showBackupReminder && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0">
              <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600 mr-3 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-yellow-800">Backup Reminder</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  {lastBackup 
                    ? `It's been ${Math.floor((new Date() - lastBackup) / (1000 * 60 * 60 * 24))} days since your last backup.`
                    : "You haven't backed up your data yet."
                  }
                </p>
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                <button
                  onClick={() => setShowBackupReminder(false)}
                  className="text-sm text-yellow-600 hover:text-yellow-800"
                >
                  Remind Later
                </button>
                <button
                  onClick={exportData}
                  className="btn-primary text-sm"
                >
                  Backup Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <ClockIcon className="h-6 w-6 sm:h-8 sm:w-8 text-primary-600 flex-shrink-0" />
              <div className="ml-3 sm:ml-4 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Hours</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {hours.reduce((sum, h) => sum + h.hours, 0).toFixed(1)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center">
              <CurrencyDollarIcon className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 flex-shrink-0" />
              <div className="ml-3 sm:ml-4 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  ${hours.reduce((sum, h) => sum + h.total, 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center">
              <DocumentTextIcon className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600 flex-shrink-0" />
              <div className="ml-3 sm:ml-4 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Pending Approval</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{pendingHours.length}</p>
              </div>
            </div>
          </div>
          
          <div className="card cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setShowTaxSettings(true)}>
            <div className="flex items-center">
              <CheckCircleIcon className="h-6 w-6 sm:h-8 sm:w-8 text-red-600 flex-shrink-0" />
              <div className="ml-3 sm:ml-4 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Quarterly Taxes</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">${taxAmount.toFixed(2)}</p>
                <p className="text-xs text-gray-500">Click to edit tax rate ({taxRate}%)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Client Management */}
        <div className="card mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-3 sm:space-y-0">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Client Management</h2>
            <button
              onClick={() => setShowAddClient(!showAddClient)}
              className="btn-primary flex items-center text-sm w-full sm:w-auto"
            >
              <UserGroupIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
              Add Client
            </button>
          </div>

          {showAddClient && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
                  <input
                    type="text"
                    value={newClient.name}
                    onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                    className="input-field"
                    placeholder="Client Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={newClient.email}
                    onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                    className="input-field"
                    placeholder="client@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea
                    value={newClient.address}
                    onChange={(e) => setNewClient({...newClient, address: e.target.value})}
                    className="input-field"
                    rows="2"
                    placeholder="Client Address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate</label>
                  <input
                    type="number"
                    value={newClient.hourlyRate}
                    onChange={(e) => setNewClient({...newClient, hourlyRate: e.target.value})}
                    className="input-field"
                    min="0"
                    step="0.01"
                    placeholder="50"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-4">
                <button
                  onClick={() => setShowAddClient(false)}
                  className="btn-secondary text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={addClient}
                  className="btn-primary text-sm"
                >
                  Add Client
                </button>
              </div>
            </div>
          )}

          {/* Clients List */}
          <div className="space-y-3">
            {clients.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No clients added yet. Add your first client!</p>
            ) : (
              clients.map(client => (
                <div key={client.id} className="flex items-center justify-between p-3 sm:p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 sm:space-x-4">
                      <BuildingOfficeIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-gray-900 text-sm sm:text-base truncate">{client.name}</h3>
                        <p className="text-xs sm:text-sm text-gray-600 truncate">{client.email}</p>
                      </div>
                      <span className="text-green-600 font-medium text-sm sm:text-base flex-shrink-0">${client.hourlyRate}/hr</span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteClient(client.id)}
                    className="text-red-600 hover:text-red-800 ml-2 flex-shrink-0"
                  >
                    <TrashIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Settings */}
        <div className="card mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Settings</h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Default Hourly Rate</h3>
              <div className="flex items-center space-x-4">
                <input
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(parseFloat(e.target.value) || 0)}
                  className="input-field w-32"
                  min="0"
                  step="0.01"
                />
                <span className="text-gray-600">USD</span>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Manager Email</h3>
              <input
                type="email"
                value={managerEmail}
                onChange={(e) => setManagerEmail(e.target.value)}
                className="input-field"
                placeholder="manager@company.com"
              />
              <p className="text-sm text-gray-600 mt-1">For sending approval requests</p>
            </div>
          </div>
        </div>

        {/* Hours Management with Tabs */}
        <div className="card mb-8">
          <div className="flex flex-col space-y-4 mb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Hours Management</h2>
              <div className="flex space-x-2 w-full sm:w-auto">
                <button
                  onClick={emailManager}
                  className="btn-secondary flex items-center text-sm flex-1 sm:flex-none"
                  title="Email Manager for Approval"
                >
                  <EnvelopeIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Email Manager</span>
                </button>
                <button
                  onClick={() => setShowAddHours(!showAddHours)}
                  className="btn-primary flex items-center text-sm flex-1 sm:flex-none"
                >
                  <PlusIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                  Add Hours
                </button>
              </div>
            </div>
            <div className="flex border border-gray-300 rounded-lg w-full sm:w-auto">
              <button
                onClick={() => setActiveTab('current')}
                className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-l-lg ${
                  activeTab === 'current' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Current ({hours.filter(h => !h.invoiced).length})
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-r-lg ${
                  activeTab === 'past' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Past ({invoicedHours.length})
              </button>
            </div>
          </div>

          {showAddHours && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={newHours.date}
                    onChange={(e) => setNewHours({...newHours, date: e.target.value})}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                  <select
                    value={newHours.clientId}
                    onChange={(e) => setNewHours({...newHours, clientId: e.target.value})}
                    className="input-field"
                  >
                    <option value="">Select Client (Optional)</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>
                        {client.name} (${client.hourlyRate}/hr)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hours</label>
                  <input
                    type="number"
                    value={newHours.hours}
                    onChange={(e) => setNewHours({...newHours, hours: e.target.value})}
                    className="input-field"
                    min="0"
                    step="0.5"
                    placeholder="8.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rate (if no client)</label>
                  <input
                    type="number"
                    value={newHours.rate}
                    onChange={(e) => setNewHours({...newHours, rate: e.target.value})}
                    className="input-field"
                    min="0"
                    step="0.01"
                    placeholder={hourlyRate}
                    disabled={newHours.clientId !== ''}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={newHours.description}
                    onChange={(e) => setNewHours({...newHours, description: e.target.value})}
                    className="input-field"
                    placeholder="What did you work on?"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-4">
                <button
                  onClick={() => setShowAddHours(false)}
                  className="btn-secondary text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={addHours}
                  className="btn-primary text-sm"
                >
                  Add Hours
                </button>
              </div>
            </div>
          )}

          {/* Hours List */}
          <div className="space-y-3">
            {activeTab === 'current' ? (
              hours.filter(h => !h.invoiced).length === 0 ? (
                <p className="text-gray-500 text-center py-8">No current hours. Add your first entry!</p>
              ) : (
                hours.filter(h => !h.invoiced).map(hour => (
                  <div key={hour.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-white border border-gray-200 rounded-lg space-y-2 sm:space-y-0">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 lg:space-x-4">
                        <span className="text-xs sm:text-sm text-gray-500">{hour.date}</span>
                        <span className="font-medium text-sm sm:text-base">{hour.hours}h</span>
                        <span className="text-gray-700 text-sm sm:text-base truncate">{hour.description}</span>
                        <span className="text-blue-600 text-xs sm:text-sm">{getClientName(hour.clientId)}</span>
                        <span className="text-green-600 font-medium text-sm sm:text-base">${hour.total.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 w-full sm:w-auto">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        hour.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {hour.status}
                      </span>
                      {hour.status === 'pending' && (
                        <button
                          onClick={() => approveHours(hour.id)}
                          className="text-green-600 hover:text-green-800"
                        >
                          <CheckCircleIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteHours(hour.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <TrashIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                      </button>
                    </div>
                  </div>
                ))
              )
            ) : (
              invoicedHours.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No past hours. Create invoices to see them here.</p>
              ) : (
                invoicedHours.map(hour => (
                  <div key={hour.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-2 sm:space-y-0">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 lg:space-x-4">
                        <ArchiveBoxIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0" />
                        <span className="text-xs sm:text-sm text-gray-500">{hour.date}</span>
                        <span className="font-medium text-sm sm:text-base">{hour.hours}h</span>
                        <span className="text-gray-700 text-sm sm:text-base truncate">{hour.description}</span>
                        <span className="text-blue-600 text-xs sm:text-sm">{getClientName(hour.clientId)}</span>
                        <span className="text-green-600 font-medium text-sm sm:text-base">${hour.total.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 w-full sm:w-auto">
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                        Invoiced
                      </span>
                    </div>
                  </div>
                ))
              )
            )}
          </div>
        </div>

        {/* Invoice Management */}
        <div className="card mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-3 sm:space-y-0">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Invoice Management</h2>
            {approvedHours.length > 0 && (
              <button
                onClick={() => setShowCreateInvoice(!showCreateInvoice)}
                className="btn-primary flex items-center text-sm w-full sm:w-auto"
              >
                <DocumentTextIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                Create Invoice
              </button>
            )}
          </div>

          {showCreateInvoice && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="font-medium text-gray-900 mb-2">Create Invoices from Approved Hours</h3>
              <p className="text-sm text-gray-600 mb-4">
                Total: {approvedHours.reduce((sum, h) => sum + h.hours, 0).toFixed(1)} hours = 
                ${approvedHours.reduce((sum, h) => sum + h.total, 0).toFixed(2)}
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowCreateInvoice(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={createInvoice}
                  className="btn-primary"
                >
                  Create Invoice
                </button>
              </div>
            </div>
          )}

          {/* Invoices List */}
          <div className="space-y-3">
            {invoices.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No invoices created yet.</p>
            ) : (
              invoices.map(invoice => (
                                <div key={invoice.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  {/* Invoice Header */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 space-y-2 sm:space-y-0">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 lg:space-x-4">
                        <span className="text-xs sm:text-sm text-gray-500">Invoice #{invoice.invoiceNumber || invoice.id}</span>
                        <span className="text-xs sm:text-sm text-gray-500">{invoice.date}</span>
                        <span className="font-medium text-sm sm:text-base">{invoice.totalHours}h</span>
                        <span className="text-blue-600 text-xs sm:text-sm truncate">{invoice.clientName}</span>
                        <span className="text-green-600 font-medium text-sm sm:text-base">${invoice.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 w-full sm:w-auto">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        invoice.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {invoice.status}
                      </span>
                      {invoice.status === 'pending' && (
                        <button
                          onClick={() => markInvoicePaid(invoice.id)}
                          className="text-green-600 hover:text-green-800"
                          title="Mark as Paid"
                        >
                          <CheckCircleIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                        </button>
                      )}
                      <button
                        onClick={() => editInvoice(invoice)}
                        className="text-gray-600 hover:text-gray-800"
                        title="Edit Invoice"
                      >
                        <PencilIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                      </button>
                      <button
                        onClick={() => generatePDFInvoice(invoice)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Download PDF Invoice"
                      >
                        <DocumentArrowDownIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Invoice Details (when editing) */}
                  {editingInvoice && editingInvoice.id === invoice.id && (
                    <div className="border-t border-gray-200 bg-gray-50 p-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium text-gray-900">Invoice Details</h4>
                          <div className="flex space-x-2">
                            <button
                              onClick={saveInvoiceEdit}
                              className="btn-primary text-sm"
                            >
                              Save Changes
                            </button>
                            <button
                              onClick={cancelInvoiceEdit}
                              className="btn-secondary text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                        
                        {/* Editable Invoice Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Number</label>
                            <input
                              type="text"
                              value={editingInvoice.invoiceNumber || ''}
                              onChange={(e) => setEditingInvoice({...editingInvoice, invoiceNumber: e.target.value})}
                              className="input-field"
                              placeholder="e.g., INV-001, CLIENT-2024-001"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Date</label>
                            <input
                              type="date"
                              value={editingInvoice.date}
                              onChange={(e) => setEditingInvoice({...editingInvoice, date: e.target.value})}
                              className="input-field"
                            />
                          </div>
                        </div>
                        
                        {/* Hours in this invoice */}
                        <div className="space-y-2">
                          <h5 className="text-sm font-medium text-gray-700">Hours Included:</h5>
                          {invoice.hours.map(hour => (
                            <div key={hour.id} className="flex items-center justify-between p-2 bg-white rounded border">
                              <div className="flex items-center space-x-3">
                                <span className="text-sm text-gray-500">{hour.date}</span>
                                <span className="font-medium">{hour.hours}h</span>
                                <span className="text-gray-700">{hour.description}</span>
                                <span className="text-green-600">${hour.total.toFixed(2)}</span>
                              </div>
                              <button
                                onClick={() => removeHourFromInvoice(invoice.id, hour.id)}
                                className="text-red-600 hover:text-red-800"
                                title="Remove from invoice"
                              >
                                <XMarkIcon className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Tax Summary */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Quarterly Tax Summary</h2>
            <button
              onClick={() => setShowTaxSettings(true)}
              className="btn-secondary flex items-center text-sm"
            >
              <PencilIcon className="h-4 w-4 mr-1" />
              Edit Tax Rate
            </button>
          </div>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Current Quarter</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm sm:text-base">Total Earnings:</span>
                  <span className="font-medium text-sm sm:text-base">${totalEarnings.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm sm:text-base">Taxes ({taxRate}%):</span>
                  <span className="font-medium text-red-600 text-sm sm:text-base">${taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-gray-900 font-medium text-sm sm:text-base">Net Income:</span>
                  <span className="font-medium text-green-600 text-sm sm:text-base">${(totalEarnings - taxAmount).toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Tax Due Dates</h3>
              <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                <p>Q1: April 15</p>
                <p>Q2: June 15</p>
                <p>Q3: September 15</p>
                <p>Q4: January 15</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tax Settings Modal */}
        {showTaxSettings && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Tax Settings</h3>
                <button
                  onClick={() => setShowTaxSettings(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                    className="input-field w-full"
                    min="0"
                    max="100"
                    step="0.1"
                    placeholder="20"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter your estimated tax rate (e.g., 20 for 20%)
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Preview</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Total Earnings:</span>
                      <span>${totalEarnings.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax Rate:</span>
                      <span>{taxRate}%</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Estimated Tax:</span>
                      <span className="text-red-600">${(totalEarnings * (taxRate / 100)).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowTaxSettings(false)}
                  className="btn-secondary text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowTaxSettings(false)}
                  className="btn-primary text-sm"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
