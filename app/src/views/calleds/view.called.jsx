import React from "react";
import { Button, Divider, Form, Loader, Message, Modal, toaster } from 'rsuite';
import { Container, Row, Col } from 'react-grid-system';
import { AutoComplete, ViewModal } from "../../controls";
import { MdCheckCircleOutline } from "react-icons/md";
import { Service } from "../../service";
import { Loading } from "../../App";

import dayjs from 'dayjs'

import _ from "lodash";
import { Search } from "../../search";
import { Exception } from "../../utils/exception";

export class ViewCalled extends React.Component {

    viewModal = React.createRef()

    new = async (called) => {
        this.clear()
        this.setState({...called})
        return this.viewModal.current.show()
    }

    edit = async (id) => {
        try {

            this.clear()

            Loading.Show()
            const result = await new Service().Post('called/detail', {id})
            this.setState({...result.data})

            return this.viewModal.current.show()

        } catch (error) {
            throw error
        } finally {
            Loading.Hide()
        }
    }

    clear = () => {
        if (this.state) for (const prop of Object.getOwnPropertyNames(this.state)) delete this.state[prop]
    }

    onSubmit = async () => {
        try {
            
            this.setState({submting: true})

            let called = _.pick(this.state, [
                'id',
                'company.id',
                'requested.id',
                'responsible.id',
                'reason.id',
                'occurrence.id',
                'priority',
                'step',
                'externalProtocol',
                'subject',
                'observation'
            ])

            const result = await new Service().Post('called/submit', called)

            this.viewModal.current?.close(result.data)

        } catch (error) {
            Exception.error(error)
        } finally {
            this.setState({submting: false})
        }
    }

    close(role) {
        this.viewModal.current?.close(role)
    }

