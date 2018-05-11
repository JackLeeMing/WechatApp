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

const UNPROMTED = 0;
const UNAUTHORIZED = -1;
const AUTHORIZE = 1;
const UNPROMTED_TIP = "点击获取当前位置";
const UNAUTHORIZED_TIP = "点击开启位置权限";
const AUTHORIZED_TIP = "";
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
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
    },
    city:"北京",
    locationTip:UNPROMTED_TIP,
    locationAuthorType:UNPROMTED,
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
  setCity(city){
    this.setData({ city: city, locationTip: AUTHORIZED_TIP, locationAuthorType:AUTHORIZE});
  },
  onTapDayWeather(e){
    wx.navigateTo({
      url: '/pages/list/list?city='+this.data.city,
    });
  },

  loadData(callback){
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now',
      data: {
        city: this.data.city
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
    if(this.data.locationAuthorType === UNAUTHORIZED){
      wx.openSetting({
        success:(res)=>{
          if(res.authSetting['scope.userLocation']){
            this.getCityAndLoadData();
          }
        }
      });
    }else{
        this.getCityAndLoadData();
    }
  },

  getCityAndLoadData(){
    wx.getLocation({
      success: (res) => {
        if (qqmapsdk) {
          qqmapsdk.reverseGeocoder({
            location: {
              latitude: res.latitude,
              longitude: res.longitude
            },
            success: (res) => {
              let city = res.result.address_component.city;
              console.log(city);
              this.setCity(city);
              this.setData({ locationAuthorType: AUTHORIZE, locationTip: AUTHORIZED_TIP })
              this.loadData();
            }
          });
        }
      },
      fail: (err) => {
        console.error(err);
        this.setData({ locationAuthorType: UNAUTHORIZED, locationTip: UNAUTHORIZED_TIP });
      }
    })
  },
  onLoad(){
    console.log("Hello world");
    qqmapsdk = new QQMapWX({
      key:"ZZYBZ-7KDWQ-DI25X-GIQJO-G3ZP7-LYBZM"
    });
    wx.getSetting({
      success:(res)=>{
        if (res.authSetting['scope.userLocation']){
          this.getCityAndLoadData();
        }else{
          this.loadData();
        }
      }
    });
  }
});
