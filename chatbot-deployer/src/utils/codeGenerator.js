export const generateWebWidget = (chatbotData, webConfig) => {
  if (!chatbotData) return '';

  return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chatbot Widget</title>
    <style>
        #chatbot-container {
            position: fixed;
            ${webConfig.position.includes('bottom') ? 'bottom: 20px;' : 'top: 20px;'}
            ${webConfig.position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
            width: ${webConfig.width};
            height: ${webConfig.height};
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            overflow: hidden;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            transform-origin: ${webConfig.position.includes('bottom') ? 'bottom' : 'top'} ${webConfig.position.includes('right') ? 'right' : 'left'};
        }
        
        #chatbot-toggle {
            position: fixed;
            ${webConfig.position.includes('bottom') ? 'bottom: 20px;' : 'top: 20px;'}
            ${webConfig.position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
            width: 64px;
            height: 64px;
            background: linear-gradient(135deg, ${webConfig.primaryColor}, ${webConfig.primaryColor}dd);
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            z-index: 10001;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border: none;
        }
        
        #chatbot-toggle:hover {
            transform: scale(1.1);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        
        #chatbot-toggle.pulse {
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0%, 100% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.05);
            }
        }
        
        .chatbot-header {
            background: linear-gradient(135deg, ${webConfig.primaryColor}, ${webConfig.primaryColor}dd);
            color: white;
            padding: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .chatbot-messages {
            height: calc(100% - 140px);
            overflow-y: auto;
            padding: 20px;
            background: #fafafa;
        }
        
        .chatbot-messages::-webkit-scrollbar {
            width: 6px;
        }
        
        .chatbot-messages::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 3px;
        }
        
        .chatbot-messages::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 3px;
        }
        
        .chatbot-input {
            padding: 20px;
            border-top: 1px solid #e5e7eb;
            background: white;
        }
        
        .message {
            margin-bottom: 16px;
            animation: fadeInUp 0.3s ease-out;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .message.bot {
            display: flex;
            justify-content: flex-start;
        }
        
        .message.user {
            display: flex;
            justify-content: flex-end;
        }
        
        .message-content {
            max-width: 80%;
            padding: 12px 16px;
            border-radius: 18px;
            word-wrap: break-word;
            font-size: 14px;
            line-height: 1.4;
        }
        
        .message.bot .message-content {
            background: white;
            color: #374151;
            border: 1px solid #e5e7eb;
            border-bottom-left-radius: 4px;
        }
        
        .message.user .message-content {
            background: ${webConfig.primaryColor};
            color: white;
            border-bottom-right-radius: 4px;
        }
        
        .typing-indicator {
            display: flex;
            align-items: center;
            padding: 12px 16px;
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 18px;
            border-bottom-left-radius: 4px;
            max-width: 80px;
        }
        
        .typing-dot {
            width: 8px;
            height: 8px;
            background: #9ca3af;
            border-radius: 50%;
            margin: 0 2px;
            animation: typing 1.4s infinite ease-in-out;
        }
        
        .typing-dot:nth-child(1) { animation-delay: -0.32s; }
        .typing-dot:nth-child(2) { animation-delay: -0.16s; }
        
        @keyframes typing {
            0%, 80%, 100% {
                transform: scale(0.8);
                opacity: 0.5;
            }
            40% {
                transform: scale(1);
                opacity: 1;
            }
        }
        
        .option-button {
            display: block;
            width: 100%;
            padding: 12px 16px;
            margin: 8px 0;
            background: white;
            border: 2px solid ${webConfig.primaryColor}33;
            color: ${webConfig.primaryColor};
            border-radius: 12px;
            cursor: pointer;
            text-align: left;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            outline: none;
        }
        
        .option-button:hover {
            background: ${webConfig.primaryColor};
            color: white;
            border-color: ${webConfig.primaryColor};
            transform: translateY(-2px);
            box-shadow: 0 4px 12px ${webConfig.primaryColor}33;
        }
        
        .close-button {
            background: none;
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            transition: background-color 0.2s;
        }
        
        .close-button:hover {
            background: rgba(255, 255, 255, 0.2);
        }
        
        .restart-button {
            background: white;
            border: 2px solid ${webConfig.primaryColor};
            color: ${webConfig.primaryColor};
            padding: 8px 16px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s;
        }
        
        .restart-button:hover {
            background: ${webConfig.primaryColor};
            color: white;
        }
        
        .conversation-end {
            text-align: center;
            padding: 20px;
            color: #6b7280;
        }
    </style>
</head>
<body>
    <!-- Aquí irías el contenido de tu página web -->
    <div style="padding: 50px; color: #666;">
        <h1>Mi Página Web</h1>
        <p>Este es el contenido de mi página...</p>
    </div>

    <!-- Widget del Chatbot -->
    <div id="chatbot-widget">
        <button id="chatbot-toggle" class="pulse" onclick="toggleChatbot()">
            <svg width="28" height="28" fill="white" viewBox="0 0 24 24">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
            </svg>
        </button>

        <div id="chatbot-container" style="display: none;">
            <div class="chatbot-header">
                <h3 style="margin: 0; font-size: 18px; font-weight: 600;">${webConfig.title}</h3>
                <button class="close-button" onclick="toggleChatbot()">×</button>
            </div>
            
            <div class="chatbot-messages" id="chatbot-messages">
                <div class="message bot">
                    <div class="message-content">${webConfig.greeting}</div>
                </div>
            </div>
            
            <div class="chatbot-input">
                <div id="chatbot-options"></div>
            </div>
        </div>
    </div>

    <script>
        const chatbotData = ${JSON.stringify(chatbotData, null, 2)};
        
        let currentNodeId = 'start';
        let conversationHistory = [];
        let isTyping = false;
        
        function toggleChatbot() {
            const container = document.getElementById('chatbot-container');
            const toggle = document.getElementById('chatbot-toggle');
            
            if (container.style.display === 'none') {
                container.style.display = 'block';
                toggle.style.display = 'none';
                toggle.classList.remove('pulse');
                setTimeout(() => {
                    container.style.transform = 'scale(1)';
                    container.style.opacity = '1';
                }, 10);
                showCurrentNode();
            } else {
                container.style.transform = 'scale(0.8)';
                container.style.opacity = '0';
                setTimeout(() => {
                    container.style.display = 'none';
                    toggle.style.display = 'flex';
                }, 300);
            }
        }
        
        function showCurrentNode() {
            const currentNode = chatbotData.nodes.find(node => node.id === currentNodeId);
            if (!currentNode) return;
            
            const optionsContainer = document.getElementById('chatbot-options');
            optionsContainer.innerHTML = '';
            
            if (currentNode.type === 'start' || currentNode.type === 'question') {
                if (currentNode.data.options && currentNode.data.options.length > 0) {
                    currentNode.data.options.forEach((option, index) => {
                        const button = document.createElement('button');
                        button.className = 'option-button';
                        button.textContent = option;
                        button.onclick = () => selectOption(index, option);
                        optionsContainer.appendChild(button);
                    });
                }
            } else if (currentNode.type === 'message') {
                optionsContainer.innerHTML = \`
                    <div class="conversation-end">
                        <p style="margin-bottom: 16px; font-size: 14px;">Conversación finalizada</p>
                        <button class="restart-button" onclick="restartConversation()">
                            Iniciar nueva conversación
                        </button>
                    </div>
                \`;
            }
        }
        
        function selectOption(optionIndex, optionText) {
            if (isTyping) return;
            
            // Agregar respuesta del usuario
            addMessage(optionText, 'user');
            
            // Buscar conexión
            const connection = chatbotData.connections.find(conn => 
                conn.from === currentNodeId && conn.optionIndex === optionIndex
            );
            
            if (connection) {
                // Ocultar opciones
                document.getElementById('chatbot-options').innerHTML = '';
                
                // Mostrar indicador de escritura
                showTypingIndicator();
                
                setTimeout(() => {
                    hideTypingIndicator();
                    currentNodeId = connection.to;
                    const nextNode = chatbotData.nodes.find(node => node.id === currentNodeId);
                    
                    if (nextNode) {
                        addMessage(nextNode.data.message, 'bot');
                        setTimeout(() => {
                            showCurrentNode();
                        }, 300);
                    }
                }, 1000 + Math.random() * 1000); // Delay variable para simular procesamiento
            }
        }
        
        function addMessage(text, sender) {
            const messagesContainer = document.getElementById('chatbot-messages');
            const messageDiv = document.createElement('div');
            messageDiv.className = \`message \${sender}\`;
            
            const contentDiv = document.createElement('div');
            contentDiv.className = 'message-content';
            contentDiv.textContent = text;
            
            messageDiv.appendChild(contentDiv);
            messagesContainer.appendChild(messageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
        
        function showTypingIndicator() {
            if (isTyping) return;
            isTyping = true;
            
            const messagesContainer = document.getElementById('chatbot-messages');
            const typingDiv = document.createElement('div');
            typingDiv.className = 'message bot';
            typingDiv.id = 'typing-indicator';
            
            const indicatorDiv = document.createElement('div');
            indicatorDiv.className = 'typing-indicator';
            indicatorDiv.innerHTML = \`
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            \`;
            
            typingDiv.appendChild(indicatorDiv);
            messagesContainer.appendChild(typingDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
        
        function hideTypingIndicator() {
            const indicator = document.getElementById('typing-indicator');
            if (indicator) {
                indicator.remove();
            }
            isTyping = false;
        }
        
        function restartConversation() {
            currentNodeId = 'start';
            conversationHistory = [];
            
            const messagesContainer = document.getElementById('chatbot-messages');
            messagesContainer.innerHTML = \`
                <div class="message bot">
                    <div class="message-content">${webConfig.greeting}</div>
                </div>
            \`;
            
            // Mostrar mensaje inicial del nodo start si es diferente del saludo
            const startNode = chatbotData.nodes.find(node => node.id === 'start');
            if (startNode && startNode.data.message !== '${webConfig.greeting}') {
                setTimeout(() => {
                    addMessage(startNode.data.message, 'bot');
                    setTimeout(() => {
                        showCurrentNode();
                    }, 300);
                }, 500);
            } else {
                setTimeout(() => {
                    showCurrentNode();
                }, 500);
            }
        }
        
        // Inicializar cuando se carga la página
        document.addEventListener('DOMContentLoaded', function() {
            const startNode = chatbotData.nodes.find(node => node.id === 'start');
            if (startNode && startNode.data.message !== '${webConfig.greeting}') {
                setTimeout(() => {
                    addMessage(startNode.data.message, 'bot');
                    setTimeout(() => {
                        showCurrentNode();
                    }, 300);
                }, 1000);
            } else {
                showCurrentNode();
            }
        });
    </script>
</body>
</html>`;
};