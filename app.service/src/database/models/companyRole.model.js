import Sequelize from 'sequelize';

export class CompanyRole {

  id = {
    field: 'id',
    primaryKey: true,
    type: Sequelize.UUIDV4
  }

  companyId = {
    field: 'companyId',
    type: Sequelize.UUIDV4
  }

  roleId = {
    field: 'roleId',
    type: Sequelize.UUIDV4
  }

}