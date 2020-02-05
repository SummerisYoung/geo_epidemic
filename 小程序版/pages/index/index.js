import * as echarts from '../../ec-canvas/echarts';
import geoJson from './china.js';
//阿里云地图来源:http://datav.aliyun.com/tools/atlas/
const app = getApp();

Page({
  data: {
    ec: {
      lazyLoad: true // 延迟加载
    },
    confirmLists:[],
    dataLists:[]
  },
  onLoad(){
    this.echartsComponnet = this.selectComponent('#mychart');
    this.getData();
  },
  getData(){//获取数据
    let that = this
    let confirmLists = that.data.confirmLists
    let confirmList = {}
    wx.request({
      url:'https://interface.sina.cn/news/wap/fymap2020_data.d.json',
      success(res){
        console.log(res.data.data)
        that.setData({
          dataLists:res.data.data.list
        })
        that.data.dataLists.forEach((value,index) => {
          confirmList = {'name':value.name,'value':parseInt(value.value)}
          confirmLists.push(confirmList)
        });
        that.setData({confirmLists})
        that.initmap()
      }
    })
  },
  initmap() {//初始化地图
    this.echartsComponnet.init((canvas, width, height)=>{
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      canvas.setChart(chart);
      echarts.registerMap('china', geoJson);
      chart.setOption(this.getOption(this.data.confirmLists));
      chart.on('click',(param)=>{
        let selectedProvince = param.name;
        this.data.dataLists.forEach((value,index)=>{
          if(selectedProvince == value.name){
            console.log(value)
            wx.navigateTo({
              url: '../province/index?province=' + selectedProvince + '&data=' + JSON.stringify(value.city)
            });
          }
        })
      })
      return chart;
    });
  },
  getOption(showData){//配置项
    const option = {
      tooltip: {
        trigger: 'item'
      },
      visualMap: {
        type: 'piecewise',
        pieces:[
          {'min':1000,'color':'#880000'},
          {'min':500,'max':1000,'color':'#CC0000'},
          {'min':100,'max':499,'color':'#FF3333'},
          {'min':10,'max':99,'color':'#FF7744'},
          {'min':1,'max':9,'color':'#FFC8B4'},
          {'max':1,'color':'#FFFFFF'}
        ],
        left: 'left',
        top: 'bottom',
        calculable: true
      },
      series: [{
        type: 'map',
        mapType: 'china',
        label: {
          normal: {
            show: true
          },
          emphasis: {
            textStyle: {
              color: '#fff'
            }
          }
        },
        itemStyle: {
          normal: {
            borderColor: '#389BB7',
            areaColor: '#fff',
          },
          emphasis: {
            areaColor: '#389BB7',
            borderWidth: 0
          }
        },
        animation: false,
        data: showData
      }],
    }
    return option
  }
});
