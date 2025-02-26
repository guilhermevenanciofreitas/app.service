import React, { Component } from "react";
import { FaCheckCircle, FaFilter } from "react-icons/fa";
import { Button, Badge, Drawer, Checkbox, Stack, Divider } from "rsuite";
import { AutoComplete } from "../../controls";
import { Search } from "../../search";
import { Col, Row } from "react-grid-system";

class FilterButton extends Component {

  constructor(props) {
    super(props);
    this.state = {
      filters: {},
      open: false,
      responsible: null,
    };
  }

  toggleFilter = (key) => {
    this.setState((prevState) => ({
      filters: {
        ...prevState.filters,
        [key]: !prevState.filters[key],
      },
    }));
  };

  render() {

    const { filters, open, responsible } = this.state;
    const appliedFiltersCount = Object.values(filters).filter(Boolean).length;

    return (
      <div className="p-4">

        <Button appearance="subtle" onClick={() => this.setState({ open: true })}>
          <FaFilter /> &nbsp; Filtro &nbsp; {appliedFiltersCount > 0 && <Badge content={appliedFiltersCount} />}
        </Button>

        <Drawer open={open} onClose={() => this.setState({ open: false })} size="xs">
          <Drawer.Header><Drawer.Title>Filtro</Drawer.Title></Drawer.Header>
          <Drawer.Body style={{ padding: "30px" }}>
            <Row gutterWidth={0}>
              <Col md={12}>
                <div className="form-control">
                  <AutoComplete label="Filial" value={this.state?.company} text={(item) => `${item.surname}`} onChange={(company) => this.setState({ company })} onSearch={async (search) => await Search.company(search)} autoFocus>
                    <AutoComplete.Result>
                      {(item) => <span>{item.surname}</span>}
                    </AutoComplete.Result>
                  </AutoComplete>
                </div>
              </Col>
              <Col md={12}>
                <div className="form-control">
                  <AutoComplete label="Responsável" value={responsible} text={(item) => `${item.userMember.userName}`} onChange={(responsible) => this.setState({ responsible })} onSearch={async (search) => await Search.user(search)}>
                    <AutoComplete.Result>
                      {(item) => <span>{item.userMember?.userName}</span>}
                    </AutoComplete.Result>
                  </AutoComplete>
                </div>
              </Col>
              <Divider />
              <div className='form-control'>
                  <Button appearance="primary" color='green' onClick={this.submit} disabled={this.state?.submting}><FaCheckCircle /> &nbsp; Confirmar</Button>
              </div>
            </Row>
          </Drawer.Body>
        </Drawer>
      </div>
    );
  }
}

export default FilterButton;
