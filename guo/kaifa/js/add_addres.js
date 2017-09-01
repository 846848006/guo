  axios('http://test.benehugo.com/gjkx/auth/token', {
            params: {
                "appid": "gjkx",
                "secret": '06fb680f639a3f180f08cdce28b7161d'
            }
        }).then(function(res) {
            sessionStorage.setItem('token', res.data.data)
        })
         axios.defaults.headers.common['Authorization'] = 'Bearer ' + sessionStorage.getItem('token');

        var vm = new Vue({
            el: '#app',
            data: {
                storeName: '',
                storeAddress2: "",
                newAdd: "选择小区丶街道",
                PublicUrl:"http://test.benehugo.com/gjkx/"
            },
            mounted() {
                this.storeName=sessionStorage.getItem('name')
                sessionStorage.setItem('openid',Cookies.get('openid'))
                if (localStorage.getItem('newAddress')) {
                    this.newAdd = localStorage.getItem('newAddress')
                } else {
                    newAdd: "选择小区丶街道"
                }
            },
            //定义事件
            methods: {
                postUser: function() {
                    if (this.storeName == ''  ) {
                        alert('请添加门店或地址')
                    } else if(this.storeAddress2 == ''){
                        alert('请添加门店或地址')

                    }else if (this.newAdd == '选择小区丶街道') {
                        alert('请添加门店或地址')
                    } else {
                        sessionStorage.setItem('name', this.storeName)
                        sessionStorage.setItem('newAddress', this.newAdd+this.storeAddress2)
                        var openid = sessionStorage.getItem('openid')
                        var lnglatXY = JSON.parse(sessionStorage.getItem('lnglatXY'))
                        console.log(lnglatXY)
                        var str = '&storeName=' + this.storeName + '&storeAddress=' + encodeURI(this.newAdd)+encodeURI(this.storeAddress2) + '&longitude=' + lnglatXY[0] + '&latitude=' + lnglatXY[1] +'&memberWeixinOpenId='+sessionStorage.getItem('openid')
                        axios.post(this.PublicUrl+'store/add?secret=06fb680f639a3f180f08cdce28b7161d', str).then(function(data) {
                                 sessionStorage.setItem('storeid', data.data.data.storeId)
                            window.location.href = './reqairs.html'
                        })
                    }
                },
                map_click: function() {
                if(!this.storeName){
                    sessionStorage.setItem('name','')
                }else{
                    sessionStorage.setItem('name',this.storeName)
                }
                   
                   window.location.href = './map.html'
                }
            }
        })