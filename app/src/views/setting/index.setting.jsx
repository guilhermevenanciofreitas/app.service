import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Header, Content, Nav, Panel, Grid, Row, Col } from 'rsuite';
import { FaBuilding, FaUsers, FaBriefcase, FaDollarSign, FaChartLine, FaShoppingCart, FaUserTie, FaBox, FaClipboardList } from 'react-icons/fa';
import PageContent from '../../components/PageContent';
import { CustomBreadcrumb } from '../../controls';

const sections = {
  Geral: [
    //{ name: 'Empresa', icon: <FaBuilding />, path: '/settings/company' },
    { name: 'Usuários', icon: <FaUsers />, path: '/settings/users' },
    { name: 'Cargos', icon: <FaBriefcase />, path: '/settings/roles' }
  ],
  /*
  Finanças: [
    { name: 'Faturamento', icon: <FaDollarSign />, path: '/faturamento' },
    { name: 'Despesas', icon: <FaChartLine />, path: '/despesas' },
    { name: 'Impostos', icon: <FaUserTie />, path: '/impostos' }
  ],
  Vendas: [
    { name: 'Clientes', icon: <FaShoppingCart />, path: '/clientes' },
    { name: 'Produtos', icon: <FaBox />, path: '/produtos' },
    { name: 'Pedidos', icon: <FaClipboardList />, path: '/pedidos' }
  ]
  */
}

export function Setting() {
  const [activeTab, setActiveTab] = useState('Geral');

  return (
    <Panel header={<CustomBreadcrumb title={'Configurações'} />}>
      <PageContent>
        <Content style={{ padding: 20 }}>
          <Nav appearance="subtle" activeKey={activeTab} onSelect={setActiveTab}>
            {Object.keys(sections).map(key => (
              <Nav.Item eventKey={key} key={key}>
                <span style={{ fontSize: 18, fontWeight: 'bold', minWidth: 100, textAlign: 'center' }}>{key}</span>
              </Nav.Item>
            ))}
          </Nav>
          <Panel bordered style={{ padding: 5, borderRadius: 10, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
            <Grid fluid>
              <Row>
                {sections[activeTab].map(({ name, icon, path }) => (
                  <Col xs={24} key={name} style={{ padding: 10 }}>
                    <Link to={path} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <Panel bordered style={{ display: 'flex', alignItems: 'center', padding: 5, borderRadius: 10, cursor: 'pointer', transition: '0.2s', ':hover': { backgroundColor: '#f0f0f0' } }}>
                        <span style={{ fontSize: 20, marginRight: 30 }}>{icon}</span>
                        <span style={{ fontSize: 16 }}>{name}</span>
                      </Panel>
                    </Link>
                  </Col>
                ))}
              </Row>
            </Grid>
          </Panel>
        </Content>
      </PageContent>
    </Panel>
  );
}
