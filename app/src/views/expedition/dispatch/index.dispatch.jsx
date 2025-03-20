import React from 'react';

import _ from 'lodash'

import { Exception } from '../../../utils/exception'

import { Badge, Button, Divider, Drawer, Nav, Panel, Placeholder, Stack, Text } from 'rsuite';

import PageContent from '../../../components/PageContent';

import { AutoComplete, CustomBreadcrumb, CustomPagination, CustomSearch, DataTable } from '../../../controls';
import { MdAddCircleOutline } from 'react-icons/md';
import { Service } from '../../../service';
import ViewShippiment from './view.shippiment';
import ViewCtes from './view.ctes';
import { CustomNavItem } from '../../../controls/custom/CustomNavItem';
import { Row } from 'react-grid-system';
import { FaCheckCircle, FaFilter } from 'react-icons/fa';
import { Search } from '../../../search';

const fields = [
  { label: 'Nº Viagem', value: 'codeTrip' },
  { label: 'Documento de transporte', value: 'documentTransport' },
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
            <div className="form-control">
              <AutoComplete label="Motorista" value={this.state?.filter?.responsible} text={(item) => `${item.userName}`} onChange={(responsible) => this.setState({ filter: {...this.state.filter, responsible} })} onSearch={async (search) => await Search.user(search)} autoFocus>
                <AutoComplete.Result>
                  {(item) => <span>{item.userName}</span>}
                </AutoComplete.Result>
              </AutoComplete>
            </div>
            {/*
            <div className="form-control">
              <AutoComplete label="Filial" value={this.state?.filter?.company} text={(item) => `${item.surname}`} onChange={(company) => this.setState({ filter: {...this.state.filter, company} })} onSearch={async (search) => await Search.company(search)}>
                <AutoComplete.Result>
                  {(item) => <span>{item.surname}</span>}
                </AutoComplete.Result>
              </AutoComplete>
            </div>
            */}
            <Divider />
            <div className='form-control'>
                <Button appearance="primary" color='green' onClick={this.onApply}><FaCheckCircle /> &nbsp; Confirmar</Button>
            </div>
          </Drawer.Body>
        </Drawer>

      </>
    )
  }
}

export class ExpeditionDispatch extends React.Component {

  viewShippiment = React.createRef()
  viewCtes = React.createRef()

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

  onSearch = () => {
    this.setState({loading: true}, async () => {
      try {

        const result = await new Service().Post('expedition/dispatch/dispatches', this.state.request)
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
    { selector: (row) => row.documentNumber, name: 'Documento de transporte'},
    { selector: (row) => row.sender?.surname, name: 'Remetente'},
    { selector: (row) => <Badge style={{cursor: 'pointer'}} color={'blue'} onClick={() => this.onViewCtes(row)} content={_.size(row.ctes)}></Badge>, center: true, minWidth: '35px', maxWidth: '35px', style: {padding: '0px'}},
  ]

  render = () => {

    return (
      <Panel header={<CustomBreadcrumb menu={'Expedição'} title={'Despacho'} />}>

        <ViewShippiment ref={this.viewShippiment} />
        <ViewCtes ref={this.viewCtes} />

        <PageContent>
          
          <Stack direction='row' alignItems='flexStart' justifyContent='space-between'>
            <Stack spacing={5}>
              <CustomSearch loading={this.state?.loading} fields={fields} defaultPicker={'codeTrip'} value={this.state?.request?.search} onChange={(search) => this.setState({request: {search}}, () => this.onSearch())} />
            </Stack>
            <Filter filter={this.state?.request?.filter} onChange={(filter) => this.setState({request: {...this.state?.request, filter}}, () => this.onSearch())} />
          </Stack>

          <hr></hr>
          
          <Nav appearance="subtle">
            
            <CustomNavItem active={true} loading={this.state?.loading} text='Todos' count={this.state?.response?.count} onClick={() => this.setState({request: {...this.state.request, offset: 0}}, () => this.onSearch())} />

          </Nav>

          <Row style={{display: 'flex', flexDirection: 'column', overflowX: 'auto', height: 'calc(100vh - 370px)'}} >
            
            <Panel bordered header="[Sem viagem]" style={{minWidth: '280px', maxWidth: '280px', height: '100%', margin: '5px'}}>

              {/*
              <Card width={'100%'} shaded>
                <Card.Header as="h5">John Doe</Card.Header>
                <Card.Body>
                  A passionate developer with a love for learning new technologies. Enjoys building innovative
                  solutions and solving problems.
                </Card.Body>
                <Card.Footer>
                  <Text muted>Joined in January 2023</Text>
                </Card.Footer>
              </Card>
              */}

            </Panel>

            {_.map(this.state?.response?.rows, (trip) => {
              return (
                <Panel bordered header={
                  <div style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{trip.driver?.surname ? trip.driver.surname.charAt(0).toUpperCase() + trip.driver.surname.slice(1).toLowerCase() : ''}</div>
                } style={{minWidth: '280px', maxWidth: '280px', height: '100%', margin: '5px'}}>
                  <Placeholder.Paragraph />
                </Panel>
              )
            })}
          </Row>

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