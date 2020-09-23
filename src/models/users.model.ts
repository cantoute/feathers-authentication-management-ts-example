// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
import { Sequelize, DataTypes, Model } from 'sequelize';
import { Application } from '../declarations';
import { HookReturn } from 'sequelize/types/lib/hooks';
import logger from '../logger'

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
      },
      verifyShortToken: {
        type: DataTypes.STRING,
      },
      verifyExpires: {
        type: DataTypes.DATE,
      }, // or a long integer
      verifyChanges: {
        type: DataTypes.TEXT,
        /**
         * on database that supports it ie: Postgres
         * type: DataTypes.JSON
         * on others, we map it to text
         */
        get: function () {
          const prop = 'verifyChanges';
          const str = this.getDataValue(prop);
          if (str) {
            try {
              return JSON.parse(str);
            } catch (e) {
              logger.error(`Sequelize get (${prop}): failed to parse json from:\n%s`, str);
              return null;
            }
          }
          return null;
        },
        set: function (value = null) {
          const prop = 'verifyChanges';
          try {
            this.setDataValue(prop, JSON.stringify(value));
          } catch (e) {
            logger.error(`Sequelize set (${prop}): Failed to JSON.stringify() - %s`, e.message);
            this.setDataValue(prop, null);
          }
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
