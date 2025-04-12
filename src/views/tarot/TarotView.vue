<template>
  <div>
    <el-button @click="drawCard">抽牌</el-button>

    <el-input-number 
      v-model="drawCount" 
      :min="1" 
      :max="10" 
      label="抽牌数量"
    />
    
    <el-button @click="drawArray">
      抽{{ drawCount }}张牌
    </el-button>

    <el-button @click="cleanDrawResult">
      清理
    </el-button>
    
    <div v-for="(item, index) in drawnArrayCardsResult" :key="index" class="card">
      <h3>{{ item.card.name }}</h3>
      <h5>{{ item.card.nameEn }}</h5>
      <p>方向：{{ item.orientation === 'upright' ? '正位' : '逆位' }}</p>
      <ul>
        <li v-for="meaning in getMeanings(item)" :key="meaning">
          {{ meaning }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTarotStore } from '../../stores/tarot'

const tarot = useTarotStore()
// 抽排阵默认抽3张牌
const drawCount = ref(3)
// 抽牌结果
const drawnArrayCardsResult = ref<Array<{card: any, orientation: string}>>([])

function drawCard() {
  drawnArrayCardsResult.value.push(tarot.drawCard())
}
function drawArray() {
  console.log(tarot.drawArray(drawCount.value))
  drawnArrayCardsResult.value.push(...tarot.drawArray(drawCount.value))
}

function cleanDrawResult(){
  drawnArrayCardsResult.value = []
}

function getMeanings(item: {card: any, orientation: string}) {
  return item.orientation === 'upright' 
    ? item.card.upright 
    : item.card.reversed
}
</script>

<style scoped>
.card {
  border: 1px solid #ddd;
  padding: 1rem;
  margin: 1rem 0;
}
</style>