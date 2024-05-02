export enum EmailActionAdmin {
  ANSWERED = "ANSWERED",
  DELETE = "DELETE",
  CLOSE = "CLOSE",
}

export interface IEmailMessage {
  email: string;
  message: string;
  createdAt: string;
  replay: boolean;
}

export interface IAdminEmail extends IEmailMessage {
  id: string;
}
