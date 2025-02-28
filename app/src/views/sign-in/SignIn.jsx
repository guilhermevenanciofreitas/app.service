import React from 'react'
import { Form, Button, Panel, Stack, Divider, Steps, SelectPicker, Loader, Heading, toaster, Message } from 'rsuite'
import { FaSignInAlt } from 'react-icons/fa'
import { Service } from '../../service'
import { Col, Row } from 'react-grid-system'
import _ from 'lodash'
import { Exception } from '../../utils/exception'
import { checkAuthorization } from '../../App'
import { Navigate } from 'react-router-dom'

export class SignIn extends React.Component {
 
  componentDidMount = () => {

    const isAuth = checkAuthorization()

    if (isAuth) {
      this.setState({ redirect: '/' })
    }
    
  }

  signIn = async () => {
    try {
      this.setState({ loading: true })
      const signIn = await new Service().Post('login/sign-in', { email: this.state.email, password: this.state.password })
      this.authorize(signIn)
    } catch (error) {
      Exception.error(error)
    } finally {
      this.setState({ loading: false })
    }
  }

  companyBusinessChange = async (companyBusinessId) => {
    try {
      this.setState({ companyBusinessId, loading: true })
      const signIn = await new Service().Post('login/sign-in', { email: this.state.email, password: this.state.password, companyBusinessId })
      this.authorize(signIn)
    } catch (error) {
      Exception.error(error)
    } finally {
      this.setState({ loading: false })
    }
  }

  companyChange = async (companyId) => {
    try {
      this.setState({ companyId, loading: true })
      const signIn = await new Service().Post('login/sign-in', {
        email: this.state.email,
        password: this.state.password,
        companyBusinessId: this.state.companyBusinessId,
        companyId
      });
      this.authorize(signIn)
    } catch (error) {
      Exception.error(error)
    } finally {
      this.setState({ loading: false })
    }
  }

  authorize = async (signIn) => {

    if (signIn?.status == 200) {

      localStorage.setItem("Authorization", JSON.stringify(signIn.data))
      await toaster.push(<Message showIcon type='success'>{signIn.data.message}</Message>, { placement: 'topCenter', duration: 5000 })

      const urlParams = new URLSearchParams(window.location.search);
      const redirect = `${urlParams.get("redirect") || ''}` || "/dashboard"

      this.setState({ redirect: redirect })

    }

    if (signIn?.status == 201) {
      await toaster.push(<Message type='warning'>{signIn.data.message}</Message>, { placement: 'topCenter', duration: 5000 })
    }

    if (signIn?.status == 202) {
      await toaster.push(<Message type='warning'>{signIn.data.message}</Message>, { placement: 'topCenter', duration: 5000 })
      this.setState({password: ''})
    }

    if (signIn?.status == 211) {
      await toaster.push(<Message type='warning'>{signIn.data.message}</Message>, { placement: 'topCenter', duration: 5000 })
    }

    if (signIn?.status == 212) {
      const companyBusiness = _.map(signIn.data, (item) => ({ label: item.description, value: item.id }))
      this.setState({ companyBusiness })
    }

    if (signIn?.status == 213) {
      const company = _.map(signIn.data, (item) => ({ label: item.surname, value: item.id }))
      this.setState({ company })
    }

  }

  render = () => {

    if (this.state?.redirect) {
      return <Navigate to={this.state?.redirect} replace />
    }

    return (
      <Stack justifyContent="center" alignItems="center" direction="column" style={{ height: '100vh' }}>
        {_.size(this.state?.companyBusiness) == 0 && _.size(this.state?.company) == 0 && (
          <Panel bordered style={{ background: '#fff', width: 400 }} header={<Heading level={3}>Acesse sua conta!</Heading>}>
            <Form onSubmit={this.signIn}>
              <Row gutterWidth={0}>
                <Col md={12}>
                  <div className='form-control'>
                    <label className="textfield-filled">
                      <input type='text' value={this.state?.email} onChange={(event) => this.setState({ email: event.target.value })} autoFocus />
                      <span>Usuário ou e-mail</span>
                    </label>
                  </div>
                </Col>
                <Col md={12}>
                  <div className='form-control'>
                    <label className="textfield-filled">
                      <input type='password' value={this.state?.password} onChange={(event) => this.setState({ password: event.target.value })} />
                      <span>Senha</span>
                    </label>
                  </div>
                  <a style={{ float: 'right' }}>Esqueceu sua senha?</a>
                </Col>
              </Row>

              <Form.Group>
                <Stack spacing={6} divider={<Divider vertical />}>
                  <Button appearance="primary" type='submit' disabled={this.state?.loading}>
                    {this.state?.loading ? <><Loader />&nbsp;&nbsp; Entrando...</> : <><FaSignInAlt />&nbsp;&nbsp; Entrar</>}
                  </Button>
                </Stack>
              </Form.Group>
            </Form>
          </Panel>
        )}

        {_.size(this.state?.companyBusiness) >= 1 || _.size(this.state?.company) >= 1 && (
          <Panel bordered style={{ background: '#fff', width: '400px', height: '260px' }}>
            <Form>
              <Steps current={1}>
                <Steps.Item title="Entrar" />
                <Steps.Item title="Empresa" />
                <Steps.Item title="Confirmar" />
              </Steps>

              <Divider />
              
              {_.size(this.state?.companyBusiness) >= 1 && (
                <Form.Group>
                  <Form.ControlLabel><span>Empresa</span></Form.ControlLabel>
                  <SelectPicker
                    data={this.state?.companyBusiness}
                    value={this.state?.companyBusinessId}
                    onChange={this.companyBusinessChange}
                    searchable={false}
                    style={{ width: '100%' }}
                    placeholder="[Selecione]"
                  />
                </Form.Group>
              )}
              {_.size(this.state.company) >= 1 && (
                <Form.Group>
                  <Form.ControlLabel><span>Filial</span></Form.ControlLabel>
                  <SelectPicker
                    data={this.state?.company}
                    value={this.state?.companyId}
                    onChange={this.companyChange}
                    searchable={false}
                    style={{ width: '100%' }}
                    placeholder="[Selecione]"
                  />
                </Form.Group>
              )}
            </Form>
          </Panel>
        )}    
      </Stack>
    )
  }
}