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
	var vm=new Vue({
    el:"#app",
    data:{
        name:null,
        phone:null,
        verificationcode:null,
        doTime:'获取验证码',
        time:60,
        staTime:null,
        isdotime:true,
        isstaTime:false,
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
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.data;});}

    },  
    methods:{
        verify:function(){
            if(this.name==null){
                alert('请输入姓名')
            }else if(this.phone==null){
                alert('请输入手机号')
            }else if(this.phone.length != 11){
                alert('您输入的手机号有误')
            }else{
                axios.get('http://test.benehugo.com/gjkx/user/getSMS?secret=06fb680f639a3f180f08cdce28b7161d&phone='+this.phone)
                .then(function(data){
                })
                this.isdotime=false,
                this.isstaTime=true
                this.staTime='剩余'+this.time+'秒'
                var that=this
                var inter=setInterval(function(){
                        that.time--
                        that.staTime='剩余'+that.time+'秒'
                        if(that.time==0){
                            window.clearInterval(inter);
                            that.time=60
                            that.doTime='重新发送'
                            that.isdotime=true,
                            that.isstaTime=false
                        }
                },1000)
            }
        },
    modification:function(){
         if(this.name==null){
                alert('请输入姓名')
            }else if(this.phone==null){
                alert('请输入手机号')
            }else if(this.phone.length != 11){
                alert('您输入的手机号有误')
            }else if(this.verificationcode==null){
                alert('请输入验证码')
            }else{
                    var pd='phone='+this.phone+'&verificationcode='+this.verificationcode+'&password=123456&name='+this.name+'&memberWeixinOpenId='+Cookies.get('openid')
                axios.post('http://test.benehugo.com/gjkx/member/register?secret=06fb680f639a3f180f08cdce28b7161d',pd)
                .then(function(response){
                        console.log(response)
                            if(response.data.code=="000000"){
                                window.location.href='./index.html'
                            }else{
                                alert(response.data.massage);

                            }
                })
            }
        }
        }
        })