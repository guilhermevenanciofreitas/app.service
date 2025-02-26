import React from 'react'
import { Badge, Button, HStack, IconButton, List, Message, Nav, Panel, Popover, Stack, toaster, Whisper } from 'rsuite'

import dayjs from 'dayjs'

import PageContent from '../../components/PageContent'

import { AutoComplete, CustomBreadcrumb, CustomPagination, CustomSearch, DataTable } from '../../controls'
import { FaDownload, FaEllipsisV, FaFileCode, FaFileDownload, FaFilePdf, FaPlusCircle, FaPrint, FaSearchLocation, FaUpload } from 'react-icons/fa'
import { Service } from '../../service'

import _ from 'lodash'
import { Exception } from '../../utils/exception'
import { ViewCalled } from './view.called'
import { Search } from '../../search'
import { ViewCalledResolution } from './view.called-resolution'
import FilterButton from './filter'

const fields = [
  { label: 'Número', value: 'number' },
]

export class Calleds extends React.Component {

  viewCalled = React.createRef()
  viewCalledResolution = React.createRef()

  componentDidMount = () => {
    this.onSearch()
  }

  onSearch = async () => {
    try {
      this.setState({loading: true})
      const result = await new Service().Post('called/calleds', this.state?.request)
      this.setState({...result.data})
    } catch (error) {
      Exception.error(error)
    } finally {
      this.setState({loading: false})
    }
  }

  onNew = async () => {
    try {
      
      const called = await this.viewCalled.current.new()
      
      if (called) {
        await this.viewCalledResolution.current.new({calledId: called.id, number: called.number, responsible: called.responsible})
        await toaster.push(<Message showIcon type='success'>Salvo com sucesso!</Message>, {placement: 'topEnd', duration: 5000 })
        await this.onSearch()
      }

    } catch (error) {
      Exception.error(error)
    }
  }

  onEdit = async ({id}) => {
    try {
      const called = await this.viewCalled.current.edit(id)
      if (called) await this.onSearch()
    } catch (error) {
      Exception.error(error)
    }
  }

  onResolution = async (row) => {
    const resolution = await this.viewCalledResolution.current.new({calledId: row.id, number: row.number, resolutions: row.resolutions})
    if (resolution) {
      await toaster.push(<Message showIcon type='success'>Salvo com sucesso!</Message>, {placement: 'topEnd', duration: 5000 })
      await this.onSearch()
    }
  }

  columns = [
 
    { selector: (row) => <Whisper
      trigger="click"
      placement={'bottomStart'}
      speaker={(props, ref) => {
        return (
          <Popover ref={ref} className={props.className} style={{width: '200px'}}>
            <List size={'md'} hover style={{cursor: 'pointer'}}>
              <List.Item onClick={() => this.onDacte(row.id, row.chaveCT)}><FaPrint /> Imprimir dacte</List.Item>
              <List.Item><FaFileDownload /> Arquivo xml</List.Item>
            </List>
          </Popover>
        )
      }}
    >
      <IconButton className='hover-blue' size='sm' circle icon={<FaEllipsisV />} appearance="default" />
    </Whisper>, minWidth: '30px', maxWidth: '30px', center: true, style: {padding: '0px'}},
    { selector: (row) => dayjs(row.createdAt).format('DD/MM/YYYY HH:mm'), name: 'Abertura', minWidth: '140px', maxWidth: '140px'},
    { selector: (row) => row.number, name: 'Número', minWidth: '90px', maxWidth: '90px'},
    { selector: (row) => row.responsible?.userMember?.userName, name: 'Responsável', minWidth: '160px', maxWidth: '160px'},
    { selector: (row) => row.requested?.surname, name: 'Solicitante', minWidth: '230px', maxWidth: '230px'},
    { selector: (row) => row.reason?.description, name: 'Motivo', minWidth: '140px', maxWidth: '140px'},
    { selector: (row) => row.occurrence?.description, name: 'Ocorrência', minWidth: '170px', maxWidth: '170px'},
    { selector: (row) => row.subject, name: 'Assunto'},
    { selector: (row) => dayjs(row.openedDate).format('DD/MM/YYYY HH:mm'), name: 'Fechamento', minWidth: '140px', maxWidth: '140px'},
    { selector: (row) => <Badge style={{cursor: 'pointer'}} color={'blue'} onClick={() => this.onResolution(row)} content={_.size(row.resolutions)}></Badge>, center: true, minWidth: '35px', maxWidth: '35px', style: {padding: '0px'}},
  ]

