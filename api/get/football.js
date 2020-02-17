export default {
  fetchEventList: '/event/list',
  fetchTeamInfo: '/team/info',
  fetchMatchList: '/match/list',
  fetchSeasonList: '/season/list',
  fetchTeamLineup: '/team/lineup',
  fetchInfoOfLeague: '/event/info',
  fetchHotTeamList: '/web/team/hotList',
  fetchCountryList: '/area/areaCountryList',
  fetchEventTeams: '/web/event/eventTeams',
  fetchMatchScoreboard: '/web/match/scoreboard',
  fetchCountryEventList: '/event/areaCountryEvents',
  fetchMarketCompanyList: '/web/market/companyList',
  fetchScoreboard: '/season/scoreboard',
  fetchLiveUrl: '/match/getLiveUrl',
  fetchOddAhList: '/match/getAh',
  fetchOddOuList: '/match/getOu',
  fetchMatchLineup: '/match/lineup',
  fetchOddHdaList: '/match/getHda',
  fetchMatchStat: '/match/matchStat',
  fetchMatchInfo: '/match/getMatchInfo',
  fetchOddCompanyList: '/company/getList',
  fetchSeasonMatches: '/season/matchList',
  fetchOddAhHistory: '/match/getAhHistory',
  fetchOddOuHistory: '/match/getOuHistory',
  fetchOddHdaHistory: '/match/getHdaHistory',

  // 折线图数据获取（主客球队当前赛季排名走势）
  fetchTeamLineTend: '/web/team/rankTrend',
  // 进球分布表格
  fetchMatchScoreTab: '/web/team/goalTime',
  // 场均进球数
  fetchMatchTeamGoalAvg: '/web/team/goalAvg',
  // 雷达图数据获取
  fetchMatchRadarTend: '/web/match/radar',
  // 情报页面各种球队相关情报
  fetchIntelligenceOfTeam: '/match/reportInfo',
  // 资料库 → 基础数据：比分分布 （赛季比分分布）
  fetchScoreDistributionOfSeason: '/season/scoreTimes',
  // 资料库 → 基础数据：胜平负分布
  fetchResultOfRaceOfFootball: '/season/winLose',
  // 资料库 → 基础数据：赛季场均进球
  fetchAvgGoalOfSeason: '/season/avgGoals',
  // 资料库 → 基础数据：特殊数据
  fetchSpecialDataOfSeason: '/season/specialData',
  // 资料库 → 积分榜
  fetchIntegralOfTeam: '/season/scoreboard',
  // 资料库 → 射手榜
  fetchShootOfSeason: '/season/shooter',
  // 情报页面球队赔率表格
  fetchSameOdds: '/web/match/getMatchesWithSameOdd',
}
