import { HttpErrorResponse } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Database } from "@angular/fire/database";
import { IEmailMessage } from "app/models/email-message";
import { EmailMessage } from "classes/email-message.class";
import { ref, set, get, update } from "firebase/database";
import { v4 as uuid } from "uuid";

export enum DB_MESSAGE_ACTIONS {
  SUCCESS = "formSuccessSubmit",
  ERROR = "formErrorSubmit",
}

@Injectable({
  providedIn: "root",
})
export class MailingService {
  database: Database = inject(Database);

  /**
   * Retrieves all emails from the database.
   *
   * @return {Promise<{ [x: string]: IEmailMessage } | HttpErrorResponse>} The emails or an HttpErrorResponse if an error occurred.
   */
  async getAllEmails(): Promise<
    { [x: string]: IEmailMessage } | HttpErrorResponse
  > {
    try {
      const resp = await get(ref(this.database, "messages"));
      return resp.val();
    } catch (err) {
      return new HttpErrorResponse({ error: err });
    }
  }

  /**
   * Updates an email message in the database with the specified ID.
   *
   * @param {string} id - The ID of the email message to update.
   * @return {Promise<void | HttpErrorResponse>} A promise that resolves to the result of the update operation.
   *                        If an error occurs during the update, it will be wrapped in an HttpErrorResponse.
   */
  async updateEmail(id: string): Promise<void | HttpErrorResponse> {
    try {
      await update(ref(this.database, `messages/${id}`), { replay: true });
    } catch (err) {
      return new HttpErrorResponse({ error: err });
    }
  }

  /**
   * Deletes an email with the given ID from the database.
   *
   * @param {string} id - The ID of the email to be deleted.
   * @return {Promise<void | HttpErrorResponse>}  - A promise that resolves to the result of the deletion operation.
   *                          If an error occurs during the deletion, it will be wrapped in an HttpErrorResponse.
   */
  async deleteEmail(id: string): Promise<void | HttpErrorResponse> {
    try {
      await set(ref(this.database, `messages/${id}`), null);
    } catch (err) {
      return new HttpErrorResponse({ error: err });
    }
  }

  /**
   * Asynchronously sends an email message.
   *
   * @param {EmailMessage} em - The email message to be sent.
   * @return {Promise<DB_MESSAGE_ACTIONS>} The result of sending the email message.
   */
  async sendEmailMessage(em: EmailMessage): Promise<DB_MESSAGE_ACTIONS> {
    try {
      await set(ref(this.database, `messages/${uuid()}`), em);
      return DB_MESSAGE_ACTIONS.SUCCESS;
    } catch (err) {
      console.error(err);
      return DB_MESSAGE_ACTIONS.ERROR;
    }
  }
}
