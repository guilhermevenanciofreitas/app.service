import Sequelize from 'sequelize'

export class User {

  id = {
    field: 'UserId',
    primaryKey: true,
    type: Sequelize.UUID
  }

  email = {
    field: 'Email',
    type: Sequelize.STRING
  }

  password = {
    field: 'Password',
    type: Sequelize.STRING
  }

  passwordSalt = {
    field: 'PasswordSalt',
    type: Sequelize.STRING
  }

  /*
  inactivatedAt = {
    field: 'inactivatedAt',
    type: Sequelize.DATE
  }

  deletedAt = {
    field: 'deletedAt',
    type: Sequelize.DATE
  }

  status = {
    field: 'status',
    type: Sequelize.STRING
  }
  */

}