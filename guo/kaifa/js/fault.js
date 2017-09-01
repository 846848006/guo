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
    el:'#app',
    data:{
      items:[],
      selected:[],
      sum:0,
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
    //获取选中的列表页
    function getDeviceType (){
      axios.post(shlf.PublicUrl+'deviceTrouble/selectByDeviceid?secret=06fb680f639a3f180f08cdce28b7161d&deviceId='+sessionStorage.getItem('data1'))
        .then(function(data){
          shlf.items=data.data.data
      if(sessionStorage.getItem('selected')){
        var str=sessionStorage.getItem('selected')
        var str1=JSON.parse(str)
        for(var i=0;i<shlf.items.length;i++){
          
        }
      }
        })}




                            },
//设置点击事件
methods:{
  changeChecked:function(e,val){
      if(e.target.checked){
        this.selected.push(val)
        this.sum++
        }
      else{
        for(var i=0;i<this.selected.length;i++){
          if(this.selected[i].id==val.id){
            this.selected.splice(i, 1)
            this.sum--
            }
            } 
            }
            },
    subFault:function(){
      if(this.sum==0){
        alert('请选择至少一样')
      }else{
        var str = JSON.stringify(this.selected)
        sessionStorage.setItem('selected',str)
        window.location.href='./reqairs.html'
      }
      }
      }
      })