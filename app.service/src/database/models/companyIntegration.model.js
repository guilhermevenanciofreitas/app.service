import Sequelize from 'sequelize';

export class CompanyIntegration {

  id = {
    field: 'id',
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
    type: Sequelize.UUIDV4,
  }

  companyId = {
    field: 'companyId',
    type: Sequelize.UUIDV4
  }

  integrationId = {
    field: 'integrationId',
    type: Sequelize.UUIDV4
  }

  options = {
    field: 'options',
    type: Sequelize.UUIDV4
  }

}