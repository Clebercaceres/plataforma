import React from 'react';
import { Button } from 'antd';
import { WhatsAppOutlined } from '@ant-design/icons';

const WhatsAppButton = ({ floating = false }) => {
  const handleWhatsAppClick = () => {
    const phone = '+573202878212';
    const message = 'Me interesa adquirir sus productos doña luxy';
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (floating) {
    return (
      <Button
        type="primary"
        shape="circle"
        size="large"
        icon={<WhatsAppOutlined />}
        onClick={handleWhatsAppClick}
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          backgroundColor: '#25D366',
          borderColor: '#25D366',
          width: '60px',
          height: '60px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 1000
        }}
      />
    );
  }

  return (
    <Button
      type="primary"
      icon={<WhatsAppOutlined />}
      onClick={handleWhatsAppClick}
      size="large"
      style={{
        backgroundColor: '#25D366',
        borderColor: '#25D366'
      }}
    >
      Contáctanos por WhatsApp
    </Button>
  );
};

export default WhatsAppButton;
