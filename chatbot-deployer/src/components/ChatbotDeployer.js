import React, { useRef, useState } from 'react';
import { Upload, Download, Code, MessageCircle, ExternalLink, Settings, Play, Copy, Check, X, RefreshCw } from 'lucide-react';
import { useChatbot } from '../hooks/useChatbot';
import { generateWebWidget } from '../utils/codeGenerator';

// Componente para la vista previa interactiva
const InteractivePreview = ({ chatbotData, webConfig }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentNodeId, setCurrentNodeId] = useState('start');
  const [conversationHistory, setConversationHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const getCurrentNode = () => {
    return chatbotData?.nodes?.find(node => node.id === currentNodeId);
  };

  const handleOptionSelect = (optionIndex, optionText) => {
    const currentNode = getCurrentNode();
    
    // Agregar mensaje del usuario al historial
    setConversationHistory(prev => [
      ...prev,
      { type: 'user', message: optionText }
    ]);

    // Buscar conexión
    const connection = chatbotData.connections?.find(conn => 
      conn.from === currentNodeId && conn.optionIndex === optionIndex
    );

    if (connection) {
      const nextNode = chatbotData.nodes?.find(node => node.id === connection.to);
      if (nextNode) {
        setIsTyping(true);
        // Simular delay de respuesta del bot
        setTimeout(() => {
          setIsTyping(false);
          setConversationHistory(prev => [
            ...prev,
            { type: 'bot', message: nextNode.data.message, node: nextNode }
          ]);
          setCurrentNodeId(connection.to);
        }, 800 + Math.random() * 1200);
      }
    }
  };

  const resetConversation = () => {
    setCurrentNodeId('start');
    setConversationHistory([]);
    setIsOpen(true);
    setIsTyping(false);
  };

  const currentNode = getCurrentNode();

  return (
    <div className="bg-white rounded-xl shadow-lg max-w-md mx-auto p-6 relative min-h-96 border">
      {/* Simulated webpage content */}
      <div className="text-gray-600 text-sm mb-4 flex items-center justify-between">
        <span className="font-medium">Mi Página Web</span>
        <button
          onClick={resetConversation}
          className="flex items-center gap-1 text-xs bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-md text-blue-600 transition-colors"
        >
          <RefreshCw size={12} />
          Reiniciar demo
        </button>
      </div>
      <div className="h-32 bg-gradient-to-br from-blue-50 via-gray-50 to-green-50 rounded-lg mb-4 flex items-center justify-center border-2 border-dashed border-gray-200">
        <span className="text-gray-400 text-sm">Contenido de la página</span>
      </div>
      <div className="space-y-2 mb-8">
        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
      </div>
      
      {/* Widget toggle button */}
      <div 
        className="absolute transition-all duration-300 ease-in-out"
        style={{
          [webConfig.position.includes('bottom') ? 'bottom' : 'top']: '20px',
          [webConfig.position.includes('right') ? 'right' : 'left']: '20px'
        }}
      >
        {!isOpen && (
          <button 
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg cursor-pointer transform hover:scale-110 transition-all duration-200 animate-pulse hover:animate-none"
            style={{ backgroundColor: webConfig.primaryColor }}
          >
            <MessageCircle size={24} className="text-white" />
          </button>
        )}
        
        {/* Chat widget */}
        {isOpen && (
          <div 
            className="bg-white rounded-2xl shadow-2xl border overflow-hidden transition-all duration-300 ease-in-out transform animate-fadeInUp"
            style={{ 
              width: '320px', 
              height: '480px'
            }}
          >
            {/* Header */}
            <div 
              className="p-4 text-white flex justify-between items-center"
              style={{ backgroundColor: webConfig.primaryColor }}
            >
              <h3 className="font-semibold text-sm">{webConfig.title}</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            
            {/* Messages area */}
            <div className="h-80 overflow-y-auto bg-gray-50 p-4 space-y-3 custom-scrollbar">
              {/* Initial greeting */}
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl rounded-bl-md px-4 py-2 max-w-xs shadow-sm border animate-fadeInUp">
                  <p className="text-sm text-gray-800">{webConfig.greeting}</p>
                </div>
              </div>
              
              {/* Start node message if different from greeting */}
              {currentNode && currentNode.data.message !== webConfig.greeting && conversationHistory.length === 0 && (
                <div className="flex justify-start">
                  <div className="bg-white rounded-2xl rounded-bl-md px-4 py-2 max-w-xs shadow-sm border animate-fadeInUp">
                    <p className="text-sm text-gray-800">{currentNode.data.message}</p>
                  </div>
                </div>
              )}
              
              {/* Conversation history */}
              {conversationHistory.map((item, index) => (
                <div key={index} className={`flex ${item.type === 'user' ? 'justify-end' : 'justify-start'} animate-fadeInUp`}>
                  <div 
                    className={`rounded-2xl px-4 py-2 max-w-xs shadow-sm ${
                      item.type === 'user' 
                        ? 'text-white rounded-br-md' 
                        : 'bg-white text-gray-800 border rounded-bl-md'
                    }`}
                    style={item.type === 'user' ? { backgroundColor: webConfig.primaryColor } : {}}
                  >
                    <p className="text-sm">{item.message}</p>
                  </div>
                </div>
              ))}
              
              {/* Typing indicator when bot is responding */}
              {isTyping && (
                <div className="flex justify-start animate-fadeInUp">
                  <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Options/Input area */}
            <div className="p-4 bg-white border-t">
              {!isTyping && currentNode && (currentNode.type === 'start' || currentNode.type === 'question') && currentNode.data.options && (
                <div className="space-y-2">
                  {currentNode.data.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleOptionSelect(index, option)}
                      className="w-full text-left p-3 border-2 border-gray-200 rounded-lg hover:shadow-md transition-all text-sm font-medium"
                      style={{ 
                        borderColor: webConfig.primaryColor + '40',
                        color: webConfig.primaryColor 
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = webConfig.primaryColor;
                        e.target.style.color = 'white';
                        e.target.style.borderColor = webConfig.primaryColor;
                        e.target.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.color = webConfig.primaryColor;
                        e.target.style.borderColor = webConfig.primaryColor + '40';
                        e.target.style.transform = 'translateY(0)';
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
              
              {!isTyping && currentNode && currentNode.type === 'message' && (
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-3">Conversación finalizada</p>
                  <button
                    onClick={resetConversation}
                    className="text-sm px-4 py-2 rounded-lg border-2 transition-all font-medium"
                    style={{ 
                      borderColor: webConfig.primaryColor,
                      color: webConfig.primaryColor 
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = webConfig.primaryColor;
                      e.target.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = webConfig.primaryColor;
                    }}
                  >
                    Iniciar nueva conversación
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ChatbotDeployer = () => {
  const {
    chatbotData,
    webConfig,
    whatsappConfig,
    activeTab,
    error,
    setActiveTab,
    loadChatbotData,
    updateWebConfig,
    updateWhatsAppConfig,
    resetData
  } = useChatbot();

  const [generatedCode, setGeneratedCode] = useState('');
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          loadChatbotData(data);
        } catch (error) {
          alert('Error al leer el archivo JSON: ' + error.message);
        }
      };
      reader.readAsText(file);
    } else {
      alert('Por favor selecciona un archivo JSON válido');
    }
  };

  const generateWebWidgetCode = () => {
    if (!chatbotData) return;
    const widgetCode = generateWebWidget(chatbotData, webConfig);
    setGeneratedCode(widgetCode);
    setActiveTab('deploy');
  };

  const downloadWidget = () => {
    const blob = new Blob([generatedCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chatbot-widget.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateWhatsAppInstructions = () => {
    return `# Integración del Chatbot con WhatsApp Business API

## 🚀 Configuración Rápida

### 1. Requisitos Previos
- Cuenta de WhatsApp Business
- Meta for Developers Account
- Servidor con HTTPS (Heroku, Vercel, Railway, etc.)
- Node.js instalado

### 2. Instalación del Servidor

\`\`\`bash
# Crear proyecto
mkdir whatsapp-chatbot
cd whatsapp-chatbot
npm init -y

# Instalar dependencias
npm install express cors dotenv
npm install -D nodemon
\`\`\`

### 3. Código del Servidor (app.js)

\`\`\`javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Datos del chatbot
const chatbotData = ${JSON.stringify(chatbotData, null, 2)};

// Estado de usuarios (en producción, usar base de datos)
const userStates = new Map();

// Verificación del webhook
app.get('/webhook', (req, res) => {
  const VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN;
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token === VERIFY_TOKEN) {
    console.log('Webhook verificado exitosamente');
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Procesamiento de mensajes
app.post('/webhook', (req, res) => {
  const body = req.body;

  if (body.object === 'whatsapp_business_account') {
    body.entry.forEach(entry => {
      const changes = entry.changes;
      changes.forEach(change => {
        if (change.field === 'messages') {
          const messages = change.value.messages;
          if (messages) {
            messages.forEach(message => {
              processMessage(message, change.value.metadata.phone_number_id);
            });
          }
        }
      });
    });
    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

// Lógica del chatbot
function processMessage(message, phoneNumberId) {
  const from = message.from;
  const messageBody = message.text?.body?.toLowerCase().trim();

  // Obtener estado actual del usuario
  let currentNodeId = userStates.get(from) || 'start';
  
  if (message.type === 'text') {
    const currentNode = chatbotData.nodes.find(node => node.id === currentNodeId);
    
    if (currentNode && (currentNode.type === 'start' || currentNode.type === 'question')) {
      // Buscar opción seleccionada por número o texto
      let optionIndex = -1;
      
      // Verificar si es un número
      const optionNumber = parseInt(messageBody);
      if (!isNaN(optionNumber) && optionNumber > 0 && optionNumber <= currentNode.data.options.length) {
        optionIndex = optionNumber - 1;
      } else {
        // Buscar por texto similar
        optionIndex = currentNode.data.options.findIndex(option => 
          option.toLowerCase().includes(messageBody) ||
          messageBody.includes(option.toLowerCase())
        );
      }
      
      if (optionIndex !== -1) {
        // Encontrar conexión
        const connection = chatbotData.connections.find(conn => 
          conn.from === currentNodeId && conn.optionIndex === optionIndex
        );
        
        if (connection) {
          const nextNode = chatbotData.nodes.find(node => node.id === connection.to);
          if (nextNode) {
            // Enviar respuesta
            sendMessage(from, nextNode.data.message, phoneNumberId);
            
            // Actualizar estado del usuario
            userStates.set(from, connection.to);
            
            // Si el siguiente nodo tiene opciones, enviarlas
            if (nextNode.type === 'start' || nextNode.type === 'question') {
              setTimeout(() => {
                sendOptions(from, nextNode.data.options, phoneNumberId);
              }, 1000);
            }
          }
        }
      } else {
        // Opción no válida, reenviar opciones
        sendMessage(from, "Por favor, selecciona una de las opciones disponibles:", phoneNumberId);
        setTimeout(() => {
          sendOptions(from, currentNode.data.options, phoneNumberId);
        }, 500);
      }
    } else {
      // Reiniciar conversación
      sendMessage(from, "¡Hola! Iniciemos una nueva conversación.", phoneNumberId);
      userStates.set(from, 'start');
      const startNode = chatbotData.nodes.find(node => node.id === 'start');
      setTimeout(() => {
        sendMessage(from, startNode.data.message, phoneNumberId);
        setTimeout(() => {
          sendOptions(from, startNode.data.options, phoneNumberId);
        }, 1000);
      }, 1000);
    }
  }
}

function sendMessage(to, message, phoneNumberId) {
  const url = \`https://graph.facebook.com/v18.0/\${phoneNumberId}/messages\`;
  
  fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${process.env.WHATSAPP_TOKEN}\`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: to,
      text: { body: message }
    })
  }).catch(console.error);
}

function sendOptions(to, options, phoneNumberId) {
  const optionsText = options.map((option, index) => 
    \`\${index + 1}. \${option}\`
  ).join('\\n');
  
  sendMessage(to, optionsText, phoneNumberId);
}

// Endpoint de salud
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`Servidor ejecutándose en puerto \${PORT}\`);
});
\`\`\`

### 4. Variables de Entorno (.env)

\`\`\`env
WHATSAPP_TOKEN=${whatsappConfig.accessToken || 'tu_token_de_acceso_aqui'}
WEBHOOK_VERIFY_TOKEN=${whatsappConfig.accessToken || 'tu_token_de_verificacion_aqui'}
PHONE_NUMBER_ID=${whatsappConfig.phoneNumber || 'tu_phone_number_id_aqui'}
PORT=3000
\`\`\`

### 5. Scripts de package.json

\`\`\`json
{
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js"
  }
}
\`\`\`

### 6. Despliegue

#### Opción A: Railway
\`\`\`bash
# Instalar Railway CLI
npm install -g @railway/cli

# Hacer login
railway login

# Inicializar proyecto
railway init

# Desplegar
railway up
\`\`\`

#### Opción B: Heroku
\`\`\`bash
# Instalar Heroku CLI
# Crear Procfile
echo "web: node app.js" > Procfile

# Desplegar
heroku create tu-chatbot-whatsapp
git push heroku main
\`\`\`

### 7. Configuración en Meta for Developers

1. Ve a [developers.facebook.com](https://developers.facebook.com)
2. Crea una aplicación → Añade WhatsApp
3. En Configuration:
   - Webhook URL: \`https://tu-servidor.com/webhook\`
   - Verify Token: el mismo de tu .env
4. Suscríbete a: \`messages\`

### 8. Pruebas

1. Envía un mensaje a tu número de WhatsApp Business
2. Revisa los logs del servidor
3. Verifica que el webhook reciba los mensajes

### 9. Producción

Para producción, considera:
- Base de datos para estados de usuario (Redis/MongoDB)
- Rate limiting
- Logging estructurado
- Monitoreo de salud
- Backup de conversaciones

### 10. Troubleshooting

**Error común: Webhook no verifica**
- Verifica que el VERIFY_TOKEN coincida
- Asegúrate que el servidor esté en HTTPS
- Revisa los logs del servidor

**Error: Token expirado**
- Renueva el token en Meta for Developers
- Actualiza la variable de entorno

**Mensajes no llegan**
- Verifica el Phone Number ID
- Asegúrate que el webhook esté activo
- Revisa los permisos de la aplicación
`;
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Navigation Tabs */}
      <div className="mb-8">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl w-fit">
          {[
            { id: 'upload', label: 'Cargar JSON', icon: Upload },
            { id: 'configure', label: 'Configurar', icon: Settings },
            { id: 'deploy', label: 'Implementar', icon: Code }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              disabled={id !== 'upload' && !chatbotData}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 disabled:text-gray-400 disabled:cursor-not-allowed'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Content based on active tab */}
      {activeTab === 'upload' && (
        <div className="bg-white rounded-xl shadow-sm border p-8">
          <div className="text-center max-w-md mx-auto">
            <div className="mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Upload className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Cargar archivo JSON del chatbot
              </h3>
              <p className="text-gray-600 mb-6">
                Selecciona el archivo JSON exportado desde el constructor de chatbots
              </p>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-4 rounded-xl hover:shadow-lg transition-all flex items-center gap-3 mx-auto font-medium"
            >
              <Upload size={20} />
              Seleccionar archivo JSON
            </button>
            
            {chatbotData && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                <p className="text-green-800 font-medium flex items-center justify-center gap-2">
                  <Check size={16} />
                  Archivo cargado correctamente
                </p>
                <p className="text-green-600 text-sm mt-1">
                  {chatbotData.nodes?.length || 0} nodos • {chatbotData.connections?.length || 0} conexiones
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'configure' && chatbotData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Web Widget Configuration */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Code className="text-blue-600" size={16} />
              </div>
              Configuración Widget Web
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título del chatbot
                </label>
                <input
                  type="text"
                  value={webConfig.title}
                  onChange={(e) => updateWebConfig({ title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensaje de saludo
                </label>
                <textarea
                  value={webConfig.greeting}
                  onChange={(e) => updateWebConfig({ greeting: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color principal
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={webConfig.primaryColor}
                    onChange={(e) => updateWebConfig({ primaryColor: e.target.value })}
                    className="w-12 h-12 rounded-lg border border-gray-300"
                  />
                  <input
                    type="text"
                    value={webConfig.primaryColor}
                    onChange={(e) => updateWebConfig({ primaryColor: e.target.value })}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Posición en la página
                </label>
                <select
                  value={webConfig.position}
                  onChange={(e) => updateWebConfig({ position: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="bottom-right">Abajo derecha</option>
                  <option value="bottom-left">Abajo izquierda</option>
                  <option value="top-right">Arriba derecha</option>
                  <option value="top-left">Arriba izquierda</option>
                </select>
              </div>
            </div>
            
            <button
              onClick={generateWebWidgetCode}
              className="w-full mt-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2 font-medium"
            >
              <Code size={16} />
              Generar código del widget
            </button>
          </div>

          {/* WhatsApp Configuration */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <MessageCircle className="text-green-600" size={16} />
              </div>
              Configuración WhatsApp
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number ID
                </label>
                <input
                  type="text"
                  value={whatsappConfig.phoneNumber}
                  onChange={(e) => updateWhatsAppConfig({ phoneNumber: e.target.value })}
                  placeholder="123456789012345"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Access Token
                </label>
                <input
                  type="password"
                  value={whatsappConfig.accessToken}
                  onChange={(e) => updateWhatsAppConfig({ accessToken: e.target.value })}
                  placeholder="Tu token de acceso de WhatsApp"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL del Webhook
                </label>
                <input
                  type="url"
                  value={whatsappConfig.webhookUrl}
                  onChange={(e) => updateWhatsAppConfig({ webhookUrl: e.target.value })}
                  placeholder="https://tu-servidor.com/webhook"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-amber-800 text-sm">
                <strong>Nota:</strong> La integración con WhatsApp requiere configuración adicional en Meta for Developers y un servidor con HTTPS.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'deploy' && (
        <div className="space-y-8">
          {/* Interactive Preview */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Play className="text-purple-600" size={16} />
              </div>
              Vista Previa Interactiva del Widget
            </h3>
            
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 bg-gray-50">
              <div className="text-center text-gray-500 mb-4">
                Simulación funcional - ¡Prueba la interacción!
              </div>
              
              <InteractivePreview 
                chatbotData={chatbotData}
                webConfig={webConfig}
              />
            </div>
          </div>

          {/* Web Widget Code */}
          {generatedCode && (
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Code className="text-blue-600" size={16} />
                  </div>
                  Código del Widget Web
                </h3>
                <div className="flex gap-3">
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                    {copied ? 'Copiado' : 'Copiar'}
                  </button>
                  <button
                    onClick={downloadWidget}
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Download size={16} />
                    Descargar HTML
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-900 rounded-xl p-6 overflow-x-auto max-h-96 custom-scrollbar">
                <pre className="text-green-400 text-sm">
                  <code>{generatedCode}</code>
                </pre>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-3">📋 Instrucciones de uso:</h4>
                <ol className="text-blue-800 text-sm space-y-2">
                  <li>1. Copia el código HTML generado arriba</li>
                  <li>2. Pégalo antes del cierre de la etiqueta &lt;/body&gt; en tu página web</li>
                  <li>3. El widget aparecerá como un botón flotante en la posición configurada</li>
                  <li>4. ¡Listo! Tu chatbot estará funcionando en tu sitio web</li>
                </ol>
              </div>
            </div>
          )}

          {/* WhatsApp Integration Guide */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <MessageCircle className="text-green-600" size={16} />
              </div>
              Guía de Integración WhatsApp
            </h3>
            
            <div className="bg-gray-900 rounded-xl p-6 overflow-x-auto max-h-96 custom-scrollbar">
              <pre className="text-green-400 text-sm whitespace-pre-wrap">
                <code>{generateWhatsAppInstructions()}</code>
              </pre>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-900 mb-3">✅ Incluido en la guía:</h4>
                <ul className="text-green-800 text-sm space-y-1">
                  <li>• Código Node.js completo y funcional</li>
                  <li>• Configuración de webhooks</li>
                  <li>• Variables de entorno</li>
                  <li>• Instrucciones de despliegue (Railway, Heroku)</li>
                  <li>• Configuración Meta for Developers</li>
                  <li>• Troubleshooting común</li>
                </ul>
              </div>
              
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <h4 className="font-medium text-amber-900 mb-3">⚠️ Requisitos adicionales:</h4>
                <ul className="text-amber-800 text-sm space-y-1">
                  <li>• Cuenta Meta for Developers</li>
                  <li>• WhatsApp Business API</li>
                  <li>• Servidor con HTTPS</li>
                  <li>• Base de datos para producción</li>
                  <li>• Verificación de número de WhatsApp</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="https://developers.facebook.com/docs/whatsapp"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <ExternalLink size={16} />
                Documentación WhatsApp API
              </a>
              <a
                href="https://developers.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ExternalLink size={16} />
                Meta for Developers
              </a>
              <button
                onClick={() => {
                  const instructions = generateWhatsAppInstructions();
                  const blob = new Blob([instructions], { type: 'text/markdown' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'whatsapp-integration-guide.md';
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Download size={16} />
                Descargar guía completa
              </button>
            </div>
          </div>

          {/* Success Message */}
          {generatedCode && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <Check size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-green-900 font-semibold text-lg">¡Chatbot listo para implementar! 🎉</h3>
                  <p className="text-green-700 text-sm mt-1">
                    Tu chatbot ha sido configurado exitosamente. El widget web está listo para usar inmediatamente, 
                    y tienes la guía completa para integrar con WhatsApp Business API.
                  </p>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/60 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">🌐 Widget Web</h4>
                  <p className="text-sm text-gray-700">Listo para implementar en cualquier página web</p>
                </div>
                <div className="bg-white/60 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">📱 WhatsApp</h4>
                  <p className="text-sm text-gray-700">Guía completa para integración profesional</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Chatbot Data Summary */}
      {chatbotData && (
        <div className="mt-12 bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Información del Chatbot Cargado
            </h3>
            <button
              onClick={resetData}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <RefreshCw size={16} />
              Cargar nuevo chatbot
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
              <div className="text-2xl font-bold text-blue-600">
                {chatbotData.nodes?.length || 0}
              </div>
              <div className="text-blue-700 text-sm font-medium">Nodos totales</div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4">
              <div className="text-2xl font-bold text-green-600">
                {chatbotData.connections?.length || 0}
              </div>
              <div className="text-green-700 text-sm font-medium">Conexiones</div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4">
              <div className="text-2xl font-bold text-purple-600">
                {chatbotData.nodes?.filter(n => n.type === 'question' || n.type === 'start').length || 0}
              </div>
              <div className="text-purple-700 text-sm font-medium">Nodos interactivos</div>
            </div>
            
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-4">
              <div className="text-2xl font-bold text-amber-600">
                {chatbotData.nodes?.filter(n => n.type === 'message').length || 0}
              </div>
              <div className="text-amber-700 text-sm font-medium">Mensajes finales</div>
            </div>
          </div>
          
          {chatbotData.metadata && (
            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <h4 className="font-medium text-gray-900 mb-3">📋 Metadatos:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                {chatbotData.metadata.name && (
                  <div>
                    <strong className="text-gray-700">Nombre:</strong> {chatbotData.metadata.name}
                  </div>
                )}
                {chatbotData.metadata.created && (
                  <div>
                    <strong className="text-gray-700">Creado:</strong> {new Date(chatbotData.metadata.created).toLocaleString()}
                  </div>
                )}
                {chatbotData.metadata.version && (
                  <div>
                    <strong className="text-gray-700">Versión:</strong> {chatbotData.metadata.version}
                  </div>
                )}
                {chatbotData.metadata.description && (
                  <div className="md:col-span-2">
                    <strong className="text-gray-700">Descripción:</strong> {chatbotData.metadata.description}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatbotDeployer;