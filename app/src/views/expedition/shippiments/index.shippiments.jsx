import React from 'react';

import _ from 'lodash'

import { Exception } from '../../../utils/exception'

import { Badge, Button, HStack, Nav, Panel, Placeholder, Stack } from 'rsuite';

import PageContent from '../../../components/PageContent';

import { CustomBreadcrumb, CustomPagination, CustomSearch, DataTable } from '../../../controls';
import { MdAddCircleOutline } from 'react-icons/md';
import { Service } from '../../../service';
import ViewShippiment from './view.shippiment';
import ViewCtes from './view.ctes';
import { CustomNavItem } from '../../../controls/custom/CustomNavItem';
import { Row } from 'react-grid-system';

const fields = [
  { label: 'Número', value: 'code' },
  { label: 'Documento de transporte', value: 'documentTransport' },
]

export class LogisticShippiments extends React.Component {

  viewShippiment = React.createRef()
  viewCtes = React.createRef()

  componentDidMount = () => {
    this.onSearch()
  }

  onSearch = () => {
    this.setState({loading: true}, async () => {
      try {

        const result = await new Service().Post('logistic/shippiment/shippiments', this.state.request)
        this.setState({...result.data})

      } catch (error) {
        Exception.error(error)
      } finally {
        this.setState({loading: false})
      }
    })
  }

  onEditShippiment = async (shippiment) => {
    this.viewShippiment.current.editShippiment(shippiment.id).then((shippiment) => {
      if (shippiment) this.onSearch()
    })
  }

  onNewShippiment = () => {
    this.viewShippiment.current.newShippiment({}).then((shippiment) => {
      if (shippiment) this.onSearch()
    })
  }

  onViewCtes = async (cteNfes) => {
    await this.viewCtes.current.show(cteNfes)
    await this.onSearch()
  }

  columns = [
    { selector: (row) => row.id, name: 'Id', minWidth: '100px', maxWidth: '100px'},
    { selector: (row) => row.documentNumber, name: 'Doc. transporte', minWidth: '120px', maxWidth: '120px'},
    { selector: (row) => row.sender?.surname, name: 'Remetente'},
    { selector: (row) => '', name: 'Destinatário'},
    { selector: (row) => '', name: 'Exepedidor'},
    { selector: (row) => '', name: 'Recebedor'},
    { selector: (row) => <Badge style={{cursor: 'pointer'}} color={'blue'} onClick={() => this.onViewCtes(row)} content={_.size(row.ctes)}></Badge>, center: true, minWidth: '35px', maxWidth: '35px', style: {padding: '0px'}},
  ]

  render = () => {

    return (
      <Panel header={<CustomBreadcrumb menu={'Expedição'} title={'Romaneios'} />}>

        <ViewShippiment ref={this.viewShippiment} />
        <ViewCtes ref={this.viewCtes} />

        <PageContent>
          
          <Stack spacing={'6px'} direction={'row'} alignItems={'flex-start'} justifyContent={'space-between'}>
            <HStack>
              <CustomSearch loading={this.state?.loading} fields={fields} defaultPicker={'documentTransport'} value={this.state?.request?.search} onChange={(search) => this.setState({request: {search}}, () => this.onSearch())} />
            </HStack>
          </Stack>

          <hr></hr>
          
          <Nav appearance="subtle">
            
            <CustomNavItem active={true} loading={this.state?.loading} text='Todos' count={this.state?.response?.count} onClick={() => this.setState({request: {...this.state.request, offset: 0}}, () => this.onSearch())} />

          </Nav>

          <DataTable columns={this.columns} rows={this.state?.response?.rows} loading={this.state?.loading} onItem={this.onEditShippiment} />

          <hr></hr>

          <Stack direction='row' alignItems='flexStart' justifyContent='space-between'>
            <Stack spacing={5}>
              <Button appearance='primary' color='blue' startIcon={<MdAddCircleOutline />} onClick={this.onNewShippiment}>&nbsp;Novo</Button>
            </Stack>
            <CustomPagination isLoading={this.state?.loading} total={this.state?.response?.count} limit={this.state?.request?.limit} activePage={this.state?.request?.offset + 1} onChangePage={(offset) => this.setState({request: {...this.state.request, offset: offset - 1}}, () => this.onSearch())} onChangeLimit={(limit) => this.setState({request: {...this.state.request, limit}}, () => this.onSearch())} />
          </Stack>

        </PageContent>
      </Panel>
    )
  }
}