import React from 'react'
import { Badge, Button, Divider, Drawer, IconButton, List, Message, Nav, Panel, Popover, Row, Stack, toaster, Whisper } from 'rsuite'

import PageContent from '../../../components/PageContent'

import { AutoComplete, CustomBreadcrumb, CustomPagination, CustomSearch, DataTable } from '../../../controls'
import { FaCheckCircle, FaEllipsisV, FaFileDownload, FaFilter, FaPlusCircle, FaPrint } from 'react-icons/fa'
import { Service } from '../../../service'

import { Exception } from '../../../utils/exception'
import { ViewStatement } from './view.statement'
import { Search } from '../../../search'
import { ViewBankStatement } from './view.bank-statements'

import dayjs from 'dayjs'
import _ from 'lodash'
import { ViewStatementData } from './view.statement-data'

const fields = [
  { label: 'Número', value: 'number' },
  { label: 'Assunto', value: 'subject' },
]

class Filter extends React.Component {

  state = {
    filter: {
      //company: this.props.filter.company,
      responsible: this.props.filter.responsible
    }
  }

  onApply = () => {
    this.setState({open: false}, () => this.props.onChange(this.state.filter))
  }

  render() {

    const appliedFiltersCount = _.size(Object.values(this.props.filter || {}).filter(Boolean))
    
    return (
      <>

        <Button appearance="subtle" onClick={() => this.setState({ open: true, filter: this.props.filter })}>
          <FaFilter /> &nbsp; Filtro &nbsp; {appliedFiltersCount > 0 && <Badge content={appliedFiltersCount} />}
        </Button>

        <Drawer open={this.state?.open} onClose={() => this.setState({open: false})} size="xs">
          <Drawer.Header><Drawer.Title>Filtro</Drawer.Title></Drawer.Header>
          <Drawer.Body style={{padding: '30px'}}>
            <Row gutterWidth={0}>
              <div className="form-control">
                <AutoComplete label="Responsável" value={this.state?.filter?.responsible} text={(item) => `${item.userName}`} onChange={(responsible) => this.setState({ filter: {...this.state.filter, responsible} })} onSearch={async (search) => await Search.user(search)} autoFocus>
                  <AutoComplete.Result>
                    {(item) => <span>{item.userName}</span>}
                  </AutoComplete.Result>
                </AutoComplete>
              </div>
              <div className="form-control">
                <AutoComplete label="Filial" value={this.state?.filter?.company} text={(item) => `${item.surname}`} onChange={(company) => this.setState({ filter: {...this.state.filter, company} })} onSearch={async (search) => await Search.company(search)}>
                  <AutoComplete.Result>
                    {(item) => <span>{item.surname}</span>}
                  </AutoComplete.Result>
                </AutoComplete>
              </div>
              <Divider />
              <div className='form-control'>
                  <Button appearance="primary" color='green' onClick={this.onApply}><FaCheckCircle /> &nbsp; Confirmar</Button>
              </div>
            </Row>
          </Drawer.Body>
        </Drawer>

      </>
    )
  }
}

export class Statements extends React.Component {

  viewStatement = React.createRef()
  viewStatementData = React.createRef()
  viewBankStatement = React.createRef()

  constructor(props) {
    super(props)

    const Authorization = JSON.parse(localStorage.getItem("Authorization"))

    this.state = {
      request: {
        filter: {
          //company: Authorization.company,
          responsible: Authorization.user
        }
      }
    }
  }

  componentDidMount = () => {
    this.onSearch()
  }

  onSearch = async () => {
    try {
      this.setState({loading: true})
      const result = await new Service().Post('finance/statement/statements', this.state?.request)
      this.setState({...result.data})
    } catch (error) {
      Exception.error(error)
    } finally {
      this.setState({loading: false})
    }
  }

  onNew = async () => {
    try {
      
      const statement = await this.viewStatement.current.new()
      
      if (statement) {
        await this.ViewBankStatement.current.new({statementId: statement.id})
        await toaster.push(<Message showIcon type='success'>Salvo com sucesso!</Message>, {placement: 'topEnd', duration: 5000 })
        await this.onSearch()
      }

    } catch (error) {
      Exception.error(error)
    }
  }

  onEdit = async ({id, importedAt}) => {
    try {

      if (importedAt) {

        await this.viewStatementData.current.edit(id)
        //if (called) await this.onSearch()

      } else {
        await this.viewBankStatement.current.new({statementId: id})
      }

    } catch (error) {
      Exception.error(error)
    }
  }

  onResolution = async (row) => {
    const resolution = await this.viewBankStatement.current.new({calledId: row.id, number: row.number, resolutions: row.resolutions})
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
    //{ selector: (row) => dayjs(row.createdAt).format('DD/MM/YYYY HH:mm'), name: 'Abertura', minWidth: '140px', maxWidth: '140px'},
    { selector: (row) => row.company?.surname, name: 'Filial', minWidth: '120px', maxWidth: '120px'},
    { selector: (row) => row.bankAccount?.agency, name: 'Conta', minWidth: '200px', maxWidth: '200px'},
    { selector: (row) => dayjs(row.begin).format('DD/MM/YYYY HH:mm'), name: 'Inicio', minWidth: '140px', maxWidth: '140px'},
    { selector: (row) => dayjs(row.end).format('DD/MM/YYYY HH:mm'), name: 'Final', minWidth: '140px', maxWidth: '140px'},
    //{ selector: (row) => <Badge style={{cursor: 'pointer'}} color={'blue'} onClick={() => this.onResolution(row)} content={_.size(row.resolutions)}></Badge>, center: true, minWidth: '35px', maxWidth: '35px', style: {padding: '0px'}},
  ]

  render = () => {

    return (
      <Panel header={<CustomBreadcrumb menu={'Finanças'} title={'Extratos'} />}>

        <ViewStatement ref={this.viewStatement} />
        <ViewStatementData ref={this.viewStatementData} />

        <ViewBankStatement ref={this.viewBankStatement} />

        <PageContent>
          
          <Stack direction='row' alignItems='flexStart' justifyContent='space-between'>
            <Stack spacing={5}>
              <CustomSearch loading={this.state?.loading} fields={fields} defaultPicker={'number'} value={this.state?.request?.search} onChange={(search) => this.setState({request: {filter: this.state.request.filter, search}}, () => this.onSearch())} />
            </Stack>
            <Filter filter={this.state?.request?.filter} onChange={(filter) => this.setState({request: {...this.state?.request, filter}}, () => this.onSearch())} />
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