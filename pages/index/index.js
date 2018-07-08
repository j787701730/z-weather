//index.js
//获取应用实例
const app = getApp()

// 引用百度地图微信小程序JSAPI模块 
var bmap = require('../../lib/bmap-wx.min.js');
var {
  ak
} = require('../../utils/config.js');

Page({
  data: {
    currentWeather: '',
    originalData: '',
    prompt: ''
  },
  onLoad: function () {
    wx.setStorageSync('queryFlag', 'fav');

  },
  onShow: function () {
    var that = this;
    // 新建百度地图对象 
    var BMap = new bmap.BMapWX({
      ak: ak
    });
    var fail = function (data) {
      console.log(data)
    };
    var success = function (data) {
      console.log(data);
      that.setData({
        currentWeather: data.currentWeather[0],
        prompt: data.originalData.results[0].index,
        originalData: data.originalData.results[0].weather_data
      });
    }
    // 发起weather请求 
    let location = '119.3,26.08'; // 默认是福州
    if (wx.getStorageSync('queryFlag') === 'fav') {
      //  收藏页面
      let select = wx.getStorageSync('select');
      if (select) {
        location = select.lng + ',' + select.lat;
      }
    } else if (wx.getStorageSync('queryFlag') === 'addr') {
      // 地址页面
      var history = wx.getStorageSync('history');
      location = history[0].lng + ',' + history[0].lat;
    }



    BMap.weather({
      fail: fail,
      location: location,
      success: success
    });
  },
  onPullDownRefresh: function () {
    this.setData({
      citys: []
    });


    var that = this;
    // 新建百度地图对象 
    var BMap = new bmap.BMapWX({
      ak: ak
    });
    var fail = function (data) {
      console.log(data)
    };
    var success = function (data) {
      that.setData({
        currentWeather: data.currentWeather[0],
        prompt: data.originalData.results[0].index,
        originalData: data.originalData.results[0].weather_data
      });
      wx.stopPullDownRefresh();
    }
    // 发起weather请求 
    let location = '119.3,26.08'; // 默认是福州
    if (wx.getStorageSync('queryFlag') === 'fav') {
      //  收藏页面
      let select = wx.getStorageSync('select');
      if (select) {
        location = select.lng + ',' + select.lat;
      }
    } else if (wx.getStorageSync('queryFlag') === 'addr') {
      // 地址页面
      var history = wx.getStorageSync('history');
      location = history[0].lng + ',' + history[0].lat;
    }
    BMap.weather({
      fail: fail,
      location: location,
      success: success
    });
  }
})