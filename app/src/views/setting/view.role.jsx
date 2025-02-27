import React from "react";
import { Button, CheckTree, Divider, Form, Grid, Input, Loader, Message, Modal, toaster } from 'rsuite';
import { Container, Row, Col } from 'react-grid-system';


import { PhotoPicker, ViewModal } from "../../controls";
import { MdCheckCircleOutline } from "react-icons/md";
import { Service } from "../../service";
import { Loading } from "../../App";

import _ from "lodash";
import { Exception } from "../../utils/exception";

const permissions = [
    { value: 'calendar', children: [
        {label: 'Visualizar', value: 'C99A9C76-BCE0-4007-8FE8-27DA5C7BA142'},
        {label: 'Cadastrar', value: 'C947A01A-6D8B-4F47-9C54-92C9CE6FDFA8'},
        {label: 'Editar', value: '8D5C0B06-0F09-42AE-9823-A261F1E98109'},
        {label: 'Excluir', value: '0DAAE48E-BD1A-4C45-9644-5F90E3C4A452'},
    ]},
    { value: 'called', children: [
        {label: 'Visualizar', value: 'C99A9C76-BCE0-4007-8FE8-27DA5C7BA143'},
        {label: 'Cadastrar', value: 'C947A01A-6D8B-4F47-9C54-92C9CE6FDFA9'},
        {label: 'Editar', value: '8D5C0B06-0F09-42AE-9823-A261F1E98100'},
        {label: 'Criar resolução', value: '0DAAE48E-BD1A-4C45-9644-5F90E3C4A454'},
        {label: 'Excluir', value: '0DAAE48E-BD1A-4C45-9644-5F90E3C4A453'},
    ]},
    { value: 'customer', children: [
        {label: 'Visualizar', value: 'C99A9C76-BCE0-4007-8FE8-27DA5C7BA141'},
        {label: 'Cadastrar', value: 'C947A01A-6D8B-4F47-9C54-92C9CE6FDFA7'},
        {label: 'Editar', value: '8D5C0B06-0F09-42AE-9823-A261F1E98108'},
        {label: 'Excluir', value: '0DAAE48E-BD1A-4C45-9644-5F90E3C4A451'},
    ]},
    { value: 'supplier', children: [
        {label: 'Visualizar', value: '90CE2715-A5DF-4EA3-A658-0F2E076A5441'},
        {label: 'Cadastrar', value: '9EB31BD7-EABB-46E8-B4B7-62053C561E56'},
        {label: 'Editar', value: '956E095E-46C9-4DD0-828B-EA456ED3E803'},
        {label: 'Excluir', value: 'A606B1CC-BBF7-4489-9948-2DD71D891CF2'},
    ]},
    { value: 'product', children: [
        {label: 'Visualizar', value: 'CE879C5F-57D2-4A53-AC55-0F9E77CF20CB'},
        {label: 'Cadastrar', value: 'B2627091-06DE-49FA-A0B1-508489FFF04E'},
        {label: 'Editar', value: '650EA2F9-9365-4162-AACC-BB0B971CF4BA'},
        {label: 'Excluir', value: 'FFC90B11-F308-4B32-BB14-4F1180D90B09'},
    ]},
    { value: 'service', children: [
        {label: 'Visualizar', value: 'CE879C5F-57D2-4A53-AC55-0F9E77CF20CB'},
        {label: 'Cadastrar', value: 'B2627091-06DE-49FA-A0B1-508489FFF04E'},
        {label: 'Editar', value: '650EA2F9-9365-4162-AACC-BB0B971CF4BA'},
        {label: 'Excluir', value: 'FFC90B11-F308-4B32-BB14-4F1180D90B09'},
    ]},
    
]

