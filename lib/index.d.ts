import { IProvider, IAttachment } from "./types";
declare class Mailer {
    private _key?;
    private _baseDir?;
    provider?: IProvider;
    defaultFrom?: string;
    /**
     * Initialize the Mailer with an api key, provider, and base template directory
     *
     * Currently supported providers:
     * - `sendgrid`
     *
     * **Provider defaults to 'sendgrid'**
     *
     * @param options - Options Interface:
     * ```
     * {
     *    key: 'provider api key',
     *    provider: 'providername',
     *    baseTemplateDir: 'path/to/templates',
     *    defaultFrom: 'from email to be used by default if a from is not included in the send' //(optional)
     * }
     * ```
     */
    init({ key, provider, baseTemplateDir, defaultFrom }: {
        key: string;
        provider: string;
        baseTemplateDir: string;
        defaultFrom?: string;
    }): void;
    /**
     * Sends an email.
     *
     * @param template
     *  Template path within the baseDir that mailer was initialized with.
     *  Template path must be a folder and contain both html.mjml and text.handlebars files
     *
     * @param options - `{to, from, subject, data, attachments}`
     *  - `to` can be a single email or an array.
     *  - `from` is optional if you already set a defaultFrom in the initializer.
     *  - `data` contains any data your templates consume
     *  - `attachments` can be a single object or an array. and has the interface:
     * ```
     * {
     *  content: 'Base64 String',
     *  filename: 'filename with extension',
     *  type: 'mime type',
     *  disposition: 'attachment | inline', // (optional, defaults to 'attachment')
     *  content_id: 'id for inline disposition' // (optional)
     * }
     * ```
     */
    send(template: string, { to, from, subject, data, attachments }: {
        to: string | string[];
        from?: string;
        subject: string;
        data: any;
        attachments?: IAttachment | IAttachment[];
    }): Promise<void>;
}
declare const mailer: Mailer;
export default mailer;
