/**
 * Created by Moment on 16/5/28.
 */
require("./main.less");
var moduleTpl = require("./mainTpl.html");
// 基础vue
var BaseVue = require("BaseVue");

module.exports = BaseVue.extend({
    template: moduleTpl,
    created: function () {

    },
    ready: function () {
        this.setBodySize();
        this.renderParticlesBackground();
        this.renderTheater();
    },
    data: function () {
        return {
            username: "user",
            password: "123456"
        }
    },
    methods: {
        onLogin: function (e) {
            // if (!this.username) {
            //     this.renderNotice("username can't be null");
            //     return;
            // }
            // if (!this.password) {
            //     this.renderNotice("password can't be null");
            //     return;
            // }
            // var self = this, params = {
            //     username: this.username,
            //     password: self.encrypt(this.password, 8)
            // };
            // $.ajax({
            //     url: '/business/login/login',
            //     data: params,
            //     type: "GET",
            //     success: function (res) {
            //         if (!res.data.result) {
            //             self.renderNotice("Please check your username or password correctly");
            //             self.password = "";
            //             return;
            //         }
            //         if(self.checkMobile(navigator.userAgent)){
            //             window.location.href = "/chat";
            //         }else{
            //             window.location.href = "/";
            //         }
            //     }
            // });
            window.location.href = "https://blog.imoment.vip";
        },
        encrypt: function (str, degist) {
            if (!str) {
                return false;
            }
            if (!degist) {
                degist = 8;
            }
            str += 'think';
            var monyer = "";
            for (var i = 0; i < str.length; i++)
                monyer += "\\" + str.charCodeAt(i).toString(degist);
            return monyer;
        },
        /**
         * render particles animate background
         */
        renderParticlesBackground: function () {
            particlesJS('js_particles', {
                    "particles": {
                        "number": {
                            "value": 80,
                            "density": {
                                "enable": true,
                                "value_area": 800
                            }
                        },
                        "color": {
                            "value": "#ffffff"
                        },
                        "shape": {
                            "type": "circle",
                            "stroke": {
                                "width": 0,
                                "color": "#000000"
                            },
                            "polygon": {
                                "nb_sides": 5
                            },
                            "image": {
                                "src": "img/github.svg",
                                "width": 100,
                                "height": 100
                            }
                        },
                        "opacity": {
                            "value": 0.5,
                            "random": false,
                            "anim": {
                                "enable": false,
                                "speed": 1,
                                "opacity_min": 0.1,
                                "sync": false
                            }
                        },
                        "size": {
                            "value": 5,
                            "random": true,
                            "anim": {
                                "enable": false,
                                "speed": 40,
                                "size_min": 0.1,
                                "sync": false
                            }
                        },
                        "line_linked": {
                            "enable": true,
                            "distance": 150,
                            "color": "#ffffff",
                            "opacity": 0.4,
                            "width": 1
                        },
                        "move": {
                            "enable": true,
                            "speed": 6,
                            "direction": "none",
                            "random": false,
                            "straight": false,
                            "out_mode": "out",
                            "attract": {
                                "enable": false,
                                "rotateX": 600,
                                "rotateY": 1200
                            }
                        }
                    },
                    "interactivity": {
                        "detect_on": "canvas",
                        "events": {
                            "onhover": {
                                "enable": true,
                                "mode": "repulse"
                            },
                            "onclick": {
                                "enable": true,
                                "mode": "push"
                            },
                            "resize": true
                        },
                        "modes": {
                            "grab": {
                                "distance": 400,
                                "line_linked": {
                                    "opacity": 1
                                }
                            },
                            "bubble": {
                                "distance": 400,
                                "size": 40,
                                "duration": 2,
                                "opacity": 8,
                                "speed": 3
                            },
                            "repulse": {
                                "distance": 200
                            },
                            "push": {
                                "particles_nb": 4
                            },
                            "remove": {
                                "particles_nb": 2
                            }
                        }
                    },
                    "retina_detect": true,
                    "config_demo": {
                        "hide_card": false,
                        "background_color": "#b61924",
                        "background_image": "",
                        "background_position": "50% 50%",
                        "background_repeat": "no-repeat",
                        "background_size": "cover"
                    }
                }
            );
        },
        /**
         * render notice plugin
         * @param message
         */
        renderNotice: function (message) {
            this.notification = new NotificationFx({
                message: '<span class="icon icon-megaphone"></span><p>' + message + '.</p>',
                layout: 'bar',
                effect: 'slidetop',
                type: 'notice', // notice, warning or error
                onClose: function () {
                }
            });
            this.notification.show();
        },
        renderTheater: function () {
            var self = this;
            var theater = theaterJS();
            theater
                .on('type:start, erase:start', function () {
                    var actor = theater.getCurrentActor();
                    actor.$element.classList.add('is-typing')
                })
                .on('type:end, erase:end', function () {
                    var actor = theater.getCurrentActor();
                    actor.$element.classList.remove('is-typing');

                });
            theater
                .addActor('kobe')
                .addActor('t-mac');

            theater
                .addScene('kobe:Welcome To Moment Home', 200)
                .addScene('t-mac:Login First and Enjoy Yourself', 200)
                .addScene(function () {
                    setTimeout(function () {
                        $(".js_theater").animate({
                            'transform': 'rotateX(30deg)',
                            'top': '-2000px',
                            'opacity': '0'
                        }, 2000);
                        self.showLoginPart();
                    }, 1200);
                });
        },
        /**
         * login part animate show
         */
        showLoginPart: function () {
            var count = 1, self = this;
            self.timerInterval = setInterval(function () {
                if (count == 1) {
                    $(".username").show().addClass("first");
                } else if (count == 2) {
                    $(".password").show().addClass("second");
                } else if (count == 3) {
                    $(".login").show().addClass("third");
                } else {
                    window.clearInterval(self.timerInterval);
                }
                count++;
            }, 500);
        },
        /**
         * set body size eq window
         */
        setBodySize: function () {
            $('body').width($(window).width());
            $('body').height($(window).height());
            $('#js_particles').width($(window).width());
            $('#js_particles').height($(window).height());
        },
        /**
         *
         * @param agent
         * @returns {boolean}
         */
        checkMobile: function (agent) {
            var flag = false;
            agent = agent.toLowerCase();
            var keywords = ["android", "iphone", "ipod", "ipad", "windows phone", "mqqbrowser"];

            //排除 Windows 桌面系统
            if (!(agent.indexOf("windows nt") > -1) || agent.indexOf("windows nt") > -1 && agent.indexOf("compatible; msie 9.0;") > -1) {
                //排除苹果桌面系统
                if (!(agent.indexOf("windows nt") > -1) && !agent.indexOf("macintosh") > -1) {
                    for (var _iterator5 = keywords, _isArray5 = Array.isArray(_iterator5), _i5 = 0, _iterator5 = _isArray5 ? _iterator5 : (0, _getIterator3.default)(_iterator5); ;) {
                        var _ref5;

                        if (_isArray5) {
                            if (_i5 >= _iterator5.length) break;
                            _ref5 = _iterator5[_i5++];
                        } else {
                            _i5 = _iterator5.next();
                            if (_i5.done) break;
                            _ref5 = _i5.value;
                        }

                        var item = _ref5;

                        if (agent.indexOf(item) > -1) {
                            flag = true;
                            break;
                        }
                    }
                }
            }
            return flag;
        }
    },
    filters: {}
});
