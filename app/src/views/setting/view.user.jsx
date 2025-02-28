import React, { useState } from "react";
import { Container, Row, Col } from "react-grid-system";
import { Button, CheckPicker, Form, Input, Loader, Message, Modal, toaster } from "rsuite";
import { PhotoPicker, ViewModal } from "../../controls";
import { Loading } from "../../App";
import { MdCheckCircleOutline } from "react-icons/md";
import { Service } from "../../service";
import _ from "lodash";

export class ViewUser extends React.Component {
    viewModal = React.createRef();

    new = async (user) => {
        this.setState({ ...user });
        return this.viewModal.current.show();
    };

    edit = async ({id}) => {
        try {
                    
            Loading.Show()
            const result = await new Service().Post('setting/user/detail', {id})
            this.setState({...result.data})
            return this.viewModal.current.show()

        } catch (error) {
            throw error
        } finally {
            Loading.Hide()
        }
    }

    submit = async () => {
        try {
            
            this.setState({submting: true})

            const user = _.pick(this.state, ["id", "name", "email", "status", "companyUsers"])
            const result = await new Service().Post('setting/user/submit', user)
            await toaster.push(<Message showIcon type='success'>Salvo com sucesso!</Message>, {placement: 'topEnd', duration: 5000 })
            this.viewModal.current?.close(result.data)

        } catch (error) {
            Exception.error(error)
        } finally {
            this.setState({submting: false})
        }
    }

    render = () => {
        return (
            <ViewModal ref={this.viewModal} size={700}>
                <Form autoComplete="off" onSubmit={this.submit}>
                    <Modal.Header>
                        <Modal.Title>{this.props.title ? this.props.title : "Usuário"}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row gutterWidth={0}>
                            <Col md={4}>
                                <PhotoPicker padding={0} />
                            </Col>
                            <Col md={8}>
                                <Col md={12}>
                                    <div className="form-control">
                                        <label className="textfield-filled">
                                            <input
                                                type="text"
                                                value={this.state?.userName}
                                                onChange={(event) => this.setState({ userName: event.target.value })}
                                            />
                                            <span>Usuário</span>
                                        </label>
                                    </div>
                                </Col>
                                <Col md={12}>
                                    <div className="form-control">
                                        <label className="textfield-filled">
                                            <input
                                                type="text"
                                                value={this.state?.userMember?.email}
                                                onChange={(event) => this.setState({userMember: {email: event.target.value}})}
                                            />
                                            <span>E-mail</span>
                                        </label>
                                    </div>
                                </Col>
                                <Col md={12}>
                                    <div className="form-control">
                                        <label>Filiais</label>
                                        <CompanyPicker
                                            value={this.state?.companyUsers}
                                            onChange={(companyUsers) => this.setState({ companyUsers })}
                                        />
                                    </div>
                                </Col>
                                <br />
                                {!this.props.title && (
                                    <Col md={4}>
                                        <div className="form-control">
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    checked={this.state?.status === "active"}
                                                    onChange={(event) =>
                                                        this.setState({ status: event.target.checked ? "active" : "inactivated" })
                                                    }
                                                />
                                                <span>&nbsp;Ativo</span>
                                            </label>
                                        </div>
                                    </Col>
                                )}
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type="submit" appearance="primary" color="green" disabled={this.state?.submting}>
                            {this.state?.submting ? (
                                <>
                                    <Loader /> &nbsp; Confirmando...
                                </>
                            ) : (
                                <>
                                    <MdCheckCircleOutline /> &nbsp; Confirmar
                                </>
                            )}
                        </Button>
                    </Modal.Footer>
                </Form>
            </ViewModal>
        )
    }
}

const CompanyPicker = ({ value, onChange }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);

    const fetchCompanies = async () => {
        if (loaded) return; // Evita chamadas desnecessárias

        setLoading(true);
        try {
            const result = await new Service().Post("setting/company/list");
            setData(result.data.map((item) => ({ label: item.surname, value: item.id })));
            setLoaded(true);
        } catch (error) {
            toaster.push(
                <Message showIcon type="error">Erro ao carregar filiais!</Message>,
                { placement: "topEnd", duration: 5000 }
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <CheckPicker
            value={value}
            data={data}
            searchable={false}
            onChange={onChange}
            style={{ width: "100%" }}
            placeholder={loading ? "Carregando..." : "Selecione"}
            disabled={loading}
            onOpen={fetchCompanies} // Chama a API somente ao abrir
            renderMenu={(menu) => (loading ? <Loader center /> : menu)}
        />
    );
};
