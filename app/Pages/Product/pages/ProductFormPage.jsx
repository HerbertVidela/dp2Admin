import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { shape, func, arrayOf } from 'prop-types';
import {
  FormGroup,
  ControlLabel,
  Grid,
  Row,
  Col,
  Panel,
  Button,
  Label,
  Input,
} from 'react-bootstrap';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';

import Select from 'Shared/Select';
import CustomInput from 'Shared/Form/CustomInput';
import DropZone from 'Shared/Form/DropZone';
import { getStores as requestStores } from 'Modules/stores';
import { getBrands as requestBrands } from 'Modules/brands';
import { getPromotions as requestPromotions } from 'Modules/promotions';
import { getProductCategories as requestCategories } from 'Modules/productCategories';
import {
  createProduct as createProductAction,
  updateProduct as updateProductAction,
  clearSelected,
} from 'Modules/products';
import { productCategoryType } from 'Pages/ProductCategory/types';
import { brandType } from 'Pages/Brand/types';
import { storeType } from 'Pages/Store/types';
import { promotionType } from 'Pages/Promotion/types';
import objectToFormData from 'Utils/objectToFormData';

class ProductFormPage extends PureComponent {
  constructor(props) {
    super(props);

    const params = props.match.params;

    if (!params.id) {
      props.removeSelected();
    }
  }

  componentWillMount() {
    const {
      getProductCategories,
      getBrands,
      getStores,
      getPromotions,
    } = this.props;
    const element = ReactDOM.findDOMNode(this.form);

    getBrands();
    getProductCategories();
    getStores();
    getPromotions();
    $(element).parsley();
  }

  goToProductsPage = () => {
    const { history, removeSelected } = this.props;

    removeSelected();
    history.push('/productos');
  };

  createProduct = (values, dispatch) => {
    const { history } = this.props;
    const data = {};

    Object.keys(values).map(key => {
      if (['weight', 'height', 'length', 'description'].indexOf(key) >= 0) {
        const value = values[key];
        data['technical_specification_attributes'] = {
          ...data['technical_specification_attributes'],
          [key]: value,
        };
      } else if (key !== 'image') {
        data[key] = values[key];
      } else {
        data[key] = values[key][0];
      }
    });

    const finalData = objectToFormData(data, null, 'product');

    swal({
      title: 'Se esta creando su producto',
      text: 'Espere por favor',
      onOpen: () => {
        swal.showLoading();
      },
    });
    dispatch(createProductAction(history, finalData));
  };

  updateProduct = (values, dispatch, id) => {
    const { history } = this.props;
    const data = {};

    Object.keys(values).map(key => {
      if (['weight', 'height', 'length', 'description'].indexOf(key) >= 0) {
        const value = values[key];
        data['technical_specification_attributes'] = {
          ...data['technical_specification_attributes'],
          [key]: value,
        };
      } else if (key !== 'image') {
        data[key] = values[key];
      } else {
        if (Array.isArray(values[key])) data[key] = values[key][0];
      }
    });

    const finalData = objectToFormData(data, null, 'product');

    swal({
      title: 'Se esta actualiazando su producto',
      text: 'Espere por favor',
      onOpen: () => {
        swal.showLoading();
      },
    });
    dispatch(updateProductAction(history, finalData, id));
  };

  onProductSubmit = (values, dispatch) => {
    const isFormValid = $(this.form)
      .parsley()
      .isValid();
    const params = this.props.match.params;

    this.props.removeSelected();
    if (isFormValid && !params.id) {
      this.createProduct(values, dispatch);
    } else if (isFormValid && params.id) {
      this.updateProduct(values, dispatch, params.id);
    }
  };

