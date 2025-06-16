import React from 'react';

const SettingsPage: React.FC = () => (
    <div className="page-transition min-h-screen flex flex-col items-center justify-center p-8">
        <h1 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-blue-500">
            Personal Settings
        </h1>
        <div className="glass-effect p-8 rounded-xl max-w-3xl w-full">
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-medium mb-2">Profile Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Display Name</label>
                            <input type="text" className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white border border-gray-700 focus:border-indigo-500 focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Email</label>
                            <input type="email" className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white border border-gray-700 focus:border-indigo-500 focus:outline-none" />
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-medium mb-2">Preferences</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span>Dark Mode</span>
                            <div className="w-12 h-6 bg-indigo-600 rounded-full p-1 flex">
                                <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span>Email Notifications</span>
                            <div className="w-12 h-6 bg-gray-700 rounded-full p-1 flex">
                                <div className="w-4 h-4 bg-white rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-4">
                    <button className="px-6 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors duration-300 text-white font-medium">
                        Save Settings
                    </button>
                </div>
            </div>
        </div>
    </div>
);

export default SettingsPage;
