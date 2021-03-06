"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSettings = void 0;
const mongodb_1 = require("mongodb");
const Model_1 = __importDefault(require("./Model"));
class UserSettings extends Model_1.default {
    constructor(userSettings) {
        super('UserSettings', Object.assign(Object.assign({}, userSettings), { _id: new mongodb_1.ObjectID(userSettings._id) }));
    }
    static deleteUserSettings(id) {
        return this.deleteModel(new mongodb_1.ObjectID(id), this.collection);
    }
    static updateUserSettings(id, data) {
        return this.updateAndReturnModel(new mongodb_1.ObjectID(id), data, this.collection);
    }
    static getUserSettings(query) {
        return this.getModel(query, this.collection);
    }
    static getSpecificFields(query, project) {
        return this._getSpecificFields(query, project, this.collection);
    }
    static setResetPasswordToken(userId, token) {
        return this.updateModel(new mongodb_1.ObjectID(userId), {
            $set: {
                resetPassword: {
                    token: token,
                    bestBefore: new Date().getTime() + 7400000
                }
            }
        }, this.collection);
    }
    static unsetResetPasswordToken(userId) {
        return this.updateModel(new mongodb_1.ObjectID(userId), {
            $unset: {
                resetPassword: ""
            }
        }, this.collection);
    }
    static acceptEmail(userId) {
        return this.updateModel(new mongodb_1.ObjectID(userId), {
            $set: {
                approved: true
            },
            $unset: {
                approveEmailToken: ""
            }
        }, this.collection);
    }
}
exports.UserSettings = UserSettings;
UserSettings.collection = 'UserSettings';
