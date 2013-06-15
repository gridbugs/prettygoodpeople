

if (localStorage.profiles == undefined) {
    localStorage.profiles = [];
}


function en(public_key, plaintext) {
    var key = openpgp.read_publicKey(public_key);
    var cyphertext = openpgp.write_encrypted_message(key, plaintext);
    return cyphertext;
}

function de(private_key_str, password, msg_str) {
    var priv_key = openpgp.read_privateKey(private_key_str);
    try {
        var msg = openpgp.read_message(msg_str);
    } catch (err) {
        console.debug("plaintext message");
        return msg_str;
    }

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
        if (!keymat.keymaterial.decryptSecretMPIs(password)) {
            console.debug("Password for secret key was incorrect!");
            return;

        }
        return msg[0].decrypt(keymat, sesskey);
    } else {
        console.debug("No private key found!");
    }

    return "error";
}


