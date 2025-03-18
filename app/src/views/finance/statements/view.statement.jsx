import React from "react";
import { Button, Form, Loader, Message, Modal, toaster } from 'rsuite';
import { Container, Row, Col } from 'react-grid-system';
import { AutoComplete, ViewModal } from "../../../controls";
import { MdCheckCircleOutline } from "react-icons/md";
import { Service } from "../../../service";
import { Loading } from "../../../App";

import dayjs from 'dayjs'

import _ from "lodash";
import { Search } from "../../../search";
import { Exception } from "../../../utils/exception";

export class ViewStatement extends React.Component {

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

            let statement = _.pick(this.state, [
                'id',
                'company.id',
                'bankAccount.id',
                'begin',
                'end',
            ])

            const result = await new Service().Post('finance/statement/submit', statement)

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
                <ViewModal ref={this.viewModal} size={350}>
                    <Modal.Header><Modal.Title><Container>Extrato</Container></Modal.Title></Modal.Header>
                    <Modal.Body>
                        <Row gutterWidth={0}>
                            <Col md={12}>
                                <div className='form-control'>
                                    <AutoComplete label='Filial' value={this.state?.company} text={(item) => `${item.surname}`} onChange={(company) => this.setState({company})} onSearch={async (search) => await Search.company(search)}>
                                        <AutoComplete.Result>
                                            {(item) => <span>{item.surname}</span>}
                                        </AutoComplete.Result>
                                    </AutoComplete>
                                </div>
                            </Col>
                            <Col md={12}>
                                <div className='form-control'>
                                    <AutoComplete label='Conta' value={this.state?.bankAccount} text={(item) => `${item.bank?.name} - ${item.agency}`} onChange={(bankAccount) => this.setState({bankAccount})} onSearch={async (search) => await Search.bankAccount(search)}>
                                        <AutoComplete.Result>
                                            {(item) => <span>{item.bank?.name} - {item.agency}</span>}
                                        </AutoComplete.Result>
                                    </AutoComplete>
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className='form-control'>
                                    <label class="textfield-filled">
                                        <input type='date' value={this.state?.begin} onChange={(event) => this.setState({begin: event.target.value})} />
                                        <span>Inicial</span>
                                    </label>
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className='form-control'>
                                    <label class="textfield-filled">
                                        <input type='date' value={this.state?.end} onChange={(event) => this.setState({end: event.target.value})} />
                                        <span>Final</span>
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