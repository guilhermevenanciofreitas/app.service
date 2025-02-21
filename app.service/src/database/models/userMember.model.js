import Sequelize from 'sequelize'

export class UserMember {

  id = {
    field: 'UserId',
    primaryKey: true,
    type: Sequelize.UUIDV4
  }

  name = {
    field: 'UserName',
    type: Sequelize.STRING
  }

}