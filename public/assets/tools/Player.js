export default {
  name: 'Player',
  data() {
    return {
      files: [],        // lista de arquivos selecionados
      currentIndex: 0,  // índice da faixa atual
      audio: null,      // objeto de áudio
      isPlaying: false
    }
  },
  methods: {
    handleFileSelect(e) {
      this.files = Array.from(e.target.files)
      this.currentIndex = 0
      if (this.files.length > 0) {
        this.loadAudio()
      }
    },
    loadAudio() {
      if (this.audio) {
        this.audio.pause()
      }
      const file = this.files[this.currentIndex]
      if (file) {
        this.audio = new Audio(URL.createObjectURL(file))
        this.audio.addEventListener("ended", this.nextTrack)
        this.play()
      }
    },
    play() {
      if (this.audio) {
        this.audio.play()
        this.isPlaying = true
      }
    },
    pause() {
      if (this.audio) {
        this.audio.pause()
        this.isPlaying = false
      }
    },
    stop() {
      if (this.audio) {
        this.audio.pause()
        this.audio.currentTime = 0
        this.isPlaying = false
      }
    },
    nextTrack() {
      if (this.currentIndex < this.files.length - 1) {
        this.currentIndex++
        this.loadAudio()
      }
    },
    prevTrack() {
      if (this.currentIndex > 0) {
        this.currentIndex--
        this.loadAudio()
      }
    }
  },
  template: `
    <div class="block p-4">
      <h2 class="text-lg font-bold mb-2">Player MP3</h2>

      <!-- Input para escolher arquivos -->
      <input type="file" accept="audio/mp3" multiple @change="handleFileSelect" />

      <!-- Nome da faixa -->
      <div v-if="files.length > 0" class="mt-4">
        <p class="font-mono text-sm">
          Tocando: {{ files[currentIndex]?.name }}
        </p>

        <!-- Controles -->
        <div class="flex gap-2 mt-2">
          <button class="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400" @click="prevTrack" :disabled="currentIndex === 0">⏮</button>
          <button class="px-3 py-1 rounded bg-green-500 text-white hover:bg-green-600" v-if="!isPlaying" @click="play">▶️</button>
          <button class="px-3 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-600" v-if="isPlaying" @click="pause">⏸</button>
          <button class="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600" @click="stop">⏹</button>
          <button class="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400" @click="nextTrack" :disabled="currentIndex === files.length - 1">⏭</button>
        </div>
      </div>
    </div>
  `
}
