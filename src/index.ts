import Sendgrid from "./providers/sendgrid";
import { compile } from "handlebars";
import mjml2html from "mjml";
import util from "util";
import fs from "fs";
const readFile = util.promisify(fs.readFile);

import { IProvider, IAttachment } from "./types";

class Mailer {
  private _key?: string;
  private _baseDir?: string;
  public provider?: IProvider;
  public defaultFrom?: string;

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
  init({
    key,
    provider = "sendgrid",
    baseTemplateDir,
    defaultFrom
  }: {
    key: string;
    provider: string;
    baseTemplateDir: string;
    defaultFrom?: string;
  }) {
    this._baseDir = baseTemplateDir;
    this.defaultFrom = defaultFrom;

    if (provider === "sendgrid") {
      this.provider = new Sendgrid(key);
    } else {
      throw new Error(`Mailer: Unsupported provider '${provider}`);
    }
  }

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
  async send(
    template: string,
    {
      to,
      from,
      subject,
      data,
      attachments
    }: {
      to: string | string[];
      from?: string;
      subject: string;
      data: any;
      attachments?: IAttachment | IAttachment[];
    }
  ) {
    if (!template) throw new Error("Mailer: No template specified");
    if (!this.defaultFrom && !from)
      throw new Error(
        'Mailer: Must pass a "from" in the options or define a defaultFrom in the initializer'
      );
    if (!subject) throw new Error('Mailer: Must include a "subject"');
    if (!to || (Array.isArray(to) && !to.length))
      throw new Error('Mailer: Must include a "to"');

    const mjmlFile = await readFile(
      this._baseDir + "/" + template + "/html.mjml",
      "utf8"
    );
    const mjmlTemplate = compile(mjmlFile);
    const html = mjml2html(mjmlTemplate(data)).html;

    const hbsFile = await readFile(
      this._baseDir + "/" + template + "/text.handlebars",
      "utf8"
    );
    const textTemplate = compile(hbsFile);
    const text = textTemplate(data);

    from = from || this.defaultFrom || "";

    return this.provider!.send({ to, from, subject, html, text }, attachments);
  }
}

const mailer = new Mailer();

export default mailer;
