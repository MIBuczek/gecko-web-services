import { Injectable, inject } from '@angular/core';
import { Database } from '@angular/fire/database';
import { EmailMessage } from "classes/email-message.class";
import { ref, set } from 'firebase/database';
import { v4 as uuid } from 'uuid';

export enum DB_MESSAGE_ACTIONS {
  SUCCESS = "formSuccessSubmit",
  ERROR = "formErrorSubmit"
}

@Injectable({
  providedIn: 'root'
})
export class MailingService {
  database: Database = inject(Database);

  public async sendEmailMessage(em: EmailMessage): Promise<DB_MESSAGE_ACTIONS> {
    try {
      await set(ref(this.database, `messages/${uuid()}`), { ...em, createdAt: new Date().toISOString() })
      return DB_MESSAGE_ACTIONS.SUCCESS
    } catch (err) {
      console.error(err)
      return DB_MESSAGE_ACTIONS.ERROR
    }
  }
}
