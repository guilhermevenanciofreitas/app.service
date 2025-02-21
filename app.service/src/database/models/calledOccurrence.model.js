import Sequelize from 'sequelize';

export class CalledOccurrence {

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