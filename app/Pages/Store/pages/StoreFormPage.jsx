import React, { PureComponent } from "react";
import ReactDOM from "react-dom";
import { shape, func } from "prop-types";
import {
  FormGroup,
  ControlLabel,
  Grid,
  Row,
  Col,
  Panel,
  Button,
  Label,
  Input
} from "react-bootstrap";
import { reduxForm, Field } from "redux-form";

import Select from "Shared/Select";
import CustomInput from "Shared/Form/CustomInput";
import { addStores } from "Modules/stores";

let StoreForm = props => {
  const { handleSubmit } = props;
  return;
  <form onSubmit={handleSubmit} />;
};
/*
id: number,
adminId: number,
name: string,
logo: string,
banner: string,
description: string,
webpage: string,
contact_name: string,
phone_number: string,
*/

const onStoreSubmit = (values, dispatch) => {
  if (Object.keys(values).length >= 9) {
    fetch(`${process.env.API_BASE_URL}stores`, {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "content-type": "application/json"
      }
    })
      .then(response => response.json())
      .then(data => {
        dispatch(addStores(data.storeCategory));
        window.history.back();
      });
  }
};

class StoreFormPage extends PureComponent {
  componentDidMount() {
    const element = ReactDOM.findDOMNode(this.form);
    $(element).parsley();
  }
  goToStores = () => {
    const { history } = this.props;
    history.push("/tiendas");
  };

  render() {
    const { history, handleSubmit } = this.props;
    return (
      <Grid fluid>
        <Row>
          <Col lg={12}>
            <Panel>
              <form
                onSubmit={handleSubmit}
                noValidate
                ref={node => {
                  this.form = node;
                }}
              >
                <Panel.Body>
                  <FormGroup>
                    <ControlLabel>Nombre de la tienda</ControlLabel>
                    <Field
                      name="name"
                      component={CustomInput}
                      type="text"
                      props={{
                        placeholder: "Nombre de la tienda",
                        required: "required"
                      }}
                    />
                  </FormGroup>
                  <FormGroup>
                    <ControlLabel>Administrador de la tienda</ControlLabel>
                    <Field
                      name="adminId"
                      component={Select}
                      props={{
                        placeholder: "Administrador de la tienda",
                        options: [
                          {value: "1", label: "admin 1"},
                          {value: "2", label: "admin 2"},
                        ],
                        required: "required"
                      }}
                    />
                  </FormGroup>
                  <FormGroup>
                    <ControlLabel>Descripción</ControlLabel>
                    <Field
                      name="description"
                      component={CustomInput}
                      type="textarea"
                      props={{
                        placeholder: "Descripcion de la tienda",
                        required: "required"
                      }}
                    />
                  </FormGroup>
                  <FormGroup>
                    <ControlLabel>Página web</ControlLabel>
                    <Field
                      name="webpage"
                      component={CustomInput}
                      type="text"
                      props={{
                        placeholder: "Página de la tienda",
                        required: "required"
                      }}
                    />
                  </FormGroup>
                  <FormGroup>
                    <ControlLabel>Nombre del contacto</ControlLabel>
                    <Field
                      name="contact_name"
                      component={CustomInput}
                      type="text"
                      props={{
                        placeholder: "Nombre del contacto",
                        required: "required"
                      }}
                    />
                  </FormGroup>
                  <FormGroup>
                    <ControlLabel>Telefono</ControlLabel>
                    <Field
                      name="phone_number"
                      component={CustomInput}
                      type="text"
                      props={{ placeholder: "Telefono", required: "required" }}
                    />
                  </FormGroup>
                </Panel.Body>
                <Panel.Footer>
                  <div className="form-footer">
                    <div className="form-button">
                      <Button onClick={this.goToStores}>Cancelar</Button>
                    </div>
                    <div className="form-button">
                      <Button type="submit">Crear</Button>
                    </div>
                  </div>
                </Panel.Footer>
              </form>
            </Panel>
          </Col>
        </Row>
      </Grid>
    );
  }
}

StoreFormPage.propTypes = {
  history: shape({}).isRequired
};

export default reduxForm({
  form: "storeForm",
  onSubmit: onStoreSubmit
})(StoreFormPage);
