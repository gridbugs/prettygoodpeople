/* profile.js
 * Stephen Sherratt (sb@stevebob.net)
 * The offline data structure representing a user's profile
 */

function Profile(username){
    this.cyphertext_cache = [];
    this.is_password_stored = false;
    this.username = username;
}
Profile.prototype.set_private_key = function(private_key) {
    this.private_key = private_key;
}
Profile.prototype.set_public_key = function(public_key) {
    this.public_key = public_key;
}
Profile.prototype.set_stored_password = function(password) {
    this.password = password;
    this.password_hash = CryptoJS.MD5(password).toString();
    this.is_password_stored = true;
}
Profile.prototype.clear_stored_password = function() {
    this.password = "";
    this.is_password_stored = false;
}

$P = function(username, private_key, public_key, password) {
    var p = new Profile(username);
    p.set_private_key(private_key);
    p.set_public_key(public_key);
    p.set_stored_password(password);
    return p;
}
