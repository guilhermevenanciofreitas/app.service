import React from 'react';
import { Nav } from 'rsuite';
import styled, { keyframes } from 'styled-components';

// Definindo a animação de pulsação
const pulse = keyframes`
  0% {
    transform: scale(0.4);
    box-shadow: 0 0 10px ${({ color }) => color};
  }
  50% {
    transform: scale(1);
    box-shadow: 0 0 10px ${({ color }) => color};
  }
  100% {
    transform: scale(0.4);
    box-shadow: 0 0 10px ${({ color }) => color};
  }
`;

// Estilizando a bolinha com animação
const StatusIndicator = styled.span`
  display: inline-block;
  width: 10px;
  height: 10px;
  background-color: ${props => props.color};
  border-radius: 50%;
  margin-right: 8px;
  box-shadow: 0 0 0 ${props => props.color};
  animation: ${pulse} 1.5s infinite;
`;

export class CustomNavItem extends React.Component {
  state = {
    request: {
      status: '',
      offset: 0,
    },
    response: {
      statusCount: {
        closed: 0,
      },
    },
  };

  onSearch = () => {
    // Função de busca
  };

  render() {
    return (
      <Nav.Item
        active={this.props.active}
        onClick={this.props.onClick}
      >
        <center style={{ width: 100 }}>
          <StatusIndicator color={this.props.color} />
          {this.props.text}
          <br />
          {this.props.loading
            ? '-'
            : new Intl.NumberFormat('pt-BR', { style: 'decimal' }).format(
                this.props.count
              ) ?? '-'}
        </center>
      </Nav.Item>
    );
  }
}