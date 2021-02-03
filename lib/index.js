"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var sendgrid_1 = __importDefault(require("./providers/sendgrid"));
var handlebars_1 = require("handlebars");
var mjml_1 = __importDefault(require("mjml"));
var util_1 = __importDefault(require("util"));
var fs_1 = __importDefault(require("fs"));
var readFile = util_1.default.promisify(fs_1.default.readFile);
var Mailer = /** @class */ (function () {
    function Mailer() {
    }
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
    Mailer.prototype.init = function (_a) {
        var key = _a.key, _b = _a.provider, provider = _b === void 0 ? "sendgrid" : _b, baseTemplateDir = _a.baseTemplateDir, defaultFrom = _a.defaultFrom;
        this._baseDir = baseTemplateDir;
        this.defaultFrom = defaultFrom;
        if (provider === "sendgrid") {
            this.provider = new sendgrid_1.default(key);
        }
        else {
            throw new Error("Mailer: Unsupported provider '" + provider);
        }
    };
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
    Mailer.prototype.send = function (template, _a) {
        var to = _a.to, from = _a.from, subject = _a.subject, data = _a.data, attachments = _a.attachments;
        return __awaiter(this, void 0, void 0, function () {
            var mjmlFile, mjmlTemplate, html, hbsFile, textTemplate, text;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!template)
                            throw new Error("Mailer: No template specified");
                        if (!this.defaultFrom && !from)
                            throw new Error('Mailer: Must pass a "from" in the options or define a defaultFrom in the initializer');
                        if (!subject)
                            throw new Error('Mailer: Must include a "subject"');
                        if (!to || (Array.isArray(to) && !to.length))
                            throw new Error('Mailer: Must include a "to"');
                        return [4 /*yield*/, readFile(this._baseDir + "/" + template + "/html.mjml", "utf8")];
                    case 1:
                        mjmlFile = _b.sent();
                        mjmlTemplate = handlebars_1.compile(mjmlFile);
                        html = mjml_1.default(mjmlTemplate(data)).html;
                        return [4 /*yield*/, readFile(this._baseDir + "/" + template + "/text.handlebars", "utf8")];
                    case 2:
                        hbsFile = _b.sent();
                        textTemplate = handlebars_1.compile(hbsFile);
                        text = textTemplate(data);
                        from = from || this.defaultFrom || "";
                        return [2 /*return*/, this.provider.send({ to: to, from: from, subject: subject, html: html, text: text }, attachments)];
                }
            });
        });
    };
    return Mailer;
}());
var mailer = new Mailer();
exports.default = mailer;
