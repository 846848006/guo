            //实例化VUE	
            var vm = new Vue({
                el: "#app",
                data: {
                    items: [],
                    PublicUrl:"http://test.benehugo.com/gjkx/"
                },
                mounted() {
                    //设置请求头
                    axios.defaults.headers.common['Authorization'] = 'Bearer ' + sessionStorage.getItem('token');
                    //请求token码
                    axios('http://test.benehugo.com/gjkx/auth/token', {
                        params: {
                            "appid": "gjkx",
                            "secret": '06fb680f639a3f180f08cdce28b7161d'
                        }
                    }).then(function(res){
                        sessionStorage.setItem('token', res.data.data)
                    })
                    var shlf = this
                    axios.get(shlf.PublicUrl+'workorder/list?secret=06fb680f639a3f180f08cdce28b7161d&memberWeixinOpenId='+Cookies.get('openid')).then(function(data) {
                            console.log(data)
                        shlf.items = data.data.data
                    })
                },
                //设置点击事件
                methods: {
                    btn: function(data) {
                        sessionStorage.setItem('goodsOrderId', data.id)
                        window.location.href = './xiangqing.html'
                    }
                }
            })