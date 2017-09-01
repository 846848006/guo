 //定义openid
var openid = Cookies.get('openid')
//设置请求头
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
//实例化VUE
var vm=new Vue({
  el:"#app",
  data:{
    items:[],
    PublicUrl:"http://test.benehugo.com/gjkx/"
  },
   mounted(){
   //加载执行函数
    var shlf=this;
    start()
    function start () {
      if(Cookies.get('openid')){
        checkToken();
        }
      else{
        getUserInfo();
        }
        }
    //获取信息
    function getUserInfo(){
      axios.get(shlf.PublicUrl+"weixin/getOpenid?secret=06fb680f639a3f180f08cdce28b7161d&code="+ Cookies.get('wxtoken'),{},{
        headers:{
            'Authorization':"Bearer " + Cookies.get('wxtoken')
                }
                })
        .then(
            function (response) {
              if(response.data=="token_expired"){
                getToken();
                }
              else{
                var openid = response.data;
                    Cookies.set('openid',openid,{
                    expires:999999
                    });
                    start();
                    }})}
    //获取token码
    function checkToken(){
      axios.get(shlf.PublicUrl+"auth/token?appid=gjkx&secret=06fb680f639a3f180f08cdce28b7161d")
        .then(
          function (response) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.data;
            getDeviceType();});}

               //判断是否注册
                var that=this
    function getDeviceType(){
      axios.get('http://test.benehugo.com/gjkx/member/isRegister?secret=06fb680f639a3f180f08cdce28b7161d&memberWeixinOpenId='+Cookies.get('openid'))
      .then(function(data){

        if(data.data.data.phone==null || data.data.code=='000002'){
          window.location.href='./new_login.html'
        }
        else{

      axios.get('http://test.benehugo.com/gjkx/member/show?secret=06fb680f639a3f180f08cdce28b7161d&memberWeixinOpenId='+Cookies.get('openid'))
      .then(function(data){  
      console.log(data)
      that.items=data.data.data
      })

        }
      })
}
},
methods:{
  yue:function(i){
    sessionStorage.setItem('memberId',i.memberId)
    window.location.href='savings_record.html'
  },
  chongzhi:function(){
      window.location.href='../kaifa/savings_add.html'
  },  
  baoxiulist:function(){
    window.location.href='maintain_record.html'
  }
}
})
