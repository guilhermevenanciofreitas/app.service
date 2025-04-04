import Sequelize from 'sequelize';

export class CalledReason {

  id = {
    field: 'id',
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
    type: Sequelize.UUIDV4,
  }

  description = {
    field: 'description',
    type: Sequelize.STRING,
  }

}