    render = () => {
        
        return (
            <Form autoComplete='off' onSubmit={this.onSubmit}>
                <ViewModal ref={this.viewModal} size={1000}>
                    <Modal.Header><Modal.Title><Container>Chamado</Container></Modal.Title></Modal.Header>
                    <Modal.Body>
                        <Row gutterWidth={0}>
                            <Col md={2}>
                                <div className='form-control'>
                                    <label class="textfield-filled">
                                        <input type='text' value={this.state?.number} readOnly tabIndex={-1} />
                                        <span>Número</span>
                                    </label>
                                </div>
                            </Col>
                            <Col md={4}>
                                <div className='form-control'>
                                    <AutoComplete label='Filial' value={this.state?.company} text={(item) => `${item.surname}`} onChange={(company) => this.setState({company})} onSearch={async (search) => await Search.company(search)}>
                                        <AutoComplete.Result>
                                            {(item) => <span>{item.surname}</span>}
                                        </AutoComplete.Result>
                                    </AutoComplete>
                                </div>
                            </Col>
                            <Col md={2}>
                                <div className='form-control'>
                                    <label class="textfield-filled">
                                        <input type='text' value={dayjs(this.state?.createdAt).format('DD/MM/YYYY HH:mm')} readOnly tabIndex={-1} />
                                        <span>Abertura</span>
                                    </label>
                                </div>
                            </Col>
                            <Col md={4}>
                                <div className='form-control'>
                                    <label class="textfield-filled">
                                        <input type='text' value={this.state?.status?.description} readOnly tabIndex={-1} />
                                        <span>Status</span>
                                    </label>
                                </div>
                            </Col>
                            <Col md={4}>
                                <div className='form-control'>
                                    <AutoComplete label='Solicitante' value={this.state?.requested} text={(item) => `${item.cpfCnpj} - ${item.surname}`} onChange={(requested) => this.setState({requested})} onSearch={async (search) => await Search.partner(search)} autoFocus>
                                        <AutoComplete.Result>
                                            {(item) => <span>{item.cpfCnpj} - {item.surname}</span>}
                                        </AutoComplete.Result>
                                    </AutoComplete>
                                </div>
                            </Col>
                            <Col md={4}>
                                <div className='form-control'>
                                    <AutoComplete label='Motivo abertura' value={this.state?.reason} text={(item) => `${item.description}`} onChange={(reason) => this.setState({reason})} onSearch={async (search) => await Search.calledReason(search)}>
                                        <AutoComplete.Result>
                                            {(item) => <span>{item.description}</span>}
                                        </AutoComplete.Result>
                                    </AutoComplete>
                                </div>
                            </Col>
                            <Col md={4}>
                                <div className='form-control'>
                                    <AutoComplete label='Ocorrência' value={this.state?.occurrence} text={(item) => `${item.description}`} onChange={(occurrence) => this.setState({occurrence})} onSearch={async (search) => await Search.calledOccurrence(search)}>
                                        <AutoComplete.Result>
                                            {(item) => <span>{item.description}</span>}
                                        </AutoComplete.Result>
                                    </AutoComplete>
                                </div>
                            </Col>
                            <Col md={3}>
                                <div className='form-control'>
                                    <AutoComplete label='Responsável' value={this.state?.responsible} text={(item) => `${item.userName}`} onChange={(responsible) => this.setState({responsible})} onSearch={async (search) => await Search.user(search)}>
                                        <AutoComplete.Result>
                                            {(item) => <span>{item.userName}</span>}
                                        </AutoComplete.Result>
                                    </AutoComplete>
                                </div>
                            </Col>
                            <Col md={2}>
                                <div className='form-control'>
                                    <label className="textfield-filled">
                                        <select value={this.state?.priority} onChange={(event) => this.setState({ priority: event.target.value })}>
                                            <option value="">[Selecione]</option>
                                            <option value="1">Baixa</option>
                                            <option value="2">Normal</option>
                                            <option value="3">Alta</option>
                                        </select>
                                        <span>Prioridade</span>
                                    </label>
                                </div>
                            </Col>
                            <Col md={2}>
                                <div className='form-control'>
                                    <label className="textfield-filled">
                                        <select value={this.state?.step} onChange={(event) => this.setState({ step: event.target.value })}>
                                            <option value="">[Selecione]</option>
                                            <option value="0">0%</option>
                                            <option value="25">25%</option>
                                            <option value="50">50%</option>
                                            <option value="75">75%</option>
                                            <option value="100">100%</option>
                                        </select>
                                        <span>Andamento</span>
                                    </label>
                                </div>
                            </Col>
                            <Col md={2}>
                                <div className='form-control'>
                                    <label class="textfield-filled">
                                        <input type='text' value={dayjs(this.state?.previsionAt).format('DD/MM/YYYY HH:mm')} readOnly tabIndex={-1} />
                                        <span>Previsão</span>
                                    </label>
                                </div>
                            </Col>
                            <Col md={3}>
                                <div className='form-control'>
                                    <label class="textfield-filled">
                                        <input type='text' value={this.state?.externalProtocol} onChange={(event) => this.setState({ externalProtocol: event.target.value })} />
                                        <span>Protocolo externo</span>
                                    </label>
                                </div>
                            </Col>
                            <Divider />
                            <Col md={12}>
                                <div className='form-control'>
                                    <label className="textfield-filled">
                                        <input type='text' value={this.state?.subject} onChange={(event) => this.setState({subject: event.target.value.toUpperCase()})} />
                                        <span>Assunto</span>
                                    </label>
                                </div>
                            </Col>
                            <Col md={12}>
                                <div className='form-control'>
                                    <label className="textfield-filled">
                                        <textarea value={this.state?.observation} onChange={(event) => this.setState({observation: event.target.value})} rows={4} />
                                        <span>Observações</span>
                                    </label>
                                </div>
                            </Col>
                        </Row>
                        
                    </Modal.Body>
                    <Modal.Footer>
                        <Button appearance="primary" color='green' onClick={this.onSubmit} disabled={this.state?.submting}>{this.state?.submting ? <><Loader /> &nbsp; Salvando...</> : <><MdCheckCircleOutline /> &nbsp; Salvar</>}</Button>
                    </Modal.Footer>
                </ViewModal>
            </Form>
        )

    }

}