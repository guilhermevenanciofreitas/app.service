import React from 'react'
import { Badge, Button, HStack, IconButton, List, Nav, Panel, Popover, Stack, Whisper } from 'rsuite'

import dayjs from 'dayjs'

import PageContent from '../../../components/PageContent'

import { CustomBreadcrumb, CustomPagination, CustomSearch, DataTable } from '../../../controls'
import { FaDownload, FaEllipsisV, FaFileCode, FaFileDownload, FaFilePdf, FaPrint, FaSearchLocation, FaUpload } from 'react-icons/fa'
import { Service } from '../../../service'

import { ViewUpload } from './view.upload'
import { ViewNfes } from './view.nfes'
import ViewCte from './view.cte'
import ViewDacte from './view.dacte'

import _ from 'lodash'
import { Exception } from '../../../utils/exception'
import { ReportViewer } from '../../../controls/components/ReportViewer'
import { Loading } from '../../../App'
import { CustomNavItem } from '../../../controls/custom/CustomNavItem'

const fields = [
  { label: 'Número', value: 'nCT' },
  { label: 'Chave de acesso', value: 'chCTe' },
]

export class LogisticCtes extends React.Component {

  viewCte = React.createRef()
  viewUpload = React.createRef()
  viewNfes = React.createRef()
  reportViewer = React.createRef()

  componentDidMount = () => {
    this.onSearch()
  }

  onSearch = () => {
    this.setState({loading: true}, async () => {
      try {
        
        const result = await new Service().Post('logistic/cte/ctes', this.state.request)
        this.setState({...result.data})
        
      } catch (error) {
        Exception.error(error)
      } finally {
        this.setState({loading: false})
      }
    })
  }

  onUpload = async () => {
    const submited = await this.viewUpload.current.upload()
    if (submited) this.onSearch()
  }

  onEdit = async ({id}) => {
    const cte = await this.viewCte.current.editCTe(id)
    if (cte) this.onSearch()
  }

  onNew = async () => {
    const cte = await this.viewCte.current.newCte()
    if (cte) this.onSearch()
  }

  onViewNfe = async (cte) => {
    cte = await this.viewNfes.current.show(cte)
    console.log(cte)
  }

  onDacte = async ({id}) => {
    try {

      Loading.Show()
      const response = await new Service().Post('logistic/cte/dacte', {id})
      this.reportViewer.current.visualize(response.data.pdf)

    } catch (error) {
      Exception.error(error)
    } finally {
      Loading.Hide()
    }
  }

  customCheckbox = React.forwardRef((props, ref) => {
    console.log(props.row)
    return (
      <div style={{display: 'flex', alignItems: 'center', height: '100%', padding: 0, margin: 0}}>
        <div style={{width: '4px', alignSelf: 'stretch', backgroundColor: props.name == 'select-all-rows' ? 'transparent' : 'springgreen', margin: '2px'}} />
        <span style={{fontWeight: 'bold', marginLeft: '10px' }}><input type="checkbox" ref={ref} {...props} /></span>
      </div>
    )
  })

