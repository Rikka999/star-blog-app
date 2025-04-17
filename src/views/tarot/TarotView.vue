<template>
  <div class="flex flex-col items-center p-6">
    <!-- 标题 -->
    <h1 class="text-3xl font-bold text-center mb-6">星星塔罗⭐</h1>
    <el-button @click="cleanDrawResult" class="mb-6"> 重新洗牌 </el-button>
    <!-- 卡背展示区 -->
    <div class="relative mb-8 py-4">
      <div class="flex" style="min-width: calc(78 * 20px)">
        <div
          v-for="(_, index) in 78"
          :key="index"
          class="relative overflow-hidden rounded-lg transition-all duration-300"
          :style="{
            marginLeft: index > 0 ? '-75px' : '0',
            zIndex: drawnCardBackIndexes.includes(index) ? -1 : `${78 - index}`
          }"
          :class="{
            'opacity-0': drawnCardBackIndexes.includes(index),
            'hover:-translate-y-10': !drawnCardBackIndexes.includes(index)
          }"
          @click="clickCardBack(index)"
        >
          <!-- 卡背图片 -->
          <img
            :src="cardBackPath"
            alt="card back"
            class="w-24 object-cover rounded-lg border-2 border-amber-100 shadow-xl hover:shadow-2xl transition-all duration-300"
          />
        </div>
      </div>
    </div>

    <!-- 卡牌展示区域 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="(item, index) in drawnCardsResult" :key="index" class="flex justify-center">
        <el-card class="card-container" :body-style="{ padding: '20px' }" shadow="hover">
          <h3 class="text-xl font-semibold text-center">{{ item.card.name }}</h3>
          <h5 class="text-center text-gray-500">{{ item.card.nameEn }}</h5>
          <div>方向：{{ item.orientation === 'upright' ? '正位' : '逆位' }}</div>
          <!-- 卡牌图片展示 -->
          <div :class="['card-img-container', { flip: item.orientation === 'reversed' }]">
            <img :src="cardPicPath + item.card.image" alt="Tarot Card" class="card-img" />
          </div>

          <!-- 意义列表 -->
          <ul class="list-disc pl-5 mt-4 text-sm">
            <li v-for="meaning in getMeanings(item)" :key="meaning">
              {{ meaning }}
            </li>
          </ul>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useTarotStore } from '@/stores/tarot';

const cardBackPath = '/src/assets/tarot/card-back1.webp';
const cardPicPath = '/src/assets/tarot/';
const tarot = useTarotStore();
// 默认抽3张牌
const drawCount = ref(3);
// 抽卡结果数组
const drawnCardBackIndexes = ref<number[]>([]); // 存储已抽卡背的索引
const drawnCardsResult = ref<Array<{ card: any; orientation: string }>>([]);

// 清理方法
function cleanDrawResult() {
  drawnCardsResult.value = [];
  tarot.initDeck();
}

function drawCard() {
  drawnCardsResult.value.push(tarot.drawCard());
}

function drawArray() {
  drawnCardsResult.value.push(...tarot.drawArray(drawCount.value));
}

function clickCardBack(index: number) {
  if (drawnCardBackIndexes.value.includes(index)) return;
  drawnCardBackIndexes.value.push(index);
  drawCard();
  console.log(tarot.drawnCards);
}

function getMeanings(item: { card: any; orientation: string }) {
  return item.orientation === 'upright' ? item.card.upright : item.card.reversed;
}
</script>

<style scoped>
/* 卡背悬停效果 */
.group-hover\:opacity-100 {
  opacity: 1;
}

/* 卡片进入动画 */
.card-enter-active {
  transition: all 0.5s ease;
}
.card-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

/* 卡背消失动画 */
.opacity-0 {
  transition: opacity 0.3s ease;
}

.card-container {
  width: 200px;
  transition: transform 0.3s ease-in-out;
}

.card-img-container {
  width: 100%;
  height: 280px;
  overflow: hidden;
  position: relative;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-img-container.flip .card-img {
  transform: rotateX(180deg);
}

.grid {
  display: grid;
  gap: 20px;
}
</style>
