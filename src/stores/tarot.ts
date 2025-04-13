import { defineStore } from 'pinia'
import tarotData from '../assets/data/tarot-deck.json' // 或动态加载

interface TarotCard {
  id: number
  name: string
  upright: string[]
  reversed: string[]
  image: string
}

export const useTarotStore = defineStore('tarot', {
  state: () => ({
    deck: [] as TarotCard[], // 合并后的牌组
    drawnCards: [] as {card: TarotCard, orientation: 'upright' | 'reversed'}[]
  }),

  actions: {
    // 初始化牌组（合并大阿卡纳和小阿卡纳）
    initDeck() {
      this.deck = [
        ...tarotData.majorArcana,
        ...Object.values(tarotData.minorArcana).flat()
      ]
    },

    // 抽单张牌
    drawCard() {
      if (this.deck.length === 0) this.initDeck()
      
      const randomIndex = Math.floor(Math.random() * this.deck.length)
      const card = this.deck[randomIndex]
      const orientation = Math.random() > 0.5 ? 'upright' : 'reversed'

      this.drawnCards.push({ card, orientation })
      return { card, orientation }
    },

    // 抽牌阵（如三张牌）
    drawArray(count: number) {
      return Array.from({ length: count }, () => this.drawCard())
    }
  }
})