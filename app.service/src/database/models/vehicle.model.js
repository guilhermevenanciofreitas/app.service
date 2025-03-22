import Sequelize from 'sequelize'

export class Vehicle {

  id = {
    field: 'codigo_veiculo',
    primaryKey: true,
    autoIncrement: true,
    type: Sequelize.BIGINT,
  }

  identity = {
    field: 'placa',
    type: Sequelize.STRING,
  }

}