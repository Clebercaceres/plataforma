import React from 'react';
import { Layout, Menu, Card, Row, Col, Button, Typography } from 'antd';
import { ShoppingCartOutlined, CrownOutlined, DollarOutlined } from '@ant-design/icons';

const { Header, Content } = Layout;
const { Title } = Typography;

const gameCards = [
  {
    id: 1,
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
    id: 2,
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
  return (
    <Layout className="layout">
      <Header style={{ background: '#fff', padding: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 50px' }}>
          <div className="logo" style={{ fontSize: '24px', fontWeight: 'bold' }}>X</div>
          <Menu mode="horizontal" defaultSelectedKeys={['1']}>
            <Menu.Item key="1">Inicio</Menu.Item>
            <Menu.Item key="2">Productos</Menu.Item>
            <Menu.Item key="3">Contacto</Menu.Item>
          </Menu>
        </div>
      </Header>

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
                {game.prices.map((price, index) => (
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
                          height: '150px'
                        }}>
                          <CrownOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
                        </div>
                      }
                    >
                      <Card.Meta
                        title={`${price.diamonds || price.cp} ${price.diamonds ? 'Diamantes' : 'CP'}`}
                        description={`$${price.price} USD`}
                      />
                      <Button
                        type="primary"
                        icon={<ShoppingCartOutlined />}
                        style={{ marginTop: '16px', width: '100%' }}
                      >
                        Comprar
                      </Button>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          ))}
        </div>
      </Content>
    </Layout>
  );
};

export default Dashboard;
