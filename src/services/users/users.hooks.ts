import * as feathersAuthentication from '@feathersjs/authentication';
import * as local from '@feathersjs/authentication-local';
import {
  iff,
  isProvider,
  preventChanges,
  keep,
  disallow,
} from 'feathers-hooks-common';
import { Hook, HookContext } from '@feathersjs/feathers';
import { hooks } from 'feathers-authentication-management-ts';
import notifier from '../auth-management/notifier';

// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = feathersAuthentication.hooks;
const { hashPassword, protect } = local.hooks;

export default {
  before: {
    all: [],
    find: [authenticate('jwt')],
    get: [authenticate('jwt')],
    create: [hashPassword('password'), hooks.addVerification()],
    update: [hashPassword('password'), authenticate('jwt')],
    patch: [
      /**
       * NOTE: authentication-management has password hashing built in.
       * To prevent double hashing our password we are only hashing it for external calls.
       */
      iff(
        isProvider('external'),
        preventChanges(
          true,
          'isVerified',
          'verifyToken',
          'verifyShortToken',
          'verifyExpires',
          'verifyChanges',
          'resetToken',
          'resetShortToken',
          'resetExpires'
        ),
        hashPassword('password'),
        authenticate('jwt')
      ),
    ],
    remove: [authenticate('jwt')],
  },

  after: {
    all: [
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password'),
    ],
    find: [],
    get: [],
    create: [
      // (context: HookContext) => {
      //   notifier(context.app)(
      //     'resendVerifySignup',
      //     context.result
      //   );
      // },
      hooks.removeVerification(),
    ],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
