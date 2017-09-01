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
          el:'#app',
          data:{
            items:[],
            userinfo:null,
            price:0,
            select1:null,
            PublicUrl:"http://test.benehugo.com/gjkx/"
          },
        mounted(){
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
        var shlf=this
        function   getDeviceType(){
          axios.get(shlf.PublicUrl+'member/show?secret=06fb680f639a3f180f08cdce28b7161d&memberWeixinOpenId='+Cookies.get('openid'))
          .then(function(data){
            getgoods()
             if(data.data.data.accountNumber){
                shlf.userinfo=data.data.data.accountNumber
             }else{
                shlf.userinfo='首次充值后自动创建账户'
             }   
          })
             }
             function getgoods(){
              axios.get('http://test.benehugo.com/gjkx/goods/list?secret=06fb680f639a3f180f08cdce28b7161d')
              .then(function(data){
                shlf.items=data.data.data
              })
             }
           },
           methods: {
            //点击选择充值金额
            select:function(e,i){
              $(e.target).addClass('con').parent().siblings('div').children().removeClass('con')
                this.price=i.price
                this.select1=i
            },
            //点击充值
            paysaving:function(){
            if(this.price==0){
              alert('您未选择充值金额')
            }else{
              axios.post('http://test.benehugo.com/gjkx/goodsorder/insertGoodsorder?secret=06fb680f639a3f180f08cdce28b7161d&memberWeixinOpenId='+ Cookies.get('openid') +'&cityGoodId='+this.select1.cityGoodId)
              .then(function(data){
                vm.onBridgeReady(data)
              })

            }
           },

          //调起微信支付
        onBridgeReady:function(data){
        var data;
        var that=this;
        if(data.data){
          data = data.data.data.WeiXinData;
          if(data){
            var _timestamp=data.timeStamp+"";
            WeixinJSBridge.invoke(
              'getBrandWCPayRequest', {
              "appId":data.appId,     //公众号名称，由商户传入
              "timeStamp":_timestamp,         //时间戳，自1970年以来的秒数
              "nonceStr":data.nonceStr, //随机串
              "package":data.package,
              "signType":data.signType,         //微信签名方式：
              "paySign":data.paySign //微信签名
              },
              function(res){
                 if(res.err_msg == "get_brand_wcpay_request:ok" ) {
                      window.location.href='../personal/index.html'

                 } else{
                 } // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
              }
            );
          }
          }
            
    },

           }
        })

