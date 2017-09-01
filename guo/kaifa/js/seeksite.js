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
// 实例化VUE    
  var vm=new Vue({
    el:'#app',
    data:{
    	issearchwid:false,
    	antistop:null,
    	ownstorelist:[],
    	nearbystorelist:[],
    	dimshop:[],
    	issh:true,
    	isshs:false,
    	searchres:[]
    },
  mounted(){
 var shlf=this;
            start()
            function start () {
                  if(document.referrer==''){
                    window.localStorage.removeItem("order");
                  }
                  this.shopid=1;
                    if(Cookies.get('openid')){
                        checkToken();
                    }else{
                        getUserInfo();
                    }
                }
                function getUserInfo(){
          axios.get("http://test.benehugo.com/gjkx/weixin/getOpenid?secret=06fb680f639a3f180f08cdce28b7161d&code="+ sessionStorage.getItem('wxtoken'),{},{
                        headers:{
                            'Authorization':"Bearer " + Cookies.get('wxtoken')
                        }
                    }).then(
                        function (response) {
                            if(response.data=="token_expired"){
                              getToken();
                            }else {
                              var openid = response.data;
                                Cookies.set('openid',openid,{
                                  expires:999999
                              });
                             start();
                            }
                        }
                    )
                }
                function checkToken(){
                  axios.get("http://test.benehugo.com/gjkx/auth/token?appid=gjkx&secret=06fb680f639a3f180f08cdce28b7161d").then(
                        function (response) {
                            axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.data;
                            getDeviceType();
                        }
                    );
                }

             function getDeviceType (){
  //获取openid数据
  axios.get('http://test.benehugo.com/gjkx/store/list?secret=06fb680f639a3f180f08cdce28b7161d&memberWeixinOpenId='+Cookies.get('openid'))
  .then(function(data){
    shlf.ownstorelist=data.data.data

  })
  if(sessionStorage.getItem('lng')==null){
    sessionStorage.setItem('lng','116.418611')
    sessionStorage.setItem('lat','39.950709')
  }
 //获取理我最近的
 var str="&longitude="+sessionStorage.getItem('lng')+"&latitude="+sessionStorage.getItem('lat');
 axios.get('http://test.benehugo.com/gjkx/store/list?secret=06fb680f639a3f180f08cdce28b7161d&memberWeixinOpenId='+Cookies.get('openid')+str)
.then(function(data){
  shlf.nearbystorelist=data.data.data
})
  }

},
methods:{
//设置模糊搜索
search:function(e){
  var shlf=this
var val=$(e.target).val()
	var str1="&memberWeixinOpenId="+Cookies.get('openid')+"&memberId=&storeNameAndCode="+encodeURI(encodeURI(val))+"&longitude=&latitude="
	axios.get("http://test.benehugo.com/gjkx/store/list?secret=06fb680f639a3f180f08cdce28b7161d"+str1)
	.then(function(data){
    shlf.searchres=data.data.data
    if($(e.target).val().length==''){
      shlf.issh=true
      shlf.isshs=false
    }else{
      shlf.issh=false
      shlf.isshs=true
    }


	})
},
btn:function(){
window.location.href='./add_addres.html'
},

abolish:function(){
  this.issearchwid=false
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
//点击返回选择地址页，并且传参
choose1:function(item){
  console.log(item)
sessionStorage.setItem('name',item.name)
sessionStorage.setItem('newAddress',item.address)
sessionStorage.setItem('storeid',item.id)
window.location.href='./reqairs.html'

}
}
})