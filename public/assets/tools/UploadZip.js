
import Terminal from './../components/Terminal.js';

export default {
    name: 'Uploadzip',
    components: {
        Terminal
    },
    data() {
        return {
            controller: null,
            output: '·',
            isSubmitting: false,
            percentage: '0',
            zipPath: ''
        }
    },
    methods: {
        runSearch() {

            this.controller = new AbortController();
            const signal = this.controller.signal;

            const formData = new FormData();
            formData.append('zipPath', this.zipPath);

            this.output = '';
            this.isSubmitting = true;

            fetch('/upload-zip', {
                method: 'POST',
                body: formData,
                signal
            })
            .then(response => {

                const reader = response.body.getReader();
                const decoder = new TextDecoder('utf-8');

                const readChunk = () => {
                    reader.read()
                    .then(({ done, value }) => {
                        if (done) {
                        this.isSubmitting = false;
                        return;
                        }

                        const chunk = decoder.decode(value, { stream: true });
                        this.output = chunk;

                        const match = chunk.match(/(\d+)%/);
                        if (match) {
                        this.percentage = parseInt(match[1], 10);
                        }

                        readChunk();
                    })
                    .catch(err => {
                        if (err.name === 'AbortError') {
                            this.output = 'Operação cancelada';
                        } else {
                            this.output = 'Erro: ' + err;
                        }
                        this.isSubmitting = false;
                    });
                };

                readChunk();
            })
            .catch(err => {
                if (err.name === 'AbortError') {
                    this.output = 'Operação cancelada';
                } else {
                    this.output = 'Erro: ' + err;
                }
                this.isSubmitting = false;
            });
        }
    },
    template: `
        <div class="block w-full p-4">
            <div class="flex gap-4 items-top w-full">
                <div class="flex-none w-1/4">
                    <div class="relative p-4 rounded-lg bg-zinc-900">
                        <h2 class="font-extrabold text-xl">UPLOAD ZIP TO POSTGRESQL</h2>
                        <div
                            v-if="isSubmitting" 
                            class="absolute inset-0 bg-black/80 backdrop-blur-xs z-20 flex items-center justify-center rounded-lg"
                        >
                            <div class="flex flex-col items-center gap-4">
                                <span class="font-extrabold text-xl">{{ percentage }}%</span>
                                <svg class="w-6 h-6 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 
                                    0 0 5.373 0 12h4zm2 5.291A7.962 
                                    7.962 0 014 12H0c0 3.042 1.135 
                                    5.824 3 7.938l3-2.647z"/>
                                </svg>
                                <button @click="stopFetch" type="button" class="p-2 bg-red-900 text-sm text-white rounded hover:bg-red-800">
                                    STOP
                                </button>
                            </div>
                        </div>
                        <form class="max-w-sm" @submit.prevent="runSearch">
                            <label class="block mt-4 text-sm">Zip path</label>
                            <input v-model="zipPath" type="text" placeholder="/home/user/file.zip" spellcheck="false" class="bg-zinc-900 border border-zinc-800 caret-white text-white focus:text-white hover:text-white text-sm rounded-sm focus:ring-2 focus:ring-zinc-800 focus:border-zinc-800 focus:bg-zinc-900 focus:outline-none block w-full p-2">
                            <div class="block mt-4">
                                <button type="submit" class="flex itens-center bg-zinc-900 border border-zinc-800 text-white text-sm rounded-sm focus:ring-2 focus:ring-zinc-800 focus:border-zinc-800 focus:bg-zinc-900 focus:outline-none block p-2">
                                    <svg class="w-[15px] h-[15px] fill-[#ffffff]" viewBox="0 0 576 512" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.4 86.6C-3.1 74.1-3.1 53.9 9.4 41.4s32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L178.7 256 9.4 86.6zM256 416H544c17.7 0 32 14.3 32 32s-14.3 32-32 32H256c-17.7 0-32-14.3-32-32s14.3-32 32-32z"></path>
                                    </svg>
                                    <span>&nbsp;START</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <div class="flex-1">
                    <terminal :output="output"></terminal>
                </div>
            </div>
        </div>
    `
}