  render = () => {

    return (
      <Panel header={<CustomBreadcrumb title={'Chamados'} />}>

        <ViewCalled ref={this.viewCalled} />

        <ViewCalledResolution ref={this.viewCalledResolution} />

        <PageContent>
          
          {/*
          <Stack spacing={'6px'} direction={'row'} alignItems={'flex-start'} justifyContent={'space-between'}>
            <HStack>
              <CustomSearch loading={this.state?.loading} fields={fields} defaultPicker={'number'} value={this.state?.request?.search} onChange={(search) => this.setState({request: {search}}, () => this.onSearch())} />
                <FilterButton />
            </HStack>
          </Stack>
          */}

          <Stack direction='row' alignItems='flexStart' justifyContent='space-between'>
            <Stack spacing={5}>
              <CustomSearch loading={this.state?.loading} fields={fields} defaultPicker={'number'} value={this.state?.request?.search} onChange={(search) => this.setState({request: {search}}, () => this.onSearch())} />
            </Stack>
            <FilterButton />
          </Stack>

          <hr></hr>
          
          <Nav appearance="subtle">
            <Nav.Item active={!this.state?.request?.bankAccount} onClick={() => this.setState({request: {...this.state.request, bankAccount: undefined}}, () => this.onSearch())}><center style={{width: 140}}>Todos<br></br>{this.state?.loading ? "-" : this.state?.response?.count ?? '-'}</center></Nav.Item>
            {_.map(this.state?.response?.bankAccounts, (bankAccount) => {
              return <Nav.Item eventKey="home" active={this.state?.request?.bankAccount?.id == bankAccount.id} onClick={() => this.setState({request: {...this.state.request, bankAccount: bankAccount}}, () => this.onSearch())}><center style={{width: 160}}>{<><img src={bankAccount?.bank?.image} style={{height: '16px'}} />&nbsp;&nbsp;{bankAccount.name || <>{bankAccount?.agency}-{bankAccount?.agencyDigit} / {bankAccount?.account}-{bankAccount?.accountDigit}</>}</>}<br></br>{this.state?.loading ? '-' : <>R$ {bankAccount.balance}</>}</center></Nav.Item>
            })}
          </Nav>

          <DataTable columns={this.columns} rows={this.state?.response?.rows} loading={this.state?.loading} onItem={this.onEdit} selectedRows={true} onSelected={(selecteds) => this.setState({selecteds})} />
      
          <hr></hr>
          
          <Stack direction='row' alignItems='flexStart' justifyContent='space-between'>
            <Stack spacing={5}>
              {_.size(this.state?.selecteds) == 0 && <Button appearance='primary' color='blue' startIcon={<FaPlusCircle />} onClick={this.onNew}>&nbsp;Novo</Button>}
            </Stack>
            <CustomPagination isLoading={this.state?.loading} total={this.state?.response?.count} limit={this.state?.request?.limit} activePage={this.state?.request?.offset + 1} onChangePage={(offset) => this.setState({request: {...this.state.request, offset: offset - 1}}, () => this.onSearch())} onChangeLimit={(limit) => this.setState({request: {...this.state.request, limit}}, () => this.onSearch())} />
          </Stack>
          
        </PageContent>
      </Panel>
    )
  }
}