import { DataTypes } from 'sequelize'

export class Partner {

  id = {
    field: 'codigo_pessoa',
    primaryKey: true,
    type: DataTypes.UUID
  }

  cpfCnpj = {
    field: 'cpfCnpj',
    type: DataTypes.STRING(14)
  }

  name = {
    field: 'RazaoSocial',
    type: DataTypes.STRING(100)
  }

  surname = {
    field: 'nome',
    type: DataTypes.STRING(100)
  }

}