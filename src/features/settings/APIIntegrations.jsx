import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plug, Save, Key, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { useToastStore } from '../../stores/toastStore';

export const APIIntegrations = () => {
  const [integrations, setIntegrations] = useState([
    { id: 'smtp', name: 'Email (SMTP)', status: 'connected', config: { host: 'smtp.gmail.com', port: 587, user: 'admin@company.com' } },
    { id: 'sms', name: 'SMS Gateway', status: 'disconnected', config: { apiKey: '', sender: '' } },
    { id: 'slack', name: 'Slack', status: 'disconnected', config: { webhookUrl: '' } },
    { id: 'whatsapp', name: 'WhatsApp Business', status: 'disconnected', config: { apiKey: '', phoneId: '' } }
  ]);
  const showToast = useToastStore(state => state.addToast);

  const handleSave = () => {
    localStorage.setItem('apiIntegrations', JSON.stringify(integrations));
    showToast('API integrations saved', 'success');
  };

  const testConnection = (id) => {
    showToast(`Testing ${integrations.find(i => i.id === id).name} connection...`, 'info');
    setTimeout(() => {
      setIntegrations(integrations.map(i => 
        i.id === id ? { ...i, status: 'connected' } : i
      ));
      showToast('Connection successful', 'success');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-neutral-700 rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Plug className="w-5 h-5" />
          API Integrations
        </h3>

        <div className="space-y-4">
          {integrations.map((integration, idx) => (
            <motion.div
              key={integration.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="border border-gray-200 dark:border-neutral-600 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${integration.status === 'connected' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-800'} rounded-lg flex items-center justify-center`}>
                    {integration.status === 'connected' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{integration.name}</h4>
                    <p className={`text-sm ${integration.status === 'connected' ? 'text-green-600' : 'text-gray-600 dark:text-neutral-400'}`}>
                      {integration.status === 'connected' ? 'Connected' : 'Not Connected'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => testConnection(integration.id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Test
                </button>
              </div>

              <div className="space-y-3">
                {integration.id === 'smtp' && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">SMTP Host</label>
                        <input
                          type="text"
                          value={integration.config.host}
                          onChange={(e) => setIntegrations(integrations.map(i => 
                            i.id === integration.id ? { ...i, config: { ...i.config, host: e.target.value } } : i
                          ))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">Port</label>
                        <input
                          type="number"
                          value={integration.config.port}
                          onChange={(e) => setIntegrations(integrations.map(i => 
                            i.id === integration.id ? { ...i, config: { ...i.config, port: e.target.value } } : i
                          ))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">Username</label>
                      <input
                        type="email"
                        value={integration.config.user}
                        onChange={(e) => setIntegrations(integrations.map(i => 
                          i.id === integration.id ? { ...i, config: { ...i.config, user: e.target.value } } : i
                        ))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white text-sm"
                      />
                    </div>
                  </>
                )}

                {integration.id === 'sms' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1 flex items-center gap-2">
                        <Key className="w-4 h-4" />
                        API Key
                      </label>
                      <input
                        type="password"
                        placeholder="Enter API key"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">Sender ID</label>
                      <input
                        type="text"
                        placeholder="COMPANY"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white text-sm"
                      />
                    </div>
                  </>
                )}

                {integration.id === 'slack' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">Webhook URL</label>
                    <input
                      type="url"
                      placeholder="https://hooks.slack.com/services/..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                )}

                {integration.id === 'whatsapp' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1 flex items-center gap-2">
                        <Key className="w-4 h-4" />
                        API Key
                      </label>
                      <input
                        type="password"
                        placeholder="Enter WhatsApp Business API key"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">Phone Number ID</label>
                      <input
                        type="text"
                        placeholder="Enter phone number ID"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white text-sm"
                      />
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6"
      >
        <h4 className="font-medium text-blue-900 dark:text-blue-400 mb-2">🔐 Security Best Practices</h4>
        <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-300">
          <li>• Never share API keys publicly</li>
          <li>• Use environment variables for sensitive data</li>
          <li>• Rotate API keys regularly</li>
          <li>• Monitor API usage and set rate limits</li>
          <li>• Enable two-factor authentication where available</li>
        </ul>
      </motion.div>

      <div className="flex justify-end">
        <button onClick={handleSave} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Save className="w-4 h-4" />
          Save Integrations
        </button>
      </div>
    </div>
  );
};
