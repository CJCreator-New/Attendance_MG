import React, { useState, useEffect } from 'react';
import { Upload, Save } from 'lucide-react';

export const BrandingSettings = () => {
  const [branding, setBranding] = useState({
    companyName: '',
    logo: null,
    primaryColor: '#3b82f6',
    secondaryColor: '#10b981',
    accentColor: '#8b5cf6'
  });

  useEffect(() => {
    const saved = localStorage.getItem('branding');
    if (saved) setBranding(JSON.parse(saved));
  }, []);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBranding({...branding, logo: reader.result});
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    localStorage.setItem('branding', JSON.stringify(branding));
    document.documentElement.style.setProperty('--primary-color', branding.primaryColor);
    document.documentElement.style.setProperty('--secondary-color', branding.secondaryColor);
    alert('Branding settings saved successfully!');
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Branding Settings</h2>
      
      <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
        <div>
          <label className="block font-semibold mb-2 text-gray-700">Company Name</label>
          <input
            type="text"
            value={branding.companyName}
            onChange={(e) => setBranding({...branding, companyName: e.target.value})}
            placeholder="Enter your company name"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block font-semibold mb-2 text-gray-700">Company Logo</label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700">
              <Upload className="w-4 h-4" />
              Upload Logo
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            </label>
            {branding.logo && (
              <div className="border border-gray-300 rounded-lg p-2">
                <img src={branding.logo} alt="Logo" className="h-16 object-contain" />
              </div>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-2">Recommended: PNG or SVG, max 200KB</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-semibold mb-2 text-gray-700">Primary Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={branding.primaryColor}
                onChange={(e) => setBranding({...branding, primaryColor: e.target.value})}
                className="w-16 h-12 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={branding.primaryColor}
                onChange={(e) => setBranding({...branding, primaryColor: e.target.value})}
                className="flex-1 border border-gray-300 rounded px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2 text-gray-700">Secondary Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={branding.secondaryColor}
                onChange={(e) => setBranding({...branding, secondaryColor: e.target.value})}
                className="w-16 h-12 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={branding.secondaryColor}
                onChange={(e) => setBranding({...branding, secondaryColor: e.target.value})}
                className="flex-1 border border-gray-300 rounded px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2 text-gray-700">Accent Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={branding.accentColor}
                onChange={(e) => setBranding({...branding, accentColor: e.target.value})}
                className="w-16 h-12 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={branding.accentColor}
                onChange={(e) => setBranding({...branding, accentColor: e.target.value})}
                className="flex-1 border border-gray-300 rounded px-3 py-2"
              />
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="font-semibold mb-4 text-gray-700">Preview</h3>
          <div className="border border-gray-300 rounded-lg p-6" style={{ backgroundColor: branding.primaryColor + '10' }}>
            {branding.logo && <img src={branding.logo} alt="Logo" className="h-12 mb-4" />}
            <h4 className="text-2xl font-bold mb-2" style={{ color: branding.primaryColor }}>
              {branding.companyName || 'Your Company Name'}
            </h4>
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-lg text-white" style={{ backgroundColor: branding.primaryColor }}>
                Primary Button
              </button>
              <button className="px-4 py-2 rounded-lg text-white" style={{ backgroundColor: branding.secondaryColor }}>
                Secondary Button
              </button>
              <button className="px-4 py-2 rounded-lg text-white" style={{ backgroundColor: branding.accentColor }}>
                Accent Button
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold text-lg"
        >
          <Save className="w-5 h-5" />
          Save Branding Settings
        </button>
      </div>
    </div>
  );
};
