// check rdns against list of regexps

exports.hook_connect = function (next, connection) {
    var deny_list = this.config.get('rdns.deny_regexps', 'list');
    var allow_list = this.config.get('rdns.allow_regexps', 'list');
    
    for (var i=0,l=deny_list.length; i < l; i++) {
        var re = new RegExp(deny_list[i]);
        if (re.test(connection.remote_host)) {
            for (var i=0,l=allow_list.length; i < l; i++) {
                var re = new RegExp(allow_list[i]);
                if (re.test(connection.remote_host)) {
                    this.loginfo("rdns matched: " + allow_list[i] +
                        ", allowing");
                    return next();
                }
            }

            this.loginfo("rdns matched: " + deny_list[i] + ", blocking");
            return next(DENY, "Connection from a known bad host");
        }
    }

    return next();
};
