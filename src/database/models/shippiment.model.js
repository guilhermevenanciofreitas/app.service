import Sequelize from 'sequelize'

export class Shippiment {

  id = {
    field: 'codigo_carga',
    primaryKey: true,
    type: Sequelize.UUID
  }

  tripId = {
    field: 'codigo_viagem',
    type: Sequelize.BIGINT
  }

  documento_transporte = {
    field: 'documento_transporte',
    type: Sequelize.STRING
  }

  peso = {
    field: 'peso',
    type: Sequelize.DECIMAL
  }

  valor_frete = {
    field: 'valor_frete',
    type: Sequelize.DECIMAL
  }

  senderId = {
    field: 'codigo_cliente',
    type: Sequelize.BIGINT
  }

}