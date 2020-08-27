// Initializes the `AuthManagement` service on path `/auth-management`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import authManagement, {
  AuthManagementService,
  Actions,
  Types,
} from 'feathers-authentication-management-ts';
import hooks from './auth-management.hooks';
import notifier, { NotifierLinkType, isNotifierLinkType } from './notifier';
import path from 'path';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    authManagement: AuthManagementService & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  app.configure(
    authManagement({
      skipIsVerifiedCheck: true,
      service: 'users',
      notifier: notifier(app).notifier,
      path: 'authManagement',
    })
  );

  const service = app.service('authManagement');

  service.hooks(hooks);

  // app.get('/authManagementClient/*', async (req, res, next) => {
  //   const reqAction: NotifierLinkType | undefined = isNotifierLinkType(
  //     req.path.split('/').pop()
  //   )
  //     ? <NotifierLinkType>req.path.split('/').pop()
  //     : undefined;
  //   const token: string = <string>req.query.token;
  //   const email: string = <string>req.query.email;
  //   let action: Types | null = null;

  //   console.log('get:action', action);
  //   console.log('get:token:', token);
  //   console.log('get:email:', email);

  //   switch (areqAction) {
  //     case 'verify':
  //       // action =
  //       break;
  //     case 'reset':
  //       action = 'resetPwdLong';
  //       break;
  //     case 'verifyChanges':
  //       break;
  //     // case 'sendResetPwd':
  //     //   break;
  //     // case 'resendVerifySignup':
  //     //   break;
  //     // case 'resetPwdLong':
  //     //   break;
  //     // case 'resetPwdShort':
  //     //   break;
  //     // case 'passwordChange':
  //     //   break;
  //     // case 'verifySignupLong':
  //     //   break;
  //     // case 'verifySignupShort':
  //     //   break;
  //     default:
  //       console.error(`action not supported`);
  //   }

  //   if (action) {
  //     service
  //       .create({
  //         // action: 'resetPwdLong',
  //         action,
  //         value: { token: <string>token, password: 'toto' },
  //       })
  //       .then((r) => {
  //         res.end(r);
  //       })
  //       .catch((error) => {
  //         console.error(error);
  //         next(error);
  //       });
  //   } else {
  //     next();
  //   }
  //   //console.log('return', verifySignupLong)
  //   //  next();
  // });
}
