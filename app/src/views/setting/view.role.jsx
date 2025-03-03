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
        {label: 'Visualizar', value: ''},
        {label: 'Cadastrar', value: ''},
        {label: 'Editar', value: ''},
        {label: 'Excluir', value: ''},
    ]},
    { value: 'called', children: [
        {label: 'Visualizar', value: '0F7D1201-F8C9-4F1D-934D-B32A3232F7EE'},
        {label: 'Cadastrar', value: '439FE31F-D9D2-47AA-A37A-A19D01024C4F'},
        {label: 'Editar', value: '90D03DB1-E1FB-485F-9BDC-98A015427A3B'},
        {label: 'Resolucionar', value: '0DAAE48E-BD1A-4C45-9644-5F90E3C4A454'},
        {label: 'Excluir', value: '0DAAE48E-BD1A-4C45-9644-5F90E3C4A453'},
    ]},
    { value: 'customer', children: [
        {label: 'Visualizar', value: ''},
        {label: 'Cadastrar', value: ''},
        {label: 'Editar', value: ''},
        {label: 'Excluir', value: ''},
    ]},
    { value: 'supplier', children: [
        {label: 'Visualizar', value: ''},
        {label: 'Cadastrar', value: ''},
        {label: 'Editar', value: ''},
        {label: 'Excluir', value: ''},
    ]},
    { value: 'product', children: [
        {label: 'Visualizar', value: ''},
        {label: 'Cadastrar', value: ''},
        {label: 'Editar', value: ''},
        {label: 'Excluir', value: ''},
    ]},
    { value: 'service', children: [
        {label: 'Visualizar', value: ''},
        {label: 'Cadastrar', value: ''},
        {label: 'Editar', value: ''},
        {label: 'Excluir', value: ''},
    ]},
    { value: 'cte', children: [
        {label: 'Visualizar', value: 'FC9DE921-1B87-4BDE-85CC-2D5FD0CDDD6C'},
        {label: 'Cadastrar', value: ''},
        {label: 'Editar', value: ''},
        {label: 'Excluir', value: ''},
    ]},
    
]

const data = [
    /*
    {
        label: 'Caledário', value: 'calendar', children: _.filter(permissions, (c) => c.value == 'calendar')[0]?.children
    },
    */
    {
        label: 'Chamados', value: 'called', children: _.filter(permissions, (c) => c.value == 'called')[0]?.children
    },
    /*
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
    */
    {
        label: 'Logística', children: [
            {
                label: 'Conhecimentos', value: 'cte', children: _.filter(permissions, (c) => c.value == 'cte')[0]?.children
            },
        ],
    },
    {
        label: 'Configurações', children: [
            /*{
                label: 'Empresa', value: 'company', children: _.filter(permissions, (c) => c.value == 'company')[0]?.children
            },*/
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

    edit = async ({id}) => {
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
            //Logística
            'cte',
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