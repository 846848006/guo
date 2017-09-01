


     var memberweixinopenid = Cookies.get('openid');
 $(function() {
     Vue.http.options.emulateJSON = true;
     var openid= Cookies.get('openid');
     if (Arg('code')) {
         Cookies.set('wxtoken', Arg('code'), {
             expires: 999999
         });
     }

     if (!Cookies.get('wxtoken')) {
         getToken();
     }

     function getToken() {
                     document.location.href = "http://api.benehugo.com/gjkx/html/yonghu/get-weixin-code.html?redirect_url=" + (document.location.href.split('?')[0]);
     }
     var vm = new Vue({
       el: '#app',
       ready: function() {

         this.start();
       },
       data: {
         account:0,
         memberweixinopenid:null,
         password:null,
         workorderid:Arg('workorderid'),
         type:Arg('type'),
         listOthercosts1:[],
         listOthercosts2:[],
         isPayMoney:0,
         laborfee:0,
         balanceDeduction:0,
         devicetrouble:[]
       },
       methods: {
         start:function(){

           if(Cookies.get('openid'))
           {
             this.memberweixinopenid=Cookies.get('openid');

             this.checkToken();
           }
           else
           {
             this.getUserInfo();
           }
           //this.checkToken();
         },
         checkToken: function() {
           var that=this;
           this.$http.get("http://demo.benehugo.com/gjkx/auth/token?appid=gjkx&secret=06fb680f639a3f180f08cdce28b7161d").then(
             function(response) {
               //console.log(response.data.data);

               Vue.http.headers.common['Authorization'] = 'Bearer ' + response.data.data;
               that.show();
             },
             function(response) {
                 //getToken();
             }
           );
         },
         show:function(){
           var that=this;
           this.getOrderInfo(function(res) {
             that.devicetrouble=res.data.data.listWorkOrderDeviceTrouble;
             that.getPayInfo(function(r){
               that.listOthercosts1=r.data.data.listOthercosts1;
               that.listOthercosts2=r.data.data.listOthercosts2;
               that.laborfee=r.data.data.laborfee;
               that.balanceDeduction=r.data.data.balanceDeduction;
               that.isPayMoney=r.data.data.isPayMoney;
               that.account=r.data.data.accountnumber;
               if(that.account){
               }else {
                 $("#password").attr("disabled",true);
               }
             })
           })
         },
         getOrderInfo:function(callback){
           var that=this;
           that.$http.get("http://demo.benehugo.com/gjkx/workorder/selectSettlement?secret=06fb680f639a3f180f08cdce28b7161d&workorderId="+that.workorderid+"&memberWeixinOpenId="+Cookies.get('openid')).then(
               function (response) {
                 console.log(response.data)
                     callback(response)
               }
           );
         },
         getPayInfo:function(callback){
           var that=this;
           that.$http.get("http://demo.benehugo.com/gjkx/workorder/selectPaySettlement?secret=06fb680f639a3f180f08cdce28b7161d&workorderId="+that.workorderid+"&memberWeixinOpenId="+that.memberweixinopenid+"&payType="+that.type).then(
               function (response) {
                 console.log(response.data)
                     callback(response)
               }
           );
         },
         getUserInfo:function () {
             this.$http.get("http://demo.benehugo.com/gjkx/weixin/getOpenid?secret=06fb680f639a3f180f08cdce28b7161d&code="+ Cookies.get('wxtoken'),{},{
                 headers:{
                     'Authorization':"Bearer " + Cookies.get('wxtoken')
                 }
             }).then(
                 function (response) {
                     console.log(response);
                     if(response.data=="token_expired")
                     {
                       getToken();
                     }else {
                       var openid = response.data;
                       Cookies.set('openid',openid,{
                           expires:999999
                       });
                       console.log(response);
                       this.start()
                     }
                 }
         ).catch(function(err){
               if(err.data.message=="token_expired")
               {
                 getToken();
               }
             });

         },
         payorder:function(){
           var that=this;
           if(this.account)
           {
           this.checkpass(function(res){
             if(res.data.success)
             {
               if(that.isPayMoney==0)
               {
                 that.payzreo();
                 console.log(1)
               }else {
                 that.pay();
                 console.log(2)
               }

             }else {
               alert(res.data.massage)
             }
           })
         }else {
           alert("暂未储值，请充值后重试")
         }
         }
         ,
         checkpass:function(callback){
           
           var that=this;
           if(this.password)
           {
           that.$http.get("http://demo.benehugo.com/gjkx/workorder/selectPayPassword?secret=06fb680f639a3f180f08cdce28b7161d&workorderId="+that.workorderid+"&memberWeixinOpenId="+Cookies.get('openid')+"&payType="+that.type+"&payPassword="+this.password).then(
               function (response) {
                 console.log(response.data)
                     callback(response)
               }
           )
         }
         else{ 
           alert("输入的密码不正确，请重新尝试");
         }
         },
         payzreo:function(){
            var that=this;
            var pd={};
            pd.workorderId=this.workorderid;
            pd.memberWeixinOpenId=this.memberweixinopenid;
            pd.payType=this.type=="gz2"?2:this.type=="cz1"?3:1;
            var str =this.toQueryString(pd);
            this.$http.post("http://demo.benehugo.com/gjkx/workorder/preparePay?secret=06fb680f639a3f180f08cdce28b7161d"+str, {},function (response) {
              if(response.code!="000000"){
                alert(response.massage);
              }else{
                window.location.href = "../my_home/evaluate.html?workorderid=" +that.workorderid;
              }
            });
         },
         pay:function(){
           var that=this;
         $.ajax({
           url: "http://demo.benehugo.com/gjkx/weixin/getPayParamByWorkOrder",
           type: "get",
           dataType: "json",
           async:false,
           beforeSend: function(request) {
               request.setRequestHeader("Authorization", Vue.http.headers.common.Authorization);
           },
           data:{
             "weixinAccount":Cookies.get('openid'),
             "workorderId":that.workorderid,
             "secret":'06fb680f639a3f180f08cdce28b7161d',
             "payName":"moneyFee",
             "payType":that.type=="cz1"?'cz3':'gz2'
           },
           success: function(datas){
             if(datas["success"]){
               if(datas.code=="000000"){
                 datas=datas.data;
                 that.onBridgeReady(datas);
               }else{
                 alert(datas.massage);
               }
             }
           }
                 })
         },
        onBridgeReady:function(datas){
          var data;
    var that=this;
    if(datas){
      data = datas["WeiXinData"];
      if(data){
        var _timestamp=data["timeStamp"]+"";
        WeixinJSBridge.invoke(
          'getBrandWCPayRequest', {
          "appId":data["appId"],     //公众号名称，由商户传入
          "timeStamp":_timestamp,         //时间戳，自1970年以来的秒数
          "nonceStr":data["nonceStr"], //随机串
          "package":data["package"],
          "signType":data["signType"],         //微信签名方式：
          "paySign":data["paySign"] //微信签名
          },
          function(res){
             if(res.err_msg == "get_brand_wcpay_request:ok" ) {
              window.location.href = "../my_home/evaluate.html?workorderid=" +that.workorderid;
              //console.log("123123123123123123123123");
             }     // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
          }
        );
      }
      }
    },
    toQueryString:function(obj)
    {
      var str="";
      for(name in obj)
      {
        str+="&"+name+"="+obj[name];
      }
      return str;
    }
       },
       computed: {

       }
     });

   })



