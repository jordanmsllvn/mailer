import sgMail from "@sendgrid/mail";
import { IMessage, IAttachment, IProvider } from "../types";

export default class Sendgrid implements IProvider {
  constructor(key: string) {
    sgMail.setApiKey(key);
  }
  send(message: IMessage, attachments?: IAttachment | IAttachment[]) {
    if (attachments) {
      if (!Array.isArray(attachments)) {
        attachments = [attachments];
      }
      message.attachments = attachments;
    }
    sgMail.send(message);
  }
}
