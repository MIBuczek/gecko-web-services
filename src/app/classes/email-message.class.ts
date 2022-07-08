import {IEmailMessage} from "models/email-message";

export class EmailMessage implements IEmailMessage {
  constructor(readonly email: string, readonly message: string) {
  this.email = email ; this.message = message
  }
}
