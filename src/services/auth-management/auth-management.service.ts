// Initializes the `AuthManagement` service on path `/auth-management`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import authManagement, {
  AuthManagementService,
} from 'feathers-authentication-management-ts';
import hooks from './auth-management.hooks';
import notifier from './notifier';

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
      notifier: notifier(app),
    })
  );

  const service = app.service('authManagement');

  service.hooks(hooks);
}
