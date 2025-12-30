import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/Chatbot.css';

const Chatbot = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const greetings = {
    en: "Hello! How can I help you today?",
    am: "ሰላም! ዛሬ እንዴት ልርዳዎ?"
  };

  const responses = {
    en: {
      hello: "Hi there! Welcome to Ke Geberew. How can I assist you?",
      products: "You can browse our products page to see available agricultural products.",
      register: "To register, click on the 'Get Started' button and fill in your details.",
      contact: "You can contact us through our Contact page or call +251 11 123 4567",
      default: "I'm here to help! You can ask about products, registration, or contact information."
    },
    am: {
      hello: "ሰላም! ወደ ከ ገበሬው እንኳን ደህና መጡ። እንዴት ልርዳዎ?",
      products: "ያሉትን የግብርና ምርቶች ለመመልከት የምርቶች ገፃችንን ማሰስ ይችላሉ።",
      register: "ለመመዝገብ፣ በ 'ይጀምሩ' ቁልፍ ላይ ጠቅ ያድርጉ እና ዝርዝሮችዎን ይሙሉ።",
      contact: "በእውቂያ ገፃችን ወይም በስልክ +251 11 123 4567 ማገናኘት ይችላሉ",
      default: "ለመርዳት እዚህ ነኝ! ስለ ምርቶች፣ ምዝገባ ወይም የእውቂያ መረጃ መጠየቅ ይችላሉ።"
    }
  };

  const handleSend = () => {
    if (inputValue.trim() === '') return;

    const userMessage = {
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);

    // Simple bot response logic
    setTimeout(() => {
      const botResponse = getBotResponse(inputValue.toLowerCase());
      const botMessage = {
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 500);

    setInputValue('');
  };

  const getBotResponse = (input) => {
    const lang = i18n.language;
    const langResponses = responses[lang] || responses.en;

    if (input.includes('hello') || input.includes('hi') || input.includes('ሰላም')) {
      return langResponses.hello;
    } else if (input.includes('product') || input.includes('ምርት')) {
      return langResponses.products;
    } else if (input.includes('register') || input.includes('መዝገብ')) {
      return langResponses.register;
    } else if (input.includes('contact') || input.includes('እውቂያ')) {
      return langResponses.contact;
    } else {
      return langResponses.default;
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen && messages.length === 0) {
      // Add greeting message when first opened
      const greeting = {
        text: greetings[i18n.language] || greetings.en,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages([greeting]);
    }
  };

  return (
    <div className="chatbot">
      <button className="chatbot-toggle" onClick={toggleChat}>
        {isOpen ? '✕' : '💬'}
      </button>

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>{t('chatbot.title')}</h3>
          </div>

          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
              >
                <p>{message.text}</p>
                <span className="message-time">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>

          <div className="chatbot-input">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={t('chatbot.placeholder')}
            />
            <button onClick={handleSend}>{t('chatbot.send')}</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
