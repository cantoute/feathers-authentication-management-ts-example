import * as authentication from '@feathersjs/authentication';
import { iff, SyncContextFunction } from 'feathers-hooks-common';
import { Types } from 'feathers-authentication-management-ts';
import { HookContext } from '@feathersjs/feathers';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

const isAction = (...params: Types[]): SyncContextFunction<boolean> => {
  // const args = Array.from(params);
  // return (context: HookContext): boolean => args.includes(context.data.action);
  return (context: HookContext): boolean =>
    params.includes(context.data.action);
};

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      iff(isAction('passwordChange', 'identityChange'), authenticate('jwt')),
    ],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
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
