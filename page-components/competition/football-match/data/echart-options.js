export const LineChartOptions = options => {
  const opts = {
    // 设置标题
    title: {
      text: '排行走势图',
      textStyle: {
        color: '#333',
        fontSize: 14,
        fontFamily: 'PingFangSC-Medium',
        fontWeight: 'bold',
      },
      left: 14,
      top: 20,
    },

    // 设置线条颜色
    color: ['#007AFF', '#F95D22'],

    grid: { left: 45, width: 925, height: 395 },

    // Y 轴
    yAxis: {
      boundaryGap: false,
      // name: '排名',
      nameTextStyle: {
        fontFamily: 'PingFangSC-Regular',
        fontSize: 14,
        color: '#333',
      },
      z: 1,
      inverse: true,
      min: 1,
      nameLocation: 'start',
      data: [],
      axisTick: { show: false, inside: true },
      axisLabel: {
        fontFamily: 'PingFangSC-Regular',
        fontSize: 14,
        margin: 10,
        color: '#333',
      },
      axisLine: { lineStyle: { color: '#efefef' } },
      splitLine: {
        show: true,
        // interval: index => (index !== 19 ? true : false),
        lineStyle: { color: '#efefef', type: 'solid', opacity: 1, width: 1 },
      },
    },

    // X 轴
    xAxis: {
      axisPointer: {
        show: false,
      },
      nameTextStyle: {
        fontFamily: 'PingFangSC-Regular',
        fontSize: 14,
        color: '#333',
      },
      axisLine: { lineStyle: { color: '#efefef' } },
      // name: '轮次',
      nameLocation: 'end',
      type: 'category',
      boundaryGap: false,
      data: [],
      axisTick: { interval: 4, inside: true, show: false },
      splitLine: {
        show: true,
        lineStyle: { color: '#efefef', type: 'solid', opacity: 1, width: 1 },
      },
      splitArea: {
        show: true,
        areaStyle: { color: ['#fafbfc', '#fff'] },
      },
      axisLabel: {
        fontFamily: 'PingFangSC-Regular',
        fontSize: 14,
        margin: 10,
        show: true,
        color: value => {
          if (
            value === '3' ||
            value === '8' ||
            value === '13' ||
            value === '18' ||
            value === '23' ||
            value === '28' ||
            value === '33' ||
            value === '38'
          ) {
            return '#333'
          } else {
            return 'transparent'
          }
        },
      },
    },

    // 图例组件
    legend: {
      top: 13,
      type: 'plain',
      right: 24,
      itemGap: 10,
      itemWidth: 0,
      itemHeight: 0,
      inactiveColor: '#333',
      data: [
        {
          name: '主队',
          icon: 'none',
          textStyle: {
            color: '#007AFF',
            backgroundColor: 'rgba(0,122,255,0.10)',
            padding: [7, 30],
          },
        },
        {
          name: '客队',
          icon: 'none',
          textStyle: {
            color: '#F95D22',
            backgroundColor: 'rgba(249,93,34,0.10)',
            padding: [7, 30],
          },
        },
      ],
    },

    // 提示框组件
    tooltip: {
      show: true,
      trigger: 'item',
      padding: [3, 5],
      axisPointer: { type: 'none' },
      position: function(point, params, dom, rect, size) {
        return [
          rect.x + 6 - size.contentSize[0] / 2,
          rect.y - size.contentSize[1] - 11,
        ]
      },
      textStyle: {
        fontFamily: 'PingFangSC-Regular',
        fontSize: 12,
        color: '#fff',
      },
      renderMode: 'html',
      // 设置内容格式
      formatter: params => {
        const value = params.value
        const index = params.dataIndex
        const home = opts.series[0].data
        const guest = opts.series[1].data

        if (params.color === '#F95D22') {
          if (home[index] && home[index].value === value) {
            return `<div style="position: relative;">排名第 ${params.value}
                        <p style="z-index: -1; width: 8px; height: 8px; background-color: #F95D22; position: absolute;
                        top: 17px; left: 50%; transform: translateX(-4.5px) rotateZ(45deg);
                        border-right: 1px #007aff solid; border-bottom: 1px #007aff solid;" />
                    </div>`
          } else {
            return `<div style="position: relative;">排名第 ${params.value}
                 <p style="z-index: -1; width: 10px; height: 10px; background-color: #F95D22; position: absolute;
                 top: 15px; left: 50%; transform: translateX(-4.5px) rotateZ(45deg)"></p>
                </div>`
          }
        } else if (params.color === '#007AFF') {
          if (guest[index] && guest[index].value === value) {
            return `<div style="position: relative;">排名第 ${params.value}
                        <p style="z-index: -1; width: 8px; height: 8px; background-color: #F95D22; position: absolute;
                        top: 17px; left: 50%; transform: translateX(-4.5px) rotateZ(45deg);
                        border-right: 1px #007aff solid; border-bottom: 1px #007aff solid;" />
                    </div>`
          } else {
            return `<div style="position: relative;">排名第 ${params.value}
                 <p style="z-index: -1; width: 10px; height: 10px; background-color: #007aff; position: absolute;
                 top: 15px; left: 50%; transform: translateX(-4.5px) rotateZ(45deg)"></p>
                </div>`
          }
        }
      },
    },

    // 表格数据
    series: [
      {
        name: '主队',
        type: 'line',
        data: [],
        symbolSize: 8,
        emphasis: {
          itemStyle: {
            borderColor: '#fff',
            shadowColor: 'rgba(51,51,51,0.30)',
            shadowBlur: 4,
            borderWidth: 1,
            shadowOffsetY: 2,
          },
        },
        itemStyle: { borderWidth: 2 },
        hoverAnimation: true,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(0,122,255,0.20)', // 0% 处的颜色
              },
              {
                offset: 0.7,
                color: 'rgba(0,122,255,0.10)', // 0% 处的颜色
              },
              {
                offset: 1,
                color: 'transparent', // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
          origin: 'end',
        },
        tooltip: {
          backgroundColor: '#007aff',
        },
      },

      {
        tooltip: {
          backgroundColor: '#F95D22',
        },
        name: '客队',
        data: [],
        emphasis: {
          itemStyle: {
            borderColor: '#fff',
            shadowColor: 'rgba(51,51,51,0.30)',
            shadowBlur: 4,
            borderWidth: 1,
            shadowOffsetY: 2,
          },
        },
        symbolSize: 8,
        itemStyle: { borderWidth: 2 },
        hoverAnimation: true,
        type: 'line',
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(249,93,34,0.20)', // 0% 处的颜色
              },
              {
                offset: 0.7,
                color: 'rgba(249,93,34,0.10)', // 0% 处的颜色
              },
              {
                offset: 1,
                color: 'transparent', // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
          origin: 'end',
        },
      },
    ],
    ...options,
  }

  return opts
}

