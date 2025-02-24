import Sequelize from 'sequelize'

export class User {

  id = {
    field: 'UserId',
    primaryKey: true,
    type: Sequelize.UUIDV4
  }

  email = {
    field: 'Email',
    type: Sequelize.STRING
  }

}