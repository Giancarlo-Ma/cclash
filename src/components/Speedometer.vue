<template>
  <div :style="{ padding: '16px', fontSize: '16px' }">
    <div class="speed-o-meter-text">
      <a-icon type="arrow-up" />
      {{ traffic.up | formatTraffic }}
    </div>
    <div class="speed-o-meter-text">
      <a-icon type="arrow-down" />
      {{ traffic.down | formatTraffic }}
    </div>
  </div>
</template>

<script>
import { requestTraffic } from "../api";

export default {
  data() {
    return {
      traffic: { up: 0, down: 0 },
    };
  },
  created() {
    requestTraffic((chunk) => {
      if (chunk == null || chunk.length === 0) {
        return;
      }
      try {
        const t = JSON.parse(chunk);
        this.setTraffic(t);
      } catch (e) {
        console.log("settraffic error");
      }
    });
  },
  methods: {
    setTraffic(t) {
      this.traffic = t;
    },
  },
  filters: {
    formatTraffic(value) {
      let speed = Number(value / 1024);
      let suffix = 'K'
      if(speed >= 1024) {
        speed = speed / 1024
        suffix = 'M'
      }
      return `${speed.toFixed(2)}${suffix}`;
    }
  }
};
</script>

<style scoped>

</style>