export const RadarChartOptions = options => ({
  // 主客队颜色
  color: ['#F95D22', '#007AFF'],

  title: {
    text: '球队对比',
    textStyle: {
      color: '#333',
      fontSize: 14,
      fontFamily: 'PingFangSC-Medium',
      fontWeight: 'bold',
    },
    left: 14,
    top: 11,
  },

  legend: {
    selectedMode: false,
    data: [
      {
        name: '客队',
        // icon: 'roundRect',
        icon:
          'path://M115.885838 115.885838m57.942919 0l173.828756 0q57.942919 0 57.942919 57.942919l0 173.828756q0 57.942919-57.942919 57.942919l-173.828756 0q-57.942919 0-57.942919-57.942919l0-173.828756q0-57.942919 57.942919-57.942919Z',
        textStyle: {
          color: '#333',
          fontSize: 12,
          fontFamily: 'PingFangSC-Regular',
        },
      },
      {
        name: '主队',
        // icon: 'roundRect',
        icon:
          'path://M115.885838 115.885838m57.942919 0l173.828756 0q57.942919 0 57.942919 57.942919l0 173.828756q0 57.942919-57.942919 57.942919l-173.828756 0q-57.942919 0-57.942919-57.942919l0-173.828756q0-57.942919 57.942919-57.942919Z',
        textStyle: {
          color: '#333',
          fontSize: 12,
          fontFamily: 'PingFangSC-Regular',
        },
      },
    ],
    left: 40,
    top: 62,
    itemGap: 12,
    itemWidth: 10,
    itemHeight: 10,
  },

  radar: {
    // 雷达指标及其值
    indicator: [
      { name: '状态', max: 10000, color: '#333' },
      { name: '攻击', max: 10000, color: '#333' },
      { name: '角球', max: 10000, color: '#333' },
      { name: '身价', max: 10000, color: '#333' },
      { name: '防守', max: 10000, color: '#333' },
    ],

    // 雷达图的位置
    center: ['59%', '53%'],

    // 雷达图大小显示比例
    radius: '55%',

    // 旋转角度
    startAngle: 90,

    // 雷达图层级数
    splitNumber: 5,

    // 设置雷达指示器
    name: {
      show: false,
    },
    nameGap: 10,

    // 每层的颜色
    splitArea: {
      areaStyle: {
        color: ['#f5f5f5', '#fff'],
      },
    },

    splitLine: {
      lineStyle: { width: 0.5, color: '#e2e1e0' },
    },

    // 坐标线设置
    axisLine: {
      lineStyle: {
        color: 'e2e1e1',
        width: 0.5,
      },
    },
  },

  // 主客队数据设置
  series: [
    {
      type: 'radar',
      data: [],
      silent: true,
    },

    {
      type: 'radar',
      data: [],
      silent: true,
    },
  ],
  ...options,
})
