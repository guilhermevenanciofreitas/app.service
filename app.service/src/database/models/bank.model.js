import Sequelize from 'sequelize'

export class Bank {

  id = {
    field: 'ID',
    primaryKey: true,
    autoIncrement: true,
    type: Sequelize.INTEGER,
  }

  name = {
    field: 'Descricao',
    type: Sequelize.STRING(50)
  }

  /*
  image = {
    field: 'image',
    type: Sequelize.STRING(200)
  }*/

}