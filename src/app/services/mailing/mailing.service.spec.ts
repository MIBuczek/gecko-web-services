import {TestBed} from '@angular/core/testing';

import {DB_MESSAGE_ACTIONS, MailingService} from './mailing.service';
import {EmailMessage} from "classes/email-message.class";

/* Mock function to overwrite possibility of emission value*/
const mockSendEmail = (em: EmailMessage): Promise<DB_MESSAGE_ACTIONS> => {
  if (em.email) {
    return Promise.resolve(DB_MESSAGE_ACTIONS.SUCCESS)
  } else {
    return Promise.reject(DB_MESSAGE_ACTIONS.ERROR)
  }
}

describe('MailingService', () => {
  let service: MailingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MailingService);
    service.sendEmailMessage = mockSendEmail
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('has email services emit success message', (done) => {
    service.sendEmailMessage({email: 'michal@test.pl', message: 'test message'})
      .then((resp) => {
        expect(resp).toEqual(DB_MESSAGE_ACTIONS.SUCCESS)
        done()
      })
  })
  it('has email services emit error message', (done) => {
    service.sendEmailMessage({email: '', message: 'test message'})
      .catch((err) => {
        expect(err).toEqual(DB_MESSAGE_ACTIONS.ERROR)
        done()
      })
  })
});
