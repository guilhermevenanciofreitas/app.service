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
import { FaCity, FaPlusCircle, FaSyncAlt, FaTrash, FaUserMinus } from 'react-icons/fa';
import { Search } from '../../search';
import Swal from 'sweetalert2';
import { Navigate } from 'react-router-dom';

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
      Exception.error(error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className='form-control'>
      {subting && <center><FaSyncAlt className='animated rotate' color='#696969' /></center>}
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

  const [open, setOpen] = useState(false);

  const [companyUsers, setCompanyUsers] = useState(row.user.companyUsers || [])

  const [company, setCompany] = useState(null)
  const [role, setRole] = useState(null)

  const onChange = async ({ companyUserId, roleId }) => {
    try {

      await new Service().Post('setting/user/change-company-role', { companyUserId, roleId })

    } catch (error) {
      Exception.error(error)
    }
  }

  const onDelete = async ({companyUserId}) => {
    try {

      const r = await Swal.fire({text: 'Tem certeza que deseja excluir ?', icon: 'question', showCancelButton: true, confirmButtonText: 'Sim', cancelButtonText: 'Não'})
      if (!r.isConfirmed) return

      const rows = _.filter(companyUsers, (item) => item.id != companyUserId)

      await new Service().Post('setting/user/remove-company-role', { companyUserId })
  
      setCompanyUsers(rows)
  
    } catch (error) {
      Exception.error(error)
    }
  }

  const handleAddCompanyUser = async () => {
    try {

      if (!company || !role) return;
    
      let newEntry = { company, userId: row.user.id, role}
  
      const result = await new Service().Post('setting/user/add-company-role', newEntry)
      
      newEntry.id = result.data.id
  
      setCompanyUsers([...companyUsers, newEntry])
      setCompany(null)
      setRole(null)
  
    } catch (error) {
      Exception.error(error)
    }
  }

  return (
    <div className='hidden'>

      <IconButton circle icon={<FaCity />} appearance="primary" onClick={() => setOpen(true)} />

      <Drawer open={open} onClose={() => setOpen(false)} size="sm">
        <Drawer.Header><Drawer.Title>Filiais</Drawer.Title></Drawer.Header>
        <Drawer.Body style={{padding: '30px'}}>
          <table className="table-bordered table-hover">
            <thead>
              <tr>
                <th>Empresa</th>
                <th>Função</th>
                <th style={{width: '40px'}}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {_.map(companyUsers, (companyUser, index) => (
                <tr key={index}>
                  <td>
                    <div className="form-control">
                      <label className="textfield-filled">
                        <input type="text" value={companyUser.company?.surname} readOnly />
                        <span>Empresa</span>
                      </label>
                    </div>
                  </td>
                  <td>
                    <Role role={companyUser.role} onChange={(role) => onChange({ companyUserId: companyUser.id, roleId: role?.id })} />
                  </td>
                  <td style={{textAlign: 'center'}}>
                    <FaTrash size='16px' color='tomato' style={{cursor: 'pointer'}} onClick={() => onDelete({ companyUserId: companyUser.id })} />
                  </td>
                </tr>
              ))}
              <tr>
                <td>
                  <div className='form-control'>
                    <AutoComplete label='Empresa' value={company} text={(item) => `${item.surname}`} onChange={setCompany} onSearch={async (search) => await Search.company(search)}>
                      <AutoComplete.Result>
                          {(item) => <span>{item.surname}</span>}
                      </AutoComplete.Result>
                    </AutoComplete>
                  </div>
                </td>
                <td>
                  <Role role={role} onChange={setRole} />
                </td>
                <td>
                  <Button appearance="primary" color='green' onClick={handleAddCompanyUser}><FaPlusCircle /> &nbsp; Adicionar</Button>
                </td>
              </tr>
            </tbody>
          </table>
        </Drawer.Body>
      </Drawer>
    </div>
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
    try {
      const user = await this.viewUser.current.new()
      if (user) this.onSearch()
    } catch (error) {
      Exception.error(error)
    }
  }

  onMenuClick = () => {
    this.setState({redirect: '/settings'})
  }

  columns = [
    { selector: (row) => <DataTable.RowColor color={row.status == 'active' ? 'springgreen' : 'tomato'}>{row.userName}</DataTable.RowColor>, name: 'Nome' },
    { selector: (row) => row.userMember?.email, name: 'E-mail' },
    { selector: (row) => <CompanyUsers user={row} />, minWidth: '70px', maxWidth: '70px'}
  ]

  render = () => {

    if (this.state?.redirect) {
      return <Navigate to={this.state?.redirect} replace />
    }

    return (
      <Panel header={<CustomBreadcrumb menu={'Configurações'} title={'Usuários'} onMenuClick={this.onMenuClick} />}>

        <ViewUser ref={this.viewUser} />

        <PageContent>
          
          <Stack spacing={'6px'} direction={'row'} alignItems={'flex-start'} justifyContent={'space-between'}>
            <HStack>
              <CustomSearch loading={this.state?.loading} fields={fields} value={this.state?.request?.search} onChange={(search) => this.setState({request: {search}}, () => this.onSearch())} />
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
          </Stack>

        </PageContent>
      </Panel>
    )

  }

}