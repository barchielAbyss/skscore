import Echarts from 'echarts'

export const optionsPie = () => ({
  textStyle: {
    color: '#333',
    fontSize: 11,
    fontFamily: 'PingFangSC-Regular',
  },

  legend: {
    selectedMode: false,
    left: '35.5%',
    bottom: 0,
    itemGap: 12,
    itemWidth: 10,
    itemHeight: 10,
    data: [
      { name: '胜', icon: 'rect' },
      { name: '平', icon: 'rect' },
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
          name: '平',
          value: 0,
          itemStyle: { color: '#808290' },
          emphasis: { itemStyle: { color: '#808290' } },
        },
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
          name: '平',
          value: 0,
          itemStyle: { color: 'rgb(226,226,230)' },
          emphasis: { itemStyle: { color: 'rgb(226,226,230)' } },
        },
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

export const optionsBarSeason = () => ({
  textStyle: {
    color: '#333',
    fontSize: 11,
    fontFamily: 'PingFangSC-Regular',
  },

  grid: {
    left: 16,
    right: 16,
    bottom: '0%',
    top: 34,
    containLabel: true,
  },

  xAxis: {
    type: 'value',
    axisLine: {
      show: true,
      lineStyle: { color: '#e6e6e5' },
    },
    axisLabel: { margin: 10 },
    axisTick: {
      show: false,
    },
    splitLine: { show: true, lineStyle: { color: '#e6e6e5' } },
  },

  yAxis: {
    type: 'category',
    axisLabel: { margin: 18 },
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
    data: ['客队', '主队', '场均'],
  },

  series: [
    {
      cursor: 'auto',
      type: 'bar',
      itemStyle: {
        normal: { color: '#E8ECF1' },
      },
      barGap: '-100%',
      silent: true,
      barWidth: 16,
      data: [{ value: 0 }, { value: 0 }, { value: 0 }],
      animation: false,
    },

    {
      cursor: 'auto',
      type: 'bar',
      barWidth: 16,
      silent: true,
      data: [
        {
          name: '客队',
          value: 0,
          itemStyle: {
            color: new Echarts.graphic.LinearGradient(1, 0, 0, 0, [
              { offset: 0, color: '#F76B1C' },
              { offset: 1, color: '#E1243B' },
            ]),
          },
        },
        {
          name: '主队',
          value: 0,
          itemStyle: {
            color: new Echarts.graphic.LinearGradient(1, 0, 0, 0, [
              { offset: 0, color: '#36C0FF' },
              { offset: 1, color: '#198CFF' },
            ]),
          },
        },
        {
          name: '场均',
          value: 0,
          itemStyle: {
            color: new Echarts.graphic.LinearGradient(1, 0, 0, 0, [
              { offset: 0, color: '#00B6EB' },
              { offset: 1, color: '#4A37FF' },
            ]),
          },
        },
      ],
    },
  ],
})

export const optionsBarSpecial = () => ({
  textStyle: {
    color: '#333',
    fontSize: 11,
    fontFamily: 'PingFangSC-Regular',
  },

  grid: {
    left: 16,
    right: 16,
    bottom: '0%',
    top: 34,
    containLabel: true,
  },

  xAxis: {
    type: 'value',
    axisLine: {
      show: true,
      lineStyle: { color: '#e6e6e5' },
    },
    axisLabel: { margin: 10 },
    axisTick: {
      show: false,
    },
    splitLine: { show: true, lineStyle: { color: '#e6e6e5' } },
  },

  yAxis: {
    type: 'category',
    axisLabel: { margin: 18 },
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
    data: ['爆冷', '逆转', '绝杀'],
  },

  series: [
    {
      cursor: 'auto',
      type: 'bar',
      itemStyle: {
        normal: { color: '#E8ECF1' },
      },
      barGap: '-100%',
      silent: true,
      barWidth: 16,
      data: [{ value: 0 }, { value: 0 }, { value: 0 }],
      animation: false,
    },

    {
      cursor: 'auto',
      type: 'bar',
      barWidth: 16,
      silent: true,
      data: [
        {
          name: '爆冷',
          value: 0,
          itemStyle: {
            color: new Echarts.graphic.LinearGradient(1, 0, 0, 0, [
              { offset: 0, color: '#F76B1C' },
              { offset: 1, color: '#E1243B' },
            ]),
          },
        },
        {
          name: '逆转',
          value: 0,
          itemStyle: {
            color: new Echarts.graphic.LinearGradient(1, 0, 0, 0, [
              { offset: 0, color: '#36C0FF' },
              { offset: 1, color: '#198CFF' },
            ]),
          },
        },
        {
          name: '绝杀',
          value: 0,
          itemStyle: {
            color: new Echarts.graphic.LinearGradient(1, 0, 0, 0, [
              { offset: 0, color: '#00B6EB' },
              { offset: 1, color: '#4A37FF' },
            ]),
          },
        },
      ],
    },
  ],
})
