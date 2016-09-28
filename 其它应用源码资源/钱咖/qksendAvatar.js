 var u = document.getElementById("user-avatar");
        u.onchange = function() {
            i.show("正在上传头像..", 3e5),
            e.uploadUserAvatar().then(function(e) {
                i.show("上传成功"),
                t.avatar = e.data.avatar,
                n(function() {
                    t.$digest()
                })
            }, function(t) {
                i.error("上传失败")
            })
        }

uploadUserAvatar: function() {
            var t = this.q
              , i = t.defer()
              , n = i.promise
              , o = /OS ((\d_\d)||(\d_\d_\d{1,2})) like Mac OS X/i
              , s = o.exec(window.navigator.userAgent);
            if (s && s[1] && ("8_0" == s[1] || "8_0_1" == s[1]))
                return alert("您当前的ios版本存在bug，这会导致上传文件失败，请升级iOS到其他稳定版本后重试"),
                !1;
            var a = document.getElementById("user-avatar").files[0]
              , l = new FormData;
            l.append("avatar", a);
            var c = e + r
              , h = new XMLHttpRequest;
            return h.onreadystatechange = function() {
                function t() {
                    return JSON.parse(h.responseText)
                }
                200 == h.status && 4 == h.readyState ? i.resolve(t()) : h.status > 200 && i.reject()
            }
            ,
            h.open("POST", c, !0),
            h.send(l),
            n.success = function(t) {
                return n.then(function(e) {
                    t(e.data, e.status, e.headers, e.config)
                }),
                n
            }
            ,
            n.error = function(t) {
                return n.then(null , function(e) {
                    t(e.data, e.status, e.headers, e.config)
                }),
                n
            }
            ,
            n
        },