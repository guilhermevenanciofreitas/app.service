import React from 'react';

import _ from 'lodash'

import dayjs from 'dayjs'

import { Badge, Breadcrumb, Button, Col, HStack, Nav, Pagination, Panel, Placeholder, Row, Stack, Text } from 'rsuite';

import { Divider } from 'rsuite';
import PageContent from '../../../components/PageContent';

import { CustomBreadcrumb, CustomDateRangePicker, CustomFilter, CustomPagination, CustomSearch, DataTable } from '../../../controls';
import { MdAddCircleOutline, MdCheckCircleOutline } from 'react-icons/md';
import { FaFileImport, FaTransgender, FaUpload } from 'react-icons/fa';
import { Service } from '../../../service';

const fields = [
  { label: 'Número', value: 'nCT' },
  { label: 'Remetente', value: 'sender' },
  { label: 'Chave de acesso', value: 'chaveCt' },
]

export class LogisticTrips extends React.Component {

  componentDidMount = () => {
    this.onSearch()
  }

  onSearch = () => {
    this.setState({loading: true}, async () => {
      try {
        await new Service().Post('logistic/trip/trips', this.state.request).then((result) => this.setState({...result.data})).finally(() => this.setState({loading: false}))
      } catch (error) {
        toast.error(error.message)
      }
    })
  }

  render = () => {
    return (
      <Panel header={<CustomBreadcrumb menu={'Logística'} title={'Viagens'} />}>
        <PageContent>
              
          <Row style={{display: 'flex', overflow: 'scroll'}} >
          
            <Panel bordered header="Card title" style={{minWidth: '300px', height: 'calc(100vh - 180px)'}}>
              <Placeholder.Paragraph />
            </Panel>

            {_.map(this.state?.response?.rows, (trip) => {
              return (
                <Panel bordered header={`${trip.driver?.surname}`} style={{minWidth: '300px', height: 'calc(100vh - 180px)'}}>
                  <Placeholder.Paragraph />
                </Panel>
              )
            })}
          </Row>
            
        </PageContent>
      </Panel>
    )
  }
}