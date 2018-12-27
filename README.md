### 参考：
http://blog.leanote.com/post/nixon/%E6%8F%92%E4%BB%B6%E5%BC%80%E5%8F%91

### 数据源选择：（数据源与api二选一）

#### 目前只支持prometheus:

​	Data Source:  Prometheus

​	查询语句: ip_location_count 

#### 使用api请求数据：

​	URL: http://140.143.167.11:9090/api/v1/query?query=ip_location_count

​	请求：GET

​	间隔：60000 ms

#### 使用假数据

```javascript
[
    {name:"北京",value:177},
    {name:"天津",value:42},
    {name:"河北",value:102},
    {name:"山西",value:81},
    {name:"内蒙古",value:47},
    {name:"辽宁",value:67},
    {name:"吉林",value:82},
    {name:"黑龙江",value:66},
    {name:"上海",value:24},
    {name:"江苏",value:92},
    {name:"浙江",value:114},
    {name:"安徽",value:109},
    {name:"福建",value:116},
    {name:"江西",value:91},
    {name:"山东",value:119},
    {name:"河南",value:137},
    {name:"湖北",value:116},
    {name:"湖南",value:114},
    {name:"重庆",value:91},
    {name:"四川",value:125},
    {name:"贵州",value:62},
    {name:"云南",value:83},
    {name:"西藏",value:9},
    {name:"陕西",value:80},
    {name:"甘肃",value:56},
    {name:"青海",value:10},
    {name:"宁夏",value:18},
    {name:"新疆",value:67},
    {name:"广东",value:123},
    {name:"广西",value:59},
    {name:"海南",value:14}
]
```



#### echarts配置：

```javascript
    option = {
        tooltip : {  
            trigger: 'item'  
        },  
        
        visualMap: {
            show: true,
            min: 0,
            max: 200,
            left: 'left',
            top: 'bottom',
            calculable: true,
            seriesIndex: [1],
            inRange: {
                color: ['#A5CC82', '#00467F']
            },
            textStyle: {
                color: '#fff'
            }

        },

        geo: {
            show: true,
            map: 'china',
            zoom: 1.2,
            label: {
                normal: {
                    show: false
                },
                emphasis: {
                    show: false
                }
                },
            roam: true,
            itemStyle: {
                normal: {
                    areaColor: '#fff',
                    borderColor: '#3B5077' 
                },
                emphasis: {
                    areaColor: 'lightgreen'
                }
            }
        },

        series: [{
                type: 'scatter',
                coordinateSystem: 'geo',
                symbolSize: function(val) {
                    return 0.1;
                },
                itemStyle: {
                    normal: {
                        color: '#05C3F9'
                    }
                }
            },
            {
                name: '数据',
                type: 'map',
                map: 'china',
                geoIndex: 0,
                aspectScale: 0.75, 
                showLegendSymbol: false, 
                label: {
                    normal: {
                        show: false
                    },
                    emphasis: {
                        show: false,
                        textStyle: {
                            color: 'red'
                        }
                    }
                },
                roam: true,
                itemStyle: {
                    normal: {
                        areaColor: '#fff',
                        borderColor: '#3B5077',
                    },
                    emphasis: {
                        areaColor: '#2B91B7'
                    }
                },
                animation: false,
                data: data
            }
        ]
    };
```

#### 效果图如下

访问http://140.143.167.11:3000  user:guest  password:guest

![image-20181227135211415](/Users/xiejia/Library/Application Support/typora-user-images/image-20181227135211415.png)


