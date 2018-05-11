//index.js
//获取应用实例
const weatherMap = {
  'sunny': '晴天',
  'cloudy': '多云',
  'overcast': '阴',
  'lightrain': '小雨',
  'heavyrain': '大雨',
  'snow': '雪'
};

Page({
  data:{
    wendu: 10,
    tianqi: "--",
    wbg:"sunny"
  },
  onLoad(){
    console.log("Hello world");
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now',
      data:{
        city:"海南"
      },
      success:(res) => {
        if(res && res.data && res.data.code == 200 ){
          console.log(res);
          let result = res.data.result;
          let wendu = result.now.temp;
          let weather = result.now.weather;
          let tianqi = weatherMap[weather];
          this.setData({ wendu: wendu, tianqi: tianqi, wbg:"lightrain"});
          
        }
      },
      fail:(err) => {
        console.error(err);
      }
    })
  }
});
