import { DataTypes } from 'sequelize'

export class Shippiment {

  id = {
    field: 'codigo_carga',
    primaryKey: true,
    type: DataTypes.UUID
  }

  tripId = {
    field: 'codigo_viagem',
    type: DataTypes.BIGINT
  }

  documento_transporte = {
    field: 'documento_transporte',
    type: DataTypes.STRING
  }

  peso = {
    field: 'peso',
    type: DataTypes.DECIMAL
  }

  valor_frete = {
    field: 'valor_frete',
    type: DataTypes.DECIMAL
  }

  senderId = {
    field: 'codigo_cliente',
    type: DataTypes.BIGINT
  }

}