import { DataTypes } from 'sequelize';
import _ from 'lodash'

export class Product {

  id = {
    field: 'id',
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.UUID,
  };

  name = {
    field: 'name',
    type: DataTypes.STRING(100)
  };

  inactivatedAt = {
    field: 'inactivatedAt',
    type: DataTypes.DATE
  }

  deteledAt = {
    field: 'deteledAt',
    type: DataTypes.DATE
  }

  situation = {
    field: 'situation',
    type: new DataTypes.VIRTUAL,
  }

}