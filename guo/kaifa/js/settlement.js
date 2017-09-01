
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

var vm=new Vue({
	el:"#app",
	data:{
		devicetrouble:[],
		listOthercosts1:[],
		listOthercosts2:[],
    isCard:true,
    isPay:false,
    isregister:false,
		money:0,
		phone1:0,
    PublicUrl:"http://test.benehugo.com/gjkx/"
	},
	 mounted(){
    var shlf=this;
    start()
    function start() {
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
      var that=this
    function getDeviceType(){
      if(sessionStorage.getItem('goodsOrderId')){
        console.log(1)
      }else{
   var reg = new RegExp("(^|&)" +"workorderId"+ "=([^&]*)(&|$)","i");
   var r = window.location.search.substr(1).match(reg);
   console.log(r[2])
   sessionStorage.setItem('goodsOrderId',r[2])

      }
 function GetQueryString(name)
{
    
     if(r!=null)return  unescape(r[2]); return null;
}
    	
    	var openid=Cookies.get('openid')
axios.get(shlf.PublicUrl+"workorder/selectSettlement?secret=06fb680f639a3f180f08cdce28b7161d&workorderId="+sessionStorage.getItem('goodsOrderId')+"&memberWeixinOpenId="+openid)
  		.then(function(data){
  			that.devicetrouble=data.data.data.listWorkOrderDeviceTrouble;
        that.isCard=data.data.data.card;
  			that.money=data.data.data.totalfee
        that.listOthercosts1=data.data.data.listOthercosts1
        that.listOthercosts2=data.data.data.listOthercosts2
  		})
    }

	},
	 methods:{
	 	//微信付款点击直接支付
	 	pay:function(){
	 		var that=this
	 		axios.get(that.PublicUrl+'weixin/getPayParamByWorkOrder',{params:{
	 			"workorderId":sessionStorage.getItem('goodsOrderId'),
	 			"weixinAccount":Cookies.get('openid'),
	 			"secret":'06fb680f639a3f180f08cdce28b7161d',
	 			"payName":"moneyFee",
	 			"payType":"zj"
	 		}})
	 		.then(function(data){
	 			if(data.data.code=='000000'){
	 				that.onBridgeReady(data)
	 			}else{
	 			}
	 		})
	 	},
	 	//调取微信支付接口
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
									window.location.href = "pingjia.html"
							   }     // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
						}
				);
				}
		}
	 	},
	 	//挂账支付
	 	toPay:function(type){
var that=this
	axios.get(that.PublicUrl+'member/show?secret=06fb680f639a3f180f08cdce28b7161d&memberWeixinOpenId='+Cookies.get('openid'))
	  .then(function(data){
  	that.phone1=data.data.data.phone
  	//判断手机号是不是注册过
axios.get(that.PublicUrl+'member/isRegister?secret=06fb680f639a3f180f08cdce28b7161d&memberWeixinOpenId='+Cookies.get('openid')+"&memberPhone="+this.phone1)
.then(function(data){
if(data.data.code=='000002'){
		alert('当前用户未注册，请关注【果匠快修】注册成为会员用户')
	//没注册
  }else if(data.data.data.phone==null){
   		alert('当前用户未注册，请关注【果匠快修】注册成为会员用户')
  }else{
  	if(type=='cz1'){
  		sessionStorage.setItem('type','cz')
  		window.location.href='./orderpay.html'
  	}else{
  		sessionStorage.setItem('type','gz')
  		window.location.href='./orderpay.html'
  	}
  }

})
})
	 	},
	 	//充值
	 	addsaving:function(){
	 		//获取手机号
	var that=this
	axios.get(that.PublicUrl+'member/show?secret=06fb680f639a3f180f08cdce28b7161d&memberWeixinOpenId='+Cookies.get('openid'))
	  .then(function(data){
  	that.phone1=data.data.data.phone
  	//判断手机号是不是注册过
axios.get(that.PublicUrl+'member/isRegister?secret=06fb680f639a3f180f08cdce28b7161d&memberWeixinOpenId='+Cookies.get('openid')+"&memberPhone="+this.phone1)
.then(function(data){
	//没注册
	if(data.data.code=='000002'){
		alert('当前用户未注册，请关注【果匠快修】注册成为会员用户')
	//没注册
  }else if(data.data.data.phone==null){
   		alert('当前用户未注册，请关注【果匠快修】注册成为会员用户')
	}else{
	//注册跳转到选择金额页面
		window.location.href='savings_add.html'	
	}
})
  })
}
 }
 
})