import React from 'react';
import { Modal, Button, Typography } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const SessionEndedModal = ({ visible, onOk }) => {
  return (
    <Modal
      visible={visible}
      closable={false}
      maskClosable={false}
      footer={[
        <Button key="submit" type="primary" onClick={onOk}>
          Volver a iniciar sesión
        </Button>
      ]}
      centered
    >
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <ClockCircleOutlined style={{ fontSize: '48px', color: '#ff4d4f', marginBottom: '16px' }} />
        <Title level={4}>Sesión expirada</Title>
        <Text>
          Tu sesión ha expirado por inactividad. Por favor, vuelve a iniciar sesión para continuar.
        </Text>
      </div>
    </Modal>
  );
};

export default SessionEndedModal;
