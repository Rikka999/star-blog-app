<template>
  <div class="flex flex-col items-center p-6">
    <!-- 标题 -->
    <h1 class="text-3xl font-bold text-center mb-6">星星塔罗⭐</h1>

    <!-- 抽卡按钮 -->
    <el-button type="primary" @click="drawCard" class="mb-4 w-36">
      抽卡
    </el-button>

    <!-- 抽卡数量选择 -->
    <el-input-number 
      v-model="drawCount" 
      :min="1" 
      :max="10" 
      label="抽牌数量" 
      class="mb-4" 
      size="small"
    />

    <!-- 批量抽卡按钮 -->
    <el-button type="success" @click="drawArray" class="mb-6 w-36">
      抽{{ drawCount }}张牌
    </el-button>

    <!-- 清理按钮 -->
    <el-button @click="cleanDrawResult" class="mb-6">
      清理
    </el-button>

    <!-- 卡牌展示区域 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="(item, index) in drawnCardsResult" 
        :key="index" 
        class="flex justify-center"
      >
        <el-card 
          class="card-container" 
          :body-style="{ padding: '20px' }"
          shadow="hover"
        >
          <h3 class="text-xl font-semibold text-center">{{ item.card.name }}</h3>
          <h5 class="text-center text-gray-500">{{ item.card.nameEn }}</h5>
          
          <!-- 卡牌图片展示 -->
          <div :class="['card-img-container', { 'flip': item.orientation === 'reversed' }]">
            <img 
              :src="'/src/assets/tarot/' + item.card.image" 
              alt="Tarot Card"
              class="card-img"
            />
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
import { ref } from 'vue'
import { useTarotStore } from '../../stores/tarot'

const tarot = useTarotStore()
// 默认抽3张牌
const drawCount = ref(3)
// 抽卡结果数组
const drawnCardsResult = ref<Array<{ card: any, orientation: string }>>([])

function drawCard() {
  drawnCardsResult.value.push(tarot.drawCard())
}

function drawArray() {
  drawnCardsResult.value.push(...tarot.drawArray(drawCount.value))
}

function cleanDrawResult() {
  drawnCardsResult.value = []
}

function getMeanings(item: { card: any, orientation: string }) {
  return item.orientation === 'upright'
    ? item.card.upright
    : item.card.reversed
}
</script>

<style scoped>
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
