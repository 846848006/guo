  //定义openid
           var openid = Cookies.get('openid')
           axios.defaults.headers.common['Authorization'] = 'Bearer ' + Cookies.get('token');
            if (Arg('code')) {
                 Cookies.set('wxtoken', Arg('code'), {
                    expires: 999999
                });
            }
            if (!Cookies.get('wxtoken')) {
                getToken();
            }
            //跳转页面取code
            function getToken() {
                document.location.href = "http://api.benehugo.com/gjkx/html/yonghu/get-weixin-code.html?redirect_url=" + (document.location.href.split('?')[0]);
            }
            //判断内核是不是ios
            var u = navigator.userAgent;
            var isiOS = !! u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
            var ver = 10
            if (isiOS) {
                ver = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
                ver = parseInt(ver[1], 10);
            }
            //设置请求头
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + Cookies.get('token');
            //请求token码
            axios('http://test.benehugo.com/gjkx/auth/token', {
                params: {
                    "appid": "gjkx",
                    "secret": '06fb680f639a3f180f08cdce28b7161d'
                }
            }).then( function(res){
                sessionStorage.setItem('token', res.data.data)
            })
            //实例化VUE    
            var vm = new Vue({
                el: '#app',
                data: {
                    data2: null,
                    name: sessionStorage.getItem('name'),
                    newAddress: sessionStorage.getItem('newAddress'),
                    time: sessionStorage.getItem('time'),
                    uploads: [],
                    uploadindex: 0,
                    faults: [],
                    images: [],
                    isshow: false,
                    isregister: false,
                    phone1: 1,
                    describe: null,
                    openid:Cookies.get('openid'),
                    PublicUrl:"http://test.benehugo.com/gjkx/"
                },
                mounted() {
                    var shlf = this;
                    start()

                    function start() {
                        if (document.referrer == '') {
                            window.localStorage.removeItem("order");
                        }
                        this.shopid = 1;
                        if (Cookies.get('openid')) {
                            checkToken();
                        } else {
                            getUserInfo();
                        }
                    }
                    //获取信息   
                    function getUserInfo() {
                        axios.get(shlf.PublicUrl+"weixin/getOpenid?secret=06fb680f639a3f180f08cdce28b7161d&code=" + Cookies.get('wxtoken'), {}, {
                            headers: {
                                'Authorization': "Bearer " + Cookies.get('token')
                            }
                        }).then(

                        function(response) {
                            if (response.data == "token_expired") {
                                getToken();
                            } else {
                                var openid = response.data;
                                Cookies.set('openid', openid, {
                                    expires: 999999
                                });
                                start();
                            }
                        })
                    }
                    //获取
                    function checkToken() {
                        axios.get(shlf.PublicUrl+"auth/token?appid=gjkx&secret=06fb680f639a3f180f08cdce28b7161d").then(

                        function(response) {
                            axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.data;
                            getDeviceType();
                        });
                    }
                    //获取信息
                    function getDeviceType() {
                        axios.get(shlf.PublicUrl+'member/show?secret=06fb680f639a3f180f08cdce28b7161d&memberWeixinOpenId=' + Cookies.get('openid')).then(function(data) {
                            that.phone1 = data.data.data.phone
                        })
                    }
                    var that = this
                    //实例化时间插件
                    $('#selectGroupselect-demo').mobiscroll().select({
                        theme: "ios",
                        lang: "zh",
                        display: "bottom",
                        mode: "scroller",
                        label: '日期',
                        group: {
                            groupWheel: true,
                            header: false,
                            clustered: true
                        },
                        defaultValue: [0],
                        groupLabel: '时间',
                        onSelect: function(v, i) {
                            var a = i.getArrayVal();
                            var d = $("optgroup").eq(a[0]).attr(":value");
                            var t = a[1];
                            $('#selectTime').val(t);
                            that.timechange(t);
                        },
                        onInit: function() {}
                    });
                    //获取坐标
                    var imgurl = sessionStorage.getItem('imgurl')
                    var str1 = JSON.parse(imgurl);
                    this.uploads = str1
                    if(!sessionStorage.getItem('lat')){
                    var map, geolocation;
                    //加载地图，调用浏览器定位服务
                    map = new AMap.Map('container', {
                        resizeEnable: true
                    });
                    map.plugin('AMap.Geolocation', function() {
                        geolocation = new AMap.Geolocation({
                            enableHighAccuracy: true, //是否使用高精度定位，默认:true
                            timeout: 10000, //超过10秒后停止定位，默认：无穷大
                            buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                            zoomToAccuracy: true, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                            buttonPosition: 'RB'
                        });
                        map.addControl(geolocation);
                        geolocation.getCurrentPosition();
                        AMap.event.addListener(geolocation, 'complete',onComplete); //返回定位信息
                        AMap.event.addListener(geolocation, 'error', onError); //返回定位出错信息
                    });
                    //解析定位结果
                    function onComplete(data) {
                        sessionStorage.setItem('lng',data.position.getLng() )
                        sessionStorage.setItem('lat', data.position.getLat())
                    }
                    //解析定位错误信息
                    function onError() {    
                        sessionStorage.setItem('lng', "116.418611")
                        sessionStorage.setItem('lat', "39.950709")
                    }
                    }
                  
                    //获取值
                    var selected = sessionStorage.getItem('selected')
                    this.data2 = JSON.parse(selected);
                },
                // 计算属性
                computed: {
                    minNowTime: function() {
                        var date = new Date();
                        Y = date.getFullYear() + '-';
                        M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
                        D = date.getDate() + ' ';
                        h = date.getHours() + ':';
                        m = date.getMinutes() + ':';
                        s = date.getSeconds();
                        return Y + M + D + h + m + s
                    }
                },
                //定义点击事件
                methods: {
                    //点击保修
                    verify: function() {
                        var shlf = this
                        if (this.data2.length <= 0) {
                            alert('请选择故障保修')
                        } else if (this.name == null) {
                            alert('请添加报修地址')
                        } else if ($('#selectTime').val() == '') {
                            alert('请选择上门时间')
                        } else {
            axios.get(shlf.PublicUrl+'member/isRegister?secret=06fb680f639a3f180f08cdce28b7161d&memberWeixinOpenId='+Cookies.get('openid')+ "&memberPhone=" + this.phone1).then(function(data) {
                                console.log(data)
                                if (data.data.code == '000002') {
                                    window.location.href = './new_login.html'
                                } else if (data.data.data.phone == null) {
                                    window.location.href = './new_login.html'
                                } else {
                                    var str3 = ''
                                    for (var i = 0; i < shlf.data2.length; i++) {
                                        str3 += sessionStorage.getItem('data1') + '-' + shlf.data2[i].id + ','
                                    }
                                    var str5 = shlf.uploads ? (shlf.uploads.length > 0 ? shlf.uploads.join(",") : "") : "";
                                    if (shlf.describe == null) {
                                        shlf.describe = ''
                                    }
                                    var str = '&storeId='+sessionStorage.getItem('storeid')+'&memberWeixinOpenId='+Cookies.get('openid')+'&phone='+shlf.phone1 +'&description='+shlf.describe+'&visittimeParam='+sessionStorage.getItem('time')+'&imgdescription='+str5+'&deviceTrouble='+str3.substring(0, str3.length - 1) + '&doorfeePayStatus=0';
                                   
                                    axios.post(shlf.PublicUrl+'workorder/add?secret=06fb680f639a3f180f08cdce28b7161d', str)
                                    .then(function(data) {
                                        if (data.data.data.isHaveGoodsOrder == 1) {
                                            localStorage.removeItem('newAddress')
                                            window.location.href = './maintain_record.html'

                                        }
                                    })
                                }
                            })
                        }
                    },
                    //图片上传
                    uploaderInput: function(e) {
                        try {
                            var that = this;
                            var src, url = window.URL || window.webkitURL || window.mozURL,
                                files = e.target.files;
                            if (files.length === 0) {
                                return;
                            }
                            for (var i = 0, len = files.length; i < len; ++i) {
                                var file = files[i];
                                EXIF.getData(file, function() {
                                    EXIF.getAllTags(this);
                                    Orientation = EXIF.getTag(this, 'Orientation');
                                });
                                var reader = new FileReader();
                                reader.onload = function(e) {
                                    var img = new Image();
                                    var base64 = "";
                                    img.onload = function() {
                                        var w = Math.min(300, img.width);
                                        // 高度按比例计算
                                        var h = img.height * (w / img.width);
                                        var canvas = document.createElement('canvas');
                                        if (navigator.userAgent.match(/iphone/i)) {
                                            if (Orientation != undefined && Orientation != "" && Orientation != 1) {
                                                switch (Orientation) {
                                                case 6:
                                                    //需要顺时针（向左）90度旋转
                                                    that.rotateImg(this, 'left', canvas);
                                                    break;
                                                case 8:
                                                    //需要逆时针（向右）90度旋转
                                                    that.rotateImg(this, 'right', canvas);
                                                    break;
                                                case 3:
                                                    //需要180度旋转
                                                    that.rotateImg(this, 'right', canvas); //转两次
                                                    that.rotateImg(this, 'right', canvas);
                                                    break;
                                                }
                                                base64 = canvas.toDataURL('image/jpeg', 0.05);
                                            } else {
                                                var ctx = canvas.getContext('2d');
                                                //设置 canvas 的宽度和高度
                                                canvas.width = w;
                                                canvas.height = h;
                                                ctx.drawImage(img, 0, 0, w, h);
                                                base64 = canvas.toDataURL('image/jpeg', 0.05);
                                            }
                                        } else {
                                            var ctx = canvas.getContext('2d');
                                            //设置 canvas 的宽度和高度
                                            canvas.width = w;
                                            canvas.height = h;
                                            ctx.drawImage(img, 0, 0, w, h);
                                            base64 = canvas.toDataURL('image/jpeg', 1);
                                        }
                                        that.imageUpload(base64, function(res) {
                                            if (res.success) {
                                                    that.time=sessionStorage.getItem('time')
                                                if (that.uploads) {
                                                    that.uploads.push(res.data.fileUrl.toString());
                                                    var str = JSON.stringify(that.uploads);
                                                    sessionStorage.setItem('imgurl', str)
                                                } else {
                                                    that.uploads = [res.data.fileUrl.toString()];
                                                }
                                            } else {}
                                        });
                                    }
                                    img.src = e.target.result;
                                }
                                reader.readAsDataURL(file);
                            }
                        } catch (e) {}
                    },
                    rotateImg: function(img, direction, canvas) { //图片旋转
                        var min_step = 0;
                        var max_step = 3;
                        if (img == null) return;
                        var height = img.height;
                        var width = img.width;
                        var step = 2;
                        if (step == null) {
                            step = min_step;
                        }
                        if (direction == 'right') {
                            step++;
                            step > max_step && (step = min_step);
                        } else {
                            step--;
                            step < min_step && (step = max_step);
                        }
                        var degree = step * 90 * Math.PI / 180;
                        var ctx = canvas.getContext('2d');
                        switch (step) {
                        case 0:
                            canvas.width = width;
                            canvas.height = height;
                            ctx.drawImage(img, 0, 0);
                            break;
                        case 1:
                            canvas.width = height;
                            canvas.height = width;
                            ctx.rotate(degree);
                            ctx.drawImage(img, 0, - height);
                            break;
                        case 2:
                            canvas.width = width;
                            canvas.height = height;
                            ctx.rotate(degree);
                            ctx.drawImage(img, - width, - height);
                            break;
                        case 3:
                            canvas.width = height;
                            canvas.height = width;
                            ctx.rotate(degree);
                            ctx.drawImage(img, - width, 0);
                            break;
                        }
                    },
                    //图片转成64上传
                    imageUpload: function(image, callback) {
                        var that = this;
                        var pd = {};
                        pd.images = image;
                        $.ajax({
                            url: "http://test.benehugo.com/wantu/uploadFile/uploadImageForBase64?secret=06fb680f639a3f180f08cdce28b7161d",
                            method: 'POST',
                            headers: {
                                'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                                'Content-Type': "application/json"
                            },
                            data: pd
                        }).done(

                        function(response) {
                            callback(response);
                        });
                    },
                    showUpload: function(e) {
                        $("#galleryImg").attr("style", e.target.style.cssText);
                        $("#gallery").fadeIn(100);
                        this.uploadindex = parseInt(e.target.id);
                    },
                    hiddenUpload: function() {
                        $("#gallery").fadeOut(100);
                    },
                    removeUpload: function() {
                        this.uploads.splice(this.uploadindex, 1);
                        this.images.splice(this.uploadindex, 1);
                        this.uploadindex = 0;
                        this.hiddenUpload();
                    },
                    checktime: function(time) {
                        var date = new Date();
                        var hours = date.getHours();
                        return time > hours;
                    },
                    selectedtime: function(time) {
                        var date = new Date();
                        var hours = date.getHours();
                        if (time != 8) {
                            return (time - 1) == hours
                        } else {
                            return hours < 8
                        }
                    },
                    checkdate: function() {
                        var date = new Date();
                        var hours = date.getHours();
                        return hours < 20;
                    },
                    timechange: function(e) {
                        sessionStorage.setItem('time', e)
                    },
                    goseeksite: function() {
                        window.location.href = './seeksite.html'
                    },
                    toDevice: function() {
                        window.location.href = './index.html'
                    },
                    remove: function(e) {
                        for (var i = 0; i < this.data2.length; i++) {
                            if (this.data2[i].id == e.target.id) {
                                this.data2.splice(i, 1)
                            }
                        }
                    },
                }
            })
              function selectGroupselectInit() {
                $(function() {
                    $('#selectGroupselect-show').click(function() {
                        $('#selectGroupselect-demo').mobiscroll('show');
                        return false;
                    });
                    $('#selectGroupselect-lable').click(function() {
                        $('#selectGroupselect-demo').mobiscroll('show');
                        return false;
                    });
                });
            };
            selectGroupselectInit();