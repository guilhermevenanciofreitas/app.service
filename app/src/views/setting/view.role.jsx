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
    { value: 'statement', children: [
        { label: 'Visualizar', value: '53AFC0B2-7890-4D43-A6E0-B6035ADBFD64' },
        { label: 'Cadastrar', value: 'C3186E4A-6460-477D-84D9-66A1FFAC1895' },
        { label: 'Editar', value: '714FF619-EE95-4F2C-B73B-4B81A8AF74F6' },
        { label: 'Excluir', value: '7912924E-7782-4221-9D44-46EBD6E05410' },
    ]},
    { value: 'cte', children: [
        { label: 'Visualizar', value: 'FC9DE921-1B87-4BDE-85CC-2D5FD0CDDD6C' },
        { label: 'Cadastrar', value: 'CB5B6FC1-3409-466F-80F5-58532BFE152A' },
        { label: 'Editar', value: '56F79D70-950C-4CDF-A017-E6BF8681B6AC' },
        { label: 'Excluir', value: '5DE7BC80-AC16-41A8-900F-504A10D0EFA6' },
    ]},
    { value: 'shippiment', children: [
        { label: 'Visualizar', value: '6F1F9996-C17B-470A-93B7-A2491DFDF20F' },
        { label: 'Cadastrar', value: '53E6907C-14DF-464A-A60F-432539EA979B' },
        { label: 'Editar', value: '6A417948-4AA0-43A7-AD13-50CE8BCDE59A' },
        { label: 'Excluir', value: 'BA6B05D7-C4BE-49AB-A8C2-34737EABF8E3' },
    ]},
    { value: 'trips', children: [
        { label: 'Visualizar', value: '0A4763CF-3D8F-4F4A-B83C-396494F38254' },
        { label: 'Cadastrar', value: '8980D3FB-63F1-46F0-8A86-18F536E695BB' },
        { label: 'Editar', value: '1EE07AA5-5B33-4F8F-9BE8-B13AEF3666B4' },
        { label: 'Excluir', value: 'FBA6669F-ABFF-4406-9A86-D2A662667A9E' },
    ]},
    { value: 'company', children: [
        { label: 'Editar', value: 'B77BA3E3-C830-40D7-9E7C-FE21C42BF014' },
    ]},
    { value: 'user', children: [
        { label: 'Visualizar', value: 'EA48106A-F533-4747-8E52-A3006F006FB8' },
        { label: 'Cadastrar', value: '28A68BD8-0E58-4A30-8C22-3E55C0ABA42A' },
        { label: 'Editar', value: '15AF159F-A450-4CB5-A347-28AD6306C930' },
        { label: 'Excluir', value: '46D20036-32FE-4F19-9D80-41D38E0B5E5C' },
    ]},
    { value: 'role', children: [
        { label: 'Visualizar', value: 'B04301AB-679E-4EA9-9AA7-F9EA83CE4F0D' },
        { label: 'Cadastrar', value: '3CC589CB-43FF-426D-AE0F-6C36E102AE22' },
        { label: 'Editar', value: 'A0B3C522-203B-405D-8E93-854DF8A94BBA' },
        { label: 'Excluir', value: 'D19D7281-8BA3-4287-897B-03E297119ED4' },
    ]},
]

const checkTree = [
    { label: 'Chamados', value: 'called', children: permissions.find(p => p.value === 'called')?.children },
    { label: 'Finanças', value: 'finance', children: [
        { label: 'Extrato', value: 'statement', children: permissions.find(p => p.value === 'statement')?.children },
    ]},
    { label: 'Logística', value: 'logistic', children: [
        { label: 'Conhecimentos', value: 'cte', children: permissions.find(p => p.value === 'cte')?.children },
        { label: 'Romaneios', value: 'shippiment', children: permissions.find(p => p.value === 'shippiment')?.children },
        { label: 'Viagens', value: 'trips', children: permissions.find(p => p.value === 'trips')?.children },
    ]},
    { label: 'Configurações', value: 'settings', children: [
        { label: 'Empresa', value: 'company', children: permissions.find(p => p.value === 'company')?.children },
        { label: 'Usuários', value: 'user', children: permissions.find(p => p.value === 'user')?.children },
        { label: 'Cargos', value: 'role', children: permissions.find(p => p.value === 'role')?.children },
    ]},
]

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
    }

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
    }

    onChangeRules = (selectedValues) => {
        this.setState({ roleRules: selectedValues });
    }
 
    // Função para filtrar o checkTree com base nas permissões do usuário
    filterCheckTree = () => {

        const Authorization = JSON.parse(localStorage.getItem("Authorization"));
        const userRules = Authorization?.user?.rules || []

        return checkTree
            .map(group => {
                // Filtra os filhos com base nas permissões que o usuário possui
                const filteredChildren = group.children.filter(child => 
                    userRules.includes(child.value) || 
                    (child.children && child.children.some(subChild => userRules.includes(subChild.value)))
                );

                // Se o grupo tiver filhos visíveis, retorna o grupo com os filhos filtrados
                if (filteredChildren.length > 0) {
                    return { ...group, children: filteredChildren };
                }

                // Caso o grupo não tenha filhos visíveis, não o exibe
                return null;
            })
            .filter(group => group !== null); // Remove os grupos que não têm filhos visíveis
    };

    onSubmit = async () => {
        try {
            this.setState({ submitting: true });
    
            // Função recursiva para obter os filhos de um nó
            const getChildrenValues = (nodes) => {
                let childrenValues = [];
                nodes.forEach(node => {
                    if (node.children) {
                        childrenValues = childrenValues.concat(getChildrenValues(node.children)); // Recursão para buscar filhos
                    } else {
                        childrenValues.push(node.value); // Adiciona apenas os valores dos filhos (UUIDs)
                    }
                });
                return childrenValues;
            };
    
            // Função para obter os filhos de um nó específico (incluindo quando o pai está marcado)
            const getAllSelectedChildren = (selectedValues, nodes) => {
                let finalSelected = [];
    
                nodes.forEach(node => {
                    if (selectedValues.includes(node.value)) {
                        // Se o pai estiver marcado, adicionamos todos os filhos dele
                        finalSelected = finalSelected.concat(getChildrenValues([node]));
                    }
                    // Continua a busca recursiva
                    if (node.children) {
                        finalSelected = finalSelected.concat(getAllSelectedChildren(selectedValues, node.children));
                    }
                });
    
                return finalSelected;
            };
    
            // Obtém todos os filhos que devem ser selecionados caso o pai tenha sido marcado
            const selectedChildren = getAllSelectedChildren(this.state.roleRules, checkTree);
    
            // Garantir que apenas os filhos (UUIDs) estão na lista final
            const onlyChildrenRules = [...new Set(selectedChildren)]; // Remove duplicatas
    
            const role = {
                id: this.state.id,
                name: this.state.name,
                roleRules: onlyChildrenRules.map(ruleId => ({ ruleId })), // Enviar apenas os UUIDs das permissões
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
        const filteredCheckTree = checkTree //this.filterCheckTree(); // Filtra as permissões com base no Authorization

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
                                    data={filteredCheckTree}  // Usando o checkTree filtrado
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
