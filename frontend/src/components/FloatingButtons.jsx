import React from 'react';
import { Button } from 'antd';
import { WhatsAppOutlined, SettingOutlined } from '@ant-design/icons';

const FloatingButtons = ({ onPreferencesClick }) => {
  const handleWhatsAppClick = () => {
    const phone = '+573202878212';
    const message = 'Me interesa adquirir sus productos doña luxy';
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div style={{ 
      position: 'fixed',
      bottom: '30px',
      right: '30px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      zIndex: 1000 
    }}>
      <Button
        type="primary"
        shape="circle"
        size="large"
        icon={<WhatsAppOutlined />}
        onClick={handleWhatsAppClick}
        style={{
          backgroundColor: '#25D366',
          borderColor: '#25D366',
          width: '60px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}
      />
      <Button
        type="primary"
        shape="circle"
        size="large"
        icon={<SettingOutlined />}
        onClick={onPreferencesClick}
        style={{
          width: '60px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}
      />
    </div>
  );
};

export default FloatingButtons;
