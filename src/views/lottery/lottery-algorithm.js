import lotteryConfig from './lottery-config.js';

const random = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

const getRandomCard = function(currentPrize) {
  // 从缓存中获取预设的中奖结果
  const selectCardList = JSON.parse(localStorage.getItem('lottery-result') || '[]');
  console.log('selectCardList :', selectCardList);

  // 获取到结果后立即删除缓存
  if (selectCardList.length > 0) {
    localStorage.removeItem('lottery-result');
  } else {
    // 如果没有缓存结果，使用原有的随机逻辑
    const cardListRemainAllCopy = JSON.parse(JSON.stringify(lotteryConfig.cardListRemainAll));
    const selectCount = currentPrize.countRemain < currentPrize.everyTimeGet ? currentPrize.countRemain : currentPrize.everyTimeGet;

    for (let i = 0; i < selectCount; i++) {
      const curSelectIndex = random(0, cardListRemainAllCopy.length - 1);
      const card = cardListRemainAllCopy.splice(curSelectIndex, 1)[0];
      selectCardList.push(card);
    }
  }

  console.log('getRandomCard', JSON.parse(JSON.stringify(lotteryConfig)));

  // 以下保持原有的状态更新逻辑不变
  lotteryConfig.cardListWinAll = [...lotteryConfig.cardListWinAll, ...selectCardList];
  lotteryConfig.cardListRemainAll = lotteryConfig.cardList.filter((item) => {
    const winItem = lotteryConfig.cardListWinAll.find(_ => _.id === item.id);
    return !winItem;
  });

  currentPrize.cardListWin = [...currentPrize.cardListWin, ...selectCardList];
  currentPrize.countRemain = currentPrize.countRemain - selectCardList.length;
  currentPrize.round += 1;

  lotteryConfig.setLocalStorage();
  return selectCardList;
}

export { getRandomCard }
