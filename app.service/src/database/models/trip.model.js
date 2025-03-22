import Sequelize from 'sequelize'

export class Trip {

  id = {
    field: 'ID',
    primaryKey: true,
    autoIncrement: true,
    type: Sequelize.BIGINT,
  }

  tripTravelId = {
    field: 'IDViagem',
    type: Sequelize.BIGINT,
  }

  driverId = {
    field: 'IDMotorista',
    type: Sequelize.BIGINT,
  }

  vehicleId = {
    field: 'IDTracao',
    type: Sequelize.BIGINT,
  }

  haulage1Id = {
    field: 'IDReboque',
    type: Sequelize.BIGINT,
  }

  haulage2Id = {
    field: 'ID2Reboque',
    type: Sequelize.BIGINT,
  }

}