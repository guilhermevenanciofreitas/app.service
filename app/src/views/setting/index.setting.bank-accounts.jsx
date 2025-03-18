import React from 'react';

import _ from 'lodash'

import { Breadcrumb, Button, HStack, Nav, Pagination, Panel, Stack } from 'rsuite';

import { Divider } from 'rsuite';
import PageContent from '../../components/PageContent';

import { CustomBreadcrumb, CustomDateRangePicker, CustomFilter, CustomPagination, CustomSearch, DataTable } from '../../controls';
import { MdAddCircleOutline, MdCheckCircleOutline } from 'react-icons/md';

import Link from '../../components/NavLink'
import { Service } from '../../service';
import { ViewRole } from './view.role';

const fields = [
  //{ label: 'Todos', value: undefined },
  { label: 'Conta', value: 'account' },
  { label: 'Agência', value: 'agency' },
]

export class SettingBankAccounts extends React.Component {

  viewRole = React.createRef()

  componentDidMount() {
    this.onSearch()
  }

  onNewRole = () => {
    this.viewRole.current.newRole()
  }

  onEditRole = (role) => {
    this.viewRole.current.editRole(role.id)
  }

  onSearch = () => {
    this.setState({loading: true}, async() => {
      try {
        await new Service().Post('setting/bank-account/bank-accounts', this.state.request).then((result) => this.setState({...result.data})).finally(() => this.setState({loading: false}))
      } catch (error) {
        toast.error(error.message)
      }
    })
  }

  onMenuClick = () => {
    this.setState({redirect: '/settings'})
  }

  columns = [
    //{ selector: (row) => row.id, name: 'Id' },
    { selector: (row) => <><img src={row.bank?.image} style={{height: '20px'}} /> {row.bank?.name}</>, name: 'Banco' },
    { selector: (row) => `${row.agency}`, name: 'Agência' },
    { selector: (row) => `${row.account}`, name: 'Conta' },
  ]

  render = () => {

    return (
      <Panel header={<CustomBreadcrumb menu={'Configurações'} title={'Bancos'} onMenuClick={this.onMenuClick} />}>

        <ViewRole ref={this.viewRole} />

        <PageContent>
          
          <Stack spacing={'6px'} direction={'row'} alignItems={'flex-start'} justifyContent={'space-between'}>
            <HStack>
              <CustomSearch placeholder={'Conta'} loading={this.state?.loading} fields={fields} value={this.state?.request?.search} onChange={(search) => this.setState({request: {search}}, () => this.onSearch())} />
            </HStack>
          </Stack>

          <hr></hr>

          <Nav appearance="subtle">
            <Nav.Item eventKey="all" active><center style={{width: 100}}>Todos<br></br>{this.state?.loading ? '-' : '339'}</center></Nav.Item>
            <Nav.Item eventKey="active"><center style={{width: 100}}>Ativos<br></br>{this.state?.loading ? '-' : '334'}</center></Nav.Item>
            <Nav.Item eventKey="inactive"><center style={{width: 100}}>Inativos<br></br>{this.state?.loading ? '-' : '5'}</center></Nav.Item>
          </Nav>

          <DataTable columns={this.columns} rows={this.state?.response?.rows} loading={this.state?.loading} onItem={this.onEditRole} />

          <hr></hr>

          <Stack direction='row' alignItems='flexStart' justifyContent='space-between'>
            <Stack spacing={5}>
              <Button appearance='primary' color='blue' startIcon={<MdAddCircleOutline />} onClick={this.onNewRole}>Novo banco</Button>
            </Stack>            
            <CustomPagination isLoading={this.state?.loading} total={this.state?.response?.count} limit={this.state?.request?.limit} activePage={this.state?.request?.offset + 1} onChangePage={(offset) => this.setState({request: {...this.state.request, offset: offset - 1}}, () => this.onSearch())} onChangeLimit={(limit) => this.setState({request: {...this.state.request, limit}}, () => this.onSearch())} />
          </Stack>

        </PageContent>
      </Panel>
    )
  }

}