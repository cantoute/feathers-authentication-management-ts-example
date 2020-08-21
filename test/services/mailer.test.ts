import app from '../../src/app';

describe('\'Mailer\' service', () => {
  it('registered the service', () => {
    const service = app.service('mailer');
    expect(service).toBeTruthy();
  });
});
