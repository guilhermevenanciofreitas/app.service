import { useState } from 'react';
import { Container, Header, Content, Nav, Panel, Grid, Row, Col } from 'rsuite';
import { FaBuilding, FaUsers, FaBriefcase, FaDollarSign, FaChartLine, FaShoppingCart, FaUserTie, FaBox, FaClipboardList } from 'react-icons/fa';

const sections = {
  Geral: [
    { name: 'Filial', icon: <FaBuilding /> },
    { name: 'Usuários', icon: <FaUsers /> },
    { name: 'Cargos', icon: <FaBriefcase /> }
  ],
  Finanças: [
    { name: 'Faturamento', icon: <FaDollarSign /> },
    { name: 'Despesas', icon: <FaChartLine /> },
    { name: 'Impostos', icon: <FaUserTie /> }
  ],
  Vendas: [
    { name: 'Clientes', icon: <FaShoppingCart /> },
    { name: 'Produtos', icon: <FaBox /> },
    { name: 'Pedidos', icon: <FaClipboardList /> }
  ]
};

export function Setting() {
  const [activeTab, setActiveTab] = useState('Geral');

  return (
    <Container>
      <Header style={{ padding: 20, fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}>Configurações</Header>
      <Content style={{ padding: 20 }}>
        <Nav appearance="subtle" activeKey={activeTab} onSelect={setActiveTab} justified>
          {Object.keys(sections).map(key => (
            <Nav.Item eventKey={key} key={key}>{key}</Nav.Item>
          ))}
        </Nav>
        <Panel bordered style={{ marginTop: 20, padding: 20, borderRadius: 10, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
          <Grid fluid>
            <Row>
              {sections[activeTab].map(({ name, icon }) => (
                <Col xs={24} key={name} style={{ padding: 10 }}>
                  <Panel bordered style={{ display: 'flex', alignItems: 'center', padding: 15, borderRadius: 10 }}>
                    <span style={{ fontSize: 24, marginRight: 30 }}>{icon}</span>
                    <span style={{ fontSize: 18, fontWeight: 'bold' }}>{name}</span>
                  </Panel>
                </Col>
              ))}
            </Row>
          </Grid>
        </Panel>
      </Content>
    </Container>
  );
}
