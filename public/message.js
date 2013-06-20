function Com(message, encrypt_key) {
    var message_str = JSON.stringify(message);
    this.message = message;
    this.signature = sign_and_en(current_user_data.private_key,
                                            encrypt_key,
                                            CryptoJS.MD5(message_str).toString());
}

function Broadcast(sender, recipients, plaintext) {
    this.sender = sender;
    this.recipients = recipients;
    this.plaintext = plaintext;
}

Broadcast.prototype.send = function() {
    var broadcast = this;
    with_uuid(function(uuid) {

        get_public_key_array(this.recipients, function(data) {
            var cyphertext = data.map(function(user) {
                var message = {
                    type: "broadcast",
                    sender: broadcast.sender,
                    recipients: broadcast.recipients,
                    body: broadcast.plaintext
                };

                message.signature = sign_and_en(current_user_data.private_key,
                                            user.publickey,
                                            message.body);

                return en(user.publickey, JSON.stringify(message));
            });

            var to_send = [];
            for (var i in broadcast.recipients) {
                to_send[i] = {user_id: data[i].id, body: cyphertext[i]};
            }
            send_multiple_messages(to_send, function(message_id_array) {
                console.debug(message_id_array);
            });
        });
    });
}


function DirectMessage(sender, recipient, plaintext) {
    this.sender = sender;
    this.recipient = recipient;
    this.plaintext = plaintext;
}

DirectMessage.prototype.format = function(uuid) {
    return {
        uuid: uuid,
        type: "personal-message",
        sender: this.sender,
        recipient: this.recipient,
        body: this.plaintext
    };
}

DirectMessage.prototype.send = function() {
    var direct_message = this;

    with_uuid(function(uuid) {

        var message = direct_message.format(uuid);

        var message_copy = direct_message.format(uuid);
        message_copy.type = "personal-message-sender-copy";

        get_public_key_array([direct_message.recipient, direct_message.sender], function(data) {
            message_str = JSON.stringify(message);
            message_copy_str = JSON.stringify(message_copy);
            var packet = new Com(message, data[0].publickey);
            var packet_copy = new Com(message, data[1].publickey);
            send_multiple_messages([
                {user_id: data[0].id, body: en(data[0].publickey, JSON.stringify(packet))},
                {user_id: data[1].id, body: en(data[1].publickey, JSON.stringify(packet_copy))}
            ],
            function(message_id_array) {
                console.debug(message_id_array);
            });
        });
    });
}

function test2() {
    new DirectMessage("user1", "user3", "user1 to user3").send();
}

function test1() {
    var a = new Broadcast("user1", ["user1", "user2"], "hope everyone is ready");
    a.send();
}
