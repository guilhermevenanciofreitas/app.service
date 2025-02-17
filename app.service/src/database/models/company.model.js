import Sequelize from 'sequelize';

export class Company {

  id = {
    field: 'codigo_empresa_filial',
    primaryKey: true,
    type: Sequelize.NUMBER
  }

  cnpj = {
    field: 'cnpj',
    type: Sequelize.STRING(14)
  }

  name = {
    field: 'nome_fantasia',
    type: Sequelize.STRING
  }

  surname = {
    field: 'descricao',
    type: Sequelize.STRING
  }

  companyBusinessId = {
    field: 'codigo_empresa',
    type: Sequelize.NUMBER
  }

}