function get_public_key(username, callback) {
    $.get(server_url + 'get-public-key', {username: username},
    function(data_str) {
        var data = JSON.parse(data_str);
        callback(data.id, data.publickey);
    });
}

function get_public_key_array(username_array, callback) {
    $.get(server_url + 'get-public-key-array', {username_array: JSON.stringify(username_array)},
    function(data_str) {
        var data = JSON.parse(data_str);
        callback(data);
    });
}

function send_message(recipient_id, message, callback) {
    $.post(server_url + 'send-message', 
        {
            user_id: recipient_id,
            body: message
        }, function(response_str) {
            var response = JSON.parse(response_str);
            callback(response);
        }
        );
}

function send_multiple_messages(message_array, callback) {
    console.debug(message_array);
    $.post(server_url + 'send-multiple-messages', {message_array: JSON.stringify(message_array)},
    function(response_str) {
        var response = JSON.parse(response_str);
        callback(response);
    });
}

function test2() {
    var messages = [
        {user_id: 1, body: "test1"},
        {user_id: 1, body: "test2"}]
    send_multiple_messages(messages, function(a){console.debug(a)});
}
