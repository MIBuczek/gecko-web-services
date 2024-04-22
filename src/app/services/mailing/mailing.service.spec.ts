import { TestBed } from '@angular/core/testing';

import { DB_MESSAGE_ACTIONS, MailingService } from './mailing.service';
import { EmailMessage } from "classes/email-message.class";
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Database, getDatabase } from 'firebase/database';
import { inject } from '@angular/core';
import { provideFirebaseApp } from '@angular/fire/app';
import { provideDatabase } from '@angular/fire/database';
import { initializeApp } from 'firebase/app';
import { environment } from '../../../environments/environment';
import { throwError } from 'rxjs';

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
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideDatabase(() => getDatabase()),
      ],
      providers: [{ provide: Database, useValue: {} }],
    });
    service = TestBed.inject(MailingService);
    service.sendEmailMessage = mockSendEmail
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('has email services emit success message', async () => {
    jest.spyOn(service, 'sendEmailMessage').mockReturnValue(Promise.resolve(DB_MESSAGE_ACTIONS.SUCCESS))
    try {
      const resp = await service.sendEmailMessage({ email: 'michal@test.pl', message: 'test message' })
      expect(resp).toEqual(DB_MESSAGE_ACTIONS.SUCCESS)
    } catch (err) {
      expect(err).toBeUndefined()
    }
  })

  it('has email services emit error message', async () => {
    jest.spyOn(service, 'sendEmailMessage').mockReturnValue(Promise.reject(DB_MESSAGE_ACTIONS.ERROR))
    try {
      await service.sendEmailMessage({ email: '', message: 'test message' })
    } catch (err) {
      expect(err).toEqual(DB_MESSAGE_ACTIONS.ERROR)
    }
  })
});
