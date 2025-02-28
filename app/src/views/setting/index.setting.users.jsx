import React, { useState } from 'react';

import _ from 'lodash'

import { Breadcrumb, Button, Drawer, HStack, IconButton, List, Loader, Nav, Pagination, Panel, Stack, useToaster } from 'rsuite';

import { Divider } from 'rsuite';
import PageContent from '../../components/PageContent';

import { AutoComplete, CustomBreadcrumb, CustomDateRangePicker, CustomFilter, CustomSearch, DataTable } from '../../controls';
import { MdAddCircleOutline, MdCheckCircleOutline } from 'react-icons/md';

import Link from '../../components/NavLink'
import { Service } from '../../service';
import { ViewUser } from './view.user';
import { Exception } from '../../utils/exception';
import { FaPlusCircle, FaSyncAlt, FaTrash, FaUserMinus } from 'react-icons/fa';
import { Search } from '../../search';

const fields = [
  { label: 'Todos', value: undefined },
  { label: 'Nome', value: 'name' },
  { label: 'E-mail', value: 'email' },
]

const Role = ({role, onChange}) => {

  const [subting, setSubmitting] = useState(false)
  const [userRole, setUserRole] = useState(role)

  const onChangeRole = async (role) => {
    try {
      
      setSubmitting(true)

      if (role) {
        await onChange(role)
      }
      
      setUserRole(role)

    } catch (error) {

    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className='form-control'>
      {subting && <FaSyncAlt className='animated rotate' color='#696969' />}
      {!subting && (
        <AutoComplete label='Cargo' value={userRole} text={(item) => `${item.name}`} onChange={onChangeRole} onSearch={async (search) => await Search.role(search)}>
          <AutoComplete.Result>
              {(item) => <span>{item.name}</span>}
          </AutoComplete.Result>
        </AutoComplete>
      )}
    </div>
  )

}

const CompanyUsers = (row) => {

  const [open, setOpen] = useState(false)

  const onChange = async ({companyUserId, roleId}) => {

    const result = await new Service().Post('setting/user/change-company-role', {companyUserId, roleId})

    console.log(result)

  }

  return (
    <>
      <IconButton icon={<FaPlusCircle />} appearance="primary" onClick={() => setOpen(true)}>
        Gerenciar Empresas
      </IconButton>

      <Drawer open={open} onClose={() => setOpen(false)} size="sm">
        <Drawer.Header><Drawer.Title>Filiais</Drawer.Title></Drawer.Header>
        <Drawer.Body>
          <List bordered hover>
            {_.map(row.companyUsers, (companyUser, index) => (
                <List.Item key={index} style={{cursor: 'pointer', display: 'flex', justifyContent: 'space-between'}}>
                  <div className='form-control'>
                      <label class="textfield-filled">
                          <input type='text' value={companyUser.company?.surname} readOnly />
                          <span>Empresa</span>
                      </label>
                  </div>
                  <Role role={companyUser.role} onChange={(role) => onChange({companyUserId: companyUser.id, roleId: role?.id})} />
                </List.Item>
              ))}
          </List>
        </Drawer.Body>
      </Drawer>
    </>
  )
}

export class SettingUsers extends React.Component {

  viewUser = React.createRef()

  componentDidMount() {
    this.onSearch()
  }

  onSearch = async () => {
    try {
      this.setState({loading: true})
      const result = await new Service().Post('setting/user/users', this.state?.request)
      this.setState({...result.data})
    } catch (error) {
      Exception.error(error)
    } finally {
      this.setState({loading: false})
    }
  }

  onEdit = async (user) => {
    try {
      await this.viewUser.current.edit(user)
    } catch (error) {
      Exception.error(error)
    }
  }

  onNew = async () => {
    const user = await this.viewUser.current.new()
    if (user) this.onSearch()
  }

  state = {
    companies: [
      { id: 1, name: 'Empresa A', role: 'CEO' },
      { id: 2, name: 'Empresa B', role: 'Gerente' },
      { id: 3, name: 'Empresa C', role: 'Desenvolvedor' }
    ]
  }

  columns = [
    { selector: (row) => <DataTable.RowColor color={row.status == 'active' ? 'springgreen' : 'tomato'}>{row.userName}</DataTable.RowColor>, name: 'Nome' },
    { selector: (row) => row.userMember?.email, name: 'E-mail' },
    { selector: (row) => <CompanyUsers companyUsers={row.companyUsers} />}
  ]

  render = () => {

    return (
      <Panel header={<CustomBreadcrumb menu={'Configurações'} title={'Usuários'} />}>

        <ViewUser ref={this.viewUser} />

        <PageContent>
          
          <Stack spacing={'6px'} direction={'row'} alignItems={'flex-start'} justifyContent={'space-between'}>
            
            <HStack>

              <CustomSearch loading={this.state?.loading} fields={fields} value={this.state?.request?.search} onChange={(search) => this.setState({request: {search}}, () => this.onSearch())} />
              
              {/*<CustomDateRangePicker value={this.state?.request?.date} onChange={this.onApplyDate} />*/}

              {/*
              <CustomFilter.Whisper badge={_.size(this.state?.request?.filter)}>
                {(props) => <Filter filter={this.state?.request?.filter} onApply={this.onApplyFilter} {...props} />}
              </CustomFilter.Whisper>
              */}

            </HStack>

          </Stack>

          <hr></hr>
          
          <Nav appearance="subtle">
            <Nav.Item active={!this.state?.request?.status} onClick={() => this.setState({request: {...this.state.request, status: undefined}}, () => this.onSearch())}><center style={{width: 140}}>Todos<br></br>{this.state?.loading ? "-" : <>{_.sum(_.map(this.state?.response?.userStatus, (c) => parseFloat(c.statusCount)))}</>}</center></Nav.Item>
            {_.map(this.state?.response?.userStatus, (status) => {
              return <Nav.Item eventKey="home" active={this.state?.request?.status == status.status} onClick={() => this.setState({request: {...this.state.request, status: status.status}}, () => this.onSearch())}><center style={{width: 160}}>{<>{status.status == 'active' ? 'Ativos' : 'Inativos'}</>}<br></br>{this.state?.loading ? '-' : <>{status.statusCount}</>}</center></Nav.Item>
            })}
          </Nav>

          <DataTable columns={this.columns} rows={this.state?.response?.rows} loading={this.state?.loading} onItem={this.onEdit} />

          <hr></hr>

          <Stack direction='row' alignItems='flexStart' justifyContent='space-between'>

            <Button appearance='primary' color='blue' startIcon={<FaPlusCircle />} onClick={this.onNew}>Novo</Button>

            {/*
            <Pagination layout={['-', 'limit', '|', 'pager']} size={'md'} prev={true} next={true} first={true} last={true} ellipsis={false} boundaryLinks={false} total={200} limit={50} limitOptions={[30,50,100]} maxButtons={6} activePage={1}
              //onChangePage={setActivePage}
              //onChangeLimit={setLimit}
            />
            */}

          </Stack>
        </PageContent>
      </Panel>
    )
  }

}