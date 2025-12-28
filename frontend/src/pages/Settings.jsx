import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';

const Settings = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
        <SettingsIcon size={24} className="mr-3 text-slate-600" /> Hesap Ayarları
      </h1>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-8 shadow-sm max-w-2xl">
        <p className="text-slate-600 dark:text-slate-300 mb-4">
          Buradan hesap ayarlarınızı güncelleyebilirsiniz.
        </p>
        
        <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-200">
          Bu özellik henüz yapım aşamasındadır. Yakında eklenecektir.
        </div>
      </div>
    </div>
  );
};

export default Settings;
