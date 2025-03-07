import React from "react";
import { Button, Drawer, Form, Loader, Message, Modal, Panel, Tag, Timeline, toaster } from 'rsuite';
import { Container, Row, Col } from 'react-grid-system';
import { AutoComplete, ViewDrawer } from "../../controls";
import { MdCheckCircleOutline } from "react-icons/md";
import { Service } from "../../service";
import { Loading } from "../../App";
import dayjs from 'dayjs'

import _ from "lodash";
import { Search } from "../../search";
import { Exception } from "../../utils/exception";
import { FaCheckCircle } from "react-icons/fa";
import { Tiny } from "./settings/view.tiny";

export class ViewCalledResolution extends React.Component {

    viewDrawer = React.createRef()

    new = async (companyIntegration) => {
        this.setState({companyIntegration})
        return this.viewDrawer.current.show()
    }

    onSubmit = async (options) => {
        try {

            this.setState({submitting: true})

            const result = await new Service().Post('integration/submit', {...this.state?.companyIntegration, options})

            this.viewDrawer.current?.close(options)

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
            <ViewDrawer ref={this.viewDrawer}>
                <Drawer.Header>
                    <Drawer.Title>Configuração</Drawer.Title>
                </Drawer.Header>
                <Drawer.Body style={{padding: '30px'}}>
                    
                    {this.state?.companyIntegration?.integration?.id == '9146DA26-872B-400E-810E-79FD43AF6FD7' && (
                        <Tiny submitting={this.state?.submitting} options={JSON.parse(this.state?.companyIntegration?.options)} onSubmit={this.onSubmit} />
                    )}

                </Drawer.Body>
            </ViewDrawer>
        )

    }

}