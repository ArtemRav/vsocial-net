<template>
  <div class="vsn-eiv vsn-p-1-5">
    <!-- <div class="vsn-eiv__controls">
      <button @click="play">play</button>
      <button @click="pause">pause</button>
      <button @click="stop">stop</button>
      <button @click="setSpeed(0.5)">0.5x</button>
      <button @click="setSpeed(1)">1x</button>
      <button @click="setSpeed(1.5)">1.5x</button>
      <button @click="setSpeed(2)">2x</button>
    </div> -->
    <video controls ref="videoPlayer">
      <source :src="videoFile.url" type="video/mp4" />
    </video>
    <!-- <div class="vsn-eiv__btn-play" v-if="isVisible">
      <div class="vsn-eiv__play" @click="play"></div>
    </div> -->
  </div>
</template>

<script>
import { ref } from '@vue/reactivity'

export default {
  props: {
    videoFile: Object
  },
  setup() {
    const videoPlayer = ref(null)
    const isVisible = ref(true)

    function play() {
      videoPlayer.value.play()
      isVisible.value = !isVisible.value
    }

    function pause() {
      videoPlayer.value.pause()
      isVisible.value = !isVisible.value
    }

    function stop() {
      videoPlayer.value.pause()
      videoPlayer.value.currentTime = 0
      isVisible.value = !isVisible.value
    }

    function setSpeed(speed) {
      videoPlayer.value.playbackRate = speed
    }

    return {
      play,
      pause,
      stop,
      setSpeed,
      videoPlayer,
      isVisible
    }
  }
}
</script>

<style>
.vsn-eiv {
  position: relative;
  display: flex;
  width: 100%;
  flex-direction: column;
}
.vsn-eiv.vsn-p-1-5 {
  padding-top: 0;
}
.vsn-eiv > video {
  width: 100%;
  height: auto;
  max-height: 36vh;
  border-radius: 8px;
  object-fit: contain;
}
/* .vsn-eiv > video::-webkit-media-controls-panel {
  background-color: var(--gray-100);
  opacity: 0.5;
} */
.vsn-eiv .vsn-eiv__btn-play {
  position: absolute;
  top: 50%;
  margin-top: -3em;
  left: 50%;
  margin-left: -3em;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 5em;
  height: 5em;
  background-color: var(--gray-100);
  border-radius: 50%;
  opacity: 0.5;
  cursor: pointer;
}
.vsn-eiv .vsn-eiv__btn-play .vsn-eiv__play {
  width: 1.5em;
  height: 1.75em;
  background-size: 1.3em;
  background-position: 4px;
  background-repeat: no-repeat;
  background-image: var(--bg-image-play-icon-white);
  cursor: pointer;
}
</style>
