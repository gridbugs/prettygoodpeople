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
            console.debug(cyphertext);

            var to_send = [];
            console.debug(broadcast);
            for (var i in broadcast.recipients) {
                to_send[i] = {user_id: data[i].id, body: cyphertext[i]};
            }
            console.debug(to_send);
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

DirectMessage.prototype.send = function() {
    var direct_message = this;
    
    with_uuid(function(uuid) {

        var message = {
            type: "personal-message",
            uuid: uuid,
            sender: direct_message.sender,
            recipient: direct_message.recipient,
            body: direct_message.plaintext
        };

        var message_copy = {
            type: "personal-message-sender-copy",
            uuid: uuid,
            sender: direct_message.sender,
            recipient: direct_message.recipient,
            body: direct_message.plaintext
        };
        
        get_public_key_array([direct_message.recipient, direct_message.sender], function(data) {
            message_str = JSON.stringify(message);
            message_copy_str = JSON.stringify(message_copy);
            var packet = {message: message,
                          signature: sign_and_en(current_user_data.private_key,
                                            data[0].publickey,
                                            message_str)
                         };
            var packet_copy = {message: message_copy,
                               signature: sign_and_en(current_user_data.private_key,
                                                 data[1].publickey,
                                                 message_copy_str)
                                };

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
    new DirectMessage("user1", "user2", "It is a good day, isn't it.").send();
}

function test1() {
    var a = new Broadcast("user1", ["user1", "user2"], "hope everyone is ready");
    a.send();
}
