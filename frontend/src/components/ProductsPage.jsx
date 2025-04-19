import React, { useState, useEffect } from 'react';
import { Layout, Typography, Card, Row, Col, Select, Button, Tag, message } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const CATEGORIES = {
  'diamonds': 'Diamantes',
  'accounts': 'Cuentas',
  'weapons': 'Armas',
  'outfits': 'Trajes',
  'special': 'Objetos Especiales'
};

const ProductsPage = ({ userPreferences, hasFirstPurchase }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [userPreferences]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/products/${userPreferences.game}`
      );
      setProducts(response.data);
      setFilteredProducts(response.data);
      setLoading(false);
    } catch (error) {
      message.error('Error al cargar los productos');
      setLoading(false);
    }
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    if (value === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(product => product.category === value));
    }
  };

  const calculateDiscountedPrice = (price) => {
    return !hasFirstPurchase ? (price * 0.2).toFixed(2) : price;
  };

  return (
    <Content style={{ padding: '50px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '30px'
        }}>
          <Title level={2}>
            Productos para {userPreferences.game === 'ff' ? 'Free Fire' : 'Call of Duty Mobile'}
          </Title>
          <Select
            style={{ width: 200 }}
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <Option value="all">Todos los productos</Option>
            {Object.entries(CATEGORIES).map(([key, value]) => (
              <Option key={key} value={key}>{value}</Option>
            ))}
          </Select>
        </div>

        <Row gutter={[24, 24]}>
          {filteredProducts.map(product => (
            <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
              <Card
                hoverable
                cover={
                  <div style={{
                    height: 200,
                    background: '#f0f2f5',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative'
                  }}>
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                    />
                    {!hasFirstPurchase && (
                      <Tag color="#f50" style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        fontSize: '14px'
                      }}>
                        80% DCTO
                      </Tag>
                    )}
                  </div>
                }
              >
                <Card.Meta
                  title={product.name}
                  description={
                    <div>
                      <Tag color="blue">{CATEGORIES[product.category]}</Tag>
                      <div style={{ marginTop: '10px' }}>
                        {!hasFirstPurchase ? (
                          <>
                            <Text delete style={{ color: '#999' }}>${product.price} USD</Text>
                            <br />
                            <Text style={{ color: '#52c41a', fontSize: '16px', fontWeight: 'bold' }}>
                              ${calculateDiscountedPrice(product.price)} USD
                            </Text>
                          </>
                        ) : (
                          <Text>${product.price} USD</Text>
                        )}
                      </div>
                    </div>
                  }
                />
                <Button
                  type="primary"
                  icon={<ShoppingCartOutlined />}
                  style={{ width: '100%', marginTop: '16px' }}
                >
                  Comprar
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </Content>
  );
};

export default ProductsPage;
