export default {
  fetchMatchList: '/basketball_match/list',
  fetchMatchAh: '/basketball_match/getAh',
  fetchMatchAhHistory: '/basketball_match/getAhHistory',
  fetchMatchHda: '/basketball_match/getHda',
  fetchMatchHdaHistory: '/basketball_match/getHdaHistory',
  fetchMatchOu: '/basketball_match/getOu',
  fetchMatchOuHistory: '/basketball_match/getOuHistory',
  fetchMatchScoreboard: '/web/match/basketballScoreboard',

  fetchSeasonList: '/basketball_season/list',
  fetchEventList: '/basketball_event/list',
  fetchCountryEventList: '/basketball_event/areaCountryEvents',
  fetchCountryList: '/basketball_area/areaCountryList',

  // 篮球球队阵容(技术统计)
  fetchBasketballTeamSquare: '/basketball_match/matchstat',

  // 篮球比赛视频链接
  fetchBasketballVideoURL: '/basketball_match/getLiveUrl',

  // 资料库 → 篮球-赛程
  fetchBasketballMatch: '/basketball_season/matchlist',

  // 篮球球队阵容
  fetchTeamLineup: '/basketball_team/lineup',

  // 篮球球队信息
  fetchTeamInfo: '/basketball_team/info',

  fetchSeasonScoreTime: '/basketball_season/scoreTimes',
  fetchSeasonWinLose: '/basketball_season/winlose',
  fetchEventInfo: '/basketball_event/info',
}
