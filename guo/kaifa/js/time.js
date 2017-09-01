/**
 * Created by badyoung on 16/1/13.
 */


Date.prototype.getUnixTime = function() {
  return this.getTime() / 1000 | 0;
};


Date.prototype.addDays = function(days) {
  this.setDate(this.getDate() + days);
  return this;
};

Date.prototype.addSecends = function(secends) {
  this.setSeconds(this.getSeconds() + secends);
  return this;
};
/**
 * 格式化显示时间
 * @param fmt yyyy-MM-dd HH:mm:ss
 * @returns {*}
 */
Date.prototype.format = function(fmt) {
  date = this;
  var o = {
    "M+": date.getMonth() + 1, //月份
    "d+": date.getDate(), //日
    "h+": date.getHours(), //小时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
    "S": date.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }

  return fmt;
};

Date.prototype.getDifference = function(begindate, enddate) {

  //计算给定时间与当期系统时间的时间差
  //计算相差毫秒数
  var date1 = begindate; //当前时间
  var date2 = enddate; //给定时间
  var date3 = date2.getTime() - date1.getTime() //时间差的毫秒数
  return (Math.round(date3 / 1000));

}
