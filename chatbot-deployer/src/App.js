import React from 'react';
import { MessageCircle } from 'lucide-react';
import ChatbotDeployer from './components/ChatbotDeployer';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl">
                <MessageCircle className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Chatbot Deployer
                </h1>
                <p className="text-sm text-gray-500">
                  Convierte tus chatbots en widgets web y WhatsApp
                </p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              Lista para implementar
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <ChatbotDeployer />
      
      {/* Footer */}
      <div className="bg-white/50 backdrop-blur-sm border-t mt-12">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center text-gray-600">
            <p className="text-sm">
              Powered by <span className="font-semibold text-green-600">Chatbot Deployer</span> 
              {' '}- Hecho con ❤️ para desarrolladores
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;