import React, { useEffect, useState } from 'react';
import { Layout, Menu, Card, Row, Col, Button, Typography, message, Tag } from 'antd';
import { ShoppingCartOutlined, CrownOutlined, DollarOutlined } from '@ant-design/icons';
import axios from 'axios';
import SessionEndedModal from './SessionEndedModal';
import PreferencesModal from './PreferencesModal';
import ProductsPage from './ProductsPage';
import ContactPage from './ContactPage';
import WhatsAppButton from './WhatsAppButton';
import FloatingButtons from './FloatingButtons';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

// Estilos responsivos
const headerStyle = {
  position: 'sticky',
  top: 0,
  zIndex: 1,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 16px',
  background: '#fff',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
};

const contentStyle = {
  padding: '24px',
  minHeight: '280px',
  maxWidth: '1200px',
  margin: '0 auto',
  width: '100%'
};

const logoStyle = {
  height: '40px',
  marginRight: '16px'
};

const menuContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  '@media (max-width: 768px)': {
    flexDirection: 'column',
    alignItems: 'flex-end'
  }
};

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutos en milisegundos

const GAME_NAMES = {
  'cod': 'Call of Duty Mobile',
  'ff': 'Free Fire'
};

const REGION_NAMES = {
  'na': 'Región Norte América',
  'br': 'Región Brasil',
  'us': 'Región EEUU',
  'eu': 'Región Europa'
};

const gameCards = [
  {
    id: 'ff',
    game: "Free Fire",
    prices: [
      { diamonds: 100, price: 5 },
      { diamonds: 310, price: 10 },
      { diamonds: 520, price: 15 },
      { diamonds: 1060, price: 25 }
    ],
    image: "free-fire.jpg"
  },
  {
    id: 'cod',
    game: "Call of Duty Mobile",
    prices: [
      { cp: 80, price: 5 },
      { cp: 400, price: 10 },
      { cp: 800, price: 15 },
      { cp: 2000, price: 25 }
    ],
    image: "cod-mobile.jpg"
  }
];

