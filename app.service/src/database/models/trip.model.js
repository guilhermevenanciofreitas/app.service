import Sequelize from 'sequelize'

export class Trip {

  id = {
    field: 'ID',
    primaryKey: true,
    autoIncrement: true,
    type: Sequelize.BIGINT,
  }

  driverId = {
    field: 'IDMotorista',
    type: Sequelize.BIGINT,
  }

}