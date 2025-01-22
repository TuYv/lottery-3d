import { controls, render, objects, targets } from "./3d-core.js";
import { setTableDist, setSphereDist } from './3d-calc-distance.js';
const TWEEN = window.TWEEN;

function animate() {
  requestAnimationFrame( animate );
  TWEEN.update();
  controls.update();
}

let transformStatus = null;

// 将所有的卡片从一个状态转换到另一个状态
function transform( targets, duration ) {
  // TWEEN.removeAll();
  return new Promise((resolve, reject) => {
    // 添加参数检查
    if (!targets || !Array.isArray(targets)) {
      console.error('目标数组无效');
      reject(new Error('目标数组无效'));
      return;
    }

    for ( let i = 0; i < objects.length; i ++ ) {
      const object = objects[ i ];
      const target = targets[ i ];

      // 添加空值检查
      if (!target || !target.position || !target.rotation) {
        console.warn(`第 ${i} 个目标对象无效，跳过`);
        continue;
      }
      
      new TWEEN.Tween( object.position )
        .to( { x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration )
        .easing( TWEEN.Easing.Exponential.InOut )
        .start();

      new TWEEN.Tween( object.rotation )
        .to( { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration )
        .easing( TWEEN.Easing.Exponential.InOut )
        .start();
    }

    new TWEEN.Tween( this )
      .to( {}, duration * 2 )
      .onUpdate( render )
      .start()
      .onComplete(() => {
        resolve();
      });
  });
}

async function transformTargets(type, duration, distMultiple) {
  switch (type) {
    case 'table':
      transformStatus = 'table';
      setTableDist(distMultiple); // 设置table的Z纵深
      await transform( targets.table, duration );
      break;
    case 'sphere':
      transformStatus = 'sphere';
      await Promise.all([
        setSphereDist(distMultiple, duration),
        transform( targets.sphere, duration ),
      ])
      break;
    case 'helix':
      transformStatus = 'helix';
      await transform( targets.helix, duration );
      break;
    case 'grid':
      transformStatus = 'grid';
      await transform( targets.grid, duration );
      break;
  }
}

export { transformTargets as transform }
export { animate, transformStatus }
