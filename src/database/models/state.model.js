import Sequelize from 'sequelize';

export class State {

  id = {
    field: 'codigo_uf',
    primaryKey: true,
    autoIncrement: true,
    type: Sequelize.NUMBER,
  };

  acronym = {
    field: 'sigla_uf',
    type: Sequelize.STRING(30)
  };

}