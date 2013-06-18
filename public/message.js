function Broadcast(sender, recipients, plaintext) {
    this.sender = sender;
    this.recipients = recipients;
    this.plaintext = plaintext;
}

Broadcast.prototype.send = function() {
    var broadcast = this;
    get_public_key_array(this.recipients, function(data) {
        var cyphertext = data.map(function(user) {
            var message = {
                type: "broadcast",
                sender: broadcast.sender,
                recipients: broadcast.recipients,
                body: broadcast.plaintext
            };
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
}

function test1() {
    var a = new Broadcast("steve", ["steve", "stevebob", "test"], "we attack at dawn");
    a.send();
}
