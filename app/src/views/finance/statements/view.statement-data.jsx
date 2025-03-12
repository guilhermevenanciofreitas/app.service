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
import DataTable from "react-data-table-component";

export class ViewStatementData extends React.Component {

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
            const result = await new Service().Post('finance/statement/statement-data', {id})
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

    columns = [
        { selector: (row) => dayjs(row.date).format('DD/MM/YYYY HH:mm'), name: 'Data', minWidth: '140px', maxWidth: '140px', style: {padding: '0px'}},
        { selector: (row) => row.sourceId, name: 'ID', minWidth: '120px', maxWidth: '120px', style: {padding: '0px'}},
        { selector: (row) => row.orderId, name: 'Número', minWidth: '120px', maxWidth: '120px', style: {padding: '0px'}},
        { selector: (row) => new Intl.NumberFormat('pt-BR', {style: 'decimal', minimumFractionDigits: 2}).format(parseFloat(row.gross)), name: 'Valor', minWidth: '90px', maxWidth: '90px', right: true, style: {padding: '0px'}},
        { selector: (row) => new Intl.NumberFormat('pt-BR', {style: 'decimal', minimumFractionDigits: 2}).format(parseFloat(row.fee)), name: 'Taxa', minWidth: '100px', maxWidth: '100px', right: true, style: {padding: '0px'}},
        { selector: (row) => new Intl.NumberFormat('pt-BR', {style: 'decimal', minimumFractionDigits: 2}).format(parseFloat(row.debit)), name: 'Débito', minWidth: '100px', maxWidth: '100px', right: true, style: {padding: '0px'}},
        { selector: (row) => new Intl.NumberFormat('pt-BR', {style: 'decimal', minimumFractionDigits: 2}).format(parseFloat(row.credit)), name: 'Crédito', minWidth: '100px', maxWidth: '100px', right: true, style: {padding: '0px'}},
        { selector: (row) => new Intl.NumberFormat('pt-BR', {style: 'decimal', minimumFractionDigits: 2}).format(parseFloat(row.balance)), name: 'Saldo', minWidth: '100px', maxWidth: '100px', right: true, style: {padding: '0px'}},
    ]

    render = () => {
        
        return (
            <Form autoComplete='off' onSubmit={this.onSubmit}>
                <ViewModal ref={this.viewModal} size={950}>
                    <Modal.Header><Modal.Title><Container>Conciliação</Container></Modal.Title></Modal.Header>
                    <Modal.Body>
                        <div style={{height: '100%'}}>
                            <DataTable
                                fixedHeader
                                fixedHeaderScrollHeight='100%'
                                dense
                                columns={this.columns}
                                data={this.state?.statementData}
                            />
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button appearance="primary" color='green' onClick={this.onSubmit} disabled={this.state?.submting}>{this.state?.submting ? <><Loader /> &nbsp; Conciliando...</> : <><MdCheckCircleOutline /> &nbsp; Conciliar</>}</Button>
                    </Modal.Footer>
                </ViewModal>
            </Form>
        )

    }

}