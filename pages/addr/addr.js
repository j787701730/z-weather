// pages/addr.js

var bmap = require('../../lib/bmap-wx.min.js');
var {
  citys,
  ak
} = require('../../utils/config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    citys: [],
    toView: 'inToView01'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      citys: citys
    })
  },
  getLL: function (addr) {
    wx.request({
      url: 'https://api.map.baidu.com/geocoder/v2/?address=' + addr + '&output=json&ak=' + ak,
      data: {},
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {

        if (res.statusCode == 200) {
          // console.log(res.data.result.location);
          var loc = res.data.result.location;
          // lng 经度 lat 纬度
          if (wx.getStorageSync('history')) {
            var history = wx.getStorageSync('history');
            var obj = {
              name: addr,
              lng: loc.lng,
              lat: loc.lat
            };
            var arr = [obj];
            var count = 0;
            for (let i = 0; i < history.length; i++) {
              if (history[i].name !== arr[0].name) {
                arr.push(history[i]);
                count++;
              }
              if (count === 9) {
                break;
              }
            }
            wx.setStorageSync('history', arr);
          } else {
            var obj = {
              name: addr,
              lng: loc.lng,
              lat: loc.lat
            };
            wx.setStorageSync('history', [obj]);
          }
          wx.setStorageSync('queryFlag', 'addr');
          wx.switchTab({
            url: '../../pages/index/index'
          });
        }
      }
    })
  },
  scrollToViewFn: function (e) {
    var _id = e.target.dataset.id;
    this.setData({
      toView: 'inToView' + _id
    })
    console.log(this.data.toView)
  },
  fetchCity: function (e) {
    // 筛选city
    var val = e.detail.value;
    if (val == '') {
      this.setData({
        citys: citys
      })
    } else {
      var arr = [];
      for (let i = 0, len = citys.length; i < len; i++) {
        if (val.toUpperCase() === citys[i].py) {
          arr.push(citys[i]);
        } else {
          var obj = {
            py: citys[i].py,
            data: []
          };
          for (let j = 0; j < citys[i].data.length; j++) {
            if (val.toLowerCase() == citys[i].data[j].pinyin.toLowerCase() || citys[i].data[j].name.indexOf(val) > -1) {
              obj.data.push(citys[i].data[j]);
            }
          }
          if (obj.data.length) {
            arr.push(obj);
          }
        }
      }
      this.setData({
        citys: arr
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  selectCity: function (e) {
    this.getLL(e.target.dataset.name);
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})