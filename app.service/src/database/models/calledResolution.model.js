import Sequelize from 'sequelize';

export class CalledResolution {

  id = {
    field: 'id',
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
    type: Sequelize.UUIDV4,
  }

  calledId = {
    field: 'calledId',
    type: Sequelize.UUIDV4,
  }

  createdAt = {
    field: 'createdAt',
    type: Sequelize.STRING,
  }

  userId = {
    field: 'userId',
    type: Sequelize.UUIDV4,
  }

  statusId = {
    field: 'statusId',
    type: Sequelize.UUIDV4,
  }

  detail = {
    field: 'detail',
    type: Sequelize.STRING,
  }

}