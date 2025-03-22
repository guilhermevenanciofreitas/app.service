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
import CustomDragAndDrop from '../../../controls/custom/CustomDragAndDrop';
//import DragAndDrop from './DragAndDrop';

const fields = [
  { label: 'Nº Viagem', value: 'tripTravelId' },
  { label: 'Documento de transporte', value: 'documentTransport' },
]

class Filter extends React.Component {

  state = {
    filter: {
      //company: this.props.filter.company,
      driver: this.props.filter.driver
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
              <AutoComplete label="Motorista" value={this.state?.filter?.driver} text={(item) => `${item.surname}`} onChange={(driver) => this.setState({ filter: {...this.state.filter, driver} })} onSearch={async (search) => await Search.driver(search)} autoFocus>
                <AutoComplete.Result>
                  {(item) => <span>{item.surname}</span>}
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

export class ExpeditionDispatches extends React.Component {

  viewShippiment = React.createRef()
  viewCtes = React.createRef()

  constructor(props) {
    super(props)

    this.state = {
      request: {
        filter: {

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
      const result = await new Service().Post('expedition/dispatch/dispatches', this.state.request)
      this.setState({...result.data})

    } catch (error) {
      Exception.error(error)
    } finally {
      this.setState({loading: false})
    }
  }

  onChange = async (trips, {item, target}) => {

    const before = _.cloneDeep(this.state.response.trips)

    try {

      const tripId = target.id
      const shippimentId = item.id

      console.log(tripId, shippimentId)

      this.setState({response: {...this.state?.response, trips}})

      //this.setState({loading: true})
      await new Service().Post('expedition/dispatch/change', {tripId, shippimentId})


      //this.setState({...result.data})

    } catch (error) {
      this.setState({response: {...this.state?.response, trips: before}})
      Exception.error(error)
    } finally {
      this.setState({loading: false})
    }
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
              <CustomSearch loading={this.state?.loading} fields={fields} defaultPicker={'tripTravelId'} value={this.state?.request?.search} onChange={(search) => this.setState({request: {...this.state.request, search}}, () => this.onSearch())} />
            </Stack>
            <Filter filter={this.state?.request?.filter} onChange={(filter) => this.setState({request: {...this.state?.request, filter}}, () => this.onSearch())} />
          </Stack>

          <hr></hr>
          
          <Nav appearance="subtle">
            <CustomNavItem active={true} loading={this.state?.loading} text='Todos' count={this.state?.response?.count} onClick={() => this.setState({request: {...this.state.request, offset: 0}}, () => this.onSearch())} />
          </Nav>

          <Row style={{display: 'flex', flexDirection: 'column', overflowX: 'auto', height: 'calc(100vh - 370px)'}} >
            
            <div style={{height: '100%', padding: '10px', overflow: 'hidden'}}>
              <CustomDragAndDrop values={this.state?.response?.trips} itemsKey='shippiments' onChange={this.onChange}>
                {{
                  renderHeader: (trip) => {
                    const driver = !trip.id ? <center>[Sem viagem]</center> : `${trip.tripTravelId} - ${trip.driver?.surname ? trip.driver.surname.charAt(0).toUpperCase() + trip.driver.surname.slice(1).toLowerCase() : ''}`
                    const vehicle = !trip.id ? `-` : `${trip.vehicle?.identity.replace(/[^a-zA-Z0-9]/g, "").replace(/^(.{3})(.)/, "$1-$2")} - ${trip.haulage1?.identity.replace(/[^a-zA-Z0-9]/g, "").replace(/^(.{3})(.)/, "$1-$2") || ''} - ${trip.haulage2?.identity.replace(/[^a-zA-Z0-9]/g, "").replace(/^(.{3})(.)/, "$1-$2") || ''}`
                    return (
                      <div style={{minHeight: '35px', maxHeight: '35px'}}>
                        <span style={{ 
                          fontSize: 14, 
                          fontWeight: "bold", 
                          whiteSpace: "nowrap", 
                          overflow: "hidden", 
                          textOverflow: "ellipsis",
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'center' 
                        }}>
                          <div>
                            {driver}
                          </div>
                          {!trip.id && <FaFilter color='#2196f3' />}
                        </span>
                        <center>{vehicle}</center>
                      </div>
                    )
                  },
                  renderItem: (item) => (
                    <span>
                      # {item.documentNumber}
                      <br></br>
                      <b>Rem.:</b> {item.sender?.surname}
                      <br></br>
                      <b>Dest.:</b> {item.sender?.surname}
                    </span>
                  ),
                }}
              </CustomDragAndDrop>
            </div>

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