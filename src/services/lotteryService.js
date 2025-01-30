import axios from 'axios';

const LOTTERY_RESULT_API = '/callback/MDMxNGMyYzhkYTBhOTczZTk4Yjc1NGQxM2ZkZWQwOTUw';

// 获取预设的抽奖结果
export async function fetchLotteryResult(num, prizeName) {
  try {
    const headers = {
      'Accept': '*/*',
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      'Content-Type': 'application/json'
    };
    
    // 构建带参数的URL
    const url = `${LOTTERY_RESULT_API}?num=${num}&prize_name=${encodeURIComponent(prizeName)}`;
    
    const response = await axios.post(url, {}, { headers });
    
    // 转换中奖用户数据格式
    const formattedWinners = response.data.map((item, index) => {
      const userInfo = item.fields.签到人员[0];
      return {
        id: userInfo.id,
        name: userInfo.name,
        avatar: userInfo.avatar_url,
        index: index,
        number: item.fields.编号,
        prize: item.fields.获奖信息 || prizeName  // 如果获奖信息为null，使用当前奖品名称
      };
    });

    // 缓存转换后的抽奖结果
    localStorage.setItem('lottery-result', JSON.stringify(formattedWinners));
    return formattedWinners;
  } catch (error) {
    console.error('获取抽奖结果失败:', error);
    return null;
  }
} 