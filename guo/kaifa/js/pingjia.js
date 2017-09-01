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
             var vm = new Vue({
                el: '#app',
                data: {
                    content: null,
                    score: {
                        efficiency: 0,
                        tech: 0,
                        service: 0,
                        recover: 0,
                        PublicUrl:"http://test.benehugo.com/gjkx/"
                    },
                    workorderid: sessionStorage.getItem('goodsOrderId'),
                    memberweixinopenid: Cookies.get('openid')
                },
                mounted() {
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
                    grade("recover");
                    grade("efficiency");
                    grade("service");
                    grade("tech");
            ;});}


                    function grade(name) {
                        $("#" + name + " li").bind({
                            mousedown: function(e) {
                                var n = e.toElement.parentElement.parentElement.id;
                                $(this).siblings().css("color", " #DAA520").html("☆");
                                $(this).css("color", " #DAA520").html("★").prevAll().css("color", " #DAA520").html("★");
                                vm.score[n] = parseInt($(this).index("#" + n + " li")) + 1;

                            }
                        });
                    }
                },
                methods: {
                    verify: function() {
                        if (this.score.efficiency == 0 || this.score.tech == 0 || this.score.service == 0 || this.score.recover == 0) {
                            alert("还有未评分项")
                        } else {
                            if(this.content==null){
                                this.content=''
                            }
                            var str ='&memberWeixinOpenId=' + this.memberweixinopenid + "&content=" + this.content + "&efficiency=" + this.score.efficiency + "&technology=" + this.score.tech + '&serviceawareness=' + this.score.service + "&recover=" + this.score.recover + "&workorderId=" + this.workorderid
                            
                            axios.post('http://test.benehugo.com/gjkx/workorderevaluate/add?secret=06fb680f639a3f180f08cdce28b7161d',str).then(function(data) {
                                console.log(data)
                                if (data.data.code == 000000) {
                                    window.location.href = "evaluate_succeed.html"
                                } else {
                                    alert(data.data.massage);
                                }
                            })
                        }
                    }
                }

            })