  columns = [
    //
    {
      name: 'Seleção',
      cell: (row) => {

        let color = ''

        switch (row.cStat) {
          case 100:
            color = 'SpringGreen'
            break;
          case 101, 135:
            color = 'Tomato'
            break;
          default:
            color = 'Silver'
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
      minWidth: '40px',
      maxWidth: '40px'
    },
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
    </Whisper>, minWidth: '45px', maxWidth: '45px', center: true},
    { selector: (row) => dayjs(row.dhEmi).format('DD/MM/YYYY HH:mm'), name: 'Emissão', minWidth: '120px', maxWidth: '120px'},
    { selector: (row) => row.nCT, name: 'Número', minWidth: '75px', maxWidth: '75px'},
    { selector: (row) => row.serie, name: 'Série', minWidth: '50px', maxWidth: '50px'},
    { selector: (row) => row.chCTe, name: 'Chave de acesso', minWidth: '335px', maxWidth: '335px'},
    { selector: (row) => row.sender?.surname, name: 'Remetente'},
    { selector: (row) => row.recipient?.surname, name: 'Destinatário', minWidth: '350px', maxWidth: '350px'},
    { selector: (row) => new Intl.NumberFormat('pt-BR', {style: 'decimal', minimumFractionDigits: 2}).format(parseFloat(row.baseCalculo)), name: 'Valor', minWidth: '100px', maxWidth: '100px', right: true},
    { selector: (row) => <div className='hidden'><FaPrint size='16px' color='tomato' style={{padding: '3px'}} onClick={() => this.onDacte(row)} /><FaFileCode size='16px' color='steelblue' style={{padding: '3px'}} /></div>, center: true, minWidth: '60px', maxWidth: '60px'},
    { selector: (row) => <Badge style={{cursor: 'pointer'}} color={'blue'} onClick={() => this.onViewNfe(row)} content={_.size(row.cteNfes)}></Badge>, center: true, minWidth: '30px', maxWidth: '30px'},
  ]

  render = () => {

    return (
      <Panel header={<CustomBreadcrumb menu={'Logística'} title={'Conhecimentos'} />}>

        <ViewUpload ref={this.viewUpload} />

        <ViewNfes ref={this.viewNfes} />

        <ViewCte ref={this.viewCte} />

        <ReportViewer ref={this.reportViewer} />

        <PageContent>
          
          <Stack spacing={'6px'} direction={'row'} alignItems={'flex-start'} justifyContent={'space-between'}>
            <HStack>
              <CustomSearch loading={this.state?.loading} fields={fields} defaultPicker={'nCT'} value={this.state?.request?.search} onChange={(search) => this.setState({request: {search}}, () => this.onSearch())} />
            </HStack>
          </Stack>

          <hr></hr>
          
          <Nav appearance="subtle">
            
            <CustomNavItem active={this.state?.request?.cStat == undefined} loading={this.state?.loading} text='Todos' count={this.state?.response?.statusCount?.all} onClick={() => this.setState({request: {...this.state.request, offset: 0, cStat: undefined}}, () => this.onSearch())} />
            
            <CustomNavItem active={this.state?.request?.cStat == 'pending'} loading={this.state?.loading} color='Silver' text='Pendentes' count={this.state?.response?.statusCount?.pending} onClick={() => this.setState({request: {...this.state.request, offset: 0, cStat: 'pending'}}, () => this.onSearch())} />
            <CustomNavItem active={this.state?.request?.cStat == 'autorized'} loading={this.state?.loading} color='SpringGreen' text='Autorizados' count={this.state?.response?.statusCount?.autorized} onClick={() => this.setState({request: {...this.state.request, offset: 0, cStat: 'autorized'}}, () => this.onSearch())} />
            <CustomNavItem active={this.state?.request?.cStat == 'canceled'} loading={this.state?.loading} color='Tomato' text='Cancelados' count={this.state?.response?.statusCount?.canceled} onClick={() => this.setState({request: {...this.state.request, offset: 0, cStat: 'canceled'}}, () => this.onSearch())} />

          </Nav>

          <DataTable columns={this.columns} rows={this.state?.response?.rows} loading={this.state?.loading} onItem={this.onEdit} />
      
          <hr></hr>
          
          <Stack direction='row' alignItems='flexStart' justifyContent='space-between'>
            <Stack spacing={5}>
              {_.size(this.state?.selecteds) == 0 && <Button appearance='primary' color='blue' startIcon={<FaUpload />} onClick={this.onUpload}>&nbsp;Upload</Button>}
              {_.size(this.state?.selecteds) > 0 && <>
                <Button appearance='primary' color='blue' startIcon={<FaPrint />} onClick={this.onUpload}>&nbsp;Imprimir</Button>
                <Button appearance='primary' color='blue' startIcon={<FaDownload />} onClick={this.onUpload}>&nbsp;Arquivo XML</Button>
                {_.size(this.state?.selecteds)} registro(s)
              </>}
            </Stack>
            <CustomPagination isLoading={this.state?.loading} total={this.state?.response?.count} limit={this.state?.request?.limit} activePage={this.state?.request?.offset + 1} onChangePage={(offset) => this.setState({request: {...this.state.request, offset: offset - 1}}, () => this.onSearch())} onChangeLimit={(limit) => this.setState({request: {...this.state.request, limit}}, () => this.onSearch())} />
          </Stack>
          
        </PageContent>
      </Panel>
    )
  }
}