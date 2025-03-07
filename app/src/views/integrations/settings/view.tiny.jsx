import React from "react";
import { Col, Row } from "react-grid-system";
import { AutoComplete } from "../../../controls";
import { Search } from "../../../search";
import { Button, Loader } from "rsuite";
import { MdCheckCircleOutline } from "react-icons/md";

export class Tiny extends React.Component {

    state = {
        token: this.props.options.token
    }

    render = () => {

        return (
            <>
                <Row gutterWidth={0}>
                    <Col md={12}>
                        <div className='form-control'>
                            <label class="textfield-filled">
                                <input type='text' value={this.state?.token} onChange={(event) => this.setState({token: event.target.value})} autoFocus />
                                <span>Token</span>
                            </label>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <div className='form-control'>
                            <Button appearance="primary" color='green' onClick={() => this.props.onSubmit(this.state)} disabled={this.props?.submitting}>{this.props?.submitting ? <><Loader /> &nbsp; Salvando...</> : <><MdCheckCircleOutline /> &nbsp; Salvar</>}</Button>    
                        </div>
                    </Col>
                </Row>
            </>
        )

    }

}