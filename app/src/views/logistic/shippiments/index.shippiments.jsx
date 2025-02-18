import React from 'react';

import _ from 'lodash'

import dayjs from 'dayjs'

import { Exception } from '../../../utils/exception'

import { Badge, Breadcrumb, Button, HStack, Nav, Panel, Stack } from 'rsuite';

import { Divider } from 'rsuite';
import PageContent from '../../../components/PageContent';

import { CustomBreadcrumb, CustomDateRangePicker, CustomFilter, CustomPagination, CustomSearch, DataTable } from '../../../controls';
import { MdAddCircleOutline, MdCheckCircleOutline } from 'react-icons/md';
import { FaFileImport, FaTransgender, FaUpload } from 'react-icons/fa';
import { Service } from '../../../service';
import ViewShippiment from './view.shippiment';
import ViewCtes from './view.ctes';

const fields = [
  { label: 'Número', value: 'code' },
  { label: 'Documento de transporte', value: 'documentTransport' },
]

class LogisticShippiments extends React.Component {

  viewShippiment = React.createRef()
  viewCtes = React.createRef()

  componentDidMount = () => {
    this.onSearch()
  }

  onApplyDate = (date) => {
    //this.setState({request: {date}})
  }

  onApplyFilter = (filter) => {
    this.setState({request: {filter}}, () => this.onSearch())
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
    { selector: (row) => row.id, name: 'Id'},
    { selector: (row) => row.documento_transporte, name: 'Documento transporte'},
    { selector: (row) => row.sender?.surname, name: 'Remetente'},
    { selector: (row) => <Badge style={{cursor: 'pointer'}} color={'blue'} onClick={() => this.onViewCtes(row)} content={_.size(row.ctes)}></Badge>, name: '#', minWidth: '80px', maxWidth: '80px'},
  ]

  render = () => {

    return (
      <>

        <ViewShippiment ref={this.viewShippiment} />
        <ViewCtes ref={this.viewCtes} />

        <PageContent>
          
          <Stack spacing={'6px'} direction={'row'} alignItems={'flex-start'} justifyContent={'space-between'}>
            
            <HStack>

              <CustomSearch loading={this.state?.loading} fields={fields} defaultPicker={'documentTransport'} value={this.state?.request?.search} onChange={(search) => this.setState({request: {search}}, () => this.onSearch())} />
      
              {/*
              <CustomFilter.Whisper badge={_.size(this.state?.request?.filter)}>
                {(props) => <Filter filter={this.state?.request?.filter} onApply={this.onApplyFilter} {...props} />}
              </CustomFilter.Whisper>
              */}

            </HStack>

          </Stack>

          <hr></hr>
          
          <Nav appearance="subtle">
            <Nav.Item active={!this.state?.request?.bankAccount} onClick={() => this.setState({request: {...this.state.request, bankAccount: undefined}}, () => this.onSearch())}><center style={{width: 140}}>Todos<br></br>{this.state?.loading ? "-" : <>{this.state?.response?.count}</>}</center></Nav.Item>
            {_.map(this.state?.response?.bankAccounts, (bankAccount) => {
              return <Nav.Item eventKey="home" active={this.state?.request?.bankAccount?.id == bankAccount.id} onClick={() => this.setState({request: {...this.state.request, bankAccount: bankAccount}}, () => this.onSearch())}><center style={{width: 160}}>{<><img src={bankAccount?.bank?.image} style={{height: '16px'}} />&nbsp;&nbsp;{bankAccount.name || <>{bankAccount?.agency}-{bankAccount?.agencyDigit} / {bankAccount?.account}-{bankAccount?.accountDigit}</>}</>}<br></br>{this.state?.loading ? '-' : <>R$ {bankAccount.balance}</>}</center></Nav.Item>
            })}
          </Nav>

          <DataTable columns={this.columns} rows={this.state?.response?.rows} loading={this.state?.loading} onItem={this.onEditShippiment} />

          <hr></hr>

          <Stack direction='row' alignItems='flexStart' justifyContent='space-between'>
            <Button appearance='primary' color='blue' startIcon={<MdAddCircleOutline />} onClick={this.onNewShippiment}>&nbsp;Novo romaneio</Button>
            <CustomPagination isLoading={this.state?.loading} total={this.state?.response?.count} limit={this.state?.request?.limit} activePage={this.state?.request?.offset + 1} onChangePage={(offset) => this.setState({request: {...this.state.request, offset: offset - 1}}, () => this.onSearch())} onChangeLimit={(limit) => this.setState({request: {...this.state.request, limit}}, () => this.onSearch())} />
          </Stack>

        </PageContent>
      </>
    )
  }
}

class Page extends React.Component {

  render = () => {
    return (
      <Panel header={<CustomBreadcrumb menu={'Logística'} title={'Romaneios'} />}>
        <LogisticShippiments />
      </Panel>
    )
  }

}

export default Page;