import axios from 'axios';
import fs from 'fs';
import path from 'path';

// 配置接口地址
const API_URL = 'https://open.feishu.cn/anycross/trigger/callback/MDM1NDVmZjYzOGQ4OTA1MDBhNGFmY2ZkZjQ5OGQ2NjYz'; // 需要替换为实际的API地址

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
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('获取用户数据失败:', error);
    return null;
  }
}

// 更新用户数据文件
async function updateUsersFile(users) {
  if (!users) return false;
  
  try {
    const filePath = path.resolve(process.cwd(), 'src/views/lottery/lottery-config-users-raw.json');
    await fs.promises.writeFile(filePath, JSON.stringify(users, null, 2));
    console.log('用户数据更新成功');
    return true;
  } catch (error) {
    console.error('更新用户数据文件失败:', error);
    return false;
  }
}

// 定时更新用户数据
function startUserDataSync(interval = 3000) { // 默认5分钟更新一次
  setInterval(async () => {
    console.log('开始同步用户数据...');
    const users = await fetchUsers();
    if (users) {
    //   await updateUsersFile(users);
    }
  }, interval);
}

export { fetchUsers, updateUsersFile, startUserDataSync }; 