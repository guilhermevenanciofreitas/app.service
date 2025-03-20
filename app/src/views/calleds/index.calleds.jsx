import React from 'react'
import { Badge, Button, Divider, Drawer, Dropdown, IconButton, List, Message, Nav, Panel, Popover, Row, Stack, toaster, Whisper } from 'rsuite'

import PageContent from '../../components/PageContent'

import { AutoComplete, CustomBreadcrumb, CustomPagination, CustomSearch, DataTable } from '../../controls'
import { FaCheckCircle, FaEllipsisV, FaFileDownload, FaFilter, FaPlusCircle, FaPrint } from 'react-icons/fa'
import { Service } from '../../service'

import { Exception } from '../../utils/exception'
import { ViewCalled } from './view.called'
import { Search } from '../../search'
import { ViewCalledResolution } from './view.called-resolution'

import dayjs from 'dayjs'
import _ from 'lodash'
import { CustomNavItem } from '../../controls/custom/CustomNavItem'
import { Loading } from '../../App'
import Swal from 'sweetalert2'

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

export class Calleds extends React.Component {

  viewCalled = React.createRef()
  viewCalledResolution = React.createRef()

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
      
      const Authorization = JSON.parse(localStorage.getItem("Authorization"))
      
      const called = await this.viewCalled.current.new({company: Authorization.company})
      
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

  onClose = async (row) => {
    try {

      const r = await Swal.fire({text: 'Tem certeza que deseja fechar ?', icon: 'warning', showCancelButton: true, confirmButtonText: 'Sim', cancelButtonText: 'Não'})
      if (!r.isConfirmed) return

      Loading.Show('Fechando chamado...')
      await new Service().Post('called/close', [row.id])
      Loading.Hide()
      await this.onSearch()

    } catch (error) {
      Exception.error(error)
    } finally {
      Loading.Hide()
    }
  }

  columns = [
    {
      name: 'Seleção',
      cell: (row) => {

        let color = ''

        switch (row.status) {
          case 'opened':
            color = 'SpringGreen'
            break;
          case 'closed':
            color = 'DodgerBlue'
            break;
          default:
            color = 'Tomato'
            break;
        }

        return (
          <div style={{ display: 'flex', alignItems: 'center', width: '100%', height: '100%', padding: 0, margin: 0 }}>
            <div style={{ width: '4px', alignSelf: 'stretch', backgroundColor: color, margin: '2px' }} />
            <span style={{ fontWeight: 'bold', marginLeft: '10px' }}>
              <input type="checkbox" checked={this.state.selectedIds?.includes(row.id) || false} onChange={() => this.handleToggle(row.id)} />
            </span>
          </div>
        )
      },
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      minWidth: '35px',
      maxWidth: '35px'
    },
    { selector: (row) => <Whisper
      trigger="click"
      placement={'bottomStart'}
      speaker={(props, ref) => {
        return (
          <Popover ref={ref} className={props.className} style={{width: '200px'}}>
            <Dropdown.Menu onSelect={(eventKey) => {
              switch(eventKey) {
                case 'close':
                  this.onClose(row)
                  break
              }
            }}>
              {!row.closedAt && (<Dropdown.Item eventKey={'close'}><FaCheckCircle /> Fechar</Dropdown.Item>)}
            </Dropdown.Menu>
            {/*
            <List size={'md'} hover style={{cursor: 'pointer'}}>
              {!row.closedAt && (<List.Item onClick={() => this.onDacte(row.id, row.chaveCT)}><FaCheckCircle /> Fechar</List.Item>)}
            </List>
            */}
          </Popover>
        )
      }}
    >
      <IconButton className='hover-blue' size='sm' circle icon={<FaEllipsisV />} appearance="default" />
    </Whisper>, minWidth: '45px', maxWidth: '45px', center: true},
    { selector: (row) => dayjs(row.createdAt).format('DD/MM/YYYY HH:mm'), name: 'Abertura', minWidth: '120px', maxWidth: '120px'},
    { selector: (row) => row.company?.surname, name: 'Filial', minWidth: '120px', maxWidth: '120px'},
    { selector: (row) => row.number, name: 'Número', minWidth: '90px', maxWidth: '90px'},
    { selector: (row) => row.responsible?.userName, name: 'Responsável', minWidth: '160px', maxWidth: '160px'},
    { selector: (row) => row.requested?.surname, name: 'Solicitante', minWidth: '230px', maxWidth: '230px'},
    { selector: (row) => row.reason?.description, name: 'Motivo', minWidth: '140px', maxWidth: '140px'},
    { selector: (row) => row.occurrence?.description, name: 'Ocorrência', minWidth: '170px', maxWidth: '170px'},
    { selector: (row) => row.subject, name: 'Assunto'},
    { selector: (row) => row.status == 'closed' ? (row.closedAt ? dayjs(row.closedAt).format('DD/MM/YYYY HH:mm') : '') : (row.previsionAt ? dayjs(row.previsionAt).format('DD/MM/YYYY HH:mm') : ''), name: 'Prev./Fechamento', minWidth: '140px', maxWidth: '140px'},
    { selector: (row) => <Badge style={{cursor: 'pointer'}} color={'blue'} onClick={() => this.onResolution(row)} content={_.size(row.resolutions)}></Badge>, center: true, minWidth: '35px', maxWidth: '35px'},
  ]

  render = () => {

    return (
      <Panel header={<CustomBreadcrumb title={'Chamados'} />}>

        <ViewCalled ref={this.viewCalled} />

        <ViewCalledResolution ref={this.viewCalledResolution} />

        <PageContent>
          
          <Stack direction='row' alignItems='flexStart' justifyContent='space-between'>
            <Stack spacing={5}>
              <CustomSearch loading={this.state?.loading} fields={fields} defaultPicker={'number'} value={this.state?.request?.search} onChange={(search) => this.setState({request: {filter: this.state.request.filter, search}}, () => this.onSearch())} />
            </Stack>
            <Filter filter={this.state?.request?.filter} onChange={(filter) => this.setState({request: {...this.state?.request, filter}}, () => this.onSearch())} />
          </Stack>

          <hr></hr>
          
          <Nav appearance="subtle">
            <CustomNavItem active={this.state?.request?.status == 'opened'} loading={this.state?.loading} color='SpringGreen' text='Abertos' count={this.state?.response?.statusCount?.closed} onClick={() => this.setState({request: {...this.state.request, offset: 0, status: 'opened'}}, () => this.onSearch())} />
            <CustomNavItem active={this.state?.request?.status == 'delayed'} loading={this.state?.loading} color='Tomato' text='Atrasados' count={this.state?.response?.statusCount?.closed} onClick={() => this.setState({request: {...this.state.request, offset: 0, status: 'delayed'}}, () => this.onSearch())} />
            <CustomNavItem active={this.state?.request?.status == 'closed'} loading={this.state?.loading} color='DodgerBlue' text='Fechados' count={this.state?.response?.statusCount?.closed} onClick={() => this.setState({request: {...this.state.request, offset: 0, status: 'closed'}}, () => this.onSearch())} />
          </Nav>

          <DataTable columns={this.columns} rows={this.state?.response?.rows} loading={this.state?.loading} onItem={this.onEdit} />
      
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