// 不再直接导入静态JSON
let cardUserList = [];

// 从localStorage获取最新用户数据
function refreshUserList() {
  const savedUsers = localStorage.getItem('lottery-config-users');
  if (savedUsers) {
    cardUserList = JSON.parse(savedUsers);
  }
  
  // 计算行列位置
  let row = 1;
  let col = 1;
  const colCount = 25;
  cardUserList.forEach((item, i) => {
    item.index = i;
    if (col > colCount) {
      col = 1;
      row++;
    }
    item.row = row;
    item.col = col;
    col++;
  });
  
  return cardUserList;
}

// 导出获取最新用户列表的方法
export function getCardList() {
  return refreshUserList();
}

export const colCount = 25;
export const rowCount = Math.ceil(cardUserList.length / colCount);
