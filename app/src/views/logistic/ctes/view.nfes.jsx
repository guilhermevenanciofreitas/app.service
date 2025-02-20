import React from "react";
import { Button, CheckTree, DatePicker, Divider, Form, IconButton, Input, InputGroup, Loader, Message, Modal, toaster } from 'rsuite';
import { Container, Row, Col } from 'react-grid-system';
import { AutoComplete, DataTable, PhotoPicker, ViewModal } from "../../../controls";
import { Service } from "../../../service";
import { Loading } from "../../../App";

import _ from "lodash";
import { Search } from "../../../search";
import { FaPlus, FaTrash } from "react-icons/fa";
import { MdCheckCircleOutline } from "react-icons/md";
import { Exception } from "../../../utils/exception";

class ViewNfes extends React.Component {

    viewModal = React.createRef()

    show = async (cte) => {
        if (this.state) for (const prop of Object.getOwnPropertyNames(this.state)) delete this.state[prop]
        this.setState({cte})
        return this.viewModal.current.show()
    }

    onAddNfe = async () => {
        try {

            this.setState({submting: true})

            const result = await new Service().Post('logistic/cte/add-nfe', {cteId: this.state.cte.id, chNFe: this.state.chNFe})
            
            if (result.status == 201) {
                await toaster.push(<Message showIcon type='warning'>{result.data.message}</Message>, {placement: 'topEnd', duration: 5000 })
                return
            }

            await toaster.push(<Message showIcon type='success'>Salvo com sucesso!</Message>, {placement: 'topEnd', duration: 5000 })
            
            this.state?.cte?.cteNfes.push({nfe: {chNFe: this.state.chNFe}})

        } catch (error) {
            Exception.error(error)
        } finally {
            this.setState({submting: false})
        }
    }

    onDeleteNfe = async (row) => {

        this.setState({deleting: true}, async () => {
            await new Service().Post('logistic/cte/delete-nfe', {id: row.id}).then(async (result) => {

                await toaster.push(<Message showIcon type='success'>Excluído com sucesso!</Message>, {placement: 'topEnd', duration: 5000 })

                this.state.cte.cteNfes = _.filter(this.state?.cte?.cteNfes, (cteNfe) => cteNfe.id !== row.id)

                this.setState({cte: {...this.state.cte, cteNfes: this.state.cte.cteNfes}})
                
            }).finally(() => {
                this.setState({deleting: false})
            })

        })
    }

    close() {
        this.viewModal.current?.close(this.state?.cte)
    }

    columns = [
        { selector: (row) => row.nfe.chNFe, name: 'Chave de acesso'},
        { selector: (row) => <div class="hidden"><FaTrash color="tomato" onClick={() => this.onDeleteNfe(row)} /></div>, name: '', minWidth: '80px', maxWidth: '80px'},
   ]

    render = () => {
        
        return (
            <Form autoComplete='off' onSubmit={this.submit}>
                <ViewModal ref={this.viewModal} size={600}>
                    <Modal.Header><Modal.Title><Container>Notas fiscais</Container></Modal.Title></Modal.Header>
                    <Modal.Body>
                        <Row gutterWidth={0}>
                                
                            <Col md={12}>
                                <DataTable height={'auto'} columns={this.columns} rows={this.state?.cte?.cteNfes} noDataComponent={'Nenhuma nota fiscal'} />
                            </Col>

                            <Divider />

                            <Col md={8}>
                                <div className='form-control'>
                                    <label class="textfield-filled">
                                        <input type='text' value={this.state?.chNFe} onChange={(event) => this.setState({chNFe: event.target.value})} />
                                        <span>Chave de acesso</span>
                                    </label>
                                </div>
                            </Col>

                            <p style={{marginTop: '10px', marginLeft: '10px'}}><Button appearance="primary" color='green' onClick={this.onAddNfe} disabled={this.state?.submting}>{this.state?.submting ? <><Loader /> &nbsp; Adicionando...</> : <><MdCheckCircleOutline /> &nbsp; Adicionar</>}</Button></p>

                        </Row>
                    </Modal.Body>
                </ViewModal>
            </Form>
        )

    }

}

export default ViewNfes;