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
import { FaPlusCircle } from 'react-icons/fa';
import { Exception } from '../../utils/exception';
import { Navigate } from 'react-router-dom';

const fields = [
  { label: 'Cargo', value: 'name' },
]

export class SettingRoles extends React.Component {

  viewRole = React.createRef()

  componentDidMount() {
    this.onSearch()
  }

  onSearch = async () => {
    try {
      this.setState({loading: true})
      const result = await new Service().Post('setting/role/roles', this.state?.request)
      this.setState({...result.data})
    } catch (error) {
      Exception.error(error)
    } finally {
      this.setState({loading: false})
    }
  }

  onNew = () => {
    this.viewRole.current.new()
  }

  onEdit = async (role) => {
    try {
      await this.viewRole.current.edit(role)
    } catch (error) {
      Exception.error(error)
    }
  }

  onMenuClick = () => {
    this.setState({redirect: '/settings'})
  }

  columns = [
    { selector: (row) => row.name, name: 'Cargo' },
  ]

  render = () => {

    if (this.state?.redirect) {
      return <Navigate to={this.state?.redirect} replace />
    }
    
    return (
      <Panel header={<CustomBreadcrumb menu={'Configurações'} title={'Cargos'} onMenuClick={this.onMenuClick} />}>

        <ViewRole ref={this.viewRole} />

        <PageContent>
          
          <Stack spacing={'6px'} direction={'row'} alignItems={'flex-start'} justifyContent={'space-between'}>
            <HStack>
              <CustomSearch placeholder={'Cargo'} loading={this.state?.loading} fields={fields} value={this.state?.request?.search} onChange={(search) => this.setState({request: {search}}, () => this.onSearch())} />
            </HStack>
          </Stack>

          <hr></hr>

          <Nav appearance="subtle">
            <Nav.Item eventKey="all" active><center style={{width: 100}}>Todos<br></br>{this.state?.loading ? '-' : this.state?.response?.count}</center></Nav.Item>
            {/*
            <Nav.Item eventKey="active"><center style={{width: 100}}>Ativos<br></br>{this.state?.loading ? '-' : '334'}</center></Nav.Item>
            <Nav.Item eventKey="inactive"><center style={{width: 100}}>Inativos<br></br>{this.state?.loading ? '-' : '5'}</center></Nav.Item>
            */}
          </Nav>

          <DataTable columns={this.columns} rows={this.state?.response?.rows} loading={this.state?.loading} onItem={this.onEdit} />

          <hr></hr>

          <Stack direction='row' alignItems='flexStart' justifyContent='space-between'>
              <Stack spacing={5}>
                <Button appearance='primary' color='blue' startIcon={<FaPlusCircle />} onClick={this.onNew}>Novo</Button>
              </Stack>
              <CustomPagination isLoading={this.state?.loading} total={this.state?.response?.count} limit={this.state?.request?.limit} activePage={this.state?.request?.offset + 1} onChangePage={(offset) => this.setState({request: {...this.state.request, offset: offset - 1}}, () => this.onSearch())} onChangeLimit={(limit) => this.setState({request: {...this.state.request, limit}}, () => this.onSearch())} />
          </Stack>

        </PageContent>
      </Panel>
    )
  }

}