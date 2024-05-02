import { IEmailMessage } from "models/email-message";

export class EmailMessage implements IEmailMessage {
  readonly createdAt: string = new Date().toISOString()
  replay = false
  constructor(readonly email: string, readonly message: string) {
    this.email = email; this.message = message
  }
}
