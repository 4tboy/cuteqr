import React, { useState, useEffect, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';
import CustomColorPicker from './components/CustomColorPicker';
import { Html5Qrcode } from 'html5-qrcode';
import { BrowserQRCodeReader } from '@zxing/browser';
import { DecodeHintType } from '@zxing/library';
import jsQR from 'jsqr';
import { 
  QrCode, 
  Link2, 
  Wifi, 
  UserSquare, 
  FileText, 
  Settings, 
  Download, 
  History, 
  ScanLine, 
  Camera, 
  Upload, 
  Trash2, 
  Sparkles,
  Info, 
  Check, 
  ArrowRight,
  Circle,
  Grip,
  Square,
  Sparkle,
  CircleDot,
  ChevronDown,
  ChevronUp,
  Maximize,
  Heart,
  Coffee,
  Banknote,
  AtSign,
  User
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('editor'); // editor | history | scanner
  const [qrList, setQrList] = useState([]);
  const [alert, setAlert] = useState(null);
  
  // Donation Modal State
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [karmaUnlocked, setKarmaUnlocked] = useState(false);

  // Editor State
  const [qrName, setQrName] = useState('My Awesome QR Code');
  const [qrType, setQrType] = useState('url'); // url | wifi | vcard | text
  const [destUrl, setDestUrl] = useState('https://github.com/4tboy');
  const [textPayload, setTextPayload] = useState('Hello, this is a custom QR code!');
  
  // Wi-Fi Payload
  const [wifiSsid, setWifiSsid] = useState('My-WiFi-Network');
  const [wifiPassword, setWifiPassword] = useState('secret123');
  const [wifiEncryption, setWifiEncryption] = useState('WPA'); // WPA | WEP | nopass

  // vCard Payload
  const [vcardName, setVcardName] = useState('Jane Doe');
  const [vcardPhone, setVcardPhone] = useState('+1-555-0199');
  const [vcardEmail, setVcardEmail] = useState('jane.doe@example.com');
  const [vcardNote, setVcardNote] = useState('Digital Creator');

  // UPI Payload
  const [upiId, setUpiId] = useState('ashahu@upi');
  const [upiAmount, setUpiAmount] = useState('');

  // Aesthetic Customization State
  const [dotType, setDotType] = useState('extra-rounded'); // rounded | extra-rounded | dots | classy | classy-rounded | square
  const [dotColor, setDotColor] = useState('#2C3E50');
  const [useGradient, setUseGradient] = useState(false);
  const [gradientColor1, setGradientColor1] = useState('#FFB3D9');
  const [gradientColor2, setGradientColor2] = useState('#B3E5FC');
  const [gradientType, setGradientType] = useState('linear'); // linear | radial

  const [cornerSquareType, setCornerSquareType] = useState('extra-rounded'); // square | rounded | extra-rounded | dot
  const [cornerSquareColor, setCornerSquareColor] = useState('#2C3E50');

  const [cornerDotType, setCornerDotType] = useState('dot'); // square | dot
  const [cornerDotColor, setCornerDotColor] = useState('#2C3E50');

  const [bgColor, setBgColor] = useState('#FFFDFE');
  const [showAdvancedEyes, setShowAdvancedEyes] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoSize, setLogoSize] = useState(0.35); // 0.2 to 0.5
  
  const [logoMode, setLogoMode] = useState('image'); // 'image' | 'text'
  const [logoText, setLogoText] = useState('SCAN');
  const [logoTextColor, setLogoTextColor] = useState('#FFFFFF');
  const [logoTextBgColor, setLogoTextBgColor] = useState('#2C3E50');

  // Scanner State
  const [scanResult, setScanResult] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [scannerInstance, setScannerInstance] = useState(null);

  // Reference for QR Code preview element
  const qrRef = useRef(null);
  const qrStylingInstance = useRef(null);

  // Load saved QRs on start
  useEffect(() => {
    fetchQrs();
    
    // Track app opens to show github URL only on 1st and 100th open
    try {
      let openCount = parseInt(localStorage.getItem('appOpenCount') || '0', 10);
      openCount += 1;
      localStorage.setItem('appOpenCount', openCount.toString());
      if (openCount === 1 || openCount === 100) {
        setDestUrl('https://github.com/4tboy');
      }
    } catch (e) {
      console.warn('Failed to access local storage for open count', e);
    }
  }, []);

  const fetchQrs = () => {
    try {
      const saved = localStorage.getItem('qr_gallery');
      if (saved) {
        setQrList(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Failed to parse local storage', e);
    }
  };

  const showAlert = (message, type = 'info') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 4000);
  };

  // Compile the data payload based on the selected type
  const getPayloadData = () => {
    switch (qrType) {
      case 'url':
        return destUrl;
      case 'text':
        return textPayload;
      case 'wifi':
        // format: WIFI:S:SSID;T:WPA;P:PASSWORD;;
        const enc = wifiEncryption === 'nopass' ? '' : wifiEncryption;
        return `WIFI:S:${wifiSsid};T:${enc};P:${wifiPassword};;`;
      case 'vcard':
        // format: BEGIN:VCARD\nVERSION:3.0\nN:LastName;FirstName\nTEL:Phone\nEMAIL:Email\nNOTE:Note\nEND:VCARD
        return `BEGIN:VCARD\nVERSION:3.0\nN:${vcardName}\nFN:${vcardName}\nTEL:${vcardPhone}\nEMAIL:${vcardEmail}\nNOTE:${vcardNote}\nEND:VCARD`;
      case 'upi':
        let upiStr = `upi://pay?pa=${upiId}`;
        if (upiAmount) upiStr += `&am=${upiAmount}`;
        return upiStr;
      default:
        return destUrl;
    }
  };

  // Build the styling options object
  const getQrOptions = (dataPayload) => {
    const errorLevel = logoPreview ? 'H' : 'Q'; // Force High error correction when embedding logo

    const dotsOpts = {
      type: dotType,
      color: dotColor,
    };

    if (useGradient) {
      dotsOpts.gradient = {
        type: gradientType,
        rotation: 45,
        colorStops: [
          { offset: 0, color: gradientColor1 },
          { offset: 1, color: gradientColor2 }
        ]
      };
    }

    return {
      width: 280,
      height: 280,
      type: 'svg',
      data: dataPayload || getPayloadData(),
      margin: 12,
      qrOptions: {
        typeNumber: 0,
        mode: 'Byte',
        errorCorrectionLevel: errorLevel,
      },
      backgroundOptions: {
        color: bgColor,
      },
      dotsOptions: dotsOpts,
      cornersSquareOptions: {
        type: cornerSquareType,
        color: cornerSquareColor,
      },
      cornersDotOptions: {
        type: cornerDotType,
        color: cornerDotColor,
      },
      imageOptions: {
        crossOrigin: 'anonymous',
        hideBackgroundDots: true,
        imageSize: logoSize,
        margin: 4
      },
      ...(logoPreview ? { image: logoPreview } : {})
    };
  };

  // Initialize and update the live QR Code canvas preview
  useEffect(() => {
    if (activeTab === 'editor' && qrRef.current) {
      const dataPayload = getPayloadData();
      const options = getQrOptions(dataPayload);

      // Create instance if it doesn't exist
      if (!qrStylingInstance.current) {
        qrStylingInstance.current = new QRCodeStyling(options);
      } else {
        qrStylingInstance.current.update(options);
      }
      
      // Always ensure the preview is rendered in the current DOM node
      if (qrRef.current && qrRef.current.children.length === 0) {
        qrStylingInstance.current.append(qrRef.current);
      }
    }
  }, [
    activeTab,
    qrType,
    destUrl,
    textPayload,
    wifiSsid,
    wifiPassword,
    wifiEncryption,
    vcardName,
    vcardPhone,
    vcardEmail,
    vcardNote,
    upiId,
    upiAmount,
    dotType,
    dotColor,
    useGradient,
    gradientColor1,
    gradientColor2,
    gradientType,
    cornerSquareType,
    cornerSquareColor,
    cornerDotType,
    cornerDotColor,
    bgColor,
    logoPreview,
    logoSize
  ]);

  // Handle logo file upload and convert to base64
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleLogoModeChange = (mode) => {
    setLogoMode(mode);
    setLogoFile(null);
    if (mode === 'image') {
      setLogoPreview(null);
    }
  };

  useEffect(() => {
    if (logoMode === 'text') {
      if (logoText.trim()) {
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="60">
          <rect width="100%" height="100%" fill="${logoTextBgColor}" rx="15"/>
          <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="28" fill="${logoTextColor}">${logoText}</text>
        </svg>`;
        setLogoPreview(`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`);
      } else {
        setLogoPreview(null);
      }
    }
  }, [logoMode, logoText, logoTextColor, logoTextBgColor]);

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    if (logoMode === 'text') {
      setLogoText('');
    }
  };

  // Helper to generate dynamic filenames based on content
  const getDynamicFilename = () => {
    // If the user explicitly typed a custom name (not the default), prioritize that
    if (qrName && qrName !== 'My Awesome QR Code') {
      return qrName.replace(/[\s\W]+/g, '-').toLowerCase();
    }
    
    // Otherwise, generate a context-aware filename
    let base = `qr-${qrType}`;
    
    if (qrType === 'url' && destUrl) {
      base += `-${destUrl.replace(/https?:\/\//, '').split('/')[0]}`;
    } else if (qrType === 'text' && textPayload) {
      base += `-${textPayload.slice(0, 12)}`;
    } else if (qrType === 'wifi' && wifiSsid) {
      base += `-${wifiSsid}`;
    } else if (qrType === 'upi' && upiId) {
      base += `-${upiId.split('@')[0]}`;
    } else if (qrType === 'vcard' && vcardName) {
      base += `-${vcardName}`;
    }
    
    return base.replace(/[^a-z0-9.-]/gi, '-').toLowerCase();
  };

  // Download functionality client-side
  const downloadQr = (format) => {
    if (!qrStylingInstance.current) return;
    
    const filename = getDynamicFilename();
    
    qrStylingInstance.current.download({
      name: filename,
      extension: format
    });
    showAlert(`Downloaded QR Code successfully as ${format.toUpperCase()}`, 'success');
    
    // Track downloads to show donation modal only on 1st and 100th download
    try {
      let dCount = parseInt(localStorage.getItem('downloadCount') || '0', 10);
      dCount += 1;
      localStorage.setItem('downloadCount', dCount.toString());
      if (dCount === 1 || dCount === 100) {
        setTimeout(() => {
          setShowDonationModal(true);
          setKarmaUnlocked(false);
        }, 1000);
      }
    } catch (e) {
      console.warn('Failed to access local storage for download count', e);
    }
  };

  // Save the custom QR to Local Storage
  const handleSaveQr = () => {
    const payloadObject = {
      destUrl: qrType === 'url' ? destUrl : '',
      text: qrType === 'text' ? textPayload : '',
      wifi: qrType === 'wifi' ? { ssid: wifiSsid, password: wifiPassword, encryption: wifiEncryption } : null,
      vcard: qrType === 'vcard' ? { name: vcardName, phone: vcardPhone, email: vcardEmail, note: vcardNote } : null,
      upi: qrType === 'upi' ? { id: upiId, amount: upiAmount } : null,
    };

    const stylingConfig = {
      dotType,
      dotColor,
      useGradient,
      gradientColor1,
      gradientColor2,
      gradientType,
      cornerSquareType,
      cornerSquareColor,
      cornerDotType,
      cornerDotColor,
      bgColor,
      logoSize,
      logoPreview
    };

    const newQr = {
      id: Date.now().toString(),
      name: qrName,
      type: qrType,
      payload: payloadObject,
      styling_config: stylingConfig,
      created_at: new Date().toISOString()
    };

    const updatedList = [newQr, ...qrList];
    setQrList(updatedList);
    localStorage.setItem('qr_gallery', JSON.stringify(updatedList));
    showAlert(`Successfully saved "${newQr.name}" to local browser storage!`, 'success');
    setActiveTab('history');
  };

  // Delete QR Code from Local Storage
  const handleDeleteQr = (id) => {
    const updatedList = qrList.filter(q => q.id !== id);
    setQrList(updatedList);
    localStorage.setItem('qr_gallery', JSON.stringify(updatedList));
    showAlert('QR Code deleted successfully', 'success');
  };

  // Camera scanner control
  const startCamera = async () => {
    setCameraActive(true);
    setScanResult('');
    
    // Tiny delay to let element mount in DOM
    setTimeout(async () => {
      try {
        const html5Qrcode = new Html5Qrcode("reader");
        setScannerInstance(html5Qrcode);
        await html5Qrcode.start(
          { facingMode: "environment" },
          {
            fps: 15,
            qrbox: { width: 260, height: 260 }
          },
          (decodedText) => {
            setScanResult(decodedText);
            showAlert('QR Code Scanned Successfully!', 'success');
            html5Qrcode.stop().catch(e => console.error('Stop error:', e));
            setCameraActive(false);
          },
          () => {
            // Silence error messages to reduce noise
          }
        );
      } catch (err) {
        console.error('Camera fail:', err);
        showAlert('Could not access camera. Make sure webcam is attached and permissions granted.', 'error');
        setCameraActive(false);
      }
    }, 100);
  };

  const stopCamera = async () => {
    if (scannerInstance) {
      try {
        await scannerInstance.stop();
      } catch (e) {
        console.error(e);
      }
    }
    setCameraActive(false);
  };

  // Scanning from file upload
  const handleFileScan = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setScanResult('');
    // Create temporary HTML element for scanning
    const html5QrCode = new Html5Qrcode("reader-temp-file");
    try {
      const decodedText = await html5QrCode.scanFile(file, true);
      setScanResult(decodedText);
      showAlert('QR Code decoded successfully! (via Fast Scanner)', 'success');
    } catch (err) {
      // Fallback to ZXing for complex/logo-embedded QR codes
      try {
        const imageElement = document.createElement('img');
        const url = URL.createObjectURL(file);
        imageElement.src = url;
        
        await new Promise((resolve, reject) => {
          imageElement.onload = resolve;
          imageElement.onerror = reject;
        });

        // Add 50px padding to create a quiet zone
        const padding = 50;
        const canvas = document.createElement('canvas');
        canvas.width = imageElement.width + (padding * 2);
        canvas.height = imageElement.height + (padding * 2);
        const ctx = canvas.getContext('2d');
        
        // Fill white background
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw original image in the center
        ctx.drawImage(imageElement, padding, padding);
        
        const paddedImage = document.createElement('img');
        paddedImage.src = canvas.toDataURL('image/png');
        
        await new Promise((resolve) => {
          paddedImage.onload = resolve;
        });

        const hints = new Map();
        hints.set(DecodeHintType.TRY_HARDER, true);
        const codeReader = new BrowserQRCodeReader(hints);
        
        try {
          const result = await codeReader.decodeFromImageElement(paddedImage);
          setScanResult(result.getText());
          showAlert('QR Code decoded successfully! (via Advanced Scanner)', 'success');
        } catch (zxingErr) {
          // Ultimate Fallback to jsQR
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          
          if (code && code.data) {
            setScanResult(code.data);
            showAlert('QR Code decoded successfully! (via Ultimate Scanner)', 'success');
          } else {
            throw new Error('jsQR failed');
          }
        }
        
        URL.revokeObjectURL(url);
      } catch (err2) {
        setScanResult('Error: No scannable QR code found in this image, even with advanced decoder.');
        showAlert('Failed to decode QR code', 'error');
      }
    }
  };

  // Load a saved style preset from history back into the editor
  const handleLoadStyle = (styling) => {
    if (!styling) return;
    setDotType(styling.dotType || 'extra-rounded');
    setDotColor(styling.dotColor || '#2C3E50');
    setUseGradient(styling.useGradient || false);
    setGradientColor1(styling.gradientColor1 || '#FFB3D9');
    setGradientColor2(styling.gradientColor2 || '#B3E5FC');
    setGradientType(styling.gradientType || 'linear');
    setCornerSquareType(styling.cornerSquareType || 'extra-rounded');
    setCornerSquareColor(styling.cornerSquareColor || '#2C3E50');
    setCornerDotType(styling.cornerDotType || 'dot');
    setCornerDotColor(styling.cornerDotColor || '#2C3E50');
    setBgColor(styling.bgColor || '#FFFDFE');
    setLogoSize(styling.logoSize || 0.35);
    setLogoPreview(styling.logoPreview || null);
    showAlert('Loaded QR design settings into studio!', 'success');
    setActiveTab('editor');
  };

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Alert Overlay */}
      {alert && (
        <div className="toast toast-top toast-end z-50">
          <div className={`alert text-white rounded-xl shadow-lg border-none flex gap-2 items-center ${
            alert.type === 'success' ? 'bg-success' : alert.type === 'error' ? 'bg-error' : 'bg-info'
          }`}>
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span className="font-semibold text-sm">{alert.message}</span>
          </div>
        </div>
      )}

      {/* Header Panel */}
      <header className="navbar bg-base-100 border-b border-base-200 px-6 py-4 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white shadow-md">
            <QrCode className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-neutral leading-none m-0">CuteQR Offline</h1>
            <p className="text-xs text-neutral/50 font-medium mt-1">Creative Static QR Studio</p>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <nav className="flex gap-2 bg-base-200/50 p-1.5 rounded-2xl">
          <button 
            onClick={() => setActiveTab('editor')} 
            className={`btn btn-sm rounded-xl border-none hover:bg-base-300 gap-2 ${activeTab === 'editor' ? 'bg-primary text-primary-content hover:bg-primary/95 shadow-sm' : 'bg-transparent text-neutral/70'}`}
          >
            <Sparkles className="w-4 h-4" />
            Studio
          </button>
          <button 
            onClick={() => setActiveTab('history')} 
            className={`btn btn-sm rounded-xl border-none hover:bg-base-300 gap-2 ${activeTab === 'history' ? 'bg-primary text-primary-content hover:bg-primary/95 shadow-sm' : 'bg-transparent text-neutral/70'}`}
          >
            <History className="w-4 h-4" />
            Gallery ({qrList.length})
          </button>
          <button 
            onClick={() => setActiveTab('scanner')} 
            className={`btn btn-sm rounded-xl border-none hover:bg-base-300 gap-2 ${activeTab === 'scanner' ? 'bg-primary text-primary-content hover:bg-primary/95 shadow-sm' : 'bg-transparent text-neutral/70'}`}
          >
            <ScanLine className="w-4 h-4" />
            Verify Scan
          </button>
        </nav>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 flex flex-col justify-start">
        
        {/* TAB 1: STUDIO (EDITOR) */}
        {activeTab === 'editor' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Editor Sidebar Options (Left 7 Cols) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              {/* Card 1: Title & Routing Type */}
              <div className="card bg-white border border-base-200 shadow-sm rounded-3xl p-6 flex flex-col gap-4">
                <h2 className="text-lg font-bold text-neutral m-0 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" />
                  1. Setup Campaign
                </h2>
                
                <div className="form-control w-full">
                  <label className="label py-1"><span className="label-text font-semibold text-xs text-neutral/70">Campaign / QR Name</span></label>
                  <input 
                    type="text" 
                    value={qrName}
                    onChange={(e) => setQrName(e.target.value)}
                    placeholder="My Restaurant Menu" 
                    className="input input-bordered w-full rounded-2xl bg-base-100 border-base-200 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Card 2: Payload Content Details */}
              <div className="card bg-white border border-base-200 shadow-sm rounded-3xl p-6 flex flex-col gap-4">
                <h2 className="text-lg font-bold text-neutral m-0 flex items-center gap-2">
                  <Link2 className="w-5 h-5 text-primary" />
                  2. QR Code Content
                </h2>

                {/* Content Type Selector Tabs */}
                <div className="tabs tabs-boxed rounded-2xl bg-base-200/60 p-1 flex justify-between gap-1 w-full">
                  <button 
                    onClick={() => setQrType('url')}
                    className={`tab flex-1 rounded-xl text-xs font-semibold gap-1.5 ${qrType === 'url' ? 'tab-active bg-white text-neutral shadow-sm' : 'text-neutral/60'}`}
                  >
                    <Link2 className="w-4 h-4" /> Link
                  </button>
                  <button 
                    onClick={() => setQrType('wifi')}
                    className={`tab flex-1 rounded-xl text-xs font-semibold gap-1.5 ${qrType === 'wifi' ? 'tab-active bg-white text-neutral shadow-sm' : 'text-neutral/60'}`}
                  >
                    <Wifi className="w-4 h-4" /> Wi-Fi
                  </button>
                  <button 
                    onClick={() => setQrType('vcard')}
                    className={`tab flex-1 rounded-xl text-xs font-semibold gap-1.5 ${qrType === 'vcard' ? 'tab-active bg-white text-neutral shadow-sm' : 'text-neutral/60'}`}
                  >
                    <UserSquare className="w-4 h-4" /> Contact
                  </button>
                  <button 
                    onClick={() => setQrType('text')}
                    className={`tab flex-1 rounded-xl text-xs font-semibold gap-1.5 ${qrType === 'text' ? 'tab-active bg-white text-neutral shadow-sm' : 'text-neutral/60'}`}
                  >
                    <FileText className="w-4 h-4" /> Text
                  </button>
                  <button 
                    onClick={() => setQrType('upi')}
                    className={`tab flex-1 rounded-xl text-xs font-semibold gap-1.5 ${qrType === 'upi' ? 'tab-active bg-white text-neutral shadow-sm' : 'text-neutral/60'}`}
                  >
                    <Banknote className="w-4 h-4" /> UPI
                  </button>
                </div>

                {/* Payload Inputs depending on type */}
                {qrType === 'url' && (
                  <div className="form-control w-full">
                    <label className="label py-1"><span className="label-text font-semibold text-xs text-neutral/70">Target Website URL</span></label>
                    <input 
                      type="url" 
                      value={destUrl}
                      onChange={(e) => setDestUrl(e.target.value)}
                      placeholder="https://mywebsite.com" 
                      className="input input-bordered w-full rounded-2xl bg-base-100 border-base-200 text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                )}

                {qrType === 'text' && (
                  <div className="form-control w-full">
                    <label className="label py-1"><span className="label-text font-semibold text-xs text-neutral/70">Text Data</span></label>
                    <textarea 
                      value={textPayload}
                      onChange={(e) => setTextPayload(e.target.value)}
                      placeholder="Enter custom plain text..." 
                      className="textarea textarea-bordered h-24 rounded-2xl bg-base-100 border-base-200 text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                )}

                {qrType === 'wifi' && (
                  <div className="flex flex-col gap-3">
                    <div className="form-control w-full">
                      <label className="label py-1"><span className="label-text font-semibold text-xs text-neutral/70">Network SSID (Name)</span></label>
                      <input 
                        type="text" 
                        value={wifiSsid}
                        onChange={(e) => setWifiSsid(e.target.value)}
                        placeholder="Home-WiFi" 
                        className="input input-bordered w-full rounded-2xl bg-base-100 border-base-200 text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="form-control">
                        <label className="label py-1"><span className="label-text font-semibold text-xs text-neutral/70">Password</span></label>
                        <input 
                          type="password" 
                          value={wifiPassword}
                          onChange={(e) => setWifiPassword(e.target.value)}
                          placeholder="Password" 
                          className="input input-bordered w-full rounded-2xl bg-base-100 border-base-200 text-sm"
                        />
                      </div>
                      <div className="form-control">
                        <label className="label py-1"><span className="label-text font-semibold text-xs text-neutral/70">Security</span></label>
                        <select 
                          value={wifiEncryption}
                          onChange={(e) => setWifiEncryption(e.target.value)}
                          className="select select-bordered w-full rounded-2xl bg-base-100 border-base-200 text-sm"
                        >
                          <option value="WPA">WPA/WPA2</option>
                          <option value="WEP">WEP</option>
                          <option value="nopass">None (Open)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {qrType === 'vcard' && (
                  <div className="flex flex-col gap-3">
                    <div className="form-control w-full">
                      <label className="label py-1"><span className="label-text font-semibold text-xs text-neutral/70">Full Name</span></label>
                      <input 
                        type="text" 
                        value={vcardName}
                        onChange={(e) => setVcardName(e.target.value)}
                        placeholder="Jane Doe" 
                        className="input input-bordered w-full rounded-2xl bg-base-100 border-base-200 text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="form-control">
                        <label className="label py-1"><span className="label-text font-semibold text-xs text-neutral/70">Phone Number</span></label>
                        <input 
                          type="text" 
                          value={vcardPhone}
                          onChange={(e) => setVcardPhone(e.target.value)}
                          placeholder="+1234567890" 
                          className="input input-bordered w-full rounded-2xl bg-base-100 border-base-200 text-sm"
                        />
                      </div>
                      <div className="form-control">
                        <label className="label py-1"><span className="label-text font-semibold text-xs text-neutral/70">Email Address</span></label>
                        <input 
                          type="email" 
                          value={vcardEmail}
                          onChange={(e) => setVcardEmail(e.target.value)}
                          placeholder="jane@example.com" 
                          className="input input-bordered w-full rounded-2xl bg-base-100 border-base-200 text-sm"
                        />
                      </div>
                    </div>
                    <div className="form-control w-full">
                      <label className="label py-1"><span className="label-text font-semibold text-xs text-neutral/70">Company / Notes</span></label>
                      <input 
                        type="text" 
                        value={vcardNote}
                        onChange={(e) => setVcardNote(e.target.value)}
                        placeholder="Software Engineer" 
                        className="input input-bordered w-full rounded-2xl bg-base-100 border-base-200 text-sm"
                      />
                    </div>
                  </div>
                )}

                {qrType === 'upi' && (
                  <div className="bg-white border border-base-200 rounded-xl shadow-sm p-5 flex flex-col gap-5 mt-2">
                    <div className="flex items-center gap-2 pb-3 border-b border-base-100">
                      <div className="p-1.5 bg-primary/10 text-primary rounded-md">
                        <Banknote className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-neutral m-0">UPI Payment Details</h4>
                        <p className="text-[11px] text-neutral/50 m-0 leading-tight">Configure a direct bank-to-bank transfer request</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-4">
                      {/* UPI ID Field */}
                      <div className="space-y-1.5 flex flex-col">
                        <label className="text-sm font-medium leading-none text-neutral">
                          UPI ID / VPA <span className="text-error">*</span>
                        </label>
                        <div className="relative flex items-center">
                          <div className="absolute left-3 flex items-center pointer-events-none text-neutral/40">
                            <AtSign className="w-4 h-4" />
                          </div>
                          <input 
                            type="text" 
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            placeholder="username@bank" 
                            className="flex h-10 w-full rounded-md border border-base-300 bg-transparent px-3 py-2 pl-9 text-sm placeholder:text-neutral/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 transition-colors"
                          />
                        </div>
                        <p className="text-[11px] text-neutral/50">The Virtual Payment Address of the receiver.</p>
                      </div>

                        {/* Amount */}
                        <div className="space-y-1.5 flex flex-col">
                          <label className="text-sm font-medium leading-none text-neutral">
                            Fixed Amount
                          </label>
                          <div className="relative flex items-center">
                            <div className="absolute left-3 flex items-center pointer-events-none text-neutral/60 font-semibold text-sm">
                              ₹
                            </div>
                            <input 
                              type="number" 
                              value={upiAmount}
                              onChange={(e) => setUpiAmount(e.target.value)}
                              placeholder="0.00" 
                              className="flex h-10 w-full rounded-md border border-base-300 bg-transparent px-3 py-2 pl-7 text-sm placeholder:text-neutral/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 transition-colors"
                            />
                          </div>
                        </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Card 3: Aesthetic Styling options */}
              <div className="card bg-white border border-base-200 shadow-sm rounded-3xl p-6 flex flex-col gap-6">
                <h2 className="text-lg font-bold text-neutral m-0 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" />
                  3. Color & Styling Customization
                </h2>

                {/* 3.1 QR Dots Matrix Setup */}
                <div className="flex flex-col gap-4 border-b border-base-100 pb-5">
                  <h3 className="text-sm font-bold text-neutral/80 m-0">Dot Matrix Patterns</h3>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'extra-rounded', icon: Circle, label: 'Extra Rounded' },
                      { id: 'dots', icon: Grip, label: 'Dots' },
                      { id: 'rounded', icon: Maximize, label: 'Rounded' },
                      { id: 'classy', icon: Sparkle, label: 'Classy' },
                      { id: 'classy-rounded', icon: Sparkles, label: 'Classy Rounded' },
                      { id: 'square', icon: Square, label: 'Square' }
                    ].map((style) => (
                      <button 
                        key={style.id}
                        onClick={() => setDotType(style.id)}
                        className={`btn btn-sm rounded-xl border border-base-200 capitalize font-semibold text-xs gap-1.5 flex items-center justify-center ${
                          dotType === style.id ? 'bg-primary border-none text-primary-content hover:bg-primary shadow-sm' : 'bg-transparent text-neutral/70 hover:bg-base-200/50'
                        }`}
                      >
                        <style.icon className="w-3.5 h-3.5" />
                        {style.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-col gap-3 mt-2">
                    <div className="flex gap-4 items-center justify-between">
                      <span className="text-xs font-semibold text-neutral/70">Use Gradient for Dots</span>
                      <input 
                        type="checkbox" 
                        checked={useGradient}
                        onChange={(e) => setUseGradient(e.target.checked)}
                        className="toggle toggle-primary toggle-sm"
                      />
                    </div>

                    {!useGradient ? (
                      <div className="flex items-center gap-3 justify-between w-full">
                        <span className="text-xs text-neutral/50 font-medium">Solid Dot Color</span>
                        <CustomColorPicker 
                          color={dotColor} 
                          onChange={setDotColor} 
                          presets={['#2C3E50', '#000000', '#2563EB', '#059669', '#DC2626', '#D97757']}
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3 p-3 bg-base-200/40 rounded-2xl border border-base-200/50">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center gap-2 justify-between">
                            <span className="text-[11px] font-semibold text-neutral/60">Color 1</span>
                            <CustomColorPicker 
                              color={gradientColor1} 
                              onChange={setGradientColor1} 
                              presets={['#FFB3D9', '#B3E5FC', '#E8B3FF', '#FFEAB3']}
                            />
                          </div>
                          <div className="flex items-center gap-2 justify-between">
                            <span className="text-[11px] font-semibold text-neutral/60">Color 2</span>
                            <CustomColorPicker 
                              color={gradientColor2} 
                              onChange={setGradientColor2} 
                              presets={['#FFB3D9', '#B3E5FC', '#E8B3FF', '#FFEAB3']}
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2 justify-between">
                          <span className="text-[11px] font-semibold text-neutral/60">Gradient Style</span>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => setGradientType('linear')} 
                              className={`btn btn-xs rounded-lg ${gradientType === 'linear' ? 'btn-primary' : 'btn-ghost text-neutral/70'}`}
                            >
                              Linear
                            </button>
                            <button 
                              onClick={() => setGradientType('radial')} 
                              className={`btn btn-xs rounded-lg ${gradientType === 'radial' ? 'btn-primary' : 'btn-ghost text-neutral/70'}`}
                            >
                              Radial
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 3.2 Advanced Eye Options Toggle */}
                <div className="border-b border-base-100 pb-5">
                  <button 
                    onClick={() => setShowAdvancedEyes(!showAdvancedEyes)}
                    className="flex w-full items-center justify-between py-2 text-sm font-bold text-neutral hover:text-primary transition-colors"
                  >
                    <span>Advanced Eye Customization</span>
                    {showAdvancedEyes ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  
                  {showAdvancedEyes && (
                    <div className="flex flex-col gap-6 mt-4 pt-4 border-t border-base-200/50 bg-base-200/20 rounded-2xl p-4">
                      {/* Position Eye Ring (Outer Corner) */}
                      <div className="flex flex-col gap-4">
                        <h3 className="text-xs font-bold text-neutral/80 m-0 uppercase tracking-wide">Ring (Outer Corner)</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {[
                            { id: 'extra-rounded', icon: Circle, label: 'Extra Rounded' },
                            { id: 'rounded', icon: Maximize, label: 'Rounded' },
                            { id: 'dot', icon: CircleDot, label: 'Dot' },
                            { id: 'square', icon: Square, label: 'Square' }
                          ].map((style) => (
                            <button 
                              key={style.id}
                              onClick={() => setCornerSquareType(style.id)}
                              className={`btn btn-xs py-2 h-auto rounded-lg border border-base-200 capitalize font-semibold text-[10px] gap-1 flex items-center justify-center flex-col sm:flex-row ${
                                cornerSquareType === style.id ? 'bg-primary border-none text-primary-content hover:bg-primary shadow-sm' : 'bg-white text-neutral/70 hover:bg-base-200/50'
                              }`}
                            >
                              <style.icon className="w-3.5 h-3.5" />
                              {style.label}
                            </button>
                          ))}
                        </div>

                        <div className="flex items-center gap-3 justify-between w-full bg-white p-2 rounded-xl border border-base-200 shadow-sm">
                          <span className="text-xs text-neutral/50 font-medium pl-2">Ring Color</span>
                          <CustomColorPicker 
                            color={cornerSquareColor} 
                            onChange={setCornerSquareColor} 
                            presets={['#2C3E50', '#000000', '#2563EB', '#059669', '#DC2626', '#D97757']}
                          />
                        </div>
                      </div>

                      {/* Position Eye Pupil (Inner Corner) */}
                      <div className="flex flex-col gap-4">
                        <h3 className="text-xs font-bold text-neutral/80 m-0 uppercase tracking-wide">Pupil (Inner Corner)</h3>
                        <div className="grid grid-cols-2 gap-2 max-w-xs">
                          {[
                            { id: 'dot', icon: CircleDot, label: 'Dot' },
                            { id: 'square', icon: Square, label: 'Square' }
                          ].map((style) => (
                            <button 
                              key={style.id}
                              onClick={() => setCornerDotType(style.id)}
                              className={`btn btn-xs py-2 h-auto rounded-lg border border-base-200 capitalize font-semibold text-[10px] gap-1.5 flex items-center justify-center ${
                                cornerDotType === style.id ? 'bg-primary border-none text-primary-content hover:bg-primary shadow-sm' : 'bg-white text-neutral/70 hover:bg-base-200/50'
                              }`}
                            >
                              <style.icon className="w-3.5 h-3.5" />
                              {style.label}
                            </button>
                          ))}
                        </div>

                        <div className="flex items-center gap-3 justify-between w-full bg-white p-2 rounded-xl border border-base-200 shadow-sm">
                          <span className="text-xs text-neutral/50 font-medium pl-2">Pupil Color</span>
                          <CustomColorPicker 
                            color={cornerDotColor} 
                            onChange={setCornerDotColor} 
                            presets={['#2C3E50', '#000000', '#2563EB', '#059669', '#DC2626', '#D97757']}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3.3 Canvas Background */}
                <div className="flex flex-col gap-3 border-b border-base-100 pb-5">
                  <h3 className="text-sm font-bold text-neutral/80 m-0">Canvas Background Color</h3>
                  <div className="flex items-center gap-3 justify-between w-full">
                    <span className="text-xs text-neutral/50 font-medium">Background Color</span>
                    <CustomColorPicker 
                      color={bgColor} 
                      onChange={setBgColor} 
                      presets={['#FFFDFE', '#F8FAFC', '#FEF3C7', '#FCE7F3', '#E0E7FF']}
                    />
                  </div>
                </div>

                {/* 3.4 Brand Center Logo */}
                <div className="flex flex-col gap-4 border-b border-base-100 pb-5">
                  <h3 className="text-sm font-bold text-neutral/80 m-0">Center Brand Overlay</h3>
                  
                  <div className="tabs tabs-boxed rounded-2xl bg-base-200/60 p-1 flex justify-between gap-1 w-full">
                    <button 
                      onClick={() => handleLogoModeChange('image')}
                      className={`tab flex-1 rounded-xl text-xs font-semibold ${logoMode === 'image' ? 'tab-active bg-white text-neutral shadow-sm' : 'text-neutral/60'}`}
                    >
                      Image Logo
                    </button>
                    <button 
                      onClick={() => handleLogoModeChange('text')}
                      className={`tab flex-1 rounded-xl text-xs font-semibold ${logoMode === 'text' ? 'tab-active bg-white text-neutral shadow-sm' : 'text-neutral/60'}`}
                    >
                      Text Badge
                    </button>
                  </div>

                  {!logoPreview && logoMode === 'image' && (
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-base-300 rounded-2xl cursor-pointer hover:bg-base-200/40 transition-all bg-base-200/10">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 text-neutral/40 mb-1" />
                          <p className="text-xs font-semibold text-neutral/60">Upload center logo (PNG/JPG)</p>
                          <p className="text-[10px] text-neutral/40 mt-1">Recommended: 1:1 Aspect Ratio</p>
                        </div>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleLogoUpload} 
                          className="hidden" 
                        />
                      </label>
                    </div>
                  )}

                  {logoMode === 'text' && (
                    <div className="flex flex-col gap-3 p-3 bg-base-200/30 rounded-2xl border border-base-200/50">
                      <input 
                        type="text" 
                        value={logoText}
                        onChange={(e) => setLogoText(e.target.value)}
                        placeholder="Enter text (e.g. SCAN ME)"
                        className="input input-bordered w-full rounded-xl bg-white text-sm"
                        maxLength={12}
                      />
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 flex-1">
                          <span className="text-xs font-semibold text-neutral/60">Text</span>
                          <CustomColorPicker color={logoTextColor} onChange={setLogoTextColor} presets={['#FFFFFF', '#000000', '#FFB3D9']} />
                        </div>
                        <div className="flex items-center gap-2 flex-1">
                          <span className="text-xs font-semibold text-neutral/60">Background</span>
                          <CustomColorPicker color={logoTextBgColor} onChange={setLogoTextBgColor} presets={['#2C3E50', '#000000', '#2563EB']} />
                        </div>
                      </div>
                    </div>
                  )}

                  {logoPreview && (
                    <div className="flex items-center gap-4 p-3 bg-base-200/30 rounded-2xl border border-base-200/50 mt-2">
                      <div className="w-14 h-14 rounded-xl border border-base-200 overflow-hidden bg-white flex items-center justify-center shrink-0">
                        <img src={logoPreview} alt="Logo Preview" className="max-w-full max-h-full object-contain" />
                      </div>
                      <div className="flex-1">
                        <span className="text-xs font-bold text-neutral/80 block truncate">Overlay Applied</span>
                        <span className="text-[10px] text-success font-semibold flex items-center gap-1 mt-0.5">
                          <Check className="w-3.5 h-3.5" /> Auto-increased QR Error Correction to Level H (30%)
                        </span>
                        
                        {/* Logo size slider */}
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[10px] font-semibold text-neutral/50">Size Coefficient:</span>
                          <input 
                            type="range" 
                            min="0.2" 
                            max="0.45" 
                            step="0.05"
                            value={logoSize} 
                            onChange={(e) => setLogoSize(parseFloat(e.target.value))} 
                            className="range range-primary range-xs flex-1 max-w-[120px]" 
                          />
                          <span className="text-[10px] font-bold text-neutral/70">{Math.round(logoSize * 100)}%</span>
                        </div>
                      </div>
                      <button onClick={removeLogo} className="btn btn-ghost btn-sm text-error rounded-xl">
                        Remove
                      </button>
                    </div>
                  )}
                </div>

              </div>

            </div>

            {/* Canvas Preview Panel (Right 5 Cols) */}
            <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-6">
              
              {/* The Live Canvas Frame */}
              <div className="card glass-panel shadow-md rounded-3xl p-6 flex flex-col items-center gap-6 border-primary/20">
                <div className="w-full flex justify-between items-center pb-2 border-b border-base-200/60">
                  <span className="text-xs font-bold text-neutral/50 uppercase tracking-wider">Live Preview</span>
                  <div className="badge badge-primary gap-1 py-2 font-bold text-xs text-white">
                    <Sparkles className="w-3 h-3 animate-spin" /> Offline Mode
                  </div>
                </div>

                {/* QR Display Area */}
                <div className="bg-white p-4 rounded-3xl border border-base-200 shadow-inner flex items-center justify-center relative">
                  <div ref={qrRef} className="overflow-hidden rounded-2xl w-[280px] h-[280px] flex items-center justify-center" />
                </div>

                {/* Download formats */}
                <div className="w-full flex flex-col gap-3">
                  <span className="text-xs font-bold text-neutral/60">Download Vector / Asset</span>
                  <div className="grid grid-cols-3 gap-2">
                    <button 
                      onClick={() => downloadQr('png')} 
                      className="btn btn-sm rounded-xl bg-neutral text-white hover:bg-neutral/90 gap-1 text-xs border-none"
                    >
                      <Download className="w-3.5 h-3.5" /> PNG
                    </button>
                    <button 
                      onClick={() => downloadQr('svg')} 
                      className="btn btn-sm rounded-xl bg-neutral text-white hover:bg-neutral/90 gap-1 text-xs border-none"
                    >
                      <Download className="w-3.5 h-3.5" /> SVG
                    </button>
                    <button 
                      onClick={() => downloadQr('pdf')} 
                      className="btn btn-sm rounded-xl bg-neutral text-white hover:bg-neutral/90 gap-1 text-xs border-none"
                    >
                      <Download className="w-3.5 h-3.5" /> PDF
                    </button>
                  </div>
                </div>

                {/* Save QR Campaign to Browser Storage */}
                <button 
                  onClick={handleSaveQr} 
                  className="btn btn-primary text-white w-full rounded-2xl hover:bg-primary/95 text-sm gap-2 border-none shadow-sm"
                >
                  <ArrowRight className="w-4 h-4" />
                  Save to Local Gallery
                </button>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: GALLERY / HISTORY */}
        {activeTab === 'history' && (
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-neutral m-0">Local Campaign Gallery</h2>
                <p className="text-xs text-neutral/50 font-medium">Manage generated codes saved to your browser.</p>
              </div>
              <button 
                onClick={() => setActiveTab('editor')} 
                className="btn btn-primary btn-sm rounded-xl text-white border-none shadow-sm gap-1.5"
              >
                <Sparkles className="w-4 h-4" /> Create New
              </button>
            </div>

            {qrList.length === 0 ? (
              <div className="card border-2 border-dashed border-base-200 p-12 text-center rounded-3xl bg-base-100/50 flex flex-col items-center gap-3">
                <QrCode className="w-12 h-12 text-neutral/30 animate-pulse" />
                <span className="font-semibold text-sm text-neutral/60">No QR Campaigns Saved Yet</span>
                <p className="text-xs text-neutral/40 max-w-xs mt-1">Design a customized QR code in the Studio, then click "Save to Local Gallery" to store it in your browser.</p>
                <button onClick={() => setActiveTab('editor')} className="btn btn-sm btn-primary rounded-xl text-white border-none mt-2">
                  Launch Studio
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {qrList.map((qr) => {
                  return (
                    <div key={qr.id} className="card bg-white border border-base-200 shadow-sm hover:shadow-md rounded-3xl p-5 flex flex-col gap-4 transition-all">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-neutral m-0 truncate max-w-[180px]">{qr.name}</h3>
                          <span className="text-[10px] text-neutral/40 font-medium block mt-0.5">Created: {new Date(qr.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex gap-1.5">
                          <span className="badge badge-sm py-2 text-[10px] font-bold bg-primary text-white border-none capitalize">
                            {qr.type}
                          </span>
                        </div>
                      </div>

                      {/* Display targets / payloads */}
                      <div className="p-3 bg-base-200/30 rounded-2xl border border-base-200/50 flex flex-col gap-1">
                        <span className="text-[10px] font-semibold text-neutral/40 uppercase tracking-wider block">Target Payload</span>
                        <span className="text-xs font-semibold text-neutral/75 truncate mt-0.5">
                          {qr.type === 'url' ? qr.payload?.destUrl : 
                           qr.type === 'text' ? qr.payload?.text : 
                           qr.type === 'wifi' ? `SSID: ${qr.payload?.wifi?.ssid} (${qr.payload?.wifi?.encryption})` : 
                           qr.type === 'vcard' ? `vCard: ${qr.payload?.vcard?.name}` : 'Custom'}
                        </span>
                      </div>

                      {/* Interactions */}
                      <div className="flex items-center justify-end border-t border-base-100 pt-3 mt-1">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleLoadStyle(qr.styling_config)}
                            className="btn btn-ghost btn-sm rounded-xl text-neutral/70 flex gap-1 hover:bg-base-200"
                            title="Load styling into studio"
                          >
                            <Settings className="w-3.5 h-3.5" /> Design
                          </button>
                          <button 
                            onClick={() => handleDeleteQr(qr.id)}
                            className="btn btn-ghost btn-sm text-error rounded-xl hover:bg-error/10 hover:text-error"
                            title="Delete campaign"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: SCANNER / SCAN VERIFIER */}
        {activeTab === 'scanner' && (
          <div className="max-w-2xl mx-auto w-full flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-bold text-neutral m-0">Verify QR Scannability</h2>
              <p className="text-xs text-neutral/50 font-medium">Test contrast and alignment integrity before printing your codes.</p>
            </div>

            <div className="card bg-white border border-base-200 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* 1. File Upload Scanner */}
                <div className="p-4 bg-base-200/20 rounded-2xl border border-dashed border-base-300 flex flex-col items-center justify-center text-center gap-3 h-48">
                  <Upload className="w-8 h-8 text-neutral/40" />
                  <div>
                    <span className="text-xs font-bold text-neutral/80 block">Scan from Image File</span>
                    <span className="text-[10px] text-neutral/40 block mt-0.5">Upload a PNG/JPG QR image</span>
                  </div>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileScan}
                    className="file-input file-input-bordered file-input-primary file-input-xs w-full max-w-[180px] rounded-lg mt-1" 
                  />
                  {/* Temporary invisible div for html5-qrcode scanner files */}
                  <div id="reader-temp-file" className="hidden" />
                </div>

                {/* 2. Webcam live scanner */}
                <div className="p-4 bg-base-200/20 rounded-2xl border border-dashed border-base-300 flex flex-col items-center justify-center text-center gap-3 h-48">
                  <Camera className="w-8 h-8 text-neutral/40" />
                  <div>
                    <span className="text-xs font-bold text-neutral/80 block">Scan with Webcam</span>
                    <span className="text-[10px] text-neutral/40 block mt-0.5">Align QR within camera bounds</span>
                  </div>
                  {!cameraActive ? (
                    <button 
                      onClick={startCamera} 
                      className="btn btn-sm btn-primary text-white border-none rounded-xl mt-1 shadow-sm font-bold"
                    >
                      Start Camera
                    </button>
                  ) : (
                    <button 
                      onClick={stopCamera} 
                      className="btn btn-sm btn-error text-white border-none rounded-xl mt-1 shadow-sm font-bold"
                    >
                      Stop Camera
                    </button>
                  )}
                </div>

              </div>

              {/* Webcam viewbox container */}
              {cameraActive && (
                <div className="w-full max-w-sm mx-auto overflow-hidden rounded-2xl border border-base-200 shadow-md bg-black">
                  <div id="reader" className="w-full" />
                </div>
              )}

              {/* Scanned Decoded Payload Results Display */}
              {scanResult && (
                <div className="p-4 bg-primary/5 rounded-2xl border border-primary/20 flex flex-col gap-1.5 mt-2">
                  <span className="text-[10px] font-bold text-neutral/40 uppercase tracking-wider mb-1">Decoded Payload</span>
                  
                  {(() => {
                    if (scanResult.startsWith('upi://pay')) {
                      try {
                        const url = new URL(scanResult);
                        const pa = url.searchParams.get('pa');
                        const pn = url.searchParams.get('pn');
                        const am = url.searchParams.get('am');
                        
                        return (
                          <>
                            <div className="flex gap-2 items-start justify-between mt-1 mb-2">
                              <span className="text-sm font-bold text-neutral break-all select-all font-mono">
                                {scanResult}
                              </span>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-base-200 flex flex-col gap-2">
                            <div className="flex items-center gap-3 mb-1">
                              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100 shadow-sm">
                                <Banknote className="w-5 h-5" />
                              </div>
                              <div className="flex flex-col">
                                <h4 className="font-bold text-[14px] text-slate-800 m-0 leading-tight">UPI Payment Request</h4>
                                <span className="text-[11px] text-slate-500 font-medium">Bank-to-Bank Transfer</span>
                              </div>
                            </div>
                            
                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mt-1 flex flex-col gap-2">
                              {pn && (
                                <div className="flex justify-between items-center text-[12px]">
                                  <span className="text-slate-500 font-medium">Payee Name</span>
                                  <span className="font-semibold text-slate-700 text-right truncate max-w-[150px]">{decodeURIComponent(pn)}</span>
                                </div>
                              )}
                              {pa && (
                                <div className="flex justify-between items-center text-[12px]">
                                  <span className="text-slate-500 font-medium">UPI ID</span>
                                  <span className="font-semibold text-slate-700 text-right truncate max-w-[180px] font-mono">{pa}</span>
                                </div>
                              )}
                              {am && (
                                <div className="flex justify-between items-center text-[12px] pt-2.5 border-t border-slate-200/60 mt-0.5">
                                  <span className="text-slate-600 font-semibold">Amount</span>
                                  <span className="text-emerald-600 font-bold text-[15px]">₹{am}</span>
                                </div>
                              )}
                            </div>
                            
                            <a 
                              href={scanResult} 
                              className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-lg py-2.5 text-[13px] font-semibold flex items-center justify-center mt-1 transition-colors shadow-sm"
                            >
                              Pay Now on Mobile
                            </a>
                          </div>
                        </>
                        );
                      } catch (e) {
                        // fallback to raw if URL parsing fails
                      }
                    }
                    
                    return (
                      <div className="flex gap-2 items-start justify-between mt-1">
                        <span className="text-sm font-bold text-neutral break-all select-all font-mono">
                          {scanResult}
                        </span>
                        {scanResult.startsWith('http') && (
                          <a 
                            href={scanResult} 
                            target="_blank" 
                            rel="noreferrer"
                            className="btn btn-ghost btn-xs text-primary rounded-lg flex gap-1 font-semibold"
                          >
                            <Link2 className="w-3 h-3" /> Visit
                          </a>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}

            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="footer footer-center p-6 bg-base-100 border-t border-base-200 mt-auto text-xs text-neutral/40 font-medium">
        <div>
          <p>© {new Date().getFullYear()} CuteQR Studio.</p>
          <p className="mt-1">100% Offline Static Application. No data leaves your browser.</p>
          <button 
            className="mt-3 text-primary hover:underline hover:text-primary-focus font-bold transition-all"
            onClick={() => setShowAboutModal(true)}
          >
            About & Socials
          </button>
        </div>
      </footer>

      {/* About & Socials Modal */}
      <dialog className={`modal ${showAboutModal ? 'modal-open' : ''} bg-base-200/50 backdrop-blur-sm transition-all duration-300`}>
        <div className="modal-box bg-base-100 border border-base-200 shadow-2xl rounded-3xl max-w-md p-8 relative overflow-hidden">
          
          <button 
            onClick={() => setShowAboutModal(false)}
            className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 text-neutral/50 hover:bg-base-200"
          >
            ✕
          </button>

          <div className="flex flex-col items-center gap-4 text-center">
            
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white mb-2 shadow-lg">
              <span className="text-3xl font-bold">QR</span>
            </div>

            <div>
              <h3 className="font-extrabold text-2xl tracking-tight text-neutral">
                CuteQR Studio
              </h3>
              <p className="text-sm text-neutral/60 font-medium mt-1">
                Version 1.0.0 (Web)
              </p>
            </div>

            <p className="text-sm text-neutral/70 font-medium leading-relaxed bg-base-200 p-4 rounded-xl border border-base-300">
              CuteQR is a privacy-first, 100% offline static QR code generator. We believe your data belongs to you. Whether it's WiFi passwords, VCards, or UPI links, no data ever leaves your device or is sent to external servers.
            </p>

            <div className="w-full h-px bg-base-200 my-2"></div>

            <h4 className="font-bold text-neutral text-sm w-full text-left pl-1">Connect with us</h4>
            <div className="grid grid-cols-2 gap-3 w-full">
              <a href="https://github.com/4tboy" target="_blank" rel="noreferrer" className="btn btn-outline border-base-300 hover:bg-base-200 hover:text-neutral hover:border-base-300 shadow-sm rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                GitHub
              </a>
              <button onClick={() => { setShowAboutModal(false); setTimeout(() => setShowDonationModal(true), 150); }} className="btn btn-primary shadow-sm rounded-xl">
                <Heart className="w-4 h-4" />
                Donate
              </button>
            </div>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setShowAboutModal(false)}>close</button>
        </form>
      </dialog>

      {/* Donation Modal */}
      <dialog className={`modal ${showDonationModal ? 'modal-open' : ''} bg-base-200/50 backdrop-blur-sm transition-all duration-300`}>
        <div className="modal-box bg-base-100 border border-base-200 shadow-2xl rounded-3xl max-w-sm p-8 text-center relative overflow-hidden">
          
          {/* Close Button */}
          <button 
            onClick={() => setShowDonationModal(false)}
            className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 text-neutral/50 hover:bg-base-200"
          >
            ✕
          </button>

          <div className="flex flex-col items-center gap-6">
            
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <span className="text-3xl">🧋</span>
            </div>

            <div className="space-y-2">
              <h3 className="font-extrabold text-xl tracking-tight text-neutral">
                You just made an awesome QR code. Now scan ours! 📸
              </h3>
              <p className="text-sm text-neutral/60 font-medium leading-relaxed">
                Keeping things aesthetic takes a lot of late nights and iced coffees. If you love using CuteQR, chip in a few bucks to keep the servers running and the developers caffeinated. No pressure, just good vibes! ✨
              </p>
            </div>

            <div className="flex gap-4 items-center justify-center mt-2">
              <div className="w-32 h-[140px] bg-base-100 rounded-2xl flex flex-col items-center justify-start pt-3 pb-2 border border-base-200 shadow-xl overflow-hidden hover:scale-105 transition-transform cursor-pointer">
                <BeautifulQR 
                  data="upi://pay?pa=4tboy@upi&pn=CuteQR" 
                  color1="#ec4899" 
                  color2="#8b5cf6" 
                />
                <span className="text-[10px] font-bold text-neutral/60 uppercase tracking-widest mt-2">UPI</span>
              </div>
              <div className="w-32 h-[140px] bg-base-100 rounded-2xl flex flex-col items-center justify-start pt-3 pb-2 border border-base-200 shadow-xl overflow-hidden hover:scale-105 transition-transform cursor-pointer">
                <BeautifulQR 
                  data="https://www.paypal.com/paypalme/4tboy" 
                  color1="#3b82f6" 
                  color2="#0ea5e9" 
                />
                <span className="text-[10px] font-bold text-neutral/60 uppercase tracking-widest mt-2">PayPal</span>
              </div>
            </div>

            <div className="flex flex-col w-full gap-3 mt-4">
              <button 
                className={`btn rounded-xl font-bold w-full transition-all duration-300 h-auto py-3 ${karmaUnlocked ? 'btn-success text-success-content' : 'btn-primary shadow-lg shadow-primary/20 hover:scale-[1.02]'}`}
                onClick={() => {
                  if (!karmaUnlocked) {
                    window.open("https://www.paypal.com/paypalme/4tboy", "_blank");
                  }
                  setKarmaUnlocked(true);
                }}
              >
                {karmaUnlocked ? (
                  <div className="flex flex-col items-center justify-center leading-tight animate-in fade-in zoom-in duration-300">
                    <span className="flex items-center gap-2"><Heart className="w-4 h-4 fill-current" /> love you 3000 💖</span>
                    <span className="text-[11px] opacity-90 font-medium mt-0.5">you Unlocked Instant Good Karma.</span>
                  </div>
                ) : (
                  "Yes, donate it."
                )}
              </button>
              
              {!karmaUnlocked && (
                <button 
                  className="btn rounded-xl font-bold w-full transition-all duration-300 btn-ghost bg-base-200 hover:bg-base-300 text-neutral h-auto py-3"
                  onClick={() => setKarmaUnlocked(true)}
                >
                  I love this app
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Backdrop click to close */}
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setShowDonationModal(false)}>close</button>
        </form>
      </dialog>

    </div>
  );
}

// Algorithmic Art / Canvas Design QR Component
const BeautifulQR = ({ data, color1, color2 }) => {
  const ref = useRef(null);
  
  useEffect(() => {
    const qr = new QRCodeStyling({
      width: 96,
      height: 96,
      data: data,
      dotsOptions: {
        color: color1,
        type: "rounded",
        gradient: {
          type: "linear",
          rotation: Math.PI / 4,
          colorStops: [
            { offset: 0, color: color1 },
            { offset: 1, color: color2 }
          ]
        }
      },
      cornersSquareOptions: { type: "extra-rounded", color: color1 },
      cornersDotOptions: { type: "dot", color: color2 },
      backgroundOptions: { color: "transparent" }
    });
    
    if (ref.current) {
      ref.current.innerHTML = '';
      qr.append(ref.current);
    }
  }, [data, color1, color2]);

  return <div ref={ref} className="transition-all duration-300 pointer-events-none" />;
};
