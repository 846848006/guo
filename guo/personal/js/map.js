/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2016-10-17 18:25:42
 * @version $Id$
 */

function map_create(handle){
	var html='<div id="map_confrim">'+
			 '<div id="mapContainer" style="width: 100%;height: 56%;top: 6%;"></div>'+
			 '<div id="tip">'+
             '<a class="back-wrap">'+
             '<i class="icon i-back"></i>'+
             '</a>'+
             '<span class="address-search-cancel">取消</span>'+
             '<div class="address-search">'+
             '<i class="icon-magnifier address-search-icon"></i>'+
             '<input type="text" id="address-search-input" class="address-search-input" placeholder="查找地址">'+
			 '</div>'+
             '</div>'+
             '<div class="search-address-wrap">'+
             '  <div id="search-address-scroller" class="search-address-scroller">'+
             '      <div class="poi-list">'+
             '          <ul id="poi-list">'+
             '          </ul>'+
             '      </div>'+
             '      <div class="load-wrap">'+
             '          <div class="load-data">'+
             '              <img width="24" height="24" src="http://www.ibanling.com/demo/map/loadData.png">'+
             '              <span style="font-size: 14px;">加载中...</span>'+
             '          </div>'+
             '      </div>'+
             '      <div class="no-more-results">'+
             '          <p>亲，没有更多了~</p>'+
             '      </div>'+
             '  </div>'+
             '</div>'+
			 '<div id="panel">'+
			 '<div class="amap_lib_placeSearch">'+
			 '<div class="amap_lib_placeSearch_list">'+
			 '<ul id="panel_list">'+
			 '</ul>'+
			 '</div>'+
             '<div class="amap_lib_placeSearch_page">'+
             '</div>'+
			 '</div>'+
			 '</div>'+
			 '</div>';
	$("body").append(html);
	$("body").addClass("modal-open");
    $("#address-search-input").click(function(){
        $(".search-address-wrap").show();
        $("#tip").addClass('address-header-active');
    });
    $(".address-search-cancel").click(function(){
        $("#poi-list").empty();
        $('#address-search-input').val('');
        $(".search-address-wrap").hide();
        $("#tip").removeClass('address-header-active');
    });
    $(".back-wrap").click(function(){
        $("#map_confrim").remove();
    });
	var windowsArr = [];
    var city="010";
    var map = new AMap.Map("mapContainer", {
            // resizeEnable: true,
            // animateEnable:false,
            // center: [116.397428, 39.90923],//地图中心点
            zoom: 15,//地图显示的缩放级别
            keyboardEnable: false,
            // mapStyle:'light'
    });
    var marker=null;
    map.plugin('AMap.Geolocation', function() {
        geolocation = new AMap.Geolocation({
            enableHighAccuracy: true,//是否使用高精度定位，默认:true
            // timeout: 30000,          //超过10秒后停止定位，默认：无穷大
            showCircle: false,  
            showMarker: false, 
            buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            buttonPosition:'RB'
        });
        map.addControl(geolocation);
        geolocation.getCurrentPosition();
        AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
        AMap.event.addListener(geolocation, 'error', onError);      //返回定位出错信息
    });
    // map.on('click', function(e) {
    // 	console.log(e);
    //     console.log('您在[ '+e.lnglat.getLng()+','+e.lnglat.getLat()+' ]的位置点击了地图！');
    //     var lnglatXY = [e.lnglat.getLng(), e.lnglat.getLat()]; //点坐标
    //     searchNearBy(lnglatXY);
    //     if (marker) {
    //         marker.setPosition(lnglatXY);
    //     }else{
    //         marker = new AMap.Marker({
    //             position: lnglatXY,
    //             draggable: true,
    //             raiseOnDrag: true
    //         });
    //         marker.setMap(map);
    //     }
    //     marker.setMap(map);    
        
    // });
    // map.on('movestart',function(e){
    //     // e.preventDefault();
    //     var lnglatXY = map.getCenter(); //点坐标
    //     if (marker) {
    //         marker.setPosition(lnglatXY);
    //     }else{
    //         marker = new AMap.Marker({
    //             position: lnglatXY,
    //             icon:"http://www.ibanling.com/demo/map/map-marker.5105670d.png"
    //         });
    //         marker.setMap(map);
    //     }
    // });
    map.on('mapmove',function(e){
        // e.preventDefault();
        var lnglatXY = map.getCenter(); //点坐标
        if (marker) {
            marker.setPosition(lnglatXY);
        }else{
            marker = new AMap.Marker({
                position: lnglatXY,
                icon:"http://www.ibanling.com/demo/map/map-marker.5105670d.png"
            });
            marker.setMap(map);
        }
    });
    map.on('moveend',function(e){
        // e.preventDefault();
        var lnglatXY = map.getCenter(); //点坐标
        searchNearBy(lnglatXY);
        if (marker) {
            marker.setPosition(lnglatXY);
            marker.setAnimation('AMAP_ANIMATION_BOUNCE');
            setTimeout(function(){
                marker.setAnimation('AMAP_ANIMATION_NONE');
            },1000)
        }else{
            marker = new AMap.Marker({
                position: lnglatXY,
                icon:"http://www.ibanling.com/demo/map/map-marker.5105670d.png"
            });
            marker.setMap(map);
        }
     
    });
    map.on('zoomchange',function(e){
        var lnglatXY = map.getCenter(); //点坐标
        searchNearBy(lnglatXY);
        if (marker) {
            marker.setPosition(lnglatXY);
        }else{
            marker = new AMap.Marker({
                position: lnglatXY,
                icon:"http://www.ibanling.com/demo/map/map-marker.5105670d.png"
            });
            marker.setMap(map);
        }
     
    });
    //解析定位结果
    function onComplete(data) {
    	console.log(data);
        city=data.addressComponent.citycode;
        // alert(city);
        // alert(data.addressComponent.citycode);
        // alert(JSON.stringify(data));
        searchNearBy(data.position);
    	if (marker){
            marker.setPosition(data.position);
        }else{
            marker = new AMap.Marker({
                position: data.position,
                icon:"http://www.ibanling.com/demo/map/map-marker.5105670d.png"
            });
            marker.setMap(map);
        }
    	
    }
    var cpoint;
    function searchNearBy(position){
        AMap.service(["AMap.PlaceSearch"], function() {
            var placeSearch = new AMap.PlaceSearch({ //构造地点查询类
                city:city,
                // map:map,
                extensions:'all',
                // pageIndex: 1,
                pageSize:50
                // panel: "panel"
            });
            var panel_div = document.getElementById('panel_list'); 
            cpoint = position; //中心点坐标
            $("#panel_list").empty();
            placeSearch.searchNearBy('', cpoint, 2000, function(status, result) {
                console.log(result)
                for(var h=0;h<result.poiList.pois.length;h++){
                    var jy=result.poiList.pois[h]['location'];//经纬度
                    var address=result.poiList.pois[h]['cityname']+result.poiList.pois[h]['adname']+result.poiList.pois[h]['address'];//地址
                    var poibox = document.createElement("li");
                    poibox.setAttribute("class","poibox");
                    poibox.setAttribute("getLng",result.poiList.pois[h]['location']['lng']);
                    poibox.setAttribute("getLat",result.poiList.pois[h]['location']['lat']);
                    poibox.setAttribute("address",address);
                    var html='<div class="amap_lib_placeSearch_poi poibox-icon"></div>'+
                             '<h3 class="poi-title">'+
                             '<span class="poi-name">'+result.poiList.pois[h]['name']+'</span>'+
                             '</h3>'+
                             '<div class="poi-info"><p class="poi-addr">地址：'+address+'</p></div>';
                    poibox.innerHTML = html; 
                    
                    panel_div.appendChild(poibox); 

                }
               var count=result.poiList.count;
                var pageSize=result.poiList.pageSize;
                var pageIndex=result.poiList.pageIndex;
                var pageCount=Math.ceil(count/pageSize);
                if(pageCount<=pageIndex){
                    $(".amap_lib_placeSearch_page").empty();
                }else{
                    var html='<a class="pageLink1" pageno="'+pageIndex+'">更多</a>';
                    $(".amap_lib_placeSearch_page").html(html);
                }
            });
            $(document).on("click", ".pageLink1", function() {
                var page=parseInt($(this).attr('pageno'));
                placeSearch.setPageIndex(page+1);
                placeSearch.searchNearBy('', cpoint, 2000,
                 function(status, result) {
                    console.log(result);
                    for(var h=0;h<result.poiList.pois.length;h++){
                        var jy=result.poiList.pois[h]['location'];//经纬度
                        var address=result.poiList.pois[h]['cityname']+result.poiList.pois[h]['adname']+result.poiList.pois[h]['address'];//地址
                        var poibox = document.createElement("li");
                        poibox.setAttribute("class","poibox");
                        poibox.setAttribute("getLng",result.poiList.pois[h]['location']['lng']);
                        poibox.setAttribute("getLat",result.poiList.pois[h]['location']['lat']);
                        poibox.setAttribute("address",address);
                        var html='<div class="amap_lib_placeSearch_poi poibox-icon"></div>'+
                                 '<h3 class="poi-title">'+
                                 '<span class="poi-name">'+result.poiList.pois[h]['name']+'</span>'+
                                 '</h3>'+
                                 '<div class="poi-info"><p class="poi-addr">地址：'+address+'</p></div>';
                        poibox.innerHTML = html; 
                        
                        panel_div.appendChild(poibox); 

                    }
                    var count=result.poiList.count;
                    var pageSize=result.poiList.pageSize;
                    var pageIndex=result.poiList.pageIndex;
                    var pageCount=Math.ceil(count/pageSize);
                    if(pageCount<=pageIndex){
                        $(".amap_lib_placeSearch_page").empty();
                    }else{
                        var html='<a class="pageLink1" pageno="'+pageIndex+'">更多</a>';
                        $(".amap_lib_placeSearch_page").html(html);
                    }

                })
            });
        });
    }
    //解析定位错误信息
    function onError(data) {
        var lnglatXY = map.getCenter(); //点坐标
    	console.log(data);
        searchNearBy(lnglatXY);
        if (marker){
            marker.setPosition(lnglatXY);
        }else{
            marker = new AMap.Marker({
                position: lnglatXY,
                icon:"http://www.ibanling.com/demo/map/map-marker.5105670d.png"
            });
            marker.setMap(map);
        }
    }
    var infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)});
    AMap.plugin(['AMap.Autocomplete','AMap.PlaceSearch'],function(){
      var autoOptions = {
        city: city, //城市，默认全国
        // input: "keyword"//使用联想输入的input的id
      };

      autocomplete= new AMap.Autocomplete(autoOptions);
      $('#address-search-input').bind('input propertychange', function() {
        // autocomplete.setCity(city);
        var keywords=$(this).val();
        $(".load-wrap").show();
        $(".no-more-results").hide();
        autocomplete.search(keywords, function(status, result){
            console.log(result);
            console.log(status);
            if(status=='complete'){
                $("#poi-list").empty();
                var poi_list = document.getElementById('poi-list'); 
                for(var h=0;h<result.tips.length;h++){
                    if(result.tips[h]['location']!==""&&result.tips[h]['location']!==undefined&&result.tips[h]['district']!==""){
                        var jy=result.tips[h]['location'];//经纬度
                        var address=result.tips[h]['district']+result.tips[h]['address'];//地址
                        var poibox = document.createElement("li");
                        poibox.setAttribute("class","poi-list-li");
                        poibox.setAttribute("getLng",result.tips[h]['location']['lng']);
                        poibox.setAttribute("getLat",result.tips[h]['location']['lat']);
                        poibox.setAttribute("address",address);
                        var html='<p class="item">'+
                                 '  <span class="poi-title">'+result.tips[h]['name']+'</span>'+
                                 '  <span class="poi-address">'+address+'</span>'+
                                 '</p>';
                        poibox.innerHTML = html; 
                        poi_list.appendChild(poibox); 
                    }
                }
                $(".poi-list-li").unbind();
                $(".poi-list-li").click(function(){
                    $("#poi-list").empty();
                    $('#address-search-input').val('');
                    $(".search-address-wrap").hide();
                    $("#tip").removeClass('address-header-active');
                    var lnglatXY = [$(this).attr('getLng'), $(this).attr('getLat')]; //点坐标
                    searchNearBy(lnglatXY);
                    map.setCenter(lnglatXY);
                    if (marker) {
                        console.log('123');
                        marker.setPosition(lnglatXY);
                        marker.setAnimation('AMAP_ANIMATION_BOUNCE');
                        setTimeout(function(){
                            marker.setAnimation('AMAP_ANIMATION_NONE');
                        },1000)
                    }else{
                        marker = new AMap.Marker({
                            position: lnglatXY,
                            icon:"http://www.ibanling.com/demo/map/map-marker.5105670d.png"
                        });
                        marker.setMap(map);
                    }
                    // map_submit($(this).attr('address'),[$(this).attr('getLng'), $(this).attr('getLat')]);
                })
                $(".load-wrap").hide();
                $(".no-more-results").show();
            }else{
               $("#poi-list").empty();
               $(".load-wrap").hide();
               $(".no-more-results").hide();
            }
        });
      });
      
      
    });
     function geocoder_CallBack(data,lnglatXY) {
       console.log(data);
       console.log(lnglatXY);
       var address = data.regeocode.formattedAddress; //返回地址描述
       if (marker) {
            marker.setMap(null);
            marker = null;
        }
    	 marker = new AMap.Marker({
	        position: lnglatXY,
	        draggable: true,
	        cursor: 'move',
	        raiseOnDrag: true
	    });
    	marker.extData = {'getLng':lnglatXY[0],'getLat':lnglatXY[1],'address':address};//自定义想传入的参数
    	marker.on("click",function(e) {
	    	var hs=e.target.extData;
	     	infoWindow.setContent(hs['address']);//点击以后窗口展示的内容
	     	infoWindow.open(map, e.target.getPosition());
	    	// map_submit(hs['address'],[hs['getLng'],hs['getLat']]);
	    });
	    marker.setMap(map);
	    // map_submit(address,lnglatXY);
    }
    $(document).on("click", ".poibox", function() {
        map_submit($(this).attr('address'),[$(this).attr('getLng'), $(this).attr('getLat')]);
    	// map.setZoomAndCenter(14, [$(this).attr('getLng'), $(this).attr('getLat')]);
    	// infoWindow.setContent($(this).attr('address'));//点击以后窗口展示的内容
     //    infoWindow.open(map, [$(this).attr('getLng'), $(this).attr('getLat')]);
     //    // alert($(this).attr('address'));
     //    // map_submit($(this).attr('address'),[$(this).attr('getLng'), $(this).attr('getLat')]);
     //    if (marker) {
     //        marker.setMap(null);
     //        marker = null;
     //    }
    	//  marker = new AMap.Marker({
	    //     position: [$(this).attr('getLng'), $(this).attr('getLat')],
	    //     draggable: true,
	    //     cursor: 'move',
	    //     raiseOnDrag: true
	    // });
	    // marker.setMap(map);
        // 
    });
    // $(document).on("click", ".poi-list-li", function() {
    //     alert('123');
    //     map_submit($(this).attr('address'),[$(this).attr('getLng'), $(this).attr('getLat')]);
    // });
    // $(".search-address-wrap").click(function(){
    //     alert('123');
    // })
    function map_submit(address,lnglatXY){
        $("#map_confrim").remove();
        handle(address,lnglatXY);
    }
}