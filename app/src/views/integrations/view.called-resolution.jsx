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

export class ViewCalledResolution extends React.Component {

    viewDrawer = React.createRef()

    new = async (resolution) => {
        if (this.state) for (const prop of Object.getOwnPropertyNames(this.state)) delete this.state[prop]
        this.setState({...resolution})
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
                        <Drawer.Title>Chamado #{this.state?.number}</Drawer.Title>
                    </Drawer.Header>
                    <Drawer.Body style={{padding: '30px'}}>
                        <Row gutterWidth={0}>
                                
                            <Col md={6}>
                                <div className='form-control'>
                                    <AutoComplete label='Responsável' value={this.state?.responsible} text={(item) => `${item.userName}`} onChange={(responsible) => this.setState({ responsible })} onSearch={async (search) => await Search.user(search)} autoFocus>
                                        <AutoComplete.Result>
                                        {(item) => <span>{item.userName}</span>}
                                        </AutoComplete.Result>
                                    </AutoComplete>
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className='form-control'>
                                    <AutoComplete label='Status' value={this.state?.status} text={(item) => `${item.description}`} onChange={(status) => this.setState({ status })} onSearch={async (search) => await Search.calledStatus(search)}>
                                        <AutoComplete.Result>
                                        {(item) => <span>{item.description}</span>}
                                        </AutoComplete.Result>
                                    </AutoComplete>
                                </div>
                            </Col>
                            <Col md={12}>
                                <div className='form-control'>
                                    <label className="textfield-filled">
                                        <textarea rows="3" value={this.state?.detail} onChange={(event) => this.setState({ detail: event.target.value })} />
                                        <span>Detalhes</span>
                                    </label>
                                </div>
                            </Col>
                            
                            <div className='form-control'>
                                <Button appearance="primary" color='green' onClick={this.onSubmit} disabled={this.state?.submitting}>{this.state?.submitting ? <><Loader /> &nbsp; Confirmando...</> : <><FaCheckCircle /> &nbsp; Confirmar</>}</Button>
                            </div>
                        
                            {_.size(this.state?.resolutions) > 0 && (
                                <Col md={12} style={{paddingTop: '30px'}}>
                                    <Panel bordered header="Resoluções" style={{ width: '100%' }}>
                                        <Timeline isItemActive={Timeline.ACTIVE_FIRST}>
                                            {_.map(this.state?.resolutions, (resolution) => (
                                                <Timeline.Item key={resolution.id}>
                                                    <Tag color={'blue'}>{resolution.status?.description}</Tag>
                                                    <div><strong>{resolution.user?.userName}:</strong> {resolution.detail}</div>
                                                    <div style={{ fontSize: "0.8em", color: "gray" }}>{dayjs(resolution.createdAt).format('DD/MM/YYYY HH:mm')}</div>
                                                </Timeline.Item>
                                            ))}
                                        </Timeline>
                                    </Panel>
                                </Col>
                            )}
                            
                        </Row>
                    </Drawer.Body>
                </ViewDrawer>
            </Form>
        )

    }

}