  render() {
    const { history, handleSubmit } = this.props;

    return (
      <Grid fluid>
        <Row>
          <Col lg={12}>
            <Panel>
              <form
                onSubmit={handleSubmit(this.onProductSubmit)}
                noValidate
                ref={node => {
                  this.form = node;
                }}
              >
                <Panel.Body>
                  <FormGroup>
                    <ControlLabel>Nombre del producto</ControlLabel>
                    <Field
                      name="name"
                      component={CustomInput}
                      type="text"
                      props={{
                        placeholder: 'Nombre del producto',
                        required: 'required',
                      }}
                    />
                  </FormGroup>
                  <FormGroup>
                    <ControlLabel>Precio del producto</ControlLabel>
                    <Field
                      name="price"
                      component={CustomInput}
                      type="text"
                      props={{
                        placeholder: 'Precio del producto',
                        required: 'required',
                      }}
                    />
                  </FormGroup>
                  <FormGroup>
                    <ControlLabel>Marca</ControlLabel>
                    <Field
                      name="brand_id"
                      type="select"
                      component={Select}
                      props={{
                        placeholder: 'Seleccione una marca',
                        options: this.props.brands.map(brand => ({
                          value: brand.id,
                          label: brand.name,
                        })),
                        required: 'required',
                      }}
                    />
                  </FormGroup>
                  <FormGroup>
                    <ControlLabel>Categoria</ControlLabel>
                    <Field
                      name="product_category_id"
                      component={Select}
                      props={{
                        placeholder: 'Seleccionar una categoria',
                        options: this.props.productCategories.map(
                          productCategory => ({
                            value: productCategory.id,
                            label: productCategory.name,
                          })
                        ),
                        required: 'required',
                      }}
                    />
                  </FormGroup>
                  <FormGroup>
                    <ControlLabel>Tienda</ControlLabel>
                    <Field
                      name="store_id"
                      component={Select}
                      props={{
                        placeholder: 'Seleccionar una categoria',
                        options: this.props.stores.map(store => ({
                          value: store.id,
                          label: store.name,
                        })),
                        required: 'required',
                      }}
                    />
                  </FormGroup>
                  <FormGroup>
                    <ControlLabel>Promocion</ControlLabel>
                    <Field
                      name="promotion_id"
                      component={Select}
                      props={{
                        placeholder: 'Seleccionar una promocion',
                        options: this.props.promotions.map(promotion => ({
                          value: promotion.id,
                          label: promotion.value,
                        })),
                      }}
                    />
                  </FormGroup>
                  <FormGroup>
                    <ControlLabel>Información Técnica</ControlLabel>
                    <Field
                      name="description"
                      component={CustomInput}
                      type="text"
                      props={{
                        placeholder: 'Descripción del producto',
                        required: 'required',
                      }}
                    />
                    <Field
                      name="weight"
                      component={CustomInput}
                      type="text"
                      props={{
                        placeholder: 'Peso del producto',
                        required: 'required',
                      }}
                    />
                    <Field
                      name="length"
                      component={CustomInput}
                      type="text"
                      props={{
                        placeholder: 'Largo del producto',
                        required: 'required',
                      }}
                    />
                    <Field
                      name="height"
                      component={CustomInput}
                      type="text"
                      props={{
                        placeholder: 'Alto del producto',
                        required: 'required',
                      }}
                    />
                  </FormGroup>
                  <FormGroup>
                    <ControlLabel>Imagen</ControlLabel>
                    <Field
                      name="image"
                      component={DropZone}
                      props={{
                        required: 'required',
                      }}
                    />
                  </FormGroup>
                </Panel.Body>
                <Panel.Footer>
                  <div className="form-footer">
                    <div className="form-button">
                      <Button onClick={this.goToProductsPage}>Cancelar</Button>
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

ProductFormPage.defaultProps = {
  productCategories: [],
  brands: [],
  promotions: [],
};

ProductFormPage.propTypes = {
  history: shape({}).isRequired,
  productCategories: arrayOf(productCategoryType),
  brands: arrayOf(brandType),
  stores: arrayOf(storeType),
  promotions: arrayOf(promotionType),
  getBrands: func.isRequired,
  getProductCategories: func.isRequired,
  getPromotions: func.isRequired,
  removeSelected: func.isRequired,
};

const mapStateToProps = ({
  products: { selectedProduct },
  productCategories: { productCategories },
  brands: { brands },
  stores: { stores },
  promotions: { promotions },
}) => ({
  brands,
  productCategories,
  stores,
  promotions,
  initialValues: selectedProduct.id
    ? {
        ...selectedProduct,
        product_category_id: selectedProduct.product_category.id,
        brand_id: selectedProduct.brand.id,
        store_id: selectedProduct.store.id,
        promotion_id: selectedProduct.promotion.id,
        description: selectedProduct.technical_specification.description,
        weight: selectedProduct.technical_specification.weight,
        length: selectedProduct.technical_specification.length,
        height: selectedProduct.technical_specification.height,
      }
    : {},
});

const mapDispatchToProps = dispatch => ({
  getProductCategories: () => {
    dispatch(requestCategories());
  },
  getBrands: () => {
    dispatch(requestBrands());
  },
  getPromotions: () => {
    dispatch(requestPromotions());
  },
  getStores: () => {
    dispatch(requestStores());
  },
  removeSelected: () => {
    dispatch(clearSelected());
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  reduxForm({
    form: 'productForm',
    enableReinitialize: true,
  })(ProductFormPage)
);
