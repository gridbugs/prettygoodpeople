
var server_url = "http://localhost:4567/";

if (localStorage.profiles == undefined) {
    localStorage.profiles = [];
}

function en(public_key, plaintext) {
    var key = openpgp.read_publicKey(public_key);
    console.debug(key);
    var cyphertext = openpgp.write_encrypted_message(key, plaintext);
    return cyphertext;
}

function de() {
    var priv_key = openpgp.read_privateKey($('#private-key').val());
    var msg = openpgp.read_message($('#cyphertext').val());

    var keymat = null;
    var sesskey = null;
    // Find the private (sub)key for the session key of the message
    for (var i = 0; i< msg[0].sessionKeys.length; i++) {
        if (priv_key[0].privateKeyPacket.publicKey.getKeyId() == msg[0].sessionKeys[i].keyId.bytes) {
            keymat = { key: priv_key[0], keymaterial: priv_key[0].privateKeyPacket};
            sesskey = msg[0].sessionKeys[i];
            break;
        }
        for (var j = 0; j < priv_key[0].subKeys.length; j++) {
            if (priv_key[0].subKeys[j].publicKey.getKeyId() == msg[0].sessionKeys[i].keyId.bytes) {
                keymat = { key: priv_key[0], keymaterial: priv_key[0].subKeys[j]};
                sesskey = msg[0].sessionKeys[i];
                break;
            }
        }
    }
    if (keymat != null) {
        if (!keymat.keymaterial.decryptSecretMPIs('Y3llowT4xi.13')) {
            console.debug("Password for secret key was incorrect!");
            return;

        }
        $('#decrypted').text(msg[0].decrypt(keymat, sesskey));
    } else {
        console.debug("No private key found!");
    }

    return msg;
}


