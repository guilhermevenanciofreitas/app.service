import Sequelize from 'sequelize';

export class Statement {

  id = {
    field: 'id',
    primaryKey: true,
    autoIncrement: true,
    type: Sequelize.UUIDV4
  }

  companyId = {
    field: 'companyId',
    type: Sequelize.INTEGER,
  }

  bankAccountId = {
    field: 'bankAccountId',
    type: Sequelize.INTEGER,
  }

  sourceId = {
    field: 'sourceId',
    type: Sequelize.STRING(30),
  }

  createdAt = {
    field: 'createdAt',
    type: Sequelize.DATE
  }

  begin = {
    field: 'begin',
    type: Sequelize.STRING
  }

  end = {
    field: 'end',
    type: Sequelize.STRING
  }

  importedAt = {
    field: 'importedAt',
    type: Sequelize.STRING
  }

}