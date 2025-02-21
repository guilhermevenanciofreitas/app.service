import Sequelize from 'sequelize';

export class Called {

  id = {
    field: 'id',
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
    type: Sequelize.UUIDV4,
  }

  responsibleId = {
    field: 'responsibleId',
    type: Sequelize.UUIDV4,
  }

}