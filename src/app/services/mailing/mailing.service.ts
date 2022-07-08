import {Injectable} from '@angular/core';
import {getDatabase, ref, set} from "firebase/database";
import {EmailMessage} from "classes/email-message.class";
import {v4 as uuid} from 'uuid';

export enum DB_MESSAGE_ACTIONS {
  SUCCESS = "formSuccessSubmit",
  ERROR = "formErrorSubmit"
}

@Injectable({
  providedIn: 'root'
})
export class MailingService {
  private database = getDatabase();

  public async sendEmailMessage(em: EmailMessage): Promise<DB_MESSAGE_ACTIONS> {
    try {
      await set(ref(this.database, `messages/${uuid()}`), em)
      return DB_MESSAGE_ACTIONS.SUCCESS
    } catch (err) {
      console.error(err)
      return DB_MESSAGE_ACTIONS.ERROR
    }
  }
}
