const NotificationProvider = require("./notification-provider");
const axios = require("axios");
const { DOWN, UP } = require("../../src/util");

class WeCom extends NotificationProvider {

    name = "WeCom";

    async send(notification, msg, monitorJSON = null, heartbeatJSON = null) {
        let okMsg = "Sent Successfully.";

        try {
            let WeComUrl = "https://wecomchan.sora.vip:51443/wecomchan";
            let config = {
                headers: {
                    "Content-Type": "application/json"
                }
            };
            let body = this.composeMessage(notification, heartbeatJSON, msg);
            await axios.post(WeComUrl, body, config);
            return okMsg;
        } catch (error) {
            this.throwGeneralAxiosError(error);
        }
    }

    /**
     * Generate the message to send
     * @param {Object} heartbeatJSON Heartbeat details (For Up/Down only)
     * @param {string} msg General message
     * @returns {Object}
     */
    composeMessage(notification, heartbeatJSON, msg) {
        let title;
        if (msg != null && heartbeatJSON != null && heartbeatJSON["status"] === UP) {
            title = "UptimeKuma Monitor Up";
        }
        if (msg != null && heartbeatJSON != null && heartbeatJSON["status"] === DOWN) {
            title = "UptimeKuma Monitor Down";
        }
        if (msg != null) {
            title = "UptimeKuma Message";
        }
        return {
            msg_type: "text",
            msg: title + msg,
            sendkey: notification.weComBotKey
        };
    }
}

module.exports = WeCom;
