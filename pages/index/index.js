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

const weatherColorMap = {
  'sunny': '#cbeefd',
  'cloudy': '#deeef6',
  'overcast': '#c6ced2',
  'lightrain': '#bdd5e1',
  'heavyrain': '#c5ccd0',
  'snow': '#aae1fc'
};
const QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
Page({
  data:{
    now:{
      temp: 10,
      wea: "--",
      weather: "sunny",
    },
    forecast:[],
    today:{
      todayDate: "",
      todayTemp: "",
    }
  },
  onPullDownRefresh(){
    this.loadData(()=>{
      wx.stopPullDownRefresh();
    });
  },

  setNowWeather(obj){
    if (obj) {
      obj.weatherText = weatherMap[obj.weather];
      wx.setNavigationBarColor({
        frontColor: '#000000',
        backgroundColor: weatherColorMap[obj.weather],
      });
      this.setData({ now: obj});
    }
  },

  setForcastWeather(hourlyWeather){
    if (hourlyWeather) {
      let nowHour = new Date().getHours();
      let i = 0;
      hourlyWeather.forEach((item) => {
        item.weatherText = weatherMap[item.weather];
        if (i == 0) {
          item.time = '现在';
        } else {
          item.time = (i + nowHour) % 24 + '时';
        }
        i += 3
      });
      this.setData({forecast: hourlyWeather});
    }
  },

  setToday(today){
    if(today){
      let date = new Date();
        today.todayTemp = `${today.minTemp}° - ${today.maxTemp}°`;
        today.todayDate = `${date.getFullYear()}年${date.getMonth()+1}月${date.getDate()}日 今天`;
        this.setData({ today: today});
    }
  },
  onTapDayWeather:(e)=>{
    wx.navigateTo({
      url: '/pages/list/list',
    });
  },

  loadData(callback){
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now',
      data: {
        city: "北京"
      },
      success: (res) => {
        if (res && res.data && res.data.code == 200) {
          console.log(res);
          let result = res.data.result;
          let nowWeather = result.now;
          let hourlyWeather = result.forecast;
          let today = result.today;
          this.setNowWeather(nowWeather);
          this.setForcastWeather(hourlyWeather);
          this.setToday(today);
        }
      },
      fail: (err) =>  {
        console.error(err);
      },
      complete: ()=>{
        callback && callback();
      }
    })
  },

  onTapLocation(){
    wx.getLocation({
      success: function(res) {
        if(this.qqmapswx){
          this.qqmapswx.reverseGeocoder({
            location: {
              latitude: res.latitude,
              longitude: res.longitude
            },
            success: res => {
              let city = res.result.address_component.city;
              console.log(city);
            }
          });
        }else{
          console.log('null');
        }
      },
    })
  },
  onLoad(){
    console.log("Hello world");
    this.qqmapswx = new QQMapWX({
      key:"ZZYBZ-7KDWQ-DI25X-GIQJO-G3ZP7-LYBZM"
    });
    this.loadData();
  }
});
