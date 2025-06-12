import { useState, useCallback } from 'react';

export const useChatbot = () => {
  const [chatbotData, setChatbotData] = useState(null);
  const [webConfig, setWebConfig] = useState({
    primaryColor: '#25D366',
    position: 'bottom-right',
    greeting: '¡Hola! ¿En qué puedo ayudarte?',
    title: 'Asistente Virtual',
    width: '350px',
    height: '500px'
  });
  const [whatsappConfig, setWhatsappConfig] = useState({
    phoneNumber: '',
    webhookUrl: '',
    accessToken: ''
  });
  const [activeTab, setActiveTab] = useState('upload');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadChatbotData = useCallback((data) => {
    try {
      // Validar estructura del JSON
      if (!data.nodes || !Array.isArray(data.nodes)) {
        throw new Error('El archivo debe contener un array de nodos');
      }
      if (!data.connections || !Array.isArray(data.connections)) {
        throw new Error('El archivo debe contener un array de conexiones');
      }
      
      const startNode = data.nodes.find(node => node.id === 'start');
      if (!startNode) {
        throw new Error('Debe existir un nodo con id "start"');
      }

      setChatbotData(data);
      setActiveTab('configure');
      setError(null);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, []);

  const updateWebConfig = useCallback((updates) => {
    setWebConfig(prev => ({ ...prev, ...updates }));
  }, []);

  const updateWhatsAppConfig = useCallback((updates) => {
    setWhatsappConfig(prev => ({ ...prev, ...updates }));
  }, []);

  const resetData = useCallback(() => {
    setChatbotData(null);
    setActiveTab('upload');
    setError(null);
  }, []);

  return {
    chatbotData,
    webConfig,
    whatsappConfig,
    activeTab,
    isLoading,
    error,
    setActiveTab,
    setIsLoading,
    loadChatbotData,
    updateWebConfig,
    updateWhatsAppConfig,
    resetData
  };
};