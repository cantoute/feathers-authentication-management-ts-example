// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
import { Sequelize, DataTypes, Model } from 'sequelize';
import { Application } from '../declarations';
import { HookReturn } from 'sequelize/types/lib/hooks';

export default function (app: Application): typeof Model {
  const sequelizeClient: Sequelize = app.get('sequelizeClient');
  const users = sequelizeClient.define(
    'users',
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      verifyToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      verifyShortToken: {
        type: DataTypes.STRING,
      },
      verifyExpires: {
        type: DataTypes.DATE,
      }, // or a long integer
      verifyChanges: {
        /**
         * on database that supports it ie: Postgres
         * type: DataTypes.JSON
         * on others, we map it to text
         */
        type: DataTypes.TEXT,
        get: function () {
          return JSON.parse(this.getDataValue('verifyChanges'));
        },
        set: function (value) {
          return this.setDataValue('verifyChanges', JSON.stringify(value));
        },
      }, // an object (key-value map), e.g. { field: "value" }
      resetToken: {
        type: DataTypes.STRING,
      },
      resetShortToken: {
        type: DataTypes.STRING,
      },
      resetExpires: {
        type: DataTypes.DATE,
      },
    },
    {
      hooks: {
        beforeCount(options: any): HookReturn {
          options.raw = true;
        },
      },
    }
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (users as any).associate = function (models: any): void {
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return users;
}
