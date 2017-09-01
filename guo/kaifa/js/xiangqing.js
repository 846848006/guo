	//设置请求头
	 	if(sessionStorage.getItem('goodsOrderId')){
        console.log(1)
      }else{
   		var reg = new RegExp("(^|&)" +"workorderId"+ "=([^&]*)(&|$)","i");
  		 var r = window.location.search.substr(1).match(reg);
  		 console.log(r[2])
  		 sessionStorage.setItem('goodsOrderId',r[2])
      }


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

 axios.defaults.headers.common['Authorization'] = 'Bearer ' + sessionStorage.getItem('token');
  	//请求token码
 axios('http://test.benehugo.com/gjkx/auth/token',{params:{"appid":"gjkx","secret":'06fb680f639a3f180f08cdce28b7161d'}})
    .then(res=>{
      sessionStorage.setItem('token',res.data.data)
  	})
var vm=new Vue({
el:'#app',
data:{
	devicetrouble:[],
	istabno:true,
	istabno1:false,
	items:[],
	imgdescription:[],
	devicetrouble:[],
	goodsOrderId:null,
	status:null,
	ismasking:false,
	id:null,
	iscancelorder:null,
	list3_items:[],
	items1:[],
	istab1:true,
	isActive:true,
	PublicUrl:"http://test.benehugo.com/gjkx/",
	todes:[]
	},
	mounted(){
	//请求维修详情数据
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
      axios.get("http://test.benehugo.com/gjkx/weixin/getOpenid?secret=06fb680f639a3f180f08cdce28b7161d&code="+ Cookies.get('wxtoken'),{},{
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
      axios.get("http://test.benehugo.com/gjkx/auth/token?appid=gjkx&secret=06fb680f639a3f180f08cdce28b7161d")
        .then(
          function (response) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.data;

            getDeviceType();


        });}
var shlf=this
       function getDeviceType(){

	this.goodsOrderId=sessionStorage.getItem('goodsOrderId')
	axios.get('http://test.benehugo.com/gjkx/workorder/show?secret=06fb680f639a3f180f08cdce28b7161d&workorderId='+this.goodsOrderId)
		.then(function(data){
			shlf.todes = data.data.data.othercostsList?data.data.data.othercostsList:[];
			console.log(shlf.todes)
			shlf.imgdescription=data.data.data.imgdescription?data.data.data.imgdescription.split(','):[];
			shlf.items=data.data.data
			var status=data.data.data.status
			shlf.status=data.data.data.status
			shlf.id=data.data.data.id
			if(status==4 || status==7 || status==8 || status==9 || status==10 || status==11 ){
				shlf.iscancelorder=false
			}else{
				shlf.iscancelorder=true
			}	
			shlf.id=data.data.data.id
			shlf.devicetrouble=data.data.data.workorderdevicetroubleList?data.data.data.workorderdevicetroubleList:[];
			})
	axios.get('http://test.benehugo.com/gjkx/workorder/worker?secret=06fb680f639a3f180f08cdce28b7161d&workorderId='+sessionStorage.getItem('goodsOrderId'))
		.then(function(data){
			shlf.list3_items=data.data.data
			})
        }


	
			},
	methods: {
		//状态点击
		but1:function(){
			this.istab1=false
			this.isActive=false
			var shlf=this
			axios.get('http://test.benehugo.com/gjkx/workorderstatus/list?secret=06fb680f639a3f180f08cdce28b7161d&workorderId='+sessionStorage.getItem('goodsOrderId'))
				.then(function(data){
					shlf.items1=data.data.data
					})
					},
		//详情点击
		but2:function(){
			this.istab1=true,
			this.isActive=true
			},
		//通过返回值 判断订单状态
		getStatus: function (value) {
			value=parseInt(value);
			switch (value) {
				case 1:
					return "待接单";
					break;
				case 2:
					return "已接单";
					break;
				case 3:
					return "处理中";
					break;
				case 4:
					return "工单取消";
					break;
				case 5:
					return "已预约";
					break;
				case 6:
					return "维修中";
					break;
				case 7:
					return "维修完成";
					break;
				case 8:
					return "待验收";
					break;
				case 9:
					return "待支付";
					break;
				case 10:
					return "待修正";
					break;
				case 11:
					return "工单完成";
					break;
				case 12:
					return "等人待接单";
					break;
				case 13:
					return "调度待接单";
					break;
				case 14:
					return "转单待接单";
					break;
				default :
					return "其他";
					break;
					}
					},
		//联系客服
		cancelorder:function(e){
			if(this.status==1 || this.status==2 || this.status==5){
			this.ismasking=true
				}
			else if(this.status==3 || this.status==6 ||this.status==15){
				$(e.target).attr('href','tel:010-84226366')
			}
			},
		//通过返回值判断取消
		affirm:function(){
			this.ismasking=false
			var shlf=this
			var openid=sessionStorage.getItem('openid')
			axios.post("http://test.benehugo.com/gjkx/workorder/userCancelWorkorder?secret=06fb680f639a3f180f08cdce28b7161d&workorderId="+this.id+"&memberWeixinOpenId="+Cookies.get('openid')+"&isdoorFee=true")
				.then(function(data){
					if(data.data.code=='000000'){
						alert('取消成功')
						window.location.href='./maintain_record.html'
						}
					else if(data.data.code=='000014'){
						alert('该单已被取消')
						}
					else if(data.data.code=='000001'){
						alert('操作失败,请关闭后重试')
						}
					else if(data.data.code=="000002"){
						alert('没有找到相应的数据')
						}
						})
						},
		abolish:function(){
			this.ismasking=false
						},
		zhifu:function(){
			window.location.href='settlement.html'
		}
						}
						})