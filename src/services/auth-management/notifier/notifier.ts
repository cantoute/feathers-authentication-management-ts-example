import logger from '../../../logger';
import {
  Types,
  Notifier,
  NotifierOptions,
} from 'feathers-authentication-management-ts';
import { Application } from '@feathersjs/feathers';
import fs from 'fs';
import path from 'path';
import * as Mustache from 'mustache';

const mailTemplates = {
  verifySignup: fs.readFileSync(
    path.join(__dirname, 'mail-verify-signup.mustache'),
    'utf8'
  ),
  resetPwd: fs.readFileSync(
    path.join(__dirname, 'mail-reset-pwd.mustache'),
    'utf8'
  ),
  passwordChange: fs.readFileSync(
    path.join(__dirname, 'mail-password-change.mustache'),
    'utf8'
  ),
  identityChange: fs.readFileSync(
    path.join(__dirname, 'mail-identity-change.mustache'),
    'utf8'
  ),
};

const mailCSS = fs.readFileSync(path.join(__dirname, 'mail.css'), 'utf8');

// export type NotifierLinkType = 'reset' | 'verify' | 'verifyChanges';

export const stringLitArray = <L extends string>(arr: L[]) => arr;

export const notifierLinkTypes = stringLitArray([
  'reset',
  'verify',
  'verifyChanges',
]);
export type NotifierLinkType = typeof notifierLinkTypes[number];
export const isNotifierLinkType = (x: any): x is NotifierLinkType =>
  notifierLinkTypes.includes(x);

// export enum NotifierLinkType = {
//   Reset: 'reset',
// }

export type Email = {
  from: string;
  to: string;
  subject: string;
  html: string;
};

export default (app: Application): { notifier: Notifier } => {
  let authManagerConf = app.get('authManager');

  // authManagerConf.clientURL = authManagerConf.clientURL
  //   ? authManagerConf.clientURL
  //   : `http://${app.get('host')}:${app.get('port')}/authManagementClient`;

  const emailFrom = authManagerConf.emailFrom || 'from@example.com';

  const getLink = (
    linkType: NotifierLinkType,
    token: string,
    email: string | undefined = undefined
  ): string => {
    return `${authManagerConf.clientURL}/${linkType}?token=${token}${
      email ? `&email=${encodeURI(email)}` : ''
    }`;
  };

  const sendEmail = (email: Email): Promise<void> => {
    return app
      .service('mailer')
      .create(email)
      .then((result: any) => {
        logger.info('Sent email: %O', result);
      })
      .catch((error: any) => {
        logger.error('Error sending email: %O', error);
      });
  };

  const notifier = (
    type: Types,
    user: any,
    notifierOptions: NotifierOptions
  ) => {
    let tokenLink;
    let email;
    switch (type) {
      case 'verifySignup': // confirming verification
      case 'resendVerifySignup':
        tokenLink = getLink('verify', user.verifyToken);
        email = {
          from: emailFrom,
          to: <string>user.email,
          subject: 'Confirm Signup',
          html: Mustache.render(mailTemplates.verifySignup, {
            tokenLink,
            mailCSS,
          }),
        };
        return sendEmail(email);
        break;

      case 'resetPwd':
      case 'sendResetPwd':
        tokenLink = getLink('reset', user.resetToken);
        email = {
          from: emailFrom,
          to: <string>user.email,
          subject: 'Password reset',
          html: Mustache.render(mailTemplates.resetPwd, {
            tokenLink,
            mailCSS,
          }),
        };
        return sendEmail(email);
        break;

      case 'passwordChange':
        email = {
          from: emailFrom,
          to: <string>user.email,
          subject: 'Password changed',
          html: Mustache.render(mailTemplates.identityChange, {
            tokenLink,
            mailCSS,
          }),
        };
        return sendEmail(email);
        break;

      case 'identityChange':
        tokenLink = getLink('verifyChanges', user.verifyToken);
        email = {
          from: emailFrom,
          to: <string>user.email,
          subject: 'Identity changed',
          html: Mustache.render(mailTemplates.identityChange, {
            tokenLink,
            mailCSS,
          }),
        };
        return sendEmail(email);
        break;

      default:
        break;
    }
  };

  return { notifier };
};
