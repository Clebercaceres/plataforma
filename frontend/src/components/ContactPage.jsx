import React from 'react';
import { Typography, Row, Col, Card } from 'antd';
import WhatsAppButton from './WhatsAppButton';

const { Title, Paragraph } = Typography;

const ContactPage = () => {
    return (
        <div style={{ padding: '24px' }}>
            <Row justify="center">
                <Col xs={24} sm={20} md={16} lg={12}>
                    <Card>
                        <Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }}>
                            Contáctanos
                        </Title>

                        <Paragraph style={{ fontSize: '16px', textAlign: 'center', marginBottom: '32px' }}>
                            Estamos aquí para ayudarte con tus compras de diamantes y CP.
                            Contáctanos a través de WhatsApp para una atención personalizada.
                        </Paragraph>

                        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                            <WhatsAppButton />
                        </div>

                        <Paragraph style={{ textAlign: 'center', color: '#666' }}>
                            Horario de atención: Lunes a Domingo, 24/7
                        </Paragraph>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ContactPage;
