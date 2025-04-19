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
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (!parsedUser._id) {
          console.error('Usuario sin ID encontrado');
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
        console.error('Error al parsear userData:', error);
      }
    }
  }, []);

  // Mostrar modal de preferencias si no hay preferencias
  useEffect(() => {
    if (!userPreferences) {
      setShowPreferencesModal(true);
    }
  }, [userPreferences]);

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

  const handleSessionEndedOk = () => {
    setShowSessionEndedModal(false);
    onLogout();
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
          <Content style={{ padding: '0 50px' }}>
            {/* Banner */}
            <div style={{
              height: '200px',
              background: 'linear-gradient(135deg, #1890ff 0%, #722ed1 100%)',
              margin: '16px 0',
              padding: '20px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <div style={{ textAlign: 'center' }}>
                <Title level={2} style={{ color: 'white', margin: 0 }}>¡Recarga tus Diamantes!</Title>
                <p style={{ fontSize: '18px' }}>Los mejores precios para tus juegos favoritos</p>
              </div>
            </div>

            {/* Game Cards */}
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
          </Content>
        );
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header 
        style={{ 
          background: '#fff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          position: 'sticky',
          top: 0,
          zIndex: 1000
        }}
      >
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '0 50px',
          height: '100%'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className="logo" style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              marginRight: '20px',
              color: '#1890ff'
            }}>
              X
            </div>
            {userPreferences && (
              <div style={{ 
                fontSize: '16px', 
                color: '#666',
                background: '#f5f5f5',
                padding: '0px 12px',
                borderRadius: '4px'
              }}>
                {GAME_NAMES[userPreferences.game]}
              </div>
            )}
          </div>

          <Menu 
            mode="horizontal" 
            selectedKeys={[currentPage]}
            onClick={({ key }) => setCurrentPage(key)}
            style={{
              border: 'none',
              flex: '1',
              justifyContent: 'center',
              marginLeft: '40px',
              marginRight: '40px'
            }}
          >
            <Menu.Item key="home">Inicio</Menu.Item>
            <Menu.Item key="products">Productos</Menu.Item>
            <Menu.Item key="contact">Contacto</Menu.Item>
          </Menu>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {userPreferences && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#f5f5f5',
                padding: '0px 12px',
                borderRadius: '4px',
                color: '#666'
              }}>
                <span>{userPreferences.gameId}</span>
                <span style={{ color: '#d9d9d9' }}>|</span>
                <span>{REGION_NAMES[userPreferences.region]}</span>
              </div>
            )}
            {userPreferences && (
              <Button type="primary" onClick={onLogout} ghost>
                Cerrar sesión
              </Button>
            )}
          </div>
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
