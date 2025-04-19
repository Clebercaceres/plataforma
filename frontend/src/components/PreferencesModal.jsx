import React, { useState, useEffect } from 'react';
import { Modal, Form, Select, Input, Button, Radio, Space, Typography } from 'antd';

const { Option } = Select;
const { Title } = Typography;

const GAMES = [
  { id: 'cod', name: 'Call of Duty Mobile' },
  { id: 'ff', name: 'Free Fire' }
];

const REGIONS = [
  { id: 'na', name: 'Región Norte América' },
  { id: 'br', name: 'Región Brasil' },
  { id: 'us', name: 'Región EEUU' },
  { id: 'eu', name: 'Región Europa' }
];

const PreferencesModal = ({ visible, onSave, onCancel, initialPreferences = null }) => {
  const [form] = Form.useForm();
  const [selectedGame, setSelectedGame] = useState(initialPreferences?.game || null);

  // Actualizar el formulario cuando cambien las preferencias iniciales
  useEffect(() => {
    if (visible && initialPreferences) {
      form.setFieldsValue({
        game: initialPreferences.game,
        gameId: initialPreferences.gameId,
        region: initialPreferences.region
      });
      setSelectedGame(initialPreferences.game);
    } else if (visible) {
      form.resetFields();
      setSelectedGame(null);
    }
  }, [visible, initialPreferences, form]);

  const handleSubmit = () => {
    form.validateFields().then(values => {
      onSave({
        game: values.game,
        gameId: values.gameId,
        region: values.region
      });
      form.resetFields();
    });
  };

  return (
    <Modal
      title="Selecciona tus preferencias"
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      okText="Guardar"
      cancelText="Cancelar"
      width="90%"
      style={{ maxWidth: '500px' }}
      maskClosable={false}
      keyboard={false}
      closable={false}
    >
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        {!initialPreferences ? (
          <>
            <Title level={4}>¡No has añadido tus preferencias!</Title>
            <p>Por favor, selecciona tu juego favorito y completa tu información.</p>
          </>
        ) : (
          <>
            <Title level={4}>Editar preferencias</Title>
            <p>Actualiza tu información de juego y región.</p>
          </>
        )}
      </div>

      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        initialValues={initialPreferences || {}}
        style={{ width: '100%' }}
      >
        <Form.Item
          name="game"
          label="Juego"
          rules={[{ required: true, message: 'Por favor selecciona un juego' }]}
          style={{ marginBottom: '24px' }}
        >
          <Radio.Group onChange={(e) => setSelectedGame(e.target.value)}>
            <Space direction="vertical">
              {GAMES.map(game => (
                <Radio key={game.id} value={game.id}>
                  {game.name}
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="gameId"
          label={`${selectedGame === 'ff' ? 'ID' : 'Nickname'} del juego`}
          rules={[{ required: true, message: 'Este campo es requerido' }]}
        >
          <Input placeholder={selectedGame === 'ff' ? 'Ingresa tu ID de Free Fire' : 'Ingresa tu Nickname de COD Mobile'} />
        </Form.Item>

        <Form.Item
          name="region"
          label="Región"
          rules={[{ required: true, message: 'Por favor selecciona una región' }]}
        >
          <Select 
            onChange={handleGameChange}
            size="large"
            style={{ width: '100%' }}
          >
            {REGIONS.map(region => (
              <Option key={region.id} value={region.id}>
                {region.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PreferencesModal;
