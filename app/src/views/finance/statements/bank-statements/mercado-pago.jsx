import React from 'react'
import { Service } from '../../../../service'
import { DataTable } from '../../../../controls'
import dayjs from "dayjs"
import _ from "lodash"
import { Button, Divider, Loader } from 'rsuite'
import { MdCheckCircleOutline } from 'react-icons/md'

export class ViewStatementMercadoPago extends React.Component {

    componentDidMount = async () => {
        this.setState({loading: true}, async () => {
            await new Service().Post('finance/statement/bank-statements/mercago-pago/statements').then((result) => this.setState({rows: result.data.response})).finally(() => this.setState({loading: false}))
        })
    }

    onSubmit = () => {
        this.setState({loading: true}, async () => {
            await new Service().Post('finance/statement/bank-statements/mercago-pago/statement', {fileName: this.state?.selectedRows[0].file_name}).then((result) => {

                console.log(result.data)

            }).finally(() => this.setState({loading: false}))
        })
    }

    columns = [
        { selector: (row) => row.id, name: 'Id', minWidth: '90px', maxWidth: '90px', style: {padding: '0px'}},
        { selector: (row) => dayjs(row.date_created).add(-4, 'hour').format('DD/MM/YYYY HH:mm'), name: 'Data', style: {padding: '0px'} },
        { selector: (row) => dayjs(row.begin_date).format('DD/MM/YYYY HH:mm'), sort: 'begin_date', name: 'Data Inicial', style: {padding: '0px'} },
        { selector: (row) => dayjs(row.end_date).format('DD/MM/YYYY HH:mm'), name: 'Data Final', style: {padding: '0px'} },
    ]

    render = () => {
        return (
            <>
                <DataTable loading={this.state?.loading} placeholder={4} columns={this.columns} rows={this.state?.rows} selectedRows onSelected={(selectedRows) => this.setState({selectedRows})} />
                <Divider />
                <Button appearance="primary" color='green' onClick={this.onSubmit} disabled={this.props.submitting || _.size(this.state?.selectedRows) != 1}>{this.props?.submitting ? <><Loader /> &nbsp; Salvando...</> : <><MdCheckCircleOutline /> &nbsp; Continuar</>}</Button>
            </>
        )
    }

}