// Initializes the `Mailer` service on path `/mailer`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import hooks from './mailer.hooks';

// import FeathersMailer from 'feathers-mailer';
const FeathersMailer = require('feathers-mailer');

import smtpTransport from 'nodemailer-smtp-transport';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    mailer: typeof FeathersMailer & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  let mailerSMTP = app.get('mailerSMTP');

  mailerSMTP = {
    host: mailerSMTP.host === 'SMTP_HOST' ? 'localhost' : mailerSMTP.host,
    secure: mailerSMTP.secure === 'SMTP_SECURE' ? false : mailerSMTP.secure,
    auth:
      !mailerSMTP.auth || mailerSMTP.auth.user === 'SMTP_USER'
        ? undefined
        : mailerSMTP.auth,
  };

  app.use('/mailer', FeathersMailer(smtpTransport(mailerSMTP)));

  // Get our initialized service so that we can register hooks
  const service = app.service('mailer');

  service.hooks(hooks);
}