const data = [
    {
        label: 'Caledário', value: 'calendar', children: _.filter(permissions, (c) => c.value == 'calendar')[0]?.children
    },
    {
        label: 'Chamados', value: 'called', children: _.filter(permissions, (c) => c.value == 'called')[0]?.children
    },
    {
        label: 'Cadastros', children: [
            {
                label: 'Clientes', value: 'customer', children: _.filter(permissions, (c) => c.value == 'customer')[0]?.children
            },
            {
                label: 'Fornecedores', value: 'supplier', children: _.filter(permissions, (c) => c.value == 'supplier')[0]?.children
            },
            {
                label: 'Produtos', value: 'product', children: _.filter(permissions, (c) => c.value == 'product')[0]?.children
            },
            {
                label: 'Serviços', value: 'service', children: _.filter(permissions, (c) => c.value == 'service')[0]?.children
            },
            {
                label: 'Anúncios', value: '3.5', children: [
                    {label: 'Visualizar', value: '3.5.1'},
                    {label: 'Cadastrar', value: '3.5.2'},
                    {label: 'Editar', value: '3.5.3'},
                    {label: 'Excluir', value: '3.5.4'},
                ]
            },
            {
                label: 'Promoções', value: '3.6', children: [
                    {label: 'Visualizar', value: '7.1.1'},
                    {label: 'Cadastrar', value: '7.1.2'},
                    {label: 'Editar', value: '7.1.3'},
                    {label: 'Excluir', value: '7.1.4'},
                ]
            }
        ],
    },
    {
        label: 'Suprimentos', value: '4', children: []
    },
    {
        label: 'Finanças', value: '5', children: []
    },
    {
        label: 'Vendas', value: '6', children: [],
    },
    {
        label: 'Serviço', value: '7', children: [],
    },
    {
        label: 'Fiscal', value: '8', children: [],
    },
    
    {
        label: 'Configurações', children: [
            {
                label: 'Informações', value: 'company', children: _.filter(permissions, (c) => c.value == 'company')[0]?.children
            },
            {
                label: 'Usuários', value: 'user', children: _.filter(permissions, (c) => c.value == 'user')[0]?.children
            },
            {
                label: 'Cargos', value: 'role', children: _.filter(permissions, (c) => c.value == 'role')[0]?.children
            },
        ],
    }
]

export class ViewRole extends React.Component {

    viewModal = React.createRef();

    new = async () => {
        this.setState({id: undefined, name: '', roleRules: []});
        return this.viewModal.current.show()
    }

    edit = async (id) => {
        try {
            
            Loading.Show()
            const result = await new Service().Post('setting/role/detail', {id})
            this.setState({...result.data})
            return this.viewModal.current.show()

        } catch (error) {
            throw error
        } finally {
            Loading.Hide()
        }
    }

    onSubmit = async () => {
        try {
            
            this.setState({submting: true})

            const role = _.pick(this.state, ['id', 'name', 'roleRules'])
            const result = await new Service().Post('setting/role/submit', role)
            await toaster.push(<Message showIcon type='success'>Salvo com sucesso!</Message>, {placement: 'topEnd', duration: 5000 })
            this.viewModal.current?.close(result.data)

        } catch (error) {
            Exception.error(error)
        } finally {
            this.setState({submting: false})
        }
    }

    close(role) {
        this.viewModal.current?.close(role)
    }

    onChangeRules = (roleRules) => {

        const index = [
            //Calendário
            'calendar',
            //Chamado
            'called',
            //Cadastros
            'customer',
            'supplier',
            //Configuração
            'company',
            'user',
            'role'
        ]

        const rules = []

        for (const roleRule of roleRules) {
            if (index.includes(roleRule)) {
                const r = _.map(_.filter(permissions, (c) => c.value == roleRule)[0]?.children, (c) => c.value)
                for(const c of r) {
                    rules.push(c)
                }
            } else {
                rules.push(roleRule)
            }
        }

        const roleRule = _.map(rules, (ruleId) => {
            return { ruleId }
        })

        this.setState({roleRules: roleRule})
    }

    render = () => {
        
        return (
            <Form autoComplete='off' onSubmit={this.onSubmit}>
                <ViewModal ref={this.viewModal} size={450}>
                    <Modal.Header><Modal.Title><Container>Cargo</Container></Modal.Title></Modal.Header>
                    <Modal.Body>
                        <Row gutterWidth={0}>
                            <Col md={12}>
                                <div className='form-control'>
                                    <label class="textfield-filled">
                                        <input type='text' value={this.state?.name} onChange={(event) => this.setState({nnameCT: event.target.value.toUpperCase()})} />
                                        <span>Nome</span>
                                    </label>
                                </div>
                            </Col>
                            <br></br>
                            <Divider />
                            <br></br>
                            <Col md={12}>
                                <label>Permissões</label>
                                <CheckTree data={data} value={_.map(this.state?.roleRules, (rule) => rule.ruleId)} onChange={this.onChangeRules} />
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button appearance="primary" color='green' onClick={this.onSubmit} disabled={this.state?.submting}>{this.state?.submting ? <><Loader /> &nbsp; Confirmando...</> : <><MdCheckCircleOutline /> &nbsp; Confirmar</>}</Button>
                    </Modal.Footer>
                </ViewModal>
            </Form>
            
        )

    }

}