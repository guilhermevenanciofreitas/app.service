import React from "react";
import { Button, Drawer, Form, Loader, Message, Modal, toaster } from 'rsuite';
import { Container, Row, Col } from 'react-grid-system';
import { AutoComplete, ViewDrawer } from "../../controls";
import { MdCheckCircleOutline } from "react-icons/md";
import { Service } from "../../service";
import { Loading } from "../../App";

import _ from "lodash";
import { Search } from "../../search";
import { Exception } from "../../utils/exception";
import ChatTimeline from "./timeline";

export class ViewCalledResolution extends React.Component {

    viewDrawer = React.createRef()

    new = async (called) => {
        if (this.state) for (const prop of Object.getOwnPropertyNames(this.state)) delete this.state[prop]
        this.setState({...called})
        return this.viewDrawer.current.show()
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
            this.viewDrawer.current?.close(result.data)

        } catch (error) {
            Exception.error(error)
        } finally {
            this.setState({submting: false})
        }
    }

    close(role) {
        this.viewDrawer.current?.close(role)
    }

    render = () => {
        
        return (
            <Form autoComplete='off' onSubmit={this.submit}>
                <ViewDrawer ref={this.viewDrawer}>
                    <Drawer.Header>
                        <Drawer.Title>Resolução</Drawer.Title>
                    </Drawer.Header>
                    <Drawer.Body style={{padding: '30px'}}>
                        <Row gutterWidth={0}>
                            <ChatTimeline />
                        </Row>
                    </Drawer.Body>
                </ViewDrawer>
            </Form>
        )

    }

}