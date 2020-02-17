import Echarts from 'echarts'

export const LEN_CHART_OPTIONS = () => ({
  tooltip: {
    show: true,
    trigger: 'item',
    padding: [1, 5],
    axisPointer: { type: 'none' },
    position(point, params, dom, rect, size) {
      return [
        rect.x + 8 - size.contentSize[0] / 2,
        rect.y - size.contentSize[1] - 7,
      ]
    },
    textStyle: {
      fontFamily: 'PingFangSC-Regular',
      fontSize: 12,
      color: '#fff',
    },
    backgroundColor: '#36C0FF',
    renderMode: 'html',
    formatter: params => {
      return `<div style="position: relative;">${params.value}
                    <i style="
                      z-index: 1;
                      width: 0;
                      height: 0;
                      border-left: 5px solid transparent;
                      border-right: 5px solid transparent;
                      border-top: 5px solid #36C0FF;
                      position: absolute;
                      top: 100%;
                      left: 50%;
                      transform: translateX(-50%);"></i>
                  </div>`
    },
  },
  xAxis: {
    data: [],
    axisTick: {
      show: false,
    },
    axisLine: {
      lineStyle: {
        color: '#efefef',
      },
    },
    axisLabel: {
      textStyle: {
        color: '#333',
      },
    },
  },
  grid: {
    show: false,
    right: '5%',
    left: '5%',
    top: '10%',
  },
  yAxis: {
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
    axisLabel: {
      textStyle: {
        color: '#333',
      },
    },
    splitLine: {
      lineStyle: {
        color: '#efefef',
      },
    },
  },
  series: [
    {
      type: 'bar',
      barMaxWidth: 16,
      itemStyle: {
        normal: {
          color: new Echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#36c0ff' },
            { offset: 1, color: '#198cff' },
          ]),
        },
        emphasis: {
          color: new Echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#36c0ff' },
            { offset: 1, color: '#198cff' },
          ]),
        },
      },
      data: [],
    },
  ],
})

export const PIE_CHART_OPTIONS = () => ({
  textStyle: {
    color: '#333',
    fontSize: 11,
    fontFamily: 'PingFangSC-Regular',
  },

  legend: {
    selectedMode: false,
    left: '39%',
    bottom: 0,
    itemGap: 12,
    itemWidth: 10,
    itemHeight: 10,
    data: [
      { name: '胜', icon: 'rect' },
      { name: '负', icon: 'rect' },
    ],
  },

  series: [
    {
      cursor: 'auto',
      center: ['45%', '50%'],
      hoverAnimation: false,
      radius: ['32%', '50%'],
      type: 'pie',
      label: {
        show: false,
      },
      itemStyle: { borderWidth: 2, borderColor: '#fff' },
      labelLine: {
        show: false,
      },
      data: [
        {
          name: '负',
          value: 0,
          itemStyle: { color: '#00A54F' },
          emphasis: { itemStyle: { color: '#00A54F' } },
        },
        {
          name: '胜',
          value: 0,
          itemStyle: { color: '#E1243B' },
          emphasis: { itemStyle: { color: '#E1243B' } },
        },
      ],
    },

    {
      cursor: 'auto',
      center: ['45%', '50%'],
      radius: ['50.5%', '68%'],
      hoverAnimation: false,
      type: 'pie',
      itemStyle: { borderWidth: 2, borderColor: '#fff' },
      label: {
        formatter: '{b|{b}}  \n {per|{d}%}',
        rich: {
          b: {
            align: 'center',
            padding: [2, 0],
          },
          per: {
            align: 'center',
            padding: [2, 0],
          },
        },
      },
      labelLine: {
        show: true,
        length: 20,
        length2: 50,
        lineStyle: { width: 2, color: '#efefef' },
        emphasis: { show: true, lineStyle: { width: 2, color: '#efefef' } },
      },
      data: [
        {
          name: '负',
          value: 0,
          itemStyle: { color: 'rgb(197,234,215)' },
          emphasis: { itemStyle: { color: 'rgb(197,234,215)' } },
        },
        {
          name: '胜',
          value: 0,
          itemStyle: { color: 'rgb(252,234,237)' },
          emphasis: { itemStyle: { color: 'rgb(252,234,237)' } },
        },
      ],
    },
  ],
})
