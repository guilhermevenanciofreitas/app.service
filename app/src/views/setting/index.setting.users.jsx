import React from 'react';

import _ from 'lodash'

import { Breadcrumb, Button, HStack, Nav, Pagination, Panel, Stack } from 'rsuite';

import { Divider } from 'rsuite';
import PageContent from '../../components/PageContent';

import { CustomBreadcrumb, CustomDateRangePicker, CustomFilter, CustomSearch, DataTable } from '../../controls';
import { MdAddCircleOutline, MdCheckCircleOutline } from 'react-icons/md';

import Link from '../../components/NavLink'
import { Service } from '../../service';
import ViewUser from './view.user';
import { Exception } from '../../utils/exception';
import { FaPlusCircle } from 'react-icons/fa';

const fields = [
  { label: 'Todos', value: undefined },
  { label: 'Nome', value: 'name' },
  { label: 'E-mail', value: 'email' },
]

class SettingUsers extends React.Component {

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
    this.viewUser.current.editUser(user.id).then((user) => {
      if (user) this.onSearch()
    })
  }

  onNew = () => {
    this.viewUser.current.newUser().then((user) => {
      if (user) this.onSearch()
    })
  }

  columns = [
    { selector: (row) => <DataTable.RowColor color={row.status == 'active' ? 'springgreen' : 'tomato'}>{row.name}</DataTable.RowColor>, name: 'Nome' },
    { selector: (row) => row.email, name: 'E-mail' },
    { selector: (row) => row.role?.name, name: 'Cargo' },
  ]

  render = () => {

    return (
      <>

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
      </>
    )
  }

}

class Page extends React.Component {

  render = () => {
    return (
      <Panel header={<CustomBreadcrumb menu={'Configurações'} title={'Usuários'} />}>
        <SettingUsers />
      </Panel>
    )
  }

}

export default Page;