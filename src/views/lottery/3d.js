import {
  camera, scene, renderer, controls, // 3d 三大组件
  initCamera, initRenderer, initScene, initControls, // 初始化3d
  render, global3D, // 3d 其他
  objects, targets, cardSize, // 3d 变量
} from './3d-core.js';
export {
  camera, scene, renderer, controls, // 3d 三大组件
  initCamera, initRenderer, initScene, initControls, // 初始化3d
  render, global3D, // 3d 其他
  objects, targets, cardSize, // 3d 变量
}

import { transform, transformStatus, animate } from './3d-animate.js';
export { transform, transformStatus, animate };

import { create3DCard } from './3d-card-element.js';
import { targetsCoord } from './3d-card-coord.js';
import { initEvent } from './3d-bind-event.js';
import { startUserDataSync } from '../../services/userService.js';
export { rotateBall, rotateBallStop } from './3d-action.js';

// 3D效果类型数组
const effectTypes = ['table', 'sphere', 'helix', 'grid'];
let currentEffectIndex = 0;

// 自动切换3D效果
function autoSwitch3DEffect() {
  setInterval(() => {
    currentEffectIndex = (currentEffectIndex + 1) % effectTypes.length;
    transform(effectTypes[currentEffectIndex], 2000, 1);
  }, 10000); // 每10秒切换一次
}

function init() {
  console.log('init');
  initCamera(); // 相机
  initScene(); // 场景

  create3DCard(); // 制作卡片3D对象的DOM
  targetsCoord(); // 计算table、sphere、helix、grid四个图形的坐标

  initRenderer(); // 渲染器
  initControls(); // 控制器

  // 防止DOM未加载 TODO 判断是否需要setTimeout
  setTimeout(() => {
    initEvent(); // 绑定事件
    // 启动自动切换
    autoSwitch3DEffect();
  }, 100)
  console.log('startUserDataSync');
  // 启动用户数据同步 (每5分钟更新一次)
  startUserDataSync();
}

export { init };
