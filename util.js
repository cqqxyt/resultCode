
class util {
    constructor () {

    }

     /**
         * 替换动态消息
         * @param   {String} msg          替换前的字符串
         * @param   {String} arguments    替换的字符串(不定数量)
         * @returns {String} msg          替换后的字符串
         *
         * @example
         * getMessage();                                     //return "";
         * getMessage("message");                            //return "message";
         * getMessage("message", "str");                     //return "message";
         * getMessage("message {1}", "str");                 //return "message str";
         * getMessage("message {2}", "str");                 //return "message {2}";
         * getMessage("message {1}", "str", "hello");        //return "message str";
         * getMessage("message {1} {2}", "str", "hello");    //return "message str hello";
         * getMessage("message {2}", "str", "hello");        //return "message hello";
         */
        getMessage (msg) {
            if (arguments.length == 0) {
                return "";
            }

            msg += "";
            for (var i = 1; i < arguments.length; i++) {
                var key = "\\{" + i + "\\}";
                var value = arguments[i] + "";
                msg = msg.replaceAll(key, value);
            }
            return msg;
        },

        /**
         * rest接口callback统一处理方法
         *
         * @param {Object}   result        rest接口返回值
         * @param {Object}   callback      Function类型:  处理完成回调方法,含回调参数result.value,
         *                                 String类型:    成功操作提示语
         * @param {Function} onError       错误回调函数
         */
        restCallback (result, callback, onError) {
            try {
                //登录失效
                if (result.code == -1) {
                    //var msg = this.getMessage(xy_resultCode[result.retcode]);
                    var msg = result.msg;
                    window.alert(msg, function () {
                        //默认返回登录页
                        callback()
                    });
                    return;
                }

                if (!result.flag) {
                    alertDIV(gettext('操作失败！'))


                    if (result.code < 0) {
                        //var msg = this.getMessage(xy_resultCode[result.retcode], result.text);
                        var msg = result.msg;
                        if (onError) {
                            xy_util.hideLock();
                            xy_util.hideLoadingCard();
                            onError(result.code, result, msg);
                            return;
                        }

                        xy_util.alertDIV(msg, function () {

                        });
                        xy_util.hideLock();
                        xy_util.hideLoadingCard();
                        return;
                    }

                    //特殊的错误返回，返回消息为数组
                    if (result.code == 1) {
                        var msg = '';
                        $.each(result.data, function (index, item) {
                            if (typeof(item) == 'string') {
                                if (index > 0) {
                                    msg += '\n'
                                }
                                msg += item;
                            } else if (item.msg != 'ok') {
                                if (index > 0) {
                                    msg += '\n'
                                }
                                msg += item.msg;
                            }
                        })
                        alertDIV(msg)
                        return
                    }
                    return false;
                }

                //xy_util.hideLoadingCard();
                //xy_util.hideLock();
                switch (typeof(callback)) {
                    //提示语
                    case "string":
                        alertDIV(callback);
                        break;

                    //回调函数
                    case "function":
                        callback(result.data);
                        break;

                    default:
                        break;
                }
            }
            catch (e) {
                xy_util.hideLock();
                console.log(e)
            }
        }
}
}

export default util