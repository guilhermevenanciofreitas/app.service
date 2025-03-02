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
      Exception.error(error)
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

  const [open, setOpen] = useState(false);

  const [companyUsers, setCompanyUsers] = useState(row.user.companyUsers || [])

  const [company, setCompany] = useState(null)
  const [role, setRole] = useState(null)

  const onChange = async ({ companyUserId, roleId }) => {
    await new Service().Post('setting/user/change-company-role', { companyUserId, roleId })
  }

  const onDelete = async ({companyUserId}) => {

    const rows = _.filter(companyUsers, (item) => item.id != companyUserId)

    await new Service().Post('setting/user/remove-company-role', { companyUserId })

    setCompanyUsers(rows)

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
    <>
      <IconButton icon={<FaPlusCircle />} appearance="primary" onClick={() => setOpen(true)}>
        Gerenciar Empresas
      </IconButton>

      <Drawer open={open} onClose={() => setOpen(false)} size="sm">
        <Drawer.Header><Drawer.Title>Filiais</Drawer.Title></Drawer.Header>
        <Drawer.Body>
          
          <List bordered hover>
            {_.map(companyUsers, (companyUser, index) => (
              <List.Item key={index} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}>
                <div className="form-control">
                  <label className="textfield-filled">
                    <input type="text" value={companyUser.company?.surname} readOnly />
                    <span>Empresa</span>
                  </label>
                </div>
                <Role role={companyUser.role} onChange={(role) => onChange({ companyUserId: companyUser.id, roleId: role?.id })} />
                <button onClick={() => onDelete({companyUserId: companyUser.id})}>Excluir</button>
              </List.Item>
            ))}
          </List>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <AutoComplete label='Empresa' value={company} text={(item) => `${item.surname}`} onChange={setCompany} onSearch={async (search) => await Search.company(search)}>
              <AutoComplete.Result>
                  {(item) => <span>{item.surname}</span>}
              </AutoComplete.Result>
            </AutoComplete>
            <Role role={role} onChange={setRole} />
            <IconButton icon={<FaPlusCircle />} appearance="primary" onClick={() => handleAddCompanyUser()}>
              Adicionar
            </IconButton>
          </div>
          
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
    try {
      const user = await this.viewUser.current.new()
      if (user) this.onSearch()
    } catch (error) {
      Exception.error(error)
    }
  }

  columns = [
    { selector: (row) => <DataTable.RowColor color={row.status == 'active' ? 'springgreen' : 'tomato'}>{row.userName}</DataTable.RowColor>, name: 'Nome' },
    { selector: (row) => row.userMember?.email, name: 'E-mail' },
    { selector: (row) => <CompanyUsers user={row} />}
  ]

  render = () => {

    return (
      <Panel header={<CustomBreadcrumb menu={'Configurações'} title={'Usuários'} />}>

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