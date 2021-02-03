import { IMessage, IAttachment, IProvider } from "../types";
export default class Sendgrid implements IProvider {
    constructor(key: string);
    send(message: IMessage, attachments?: IAttachment | IAttachment[]): void;
}
