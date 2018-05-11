// pages/list/list.js
const dayMap = [
  "星期日","星期一","星期二","星期三","星期四","星期五","星期六"
];
Page({
  data:{
    items:[]
  },
  onPullDownRefresh() {
    this.loadData(() => {
      wx.stopPullDownRefresh();
    });
  },
  onLoad(){
    this.loadData();
  },
  loadData(callback){
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/future',
      data:{
        city:"北京",
        time:new Date().getTime()
      },
      success:(res)=>{
        console.log(res);
        let result = res.data.result;
        if(result){
          result.forEach(function(item, index){
            let date = new Date();
            date.setDate(date.getDate()+index);
            item.date = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
            if(index == 0){
              item.day = "今天";
            }else{
              item.day = dayMap[date.getDay()];
            }
          });
          this.setData({ items: res.data.result });
        }
      },
      fail:(err)=>{
        console.error(err);
      },
      complete:()=>{
         callback && callback();
      }
    })
  }
})