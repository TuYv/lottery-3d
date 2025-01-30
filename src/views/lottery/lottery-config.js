import { getCardList, colCount } from './lottery-config-users.js';
import { reinit } from './3d.js';
import { fetchPrizes } from '../../services/userService.js';

const cardUserList = getCardList();
const rowCount = Math.ceil(cardUserList.length / colCount);

const defaultPrize = {
  id: 'loading',
  name: '加载中...',
  detail: '正在加载奖品信息',
  img: '',
  count: 0,
  countRemain: 0,
  everyTimeGet: 0,
  round: 0,
  cardListWin: []
};

const lotteryConfig = {
  prizeList: [defaultPrize], // 添加一个默认奖品
  headerTitle: '【产研】2025年度晚会',
  currentPrize: null, // 当前抽奖的奖品
  colCount,
  rowCount,
  cardList: cardUserList,
  cardListWinAll: [],
  cardListRemainAll: cardUserList,
  loading: true // 添加加载状态标志
};

// 项目启动时获取一次奖品数据
fetchPrizes().then(prizes => {
  if (prizes) {
    lotteryConfig.prizeList = prizes;
    console.log('prizeList:', lotteryConfig.prizeList);
    lotteryConfig.loading = false;
  }
}).catch(error => {
  console.error('获取奖品数据失败:', error);
  lotteryConfig.loading = false;
});

// 添加事件监听，当用户数据更新时刷新列表
window.addEventListener('usersUpdated', () => {
  console.log('检测到用户数据更新');
  const newCardUserList = getCardList();
  
  // 更新抽奖配置中的用户列表
  lotteryConfig.cardList = newCardUserList;
  lotteryConfig.cardListRemainAll = newCardUserList.filter(user => {
    return !lotteryConfig.cardListWinAll.find(winner => winner.id === user.id);
  });
  
  // 更新行数
  lotteryConfig.rowCount = Math.ceil(newCardUserList.length / colCount);
  
  // 重新初始化3D卡片
  reinit();
});

lotteryConfig.getCurrentPrize = (prizeId = lotteryConfig.currentPrize) => {
  return lotteryConfig.prizeList.find(_ => {
    return _.id === prizeId;
  });
};
lotteryConfig.getUserById = (id) => {
  return lotteryConfig.cardList.find(_ => _.id === id);
}

let isInit = false;
const localStorageKey = '___lottery___';
lotteryConfig.setLocalStorage = () => {
  const _lotteryConfig = lotteryConfig;
  _lotteryConfig.headerTitle = lotteryConfig.headerTitle;
  _lotteryConfig.currentPrize = lotteryConfig.currentPrize;
  _lotteryConfig.prizeList = lotteryConfig.prizeList;
  _lotteryConfig.cardListWinAll = lotteryConfig.cardListWinAll;
  _lotteryConfig.cardListRemainAll = lotteryConfig.cardListRemainAll;
  localStorage.setItem(localStorageKey, JSON.stringify(_lotteryConfig));
}
lotteryConfig.getLocalStorage = () => {
  if (isInit !== false) {
    return void 0;
  }
  isInit = true;
  const _lotteryConfigString = localStorage.getItem(localStorageKey);
  if (!_lotteryConfigString) {
    return void 0;
  }
  let _lotteryConfig = null;
  try {
    // TODO 数据有效性判断
    _lotteryConfig = JSON.parse(_lotteryConfigString)
  } catch (e) {
    console.log(e);
  }
  lotteryConfig.headerTitle = _lotteryConfig.headerTitle && _lotteryConfig.headerTitle;
  lotteryConfig.currentPrize = _lotteryConfig.currentPrize && _lotteryConfig.currentPrize;
  lotteryConfig.prizeList = _lotteryConfig.prizeList && _lotteryConfig.prizeList;
  lotteryConfig.cardListWinAll = _lotteryConfig.cardListWinAll && _lotteryConfig.cardListWinAll;
  lotteryConfig.cardListRemainAll = _lotteryConfig.cardListRemainAll && _lotteryConfig.cardListRemainAll;
}
lotteryConfig.clearLocalStorage = () => {
  localStorage.removeItem(localStorageKey)
}
console.log('lotteryConfig', lotteryConfig);
export default lotteryConfig;
