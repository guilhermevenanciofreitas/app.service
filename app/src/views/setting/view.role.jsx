import React from "react";
import { Button, CheckTree, Divider, Form, Loader, Message, Modal, toaster } from 'rsuite';
import { Container, Row, Col } from 'react-grid-system';

import { ViewModal } from "../../controls";
import { MdCheckCircleOutline } from "react-icons/md";
import { Service } from "../../service";
import { Loading } from "../../App";

import _ from "lodash";
import { Exception } from "../../utils/exception";

const permissions = [
    { value: 'called', children: [
        { label: 'Visualizar', value: '0F7D1201-F8C9-4F1D-934D-B32A3232F7EE' },
        { label: 'Cadastrar', value: '439FE31F-D9D2-47AA-A37A-A19D01024C4F' },
        { label: 'Editar', value: '90D03DB1-E1FB-485F-9BDC-98A015427A3B' },
        { label: 'Resolucionar', value: 'CE2D3FEB-EFCE-4A92-A08E-D76361006F9C' },
        { label: 'Excluir', value: '1EE59E63-2674-4F48-8E2A-90F013F6A0E1' },
    ]},
    { value: 'cte', children: [
        { label: 'Visualizar', value: 'FC9DE921-1B87-4BDE-85CC-2D5FD0CDDD6C' },
        { label: 'Cadastrar', value: 'CB5B6FC1-3409-466F-80F5-58532BFE152A' },
        { label: 'Editar', value: '56F79D70-950C-4CDF-A017-E6BF8681B6AC' },
        { label: 'Excluir', value: '5DE7BC80-AC16-41A8-900F-504A10D0EFA6' },
    ]},
    { value: 'user', children: [
        { label: 'Visualizar', value: 'EA48106A-F533-4747-8E52-A3006F006FB8' },
        { label: 'Cadastrar', value: '28A68BD8-0E58-4A30-8C22-3E55C0ABA42A' },
        { label: 'Editar', value: '15AF159F-A450-4CB5-A347-28AD6306C930' },
        { label: 'Excluir', value: '46D20036-32FE-4F19-9D80-41D38E0B5E5C' },
    ]},
];

const checkTree = [
    { label: 'Chamados', value: 'called', children: permissions.find(p => p.value === 'called')?.children },
    { label: 'Logística', value: 'logistic', children: [
        { label: 'Conhecimentos', value: 'cte', children: permissions.find(p => p.value === 'cte')?.children },
    ]},
    { label: 'Configurações', value: 'settings', children: [
        { label: 'Usuários', value: 'user', children: permissions.find(p => p.value === 'user')?.children },
    ]},
];

export class ViewRole extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: undefined,
            name: '',
            roleRules: [], // Aqui ficarão os IDs marcados no CheckTree
            submitting: false
        };
    }

    viewModal = React.createRef();

    new = async () => {
        this.setState({ id: undefined, name: '', roleRules: [] });
        this.viewModal.current.show();
    };

    edit = async ({ id }) => {
        try {
            Loading.Show();
            const result = await new Service().Post('setting/role/detail', { id });

            // Extrai apenas os ruleId dos roleRules
            const roleRules = result.data.roleRules.map(rule => rule.ruleId);

            this.setState({ id, name: result.data.name, roleRules });

            this.viewModal.current.show();
        } catch (error) {
            Exception.error(error);
        } finally {
            Loading.Hide();
        }
    };

    onChangeRules = (selectedValues) => {
        let updatedRoleRules = [];
    
        // Itera sobre os grupos de permissões
        checkTree.forEach(group => {
            // Verifica se o grupo pai foi selecionado
            if (selectedValues.includes(group.value)) {
                // Se o grupo pai for selecionado, adiciona todos os filhos de todos os níveis
                group.children.forEach(child => {
                    // Adiciona os filhos diretamente ao updatedRoleRules
                    if (!updatedRoleRules.includes(child.value)) {
                        updatedRoleRules.push(child.value);
                    }
    
                    // Caso o filho também tenha filhos, vamos entrar recursivamente
                    if (child.children) {
                        child.children.forEach(subChild => {
                            if (!updatedRoleRules.includes(subChild.value)) {
                                updatedRoleRules.push(subChild.value);
                            }
                        });
                    }
                });
            } else {
                // Caso o grupo pai não esteja selecionado, verifica cada filho individualmente
                group.children.forEach(child => {
                    if (selectedValues.includes(child.value) && !updatedRoleRules.includes(child.value)) {
                        updatedRoleRules.push(child.value);
                    }
    
                    // Caso o filho tenha filhos, verifica cada um deles individualmente
                    if (child.children) {
                        child.children.forEach(subChild => {
                            if (selectedValues.includes(subChild.value) && !updatedRoleRules.includes(subChild.value)) {
                                updatedRoleRules.push(subChild.value);
                            }
                        });
                    }
                });
            }
        });
    
        // Atualiza o estado com os valores corretos de roleRules (somente filhos)
        this.setState({ roleRules: updatedRoleRules });
    };
    
    onSubmit = async () => {
        try {
            this.setState({ submitting: true });
    
            const role = {
                id: this.state.id,
                name: this.state.name,
                roleRules: this.state.roleRules.map(ruleId => ({ ruleId })),
            };
    
            await new Service().Post('setting/role/submit', role);
            await toaster.push(<Message showIcon type="success">Salvo com sucesso!</Message>, { placement: 'topEnd', duration: 5000 });
    
            this.viewModal.current?.close(role);
        } catch (error) {
            Exception.error(error);
        } finally {
            this.setState({ submitting: false });
        }
    };

    close(role) {
        this.viewModal.current?.close(role);
    }

    render() {
        return (
            <Form autoComplete="off" onSubmit={this.onSubmit}>
                <ViewModal ref={this.viewModal} size={450}>
                    <Modal.Header>
                        <Modal.Title>
                            <Container>Cargo</Container>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row gutterWidth={0}>
                            <Col md={12}>
                                <div className="form-control">
                                    <label className="textfield-filled">
                                        <input
                                            type="text"
                                            value={this.state?.name}
                                            onChange={(event) => this.setState({ name: event.target.value.toUpperCase() })}
                                        />
                                        <span>Nome</span>
                                    </label>
                                </div>
                            </Col>
                            <br />
                            <Divider />
                            <br />
                            <Col md={12}>
                                <label>Permissões</label>
                                <CheckTree 
                                    data={checkTree} 
                                    value={this.state.roleRules} 
                                    onChange={this.onChangeRules} 
                                />
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button 
                            appearance="primary" 
                            color="green" 
                            onClick={this.onSubmit} 
                            disabled={this.state?.submitting}
                        >
                            {this.state?.submitting ? <><Loader /> &nbsp; Confirmando...</> : <><MdCheckCircleOutline /> &nbsp; Confirmar</>}
                        </Button>
                    </Modal.Footer>
                </ViewModal>
            </Form>
        );
    }
}
