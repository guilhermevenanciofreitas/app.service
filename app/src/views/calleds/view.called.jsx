import React from "react";
import { Button, Form, Loader, Message, Modal, toaster } from 'rsuite';
import { Container, Row, Col } from 'react-grid-system';
import { AutoComplete, ViewModal } from "../../controls";
import { MdCheckCircleOutline } from "react-icons/md";
import { Service } from "../../service";
import { Loading } from "../../App";

import _ from "lodash";
import { Search } from "../../search";
import { Exception } from "../../utils/exception";

export class ViewCalled extends React.Component {

    viewModal = React.createRef()

    new = async (called) => {
        if (this.state) for (const prop of Object.getOwnPropertyNames(this.state)) delete this.state[prop]
        this.setState({...called})
        return this.viewModal.current.show()
    }

    edit = async (id) => {
        Loading.Show();
        await new Service().Post('called/detail', {id}).then((result) => this.setState({...result.data})).finally(() => Loading.Hide());
        return this.viewModal.current.show()
    }

    submit = async () => {
        try {
            this.setState({submting: true})

            let called = _.pick(this.state, [
                'id',
                'responsible.id',
                'reason.id',
                'occurrence.id',
                'subject',
                'detail'
            ])

            const result = await new Service().Post('called/submit', called)

            await toaster.push(<Message showIcon type='success'>Salvo com sucesso!</Message>, {placement: 'topEnd', duration: 5000 })
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
            <Form autoComplete='off' onSubmit={this.submit}>
                <ViewModal ref={this.viewModal} size={1000}>
                    <Modal.Header><Modal.Title><Container>Chamado</Container></Modal.Title></Modal.Header>
                    <Modal.Body>
                        <Row gutterWidth={0}>
                            <Col md={2}>
                                <div className='form-control'>
                                    <label class="textfield-filled">
                                        <input type='text' value={this.state?.nCT} onChange={(event) => this.setState({nCT: event.target.value})} readOnly />
                                        <span>Número</span>
                                    </label>
                                </div>
                            </Col>
                            <Col md={3}>
                                <div className='form-control'>
                                    <AutoComplete label='Responsável' value={this.state?.responsible} text={(item) => `${item.userMember.name}`} onChange={(responsible) => this.setState({responsible})} onSearch={async (search) => await Search.user(search)}>
                                        <AutoComplete.Result>
                                            {(item) => <span>{item.userMember.name}</span>}
                                        </AutoComplete.Result>
                                    </AutoComplete>
                                </div>
                            </Col>
                            <Col md={4}>
                                <div className='form-control'>
                                    <AutoComplete label='Motivo' value={this.state?.reason} text={(item) => `${item.description}`} onChange={(reason) => this.setState({reason})} onSearch={async (search) => await Search.calledReason(search)}>
                                        <AutoComplete.Result>
                                            {(item) => <span>{item.description}</span>}
                                        </AutoComplete.Result>
                                    </AutoComplete>
                                </div>
                            </Col>
                            <Col md={4}>
                                <div className='form-control'>
                                    <AutoComplete label='Motivo' value={this.state?.occurrence} text={(item) => `${item.description}`} onChange={(occurrence) => this.setState({occurrence})} onSearch={async (search) => await Search.calledOccurrence(search)}>
                                        <AutoComplete.Result>
                                            {(item) => <span>{item.description}</span>}
                                        </AutoComplete.Result>
                                    </AutoComplete>
                                </div>
                            </Col>
                            <Col md={12}>
                                <div className='form-control'>
                                    <label className="textfield-filled">
                                        <input type='text' value={this.state?.subject} onChange={(event) => this.setState({subject: event.target.value})} />
                                        <span>Assunto</span>
                                    </label>
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
                        </Row>
                        
                    </Modal.Body>
                    <Modal.Footer>
                        <Button appearance="primary" color='green' onClick={this.submit} disabled={this.state?.submting}>{this.state?.submting ? <><Loader /> &nbsp; Salvando...</> : <><MdCheckCircleOutline /> &nbsp; Salvar</>}</Button>
                    </Modal.Footer>
                </ViewModal>
            </Form>
        )

    }

}