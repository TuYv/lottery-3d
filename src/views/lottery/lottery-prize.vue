<template>
  <div class="prize-wrap">
    <div class="prize-list" v-if="!loading">
      <ul class="prize-list">
        <li class="prize-item"
            v-for="(item, index) in prizeList" :key="item.id"
            :class="{shine: currentPrize && currentPrize.id === item.id, done: index === donePrizeIndex}"
            @click="setPrize(item)">
          <div class="prize-item-left" v-if="false">
            <img src="http://n1.itc.cn/img8/wb/recom/2016/03/02/145687903767748488.JPEG" alt="">
          </div>
          <div class="prize-item-right">
            <div class="prize-item-title">{{ item.name }}</div>
            <div class="prize-item-name" v-if="false">{{ item.detail }}</div>
            <div class="prize-item-count" style="display: none;">{{ item.count }}名</div>
            <div class="prize-item-count-wrap">
              <div class="prize-item-count-text">{{ item.countRemain }}/{{ item.count }}</div>
              <div class="progress">
                <div
                  :style="{width: item.countRemain / item.count * 100 + '%'}"
                  class="progress-bar progress-bar-danger progress-bar-striped active"
                ></div>
              </div>
            </div>
          </div>
          <span class="line-1"></span>
          <span class="line-2"></span>
          <span class="line-3"></span>
          <span class="line-4"></span>
        </li>
      </ul>
    </div>
    <div v-else class="loading">
      正在加载奖品信息...
    </div>
    <lotteryAction/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import lotteryAction from './lottery-action.vue';
import lotteryConfig from './lottery-config.js';
import { transform } from './3d-animate.js';
import { STATUS } from './lottery-status';

@Component({
  components: { lotteryAction }
})
export default class Prize extends Vue {
  $bus: any;
  showBtn = false;
  prizeList = lotteryConfig.prizeList;
  currentPrize = lotteryConfig.currentPrize;
  donePrizeIndex = null;
  loading = lotteryConfig.loading;
  configInterval: any;

  created() {
    // 初始化数据
    this.loading = lotteryConfig.loading;
    this.prizeList = lotteryConfig.prizeList;
    this.currentPrize = lotteryConfig.currentPrize;

    // 监听配置变化
    const checkConfig = () => {
      this.loading = lotteryConfig.loading;
      this.prizeList = lotteryConfig.prizeList;
      this.currentPrize = lotteryConfig.currentPrize;
    };

    // 定期检查配置更新
    this.configInterval = setInterval(checkConfig, 1000);
  }

  beforeDestroy() {
    // 清理定时器
    if (this.configInterval) {
      clearInterval(this.configInterval);
    }
  }

  async setPrize(prize) {
    if (STATUS.getStatus() === STATUS.RUNNING) {
      alert('正在抽奖，请等待结束后再选择奖品');
      return void 0;
    }
    STATUS.setStatusRun();
    this.currentPrize = prize;
    lotteryConfig.currentPrize = prize.id;
    await transform('table', 1000); // TODO重复点击处理
    STATUS.setStatusWait();
  }
}
</script>

<style lang="scss" scoped>
@use './lottery-prize.scss';
</style>
