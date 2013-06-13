/* profile.js
 * Stephen Sherratt (sb@stevebob.net)
 * The offline data structure representing a user's profile
 */

function Profile(){
    this.cyphertext_cache = [];
    this.is_password_stored = false;
}
Profile.prototype.set_private_key = function(private_key) {
    this.private_key = private_key;
}
Profile.prototype.set_stored_password = function(password) {
    this.password = password;
    this.is_password_stored = true;
}
Profile.prototype.clear_stored_password = function() {
    this.password = "";
    this.is_password_stored = false;
}
