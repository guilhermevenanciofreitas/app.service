import Sequelize from 'sequelize'

export class TripTravel {

  id = {
    field: 'codigo_viagem',
    primaryKey: true,
    autoIncrement: true,
    type: Sequelize.BIGINT,
  }

}