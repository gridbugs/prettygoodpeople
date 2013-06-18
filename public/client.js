
openpgp.init();
var current_user_data = JSON.parse(localStorage.currentUserData);

if (localStorage.profiles == undefined) {
    localStorage.profiles = [];
}


function sign(private_key_str, plaintext) {
    var private_key = openpgp.read_privateKey(private_key_str);
    if (!private_key[0].decryptSecretMPIs(current_user_data.password)) {
        console.debug("incorrect password");
        return;
    }
    return openpgp.write_signed_message(private_key[0], plaintext);
}

function sign_and_en(private_key_str, public_key_str, plaintext) {
    var private_key = openpgp.read_privateKey(private_key_str);
    var public_key = openpgp.read_publicKey(public_key_str);
    if (!private_key[0].decryptSecretMPIs(current_user_data.password)) {
        console.debug("incorrect password");
        return;
    }
    return openpgp.write_signed_and_encrypted_message(private_key[0], public_key, plaintext);

}

function en(public_key, plaintext) {
    var key = openpgp.read_publicKey(public_key);
    var cyphertext = openpgp.write_encrypted_message(key, plaintext);
    return cyphertext;
}

function de(private_key_str, password, msg_str, public_key_str) {

    if (public_key_str != undefined) {
        var public_key = openpgp.read_publicKey(public_key_str);
        openpgp.keyring.importPublicKey(public_key_str);
    }

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
            return "";

        }
        var a = msg[0].decrypt(keymat, sesskey);
        if (public_key_str != undefined) {
            return global_signature_verified;
        } else {
            return a;
        }
    } else {
        console.debug("No private key found!");
    }

    return "error";
}


