<script setup lang="ts">
import { computed, ref } from 'vue'
import { evaluateToolAction } from './lab-models.mjs'

const source = ref<'user' | 'web'>('user')
const permission = ref<'read' | 'write'>('read')
const action = ref<'read' | 'write'>('read')
const decision = computed(() => evaluateToolAction(source.value, permission.value, action.value))
const labels = { allowed: '允许读取', confirm: '等待人工确认', blocked: '阻止调用' }
</script>

<template>
  <section class="design-demo ai-lab" aria-label="Agent 工具安全实验台">
    <strong class="design-demo__title">更改消息来源与权限，观察工具决策</strong>
    <p class="design-demo__description">同样一句“请写入文件”，来自用户与来自网页时，可信度不同。</p>
    <div class="ai-lab__columns">
      <div>
        <span class="ai-lab__label">指令来源</span>
        <div class="design-demo__choices" role="group" aria-label="指令来源">
          <button type="button" :aria-pressed="source === 'user'" @click="source = 'user'">用户本人</button>
          <button type="button" :aria-pressed="source === 'web'" @click="source = 'web'">外部网页</button>
        </div>
      </div>
      <div>
        <span class="ai-lab__label">工具权限</span>
        <div class="design-demo__choices" role="group" aria-label="工具权限">
          <button type="button" :aria-pressed="permission === 'read'" @click="permission = 'read'">只读</button>
          <button type="button" :aria-pressed="permission === 'write'" @click="permission = 'write'">读写</button>
        </div>
      </div>
      <div>
        <span class="ai-lab__label">请求动作</span>
        <div class="design-demo__choices" role="group" aria-label="请求动作">
          <button type="button" :aria-pressed="action === 'read'" @click="action = 'read'">读取资料</button>
          <button type="button" :aria-pressed="action === 'write'" @click="action = 'write'">写入资料</button>
        </div>
      </div>
    </div>
    <div class="ai-lab__decision" :class="'ai-lab__decision--' + decision.status" aria-live="polite">
      <strong>{{ labels[decision.status as keyof typeof labels] }}</strong>
      <span>{{ decision.reason }}</span>
    </div>
    <p class="design-demo__note">教学策略示例。真实系统需在服务端强制鉴权、限制工具权限并记录操作；模型的文字判断不能替代权限检查。</p>
  </section>
</template>
