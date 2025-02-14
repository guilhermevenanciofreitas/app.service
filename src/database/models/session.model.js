import Sequelize from 'sequelize';

export class Session {

  id = {
    field: 'id',
    primaryKey: true,
    autoIncrement: true,
    type: Sequelize.UUID
  };

  userId = {
    field: 'userId',
    type: Sequelize.UUID
  };

  companyId = {
    field: 'companyId',
    type: Sequelize.NUMBER
  };

  lastAcess = {
    field: 'lastAcess',
    type: Sequelize.STRING
  };

  expireIn = {
    field: 'expireIn',
    type: Sequelize.INTEGER
  };

}