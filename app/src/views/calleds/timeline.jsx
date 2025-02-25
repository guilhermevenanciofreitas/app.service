import React, { Component } from "react";
import { Timeline, Panel, Tag, Loader, Button } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import { Search } from "../../search";
import { Col, Row } from "react-grid-system";
import { AutoComplete } from "../../controls";
import { FaCheckCircle } from "react-icons/fa";

const tickets = [
  { id: 1, user: "Alice", action: "Abriu um chamado", description: "Erro no sistema ao tentar fazer login.", time: "09:00 AM", type: "opened" },
  { id: 2, user: "Suporte", action: "Em análise", description: "Verificando o problema reportado.", time: "09:30 AM", type: "in_progress" },
  { id: 3, user: "Suporte", action: "Atualização", description: "Aplicamos um patch para corrigir o erro.", time: "10:00 AM", type: "updated" },
  { id: 4, user: "Alice", action: "Confirmado", description: "O problema foi resolvido, obrigado!", time: "10:30 AM", type: "resolved" },
];

const statusColors = {
  opened: "red",
  in_progress: "orange",
  updated: "blue",
  resolved: "green",
};

class TicketTimeline extends Component {
  constructor(props) {
    super(props);
    this.state = {
      responsible: ""
    };
  }

  handleResponsibleChange = (responsible) => {
    this.setState({ responsible });
  };

  render() {
    return (
        <>
            <Col md={6}>
                <div className='form-control'>
                    <AutoComplete label='Responsável' value={this.state.responsible} text={(item) => `${item.userMember.userName}`} onChange={this.handleResponsibleChange} onSearch={async (search) => await Search.user(search)} autoFocus>
                        <AutoComplete.Result>
                        {(item) => <span>{item.userMember.userName}</span>}
                        </AutoComplete.Result>
                    </AutoComplete>
                </div>
            </Col>
            <Col md={6}>
                <div className='form-control'>
                    <AutoComplete label='Status' value={this.state.responsible} text={(item) => `${item.userMember.userName}`} onChange={this.handleResponsibleChange} onSearch={async (search) => await Search.user(search)}>
                        <AutoComplete.Result>
                        {(item) => <span>{item.userMember.userName}</span>}
                        </AutoComplete.Result>
                    </AutoComplete>
                </div>
            </Col>
            <Col md={12}>
                <div className='form-control'>
                    <label className="textfield-filled">
                        <textarea rows="3" value={this.state?.detail} onChange={(event) => this.setState({ detail: event.target.value })} />
                        <span>Detalhe</span>
                    </label>
                </div>
            </Col>
            
            <div className='form-control'>
                <Button appearance="primary" color='green' onClick={this.submit} disabled={this.state?.submting}>{this.state?.submting ? <><Loader /> &nbsp; Confirmando...</> : <><FaCheckCircle /> &nbsp; Confirmar</>}</Button>
            </div>
           
            <Col md={12} style={{paddingTop: '30px'}}>
                <Panel bordered header="Histórico" style={{ width: '100%' }}>
                    <Timeline>
                        {tickets.map((ticket) => (
                            <Timeline.Item key={ticket.id}>
                            <Tag color={statusColors[ticket.type]}>{ticket.action}</Tag>
                            <div><strong>{ticket.user}:</strong> {ticket.description}</div>
                            <div style={{ fontSize: "0.8em", color: "gray" }}>{ticket.time}</div>
                            </Timeline.Item>
                        ))}
                    </Timeline>
                </Panel>
            </Col>
        </>
    );
  }
}

export default TicketTimeline;
