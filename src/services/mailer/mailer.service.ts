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
  let mailerConf = app.get('mailer');

  mailerConf = {
    host: mailerConf.host === 'SMTP_HOST' ? 'localhost' : mailerConf.host,
    secure: mailerConf.secure === 'SMTP_SECURE' ? false : mailerConf.secure,
    auth:
      !mailerConf.auth || mailerConf.auth.user === 'SMTP_USER'
        ? undefined
        : mailerConf.auth,
  };

  app.use('/mailer', FeathersMailer(smtpTransport(mailerConf)));

  // Get our initialized service so that we can register hooks
  const service = app.service('mailer');

  service.hooks(hooks);
}
