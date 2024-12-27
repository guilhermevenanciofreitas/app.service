import Sequelize from 'sequelize';

export class Company {

  id = {
    field: 'id',
    primaryKey: true,
    type: Sequelize.UUID
  }

  cnpj = {
    field: 'cnpj',
    type: Sequelize.STRING(14)
  }

  name = {
    field: 'name',
    type: Sequelize.STRING(100)
  }

  surname = {
    field: 'surname',
    type: Sequelize.STRING(80)
  }

}