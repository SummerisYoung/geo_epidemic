import * as echarts from '../../ec-canvas/echarts';

const app = getApp();

Page({
  data: {
    ec: {
      lazyLoad: true // 延迟加载
    },
    confirmLists:[],
    dataLists:[],
    province:''//省份
  },
  onLoad(option){
    console.log(option)
    this.echartsComponnet = this.selectComponent('#mychart');

    let confirmLists = []
    let confirmList = {}
    let dataLists = JSON.parse(option.data)

    dataLists.forEach((value,index) => {
      console.log(value)
      if(option.province == '北京' || option.province == '天津' || option.province == '上海' 
      || option.province == '河南' || option.province == '湖南'){
        confirmList = {'name':value.name,'value':parseInt(value.conNum)};
      }
      else{
        confirmList = {'name':value.name + '市','value':parseInt(value.conNum)};
      }   
      confirmLists.push(confirmList)
    });

    this.setData({
      province:option.province,
      dataLists:dataLists,
      confirmLists:confirmLists
    })
    console.log(this.data)
    this.initmap(option.province);
  },
  initmap(province) {//初始化地图
    let geoJson = require('./asset/' + province)
    this.echartsComponnet.init((canvas, width, height)=>{
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      canvas.setChart(chart);
      echarts.registerMap(this.data.province, geoJson);
      chart.setOption(this.getOption());
      return chart;
    });
  },
  getOption(){//配置项
    console.log('wtf',this.data.confirmLists)
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
        mapType: this.data.province,
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
        data: this.data.confirmLists
      }],
    }
    return option
  }
});
