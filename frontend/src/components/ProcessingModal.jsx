import React from 'react';
import { Modal, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const ProcessingModal = ({ visible }) => {
  const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;

  return (
    <Modal
      title="Procesando"
      open={visible}
      footer={null}
      closable={false}
      centered
    >
      <div style={{ 
        textAlign: 'center', 
        padding: '30px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px'
      }}>
        <Spin indicator={antIcon} />
        <p style={{ 
          fontSize: '16px',
          margin: 0
        }}>
          Verificando información...
        </p>
      </div>
    </Modal>
  );
};

export default ProcessingModal;
