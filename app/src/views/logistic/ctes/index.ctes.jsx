import React from 'react'
import { Badge, Button, HStack, IconButton, List, Nav, Panel, Popover, Stack, Whisper } from 'rsuite'

import dayjs from 'dayjs'

import PageContent from '../../../components/PageContent'

import { CustomBreadcrumb, CustomPagination, CustomSearch, DataTable } from '../../../controls'
import { FaEllipsisV, FaFileCode, FaFileDownload, FaFilePdf, FaPrint, FaSearchLocation, FaUpload } from 'react-icons/fa'
import { Service } from '../../../service'

import ViewUpload from './view.upload'
import ViewNfes from './view.nfes'
import ViewCte from './view.cte'
import ViewDacte from './view.dacte'

import _ from 'lodash'
import { Exception } from '../../../utils/exception'

const fields = [
  { label: 'Número', value: 'nCT' },
  { label: 'Remetente', value: 'sender' },
  { label: 'Chave de acesso', value: 'chCTe' },
]

export class LogisticCtes extends React.Component {

  viewCte = React.createRef()
  viewUpload = React.createRef()
  viewNfes = React.createRef()
  viewDacte = React.createRef()

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

  onDacte = async ({id, chCTe}) => {

    const response = await new Service().Post('logistic/cte/dacte', {id})

    if (response.data.pdf && typeof response.data.pdf === 'string') {
      
      const binaryString = atob(response.data.pdf); // Decodifica o Base64
      const binaryData = new Uint8Array(
        binaryString.split('').map((char) => char.charCodeAt(0))
      );
      const pdfBlob = new Blob([binaryData], { type: 'application/pdf' });

      // Create download link
      const downloadUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${chCTe}.pdf`; // Nome do arquivo baixado
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    }
  
  }

  columns = [
    //
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
    { selector: (row) => dayjs(row.dhEmi).format('DD/MM/YYYY HH:mm'), name: 'Emissão', minWidth: '140px', maxWidth: '140px'},
    { selector: (row) => row.nCT, name: 'Número', minWidth: '80px', maxWidth: '80px'},
    { selector: (row) => row.serie, name: 'Série', minWidth: '60px', maxWidth: '60px'},
    { selector: (row) => row.chCTe, name: 'Chave de acesso', minWidth: '350px', maxWidth: '350px'},
    { selector: (row) => row.shippiment?.sender?.surname, name: 'Remetente'},
    { selector: (row) => row.recipient?.surname, name: 'Destinatário', minWidth: '250px', maxWidth: '250px'},
    { selector: (row) => new Intl.NumberFormat('pt-BR', {style: 'decimal', minimumFractionDigits: 2}).format(parseFloat(row.baseCalculo)), name: 'Valor', minWidth: '100px', maxWidth: '100px', right: true},
    { selector: (row) => <div className='hidden'><FaPrint size='16px' color='tomato' style={{padding: '3px'}} onClick={() => this.onDacte(row)} /><FaFileCode size='16px' color='steelblue' style={{padding: '3px'}} /></div>, center: true, minWidth: '50px', maxWidth: '50px', style: {padding: '0px'}},
    { selector: (row) => <Badge style={{cursor: 'pointer'}} color={'blue'} onClick={() => this.onViewNfe(row)} content={_.size(row.cteNfes)}></Badge>, center: true, minWidth: '35px', maxWidth: '35px', style: {padding: '0px'}},
  ]

  render = () => {

    return (
      <Panel header={<CustomBreadcrumb menu={'Logística'} title={'Conhecimentos de Transporte'} />}>

        <ViewUpload ref={this.viewUpload} />

        <ViewNfes ref={this.viewNfes} />

        <ViewCte ref={this.viewCte} />

        <ViewDacte ref={this.viewDacte} />

        <PageContent>
          
          <Stack spacing={'6px'} direction={'row'} alignItems={'flex-start'} justifyContent={'space-between'}>
            <HStack>
              <CustomSearch loading={this.state?.loading} fields={fields} defaultPicker={'nCT'} value={this.state?.request?.search} onChange={(search) => this.setState({request: {search}}, () => this.onSearch())} />
            </HStack>
          </Stack>

          <hr></hr>
          
          <Nav appearance="subtle">
            <Nav.Item active={!this.state?.request?.bankAccount} onClick={() => this.setState({request: {...this.state.request, bankAccount: undefined}}, () => this.onSearch())}><center style={{width: 140}}>Todos<br></br>{this.state?.loading ? "-" : <>{this.state?.response?.count}</>}</center></Nav.Item>
            {_.map(this.state?.response?.bankAccounts, (bankAccount) => {
              return <Nav.Item eventKey="home" active={this.state?.request?.bankAccount?.id == bankAccount.id} onClick={() => this.setState({request: {...this.state.request, bankAccount: bankAccount}}, () => this.onSearch())}><center style={{width: 160}}>{<><img src={bankAccount?.bank?.image} style={{height: '16px'}} />&nbsp;&nbsp;{bankAccount.name || <>{bankAccount?.agency}-{bankAccount?.agencyDigit} / {bankAccount?.account}-{bankAccount?.accountDigit}</>}</>}<br></br>{this.state?.loading ? '-' : <>R$ {bankAccount.balance}</>}</center></Nav.Item>
            })}
          </Nav>

          <DataTable columns={this.columns} rows={this.state?.response?.rows} loading={this.state?.loading} onItem={this.onEdit} selectedRows={true} />
      
          <hr></hr>
          
          <Stack direction='row' alignItems='flexStart' justifyContent='space-between'>
            <Button appearance='primary' color='blue' startIcon={<FaUpload />} onClick={this.onUpload}>&nbsp;Upload</Button>
            <CustomPagination isLoading={this.state?.loading} total={this.state?.response?.count} limit={this.state?.request?.limit} activePage={this.state?.request?.offset + 1} onChangePage={(offset) => this.setState({request: {...this.state.request, offset: offset - 1}}, () => this.onSearch())} onChangeLimit={(limit) => this.setState({request: {...this.state.request, limit}}, () => this.onSearch())} />
          </Stack>
          
        </PageContent>
      </Panel>
    )
  }
}