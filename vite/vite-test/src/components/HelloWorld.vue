<script setup lang="ts">
import { onMounted } from "vue"
onMounted(() => {
  setInterval(() => {
    const cpu = document.getElementById("cpu-used")
    api.getUsage().then((data: { currentLoad: any }) => {
      cpu.innerText = `CPU Usage: ${data.currentLoad.toFixed(1)}%`
    })
    document.getElementById("cpu-core").innerText = `Cores: ${api.cpuCount}`
  }, 1500)
})
</script>

<template>
  123
  <div id="cpu-core">CPU Count: 0</div>
  <div id="cpu-used">CPU Usage: 0</div>
</template>

<style scoped></style>
