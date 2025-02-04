import Sequelize from 'sequelize';

export class City {

  id = {
    field: 'codigo_municipio',
    primaryKey: true,
    autoIncrement: true,
    type: Sequelize.UUID,
  }

  name = {
    field: 'nome_municipio',
    type: Sequelize.STRING(100)
  }

  stateId = {
    field: 'codigo_uf',
    type: Sequelize.NUMBER
  }

}