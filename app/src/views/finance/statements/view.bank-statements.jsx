import React from "react";
import { Button, Divider, Drawer, Form, Loader, Message, Modal, Panel, Tag, Timeline, toaster } from 'rsuite';
import { Container, Row, Col } from 'react-grid-system';
import { AutoComplete, ViewDrawer } from "../../../controls";
import { MdCheckCircleOutline } from "react-icons/md";
import { Service } from "../../../service";
import { Loading } from "../../../App";
import dayjs from 'dayjs'

import _ from "lodash";
import { Search } from "../../../search";
import { Exception } from "../../../utils/exception";
import { FaCheckCircle } from "react-icons/fa";
import { ViewStatementMercadoPago } from "./bank-statements/mercado-pago";

export class ViewBankStatement extends React.Component {

    viewDrawer = React.createRef()

    new = async (statement) => {
        if (this.state) for (const prop of Object.getOwnPropertyNames(this.state)) delete this.state[prop]
        this.setState({...statement})
        return this.viewDrawer.current.show()
    }

    onSubmit = async () => {
        try {
            
            this.setState({submitting: true})

            let resolution = _.pick(this.state, [
                'calledId',
                'responsible.id',
                'status.id',
                'detail'
            ])

            const result = await new Service().Post('called/resolution', resolution)

            this.viewDrawer.current?.close(result.data)

        } catch (error) {
            Exception.error(error)
        } finally {
            this.setState({submitting: false})
        }
    }

    close(role) {
        this.viewDrawer.current?.close(role)
    }

    render = () => {
        
        return (
            <Form autoComplete='off' onSubmit={this.onSubmit}>
                <ViewDrawer ref={this.viewDrawer}>
                    <Drawer.Header>
                        <Drawer.Title>Importar</Drawer.Title>
                    </Drawer.Header>
                    <Drawer.Body style={{padding: '30px'}}>
                        <Row gutterWidth={0}>

                            <Col md={6}>
                                <div className='form-control'>
                                    <AutoComplete label='Integração' value={this.state?.companyIntegration} text={(item) => `${item.integration?.name}`} onChange={(companyIntegration) => this.setState({ companyIntegration })} onSearch={async (search) => await Search.companyIntegration(search, 'bank-statement')} autoFocus>
                                        <AutoComplete.Result>
                                        {(item) => <span>{item.integration?.name}</span>}
                                        </AutoComplete.Result>
                                    </AutoComplete>
                                </div>
                            </Col>

                            <Divider />

                            {this.state?.companyIntegration?.integration?.id == 'BED7B5F2-8AC7-4DF6-8B2E-D0DA30FAB945' && (
                                <ViewStatementMercadoPago statementId={this.state?.statementId} onSubmited={() => this.close()} />
                            )}

                        </Row>
                    </Drawer.Body>
                </ViewDrawer>
            </Form>
        )

    }

}