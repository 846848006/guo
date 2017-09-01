
    var myScroll;
    function loaded() {
        myScroll = new iScroll('wrapperLeft',{
            hScrollbar:false,
            vScrollbar:false
        });
        var menuSroll1 = new iScroll('wrapperRight');

    }

    document.addEventListener('touchmove',function (e) {
        e.preventDefault();
    },false);

    document.addEventListener('DOMContentLoaded',setTimeout(function () {
        loaded();
    },200),false);
    
    var openid = Cookies.get('openid')
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + Cookies.get('token');
    if (Arg('code')) {
        Cookies.set('wxtoken',Arg('code'),{
            expires:999999
        });
    }
    if (!Cookies.get('wxtoken')) {
        getToken();
    }

    function getToken() {
       document.location.href = "http://api.benehugo.com/gjkx/html/yonghu/get-weixin-code.html?redirect_url=" + (document.location.href.split('?')[0]);
    }
    var vm = new Vue({
        el:'#app',
        data:{
            items:[],
            devices:[],
            shopid:0,
            selected:0,
            searchres:[],
            test:true,
            PublicUrl:"http://test.benehugo.com/gjkx/"
        },
         mounted(){
            var that=this
              start();
        function start() {
              if(document.referrer=='')
              {
                window.localStorage.removeItem("order");
              }
              this.shopid=1;
                if(Cookies.get('openid'))
                {
                 checkToken();
                }
                else
                {
                   getUserInfo();
                };
            }
           function getDeviceType() {

                axios.get(that.PublicUrl+"devicetype/list?secret=06fb680f639a3f180f08cdce28b7161d").then(
                    function (response) {
                        that.items = response.data.data;
                        that.selected = that.items[0].id;
                        that.items[0].selected = true;
                        getDevice(that.items[0].id);

                    }
                );
            }

            function getUserInfo() {
                axios.get(that.PublicUrl+"weixin/getOpenid?secret=06fb680f639a3f180f08cdce28b7161d&code="+ Cookies.get('wxtoken'),{},{
                    headers:{
                        'Authorization':"Bearer " + Cookies.get('wxtoken')
                    }
                }).then(
                    function (response) {
                        if(response.data=="token_expired")
                        {
                          getToken();
                        }else {
                        var openid = response.data;
                        Cookies.set('openid',openid,{
                            expires:999999
                        });
                        start()
                      }
                    }
                ).catch(function(err){
                                    if(err.data.message=="token_expired")
                                    {
                                        getToken();
                                    }
                                });;

            }
           function  checkToken () {
                axios.get(that.PublicUrl+"auth/token?appid=gjkx&secret=06fb680f639a3f180f08cdce28b7161d").then(
                    function (response) {
                        axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.data;
                        getDeviceType();
                    },
                    function (response) {

                    }
                );
            }
                var that=this
            function getDevice (id) {
              
                axios.get(that.PublicUrl+"device/list?secret=06fb680f639a3f180f08cdce28b7161d",{ params: {
                            "secret": '06fb680f639a3f180f08cdce28b7161d',
                            "typeId": id
                        }}).then(function (res) {
                   that.devices = res.data.data;
                })
            }
         },
        methods:{
            
            changeType:function (type) {
                this.selected = type;
                 this.getDevice(type)
            },
            toFailt:function (id,name) {
              window.location.href="./fault.html"
                sessionStorage.setItem('data1',id)
            },

            getDevice :function (id) {
                var that=this
                axios.get(that.PublicUrl+"device/list?secret=06fb680f639a3f180f08cdce28b7161d",{ params: {
                            "secret": '06fb680f639a3f180f08cdce28b7161d',
                            "typeId": id
                        }}).then(function (res) {
                   that.devices = res.data.data;
                })
            },
            search:function (name) {
                console.log(name)
                var that=this
               axios.post(that.PublicUrl+"device/searchName?secret=06fb680f639a3f180f08cdce28b7161d&deviceName="+encodeURI(encodeURI(name)),{},{
                }).then(function (res) {
                    that.searchres = res.data.data;
                    $('#searchResult').show();
                })
            },
            searchBlur:function (e) {
                if (!e.target.value.length) {
                    this.cancelSearch()
                }
                ;
            },
            searchInput:function (e) {
                if (e.target.value.length) {
                    this.search(e.target.value);
                } else {
                    $('#searchResult').hide();
                }
            },
            hideSearchResult:function() {
                $('#searchResult').hide();
                $('#searchInput').val('');
            },
            cancelSearch:function() {
                this.hideSearchResult();
                $('#searchBar').removeClass('weui-search-bar_focusing');
                $('#searchText').show();
            },
            searchTextClick:function () {
                $('#searchBar').addClass('weui-search-bar_focusing');
                $('#searchInput').focus();
            },
            searchClear:function(){
              this.hideSearchResult();
              $('#searchInput').focus();
            },
            searchCancel:function(){
              this.cancelSearch();
              $('#searchInput').blur();
            },
            parseQueryString: function (url) {
                var obj = {};
                var keyvalue = [];
                var key = "",
                    value = "";
                var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
                for (var i in paraString) {
                    keyvalue = paraString[i].split("=");
                    key = keyvalue[0];
                    value = keyvalue[1];
                    obj[key] = value;
                }
                return obj;
            }
        }
    })
