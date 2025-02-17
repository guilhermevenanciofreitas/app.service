import Sequelize from 'sequelize';

export class Cfop {

  id = {
    field: 'ID',
    primaryKey: true,
    autoIncrement: true,
    type: Sequelize.NUMBER,
  }

  code = {
    field: 'CFOP',
    type: Sequelize.STRING(5)
  }

  description = {
    field: 'Descricao',
    type: Sequelize.STRING(100)
  }

}