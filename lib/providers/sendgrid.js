"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mail_1 = __importDefault(require("@sendgrid/mail"));
var Sendgrid = /** @class */ (function () {
    function Sendgrid(key) {
        mail_1.default.setApiKey(key);
    }
    Sendgrid.prototype.send = function (message, attachments) {
        if (attachments) {
            if (!Array.isArray(attachments)) {
                attachments = [attachments];
            }
            message.attachments = attachments;
        }
        mail_1.default.send(message);
    };
    return Sendgrid;
}());
exports.default = Sendgrid;
