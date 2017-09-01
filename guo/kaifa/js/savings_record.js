 var openid = sessionStorage.getItem('openid')
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + sessionStorage.getItem('token');
    if (Arg('code')) {
          sessionStorage.setItem('wxtoken',Arg('code'),{
          expires:999999
          });
      }
    if (!sessionStorage.getItem('wxtoken')) {
        getToken();
      }
  function getToken() {
        document.location.href = "http://api.benehugo.com/gjkx/html/yonghu/get-weixin-code.html?redirect_url=" + (document.location.href.split('?')[0]);
        }
var vm=new Vue({
	el:'#app',
	data:{
		items:[],
		isshow:true,
		notavailable:'暂无记录'

	},
	mounted(){
			start()
function start () {
                  if(document.referrer==''){
                    window.localStorage.removeItem("order");
                  }
                  this.shopid=1;
                    if(sessionStorage.getItem('openid')){
                        checkToken();
                    }else{
                        getUserInfo();
                    }

	 }
function checkToken(){
    axios.get("http://test.benehugo.com/gjkx/auth/token?appid=gjkx&secret=06fb680f639a3f180f08cdce28b7161d").then(
       	function (response) {
           	axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.data;
            getDeviceType();
                    }
                    );
               		}
function getUserInfo(){
    axios.get("http://test.benehugo.com/gjkx/weixin/getOpenid?secret=06fb680f639a3f180f08cdce28b7161d&code="+ sessionStorage.getItem('wxtoken'),{},{
           	headers:{
                    'Authorization':"Bearer " + sessionStorage.getItem('wxtoken')
                     }
                    })
    			.then(
                      function (response) {
                           if(response.data=="token_expired"){
                              getToken();
                            }else {
                              var openid = response.data;
                                sessionStorage.setItem('openid',openid,{
                                  expires:999999
                              });
                             start();
                            }
                        }
                    )
                }
               //判断是否注册
                var that=this
    function getDeviceType(){

		axios.get('http://test.benehugo.com/gjkx/balancerecord/list?secret=06fb680f639a3f180f08cdce28b7161d&memberId='+sessionStorage.getItem('memberId'))
		.then(function(data){
				that.items=data.data.data
				if(that.items.length>0){
					that.isshow=true
				}
		})
	}
	}
})