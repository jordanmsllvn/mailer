export interface IProvider {
  send(arg0: IMessage, arg1?: IAttachment | IAttachment[]): void;
}

export interface IMessage {
  to: string | string[];
  from: string;
  subject: string;
  text: string;
  html: string;
  attachments?: IAttachment[];
}
export interface IAttachment {
  content: string;
  filename: string;
  type: string;
  disposition?: string;
  content_id?: string;
}
