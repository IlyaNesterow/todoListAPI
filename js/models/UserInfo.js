"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserInfo = void 0;
const mongodb_1 = require("mongodb");
const Model_1 = __importDefault(require("./Model"));
class UserInfo extends Model_1.default {
    constructor(userInfo) {
        super('UserInfo', Object.assign(Object.assign({}, userInfo), { _id: new mongodb_1.ObjectID(userInfo._id), FullfilledTodos: 0, ActiveTodos: 0 }));
    }
    static setLastSeen(userId) {
        return this.updateModel(new mongodb_1.ObjectID(userId), {
            $set: {
                lastSeen: new Date()
            }
        }, this.collection);
    }
    static getSpecificFields(query, project) {
        return this._getSpecificFields(query, project, this.collection);
    }
    static deleteUserInfo(userId) {
        return this.deleteModel(new mongodb_1.ObjectID(userId), this.collection);
    }
    static updateUserInfo(userId, data) {
        return this.updateAndReturnModel(new mongodb_1.ObjectID(userId), data, this.collection);
    }
    static increaseActiveTodos(userId) {
        return this.updateModel(new mongodb_1.ObjectID(userId), { $inc: { ActiveTodos: 1 } }, this.collection);
    }
    static increaseCompletedTodos(userId) {
        return this.updateModel(new mongodb_1.ObjectID(userId), { $inc: { FullfilledTodos: 1 } }, this.collection);
    }
    static decreaseActiveTodos(userId) {
        return this.updateModel(new mongodb_1.ObjectID(userId), { $inc: { ActiveTodos: -1 } }, this.collection);
    }
    static decreaseCompletedTodos(userId) {
        return this.updateModel(new mongodb_1.ObjectID(userId), { $inc: { FullfilledTodos: -1 } }, this.collection);
    }
    static getUserInfo(userId) {
        return this.getModel({ _id: new mongodb_1.ObjectID(userId) }, this.collection);
    }
}
exports.UserInfo = UserInfo;
UserInfo.collection = 'UserInfo';