/*//定义openid
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
             var vm = new Vue({
                el: "#app",
                data: {
                    devicetrouble: [],
                    listOthercosts1: [],
                    listOthercosts2: [],
                    balanceDeduction: 0,
                    type: sessionStorage.getItem('type'),
                    isPayMoney: 0,
                    account: 0,
                    password: '',
                    PublicUrl:"http://test.benehugo.com/gjkx/"
                },
                mounted() {
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

             var that = this
        function getDeviceType(){
                    axios.get(that.PublicUrl+"workorder/selectSettlement?secret=06fb680f639a3f180f08cdce28b7161d&workorderId=" + sessionStorage.getItem('goodsOrderId') + "&memberWeixinOpenId=" +Cookies.get('openid')).then(function(data) {
                        that.devicetrouble = data.data.data.listWorkOrderDeviceTrouble;
                    })
                    axios.get(that.PublicUrl+"workorder/selectPaySettlement?secret=06fb680f639a3f180f08cdce28b7161d&workorderId=" + sessionStorage.getItem('goodsOrderId') + "&memberWeixinOpenId=" + Cookies.get('openid') + "&payType=" + sessionStorage.getItem('type')).then(function(data) {
                        console.log(data)
                        that.isPayMoney = data.data.data.isPayMoney
                        that.account = data.data.data.accountnumber
                        that.listOthercosts1 = data.data.data.listOthercosts1
                        that.listOthercosts2 = data.data.data.listOthercosts2
                    })
                             }
                },
                methods: {
                    onBridgeReady: function(data) {
                        var data;
                        var that = this;
                        if (data.data) {
                            data = data.data.data.WeiXinData;
                            if (data) {
                                var _timestamp = data.timeStamp + "";
                                WeixinJSBridge.invoke('getBrandWCPayRequest', {
                                    "appId": data.appId, //公众号名称，由商户传入
                                    "timeStamp": _timestamp, //时间戳，自1970年以来的秒数
                                    "nonceStr": data.nonceStr, //随机串
                                    "package": data.package,
                                    "signType": data.signType, //微信签名方式：
                                    "paySign": data.paySign //微信签名
                                },
                                function(res) {
                                    if (res.err_msg == "get_brand_wcpay_request:ok") {



                                        window.location.href = "pingjia.html"
                                    }
                                    // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回  ok，但并不保证它绝对可靠。
                                });
                            }
                        }
                    },
                    payorder: function() {
                        var taht=this
                        if (this.account) {
                            if (this.password) {
                                axios.get(taht.PublicUrl+'workorder/selectPayPassword?secret=06fb680f639a3f180f08cdce28b7161d&workorderId=' + sessionStorage.getItem('goodsOrderId') + '&memberWeixinOpenId=' + Cookies.get('openid') + "&payType=" + sessionStorage.getItem('type') + "&payPassword=" + this.password).then(function(data) {
                                    if (data.data.code == '000000') {
                                        if(vm.isPayMoney==0){
                                            var str1=sessionStorage.getItem('type')=="cz"?3:2
                                        axios.post('http://test.benehugo.com/gjkx/workorder/preparePay?secret=06fb680f639a3f180f08cdce28b7161d&workorderId='+sessionStorage.getItem('goodsOrderId')+"&memberWeixinOpenId="+Cookies.get('openid')+"&payType="+str1)
                                            .then(function(data){
                                                if(data.data.code=='000000'){
                                                    window.location.href='./pingjia.html'
                                                }
                                            })
                                            
                                        }else{
                                            axios.get('http://test.benehugo.com/gjkx/weixin/getPayParamByWorkOrder',{params:{
                                                             "workorderId":sessionStorage.getItem('goodsOrderId'),
                                                         "weixinAccount":Cookies.get('openid'),
                                                        "secret":'06fb680f639a3f180f08cdce28b7161d',
                                                         "payName":"moneyFee",
                                                        "payType":sessionStorage.getItem('type')
                                     }})
                                        .then(function(data){
                                             if(data.data.code=='000000'){
                                                vm.onBridgeReady(data)
                                             }else{
                                                 }
                                      })
                                        }

                                    } else {
                                        alert('密码输入错误')
                                    }
                                })
                            } else {
                                alert('请输入密码！')
                            }
                        } else {
                            alert('暂未储值，请充值后重试')
                        }
                    }
                }
            })*/