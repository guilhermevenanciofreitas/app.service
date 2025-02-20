import Sequelize from 'sequelize'

export class UserMember {

  id = {
    field: 'UserId',
    primaryKey: true,
    type: Sequelize.UUID
  }

  name = {
    field: 'UserName',
    type: Sequelize.STRING
  }

}