const Dashboard = () => {
  const [showSessionEndedModal, setShowSessionEndedModal] = useState(false);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [sessionTimer, setSessionTimer] = useState(null);
  const [userPreferences, setUserPreferences] = useState(null);
  const [hasFirstPurchase, setHasFirstPurchase] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [products, setProducts] = useState([]);
  const [userData, setUserData] = useState(null);

  // Cargar datos del usuario al inicio
  useEffect(() => {
    const storedUser = localStorage.getItem('userData');
    const sessionData = localStorage.getItem('sessionData');

    // Si no hay datos de usuario o sesión, redirigir al inicio
    if (!storedUser || !sessionData) {
      window.location.href = '/';
      return;
    }

    try {
      // Verificar si la sesión está activa
      const { loginTime } = JSON.parse(sessionData);
      const sessionAge = new Date().getTime() - new Date(loginTime).getTime();
      
      if (sessionAge >= SESSION_TIMEOUT) {
        // Si la sesión expiró, limpiar datos y redirigir
        localStorage.removeItem('userData');
        localStorage.removeItem('sessionData');
        window.location.href = '/';
        return;
      }

      // Cargar datos del usuario
      const parsedUser = JSON.parse(storedUser);
      if (!parsedUser._id) {
        console.error('Usuario sin ID encontrado');
        window.location.href = '/';
        return;
      }
      
      setUserData(parsedUser);

      // Si hay preferencias guardadas, cargarlas
      if (parsedUser.preferences) {
        setUserPreferences(parsedUser.preferences);
      }

      // Verificar si el usuario ya ha realizado su primera compra
      setHasFirstPurchase(parsedUser.hasFirstPurchase || false);

      // Verificar si las preferencias existen en el backend
      axios.get(`${import.meta.env.VITE_API_URL}/api/auth/preferences/${parsedUser._id}`)
        .then(response => {
          if (response.data.preferences) {
            setUserPreferences(response.data.preferences);
          }
        })
        .catch(error => {
          console.error('Error al cargar preferencias:', error);
        });
    } catch (error) {
      console.error('Error al cargar datos:', error);
      window.location.href = '/';
    }
  }, []);

  // Mostrar modal de preferencias solo si el usuario no tiene preferencias guardadas
  useEffect(() => {
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (!parsedUser.preferences) {
        setShowPreferencesModal(true);
      }
    }
  }, []);

  // Configurar el temporizador de sesión
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSessionEndedModal(true);
    }, SESSION_TIMEOUT);

    setSessionTimer(timer);

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, []);

  const handleLogout = () => {
    // Limpiar datos de usuario y sesión
    localStorage.removeItem('userData');
    localStorage.removeItem('sessionData');
    
    // Redirigir a la página de inicio
    window.location.href = '/';
  };

  const handleSessionEndedOk = () => {
    setShowSessionEndedModal(false);
    handleLogout();
  };

  const handlePreferencesSave = async (preferences) => {
    try {
      const storedUser = localStorage.getItem('userData');
      if (!storedUser) {
        throw new Error('Usuario no encontrado');
      }

      const parsedUser = JSON.parse(storedUser);
      if (!parsedUser._id) {
        throw new Error('ID de usuario no encontrado');
      }

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/auth/preferences/${parsedUser._id}`,
        preferences
      );

      if (response.data.success) {
        // Actualizar las preferencias localmente
        setUserPreferences(preferences);
        
        // Actualizar el userData en localStorage
        const updatedUser = {
          ...parsedUser,
          preferences: preferences
        };
        localStorage.setItem('userData', JSON.stringify(updatedUser));
        setUserData(updatedUser);
        
        setShowPreferencesModal(false);
        
        if (!hasFirstPurchase) {
          message.success('¡Preferencias guardadas! Disfruta de un 80% de descuento en tu primera compra.');
        } else {
          message.success('¡Preferencias actualizadas correctamente!');
        }
        
        // Recargar productos si estamos en la página de productos
        if (currentPage === 'products' && preferences.game) {
          const productsResponse = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/products/${preferences.game}`
          );
          setProducts(productsResponse.data);
        }
      }
    } catch (error) {
      console.error('Error al actualizar preferencias:', error);
      message.error(error.message || 'Error al actualizar las preferencias');
    }
  };

  const handlePurchase = async (product, hasDiscount) => {
    try {
      if (!userPreferences) {
        message.error('Por favor, configura tus preferencias antes de comprar');
        return;
      }

      const orderData = {
        userId: userData._id,
        game: userPreferences.game,
        gameId: userPreferences.gameId,
        productId: product.id,
        productName: product.name || `${product.diamonds || product.cp} ${product.diamonds ? 'Diamantes' : 'CP'}`,
        quantity: 1,
        price: hasDiscount ? (product.price * 0.2) : product.price,
        originalPrice: product.price,
        hasDiscount,
        paymentMethod: 'card' // Por defecto, podríamos agregar selección de método de pago después
      };

      // Crear la orden
      const orderResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/orders`,
        orderData
      );

      if (orderResponse.data.success) {
        if (hasDiscount) {
          setHasFirstPurchase(true);
          message.success('¡Compra realizada con éxito! Los precios se han actualizado.');
        } else {
          message.success('¡Compra realizada con éxito!');
        }
      }
    } catch (error) {
      console.error('Error al procesar la compra:', error);
      message.error('Error al procesar la compra');
    }
  };

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/1234567890', '_blank');
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'products':
        return (
          <ProductsPage 
            userPreferences={userPreferences} 
            hasFirstPurchase={hasFirstPurchase}
            products={products}
          />
        );
      case 'contact':
        return <ContactPage />;
      default:
        return (
          <Content style={contentStyle}>
            {currentPage === 'home' && (
              <div style={{ width: '100%' }}>
                <div style={{
                  height: '200px',
                  background: 'linear-gradient(135deg, #1890ff 0%, #722ed1 100%)',
                  margin: '16px 0',
                  padding: '20px',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: 'white'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <Title level={2} style={{ color: 'white', margin: 0 }}>¡Recarga tus Diamantes!</Title>
                    <p style={{ fontSize: '18px' }}>Los mejores precios para tus juegos favoritos</p>
                  </div>
                </div>
                <Row gutter={[16, 16]} justify="center">
                  <Col xs={24} sm={12} md={8} lg={6}>
                    <Card
                      hoverable
                      cover={<img alt="productos" src="/products.jpg" style={{ objectFit: 'cover', height: '200px' }} />}
                      onClick={() => setCurrentPage('products')}
                      style={{ height: '100%' }}
                    >
                      <Card.Meta
                        title="Productos"
                        description="Explora nuestra selección de productos"
                      />
                    </Card>
                  </Col>
                </Row>
              </div>
            )}
            {currentPage === 'home' && (
              <div style={{ padding: '24px 0' }}>
                {gameCards.map(game => (
                  <div key={game.id} style={{ marginBottom: '24px' }}>
                    <Title level={3}>{game.game}</Title>
                    <Row gutter={[16, 16]}>
                      {game.prices.map((price, index) => {
                        const isCurrentGame = userPreferences?.game === game.id;
                        const showDiscountForCard = !hasFirstPurchase && isCurrentGame;
                        const discountedPrice = showDiscountForCard ? (price.price * 0.2).toFixed(2) : price.price;

                        return (
                          <Col xs={24} sm={12} md={6} key={index}>
                            <Card
                              hoverable
                              style={{ textAlign: 'center' }}
                              cover={
                                <div style={{
                                  padding: '20px',
                                  background: '#f0f2f5',
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  height: '150px',
                                  position: 'relative'
                                }}>
                                  <CrownOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
                                  {showDiscountForCard && (
                                    <Tag color="#f50" style={{
                                      position: 'absolute',
                                      top: '10px',
                                      right: '10px',
                                      fontSize: '16px',
                                      padding: '4px 8px'
                                    }}>
                                      HOT SALE 80% DCTO
                                    </Tag>
                                  )}
                                </div>
                              }
                            >
                              <Card.Meta
                                title={`${price.diamonds || price.cp} ${price.diamonds ? 'Diamantes' : 'CP'}`}
                                description={
                                  <div>
                                    {showDiscountForCard ? (
                                      <>
                                        <Text delete style={{ color: '#999' }}>${price.price} USD</Text>
                                        <br />
                                        <Text style={{ color: '#52c41a', fontSize: '16px', fontWeight: 'bold' }}>
                                          Ahora: ${discountedPrice} USD
                                        </Text>
                                      </>
                                    ) : (
                                      <Text>${price.price} USD</Text>
                                    )}
                                  </div>
                                }
                              />
                              <Button
                                type="primary"
                                icon={<ShoppingCartOutlined />}
                                style={{ marginTop: '16px', width: '100%' }}
                                onClick={() => handlePurchase(price, showDiscountForCard)}
                              >
                                Comprar
                              </Button>
                            </Card>
                          </Col>
                        );
                      })}
                    </Row>
                  </div>
                ))}
              </div>
            )}
          </Content>
        );
    }
  };

  const contentStyle = {
    padding: '0 50px'
  };

  const headerStyle = {
    background: '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000
  };

  const logoStyle = {
    width: '40px',
    height: '40px',
    marginRight: '20px'
  };

  const menuContainerStyle = {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    justifyContent: 'flex-end'
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/logo.png" alt="Logo" style={logoStyle} />
          <Title level={4} style={{ margin: 0, '@media (max-width: 768px)': { fontSize: '18px' } }}>Mi Plataforma</Title>
        </div>
        <div style={menuContainerStyle}>
          {userPreferences && (
            <div style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
              justifyContent: 'flex-end'
            }}>
              <Tag color="blue">{GAME_NAMES[userPreferences.game]}</Tag>
              <Tag color="green">{REGION_NAMES[userPreferences.region]}</Tag>
            </div>
          )}
          {userPreferences && (
            <Button 
              type="primary" 
              onClick={handleLogout} 
              ghost
              style={{
                '@media (max-width: 768px)': {
                  width: '100%'
                }
              }}
            >
              Cerrar sesión
            </Button>
          )}
        </div>
      </Header>

      {renderContent()}

      <FloatingButtons onPreferencesClick={() => setShowPreferencesModal(true)} />

      <SessionEndedModal
        visible={showSessionEndedModal}
        onOk={handleSessionEndedOk}
      />

      <PreferencesModal
        visible={showPreferencesModal}
        onCancel={() => setShowPreferencesModal(false)}
        onSave={handlePreferencesSave}
        initialPreferences={userPreferences}
      />
    </Layout>
  );
};

export default Dashboard;
