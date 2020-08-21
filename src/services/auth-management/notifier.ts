import { Application } from '../../declarations';
import logger from '../../logger';
import {
  Types,
  Notifier,
  NotifierOptions,
} from 'feathers-authentication-management-ts';

export type NotifierLinkType = 'reset' | 'verify' | 'verifyChanges';

export type Email = {
  from: string;
  to: string;
  subject: string;
  html: string;
};

export default (app: Application): Notifier => {
  let authManagerConf = app.get('authManager');

  authManagerConf.baseURL = authManagerConf.baseURL
    ? authManagerConf.baseURL
    : `http://${app.get('host')}:${app.get('port')}`;

  const emailFrom = authManagerConf.emailFrom || 'from@example.com';

  const getLink = (linkType: NotifierLinkType, token: string): string => {
    return `${authManagerConf.baseURL}/${linkType}?token=${token}`;
  };

  const sendEmail = (email: Email): Promise<void> => {
    return app
      .service('mailer')
      .create(email)
      .then(function (result: any) {
        logger.info('Sent email: %o', result);
      })
      .catch((error: any) => {
        logger.error('Error sending email: %o', error);
      });
  };

  return (type: Types, user: any, notifierOptions: NotifierOptions) => {
    let tokenLink;
    let email;
    switch (type) {
      case 'resendVerifySignup': //sending the user the verification email
        tokenLink = getLink('verify', user.verifyToken);
        email = {
          from: emailFrom,
          to: <string>user.email,
          subject: 'Verify Signup',
          html: tokenLink,
        };
        return sendEmail(email);
        break;

      case 'verifySignup': // confirming verification
        tokenLink = getLink('verify', user.verifyToken);
        email = {
          from: emailFrom,
          to: <string>user.email,
          subject: 'Confirm Signup',
          html: 'Thanks for verifying your email',
        };
        return sendEmail(email);
        break;

      case 'sendResetPwd':
        tokenLink = getLink('reset', user.resetToken);
        email = {
          from: emailFrom,
          to: <string>user.email,
          subject: 'Password reset',
          html: tokenLink,
        };
        return sendEmail(email);
        break;

      case 'resetPwd':
        tokenLink = getLink('reset', user.resetToken);
        email = {
          from: emailFrom,
          to: <string>user.email,
          subject: 'Password reset',
          html: tokenLink,
        };
        return sendEmail(email);
        break;

      case 'passwordChange':
        email = {
          from: emailFrom,
          to: <string>user.email,
          subject: 'Password reset',
          html: `Password changed`,
        };
        return sendEmail(email);
        break;

      case 'identityChange':
        tokenLink = getLink('verifyChanges', user.verifyToken);
        email = {
          from: emailFrom,
          to: <string>user.email,
          subject: 'Identity changed',
          html: tokenLink,
        };
        return sendEmail(email);
        break;

      default:
        break;
    }
  };
};
