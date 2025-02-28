import React from "react";
import { Button, Form, Loader, Message, Modal, toaster } from 'rsuite';
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
        const Authorization = JSON.parse(localStorage.getItem("Authorization"))
        if (this.state) for (const prop of Object.getOwnPropertyNames(this.state)) delete this.state[prop]
        this.setState({...called, company: Authorization.company})
        return this.viewModal.current.show()
    }

    edit = async (id) => {
        try {

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
                'subject',
                'detail'
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
                            <Col md={5}>
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
                            <Col md={3}>
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
                            <Col md={3}>
                                <div className='form-control'>
                                    <AutoComplete label='Motivo' value={this.state?.reason} text={(item) => `${item.description}`} onChange={(reason) => this.setState({reason})} onSearch={async (search) => await Search.calledReason(search)}>
                                        <AutoComplete.Result>
                                            {(item) => <span>{item.description}</span>}
                                        </AutoComplete.Result>
                                    </AutoComplete>
                                </div>
                            </Col>
                            <Col md={3}>
                                <div className='form-control'>
                                    <AutoComplete label='Ocorrência' value={this.state?.occurrence} text={(item) => `${item.description}`} onChange={(occurrence) => this.setState({occurrence})} onSearch={async (search) => await Search.calledOccurrence(search)}>
                                        <AutoComplete.Result>
                                            {(item) => <span>{item.description}</span>}
                                        </AutoComplete.Result>
                                    </AutoComplete>
                                </div>
                            </Col>
                            <Col md={2}>
                                <div className='form-control'>
                                    <label class="textfield-filled">
                                        <input type='text' value={dayjs(this.state?.prevision).format('DD/MM/YYYY HH:mm')} readOnly tabIndex={-1} />
                                        <span>Previsão</span>
                                    </label>
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
                            <Col md={12}>
                                <div className='form-control'>
                                    <label className="textfield-filled">
                                        <input type='text' value={this.state?.subject} onChange={(event) => this.setState({subject: event.target.value.toUpperCase()})} />
                                        <span>Assunto</span>
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