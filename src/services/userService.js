import axios from 'axios';

// 配置接口地址
// const API_URL = 'https://open.feishu.cn/anycross/trigger/callback/MDM1NDVmZjYzOGQ4OTA1MDBhNGFmY2ZkZjQ5OGQ2NjYz'; // 需要替换为实际的API地址
const API_URL = '/anycross/trigger/callback/MDM1NDVmZjYzOGQ4OTA1MDBhNGFmY2ZkZjQ5OGQ2NjYz';
const PRIZE_API_URL = '/anycross/trigger/callback/NDFjMGZmZmExOGJhMGNjMTEzMTQ4ZDJiZWQ5NjU4Mzcw';


// 获取奖品数据
async function fetchPrizes() {
    try {
      const headers = {
        'Accept': '*/*',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'Content-Type': 'application/json'
      };
      
      const response = await axios.post(PRIZE_API_URL, {}, { headers });
      const { prizes } = response.data;
      
      // 处理奖品数据
      const formattedPrizes = prizes.map(prize => ({
        id: prize.fields.奖品名称,
        name: prize.fields.奖品名称,
        detail: prize.fields.奖品名称,
        img: prize.fields.奖品图片地址 || '',
        count: prize.fields.奖品数量, // 默认数量，根据实际需求调整
        countRemain: prize.fields.奖品数量,
        everyTimeGet: prize.fields.每次抽取数量,
        round: 0,
        cardListWin: []
      }));
  
      // 更新奖品配置
      const currentConfig = localStorage.getItem('___lottery___');
      const config = currentConfig ? JSON.parse(currentConfig) : {};
      console.log('获取奖品时config', config);
      
      // 保留已有的中奖记录
      if (config.prizeList) {
        formattedPrizes.forEach(prize => {
          const existingPrize = config.prizeList.find(p => p.id === prize.id);
          if (existingPrize) {
            prize.cardListWin = existingPrize.cardListWin;
            prize.countRemain = existingPrize.countRemain;
            prize.round = existingPrize.round;
          }
        });
      }
      
      config.prizeList = formattedPrizes;
      localStorage.setItem('___lottery___', JSON.stringify(config));
      
      return formattedPrizes;
    } catch (error) {
      console.error('获取奖品数据失败:', error);
      return null;
    }
  }
  
// 获取用户数据
async function fetchUsers() {
  try {
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
      'Accept': '*/*',
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      'Content-Type': 'application/json'
    };
    const response = await axios.post(API_URL, {}, { headers });
    const { user } = response.data;
    
    // 转换数据格式
    const convertedUsers = convertUserData(user);
    
    if (!convertedUsers) {
      throw new Error('数据转换失败');
    }
    
    console.log('转换后的用户数据:', convertedUsers);
    if (convertUserData) {
        localStorage.setItem('lottery-config-users', JSON.stringify(convertedUsers));
        window.dispatchEvent(new CustomEvent('usersUpdated'));
    }
  } catch (error) {
    console.error('获取用户数据失败:', error);
    return null;
  }
}

// 转换飞书用户数据格式为本地格式
function convertUserData(feishuUsers) {
    if (!feishuUsers) {
      console.warn('飞书用户数据格式无效');
      return null;
    }
  
    return feishuUsers.map(user => {
      const feishuUser = user.fields.签到人员[0];
      return {
        name: feishuUser.name,
        id: feishuUser.id,
        sex: 'male', // 默认性别为male
        avatar: feishuUser.avatar_url || '' // 如果没有头像则设为空字符串
      };
    });
  }

  // 转换飞书奖品数据格式为本地格式
  function convertPrizeData(prizes) {
      if (!prizes) {
        console.warn('飞书奖品数据格式无效');
        return null;
      }
    
      return prizes.map(prize => ({
        id: prize.fields.奖品名称,
        name: prize.fields.奖品名称,
        detail: prize.fields.奖品名称,
        img: prize.fields.奖品图片地址 || '',
        count: 1, // 默认数量，根据实际需求调整
        countRemain: 1,
        everyTimeGet: 1,
        round: 0,
        cardListWin: []
      }));
    }

// 定时更新用户数据
function startUserDataSync(interval = 5 * 60 * 1000) { // 默认5分钟更新一次
  setInterval(async () => {
    await fetchUsers()
  }, interval);
}

export { fetchUsers,fetchPrizes, startUserDataSync }; 