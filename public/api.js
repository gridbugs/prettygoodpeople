
function get_public_key(username, callback, extra) {
    $.get(server_url + 'get-public-key', {username: username},
    function(data_str) {
        var data = JSON.parse(data_str);
        callback(data.id, data.publickey, extra);
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
    $.post(server_url + 'send-multiple-messages', {message_array: JSON.stringify(message_array)},
    function(response_str) {
        var response = JSON.parse(response_str);
        callback(response);
    });
}

function with_uuid(callback) {
    $.get(server_url + 'uuid', {},
    function(uuid) {
        callback(uuid);
    });
}
