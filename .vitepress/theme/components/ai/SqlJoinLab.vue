<script setup lang="ts">
import { computed, ref } from 'vue'
import { joinRows, orders, people } from './lab-models.mjs'

const kind = ref<'inner' | 'left'>('inner')
const rows = computed(() => joinRows(kind.value))
</script>

<template>
  <section class="design-demo ai-lab" aria-label="SQL JOIN 实验台">
    <strong class="design-demo__title">切换 JOIN，观察哪些行被保留</strong>
    <p class="design-demo__description">订单 103 引用了不存在的用户；它不会出现在以下从用户表出发的结果中。</p>
    <div class="design-demo__choices ai-lab__choices" role="group" aria-label="连接类型">
      <button type="button" :aria-pressed="kind === 'inner'" @click="kind = 'inner'">INNER JOIN</button>
      <button type="button" :aria-pressed="kind === 'left'" @click="kind = 'left'">LEFT JOIN</button>
    </div>
    <div class="ai-lab__columns">
      <div>
        <h3>用户表</h3>
        <div class="ai-lab__table-wrap"><table><thead><tr><th>ID</th><th>姓名</th></tr></thead><tbody><tr v-for="person in people" :key="person.id"><td>{{ person.id }}</td><td>{{ person.name }}</td></tr></tbody></table></div>
      </div>
      <div>
        <h3>订单表</h3>
        <div class="ai-lab__table-wrap"><table><thead><tr><th>ID</th><th>用户 ID</th><th>金额</th></tr></thead><tbody><tr v-for="order in orders" :key="order.id"><td>{{ order.id }}</td><td>{{ order.personId }}</td><td>{{ order.amount }}</td></tr></tbody></table></div>
      </div>
    </div>
    <div class="ai-lab__stage" aria-live="polite">
      <h3>结果：{{ rows.length }} 行</h3>
      <div class="ai-lab__table-wrap"><table><thead><tr><th>用户</th><th>订单 ID</th><th>金额</th></tr></thead><tbody><tr v-for="(row, index) in rows" :key="index"><td>{{ row.person.name }}</td><td>{{ row.order?.id ?? 'NULL' }}</td><td>{{ row.order?.amount ?? 'NULL' }}</td></tr></tbody></table></div>
    </div>
    <p class="design-demo__note">教学数据固定。LEFT JOIN 保留左表的每位用户；没有匹配订单时，右表字段为 NULL。</p>
  </section>
</template>
