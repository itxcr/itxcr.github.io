<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>

<script>
import Public from '@/utils/public'

export default {
  mounted () {
    Public.$on('test', val => {
      console.log(val)
    })
  }
}
</script>
