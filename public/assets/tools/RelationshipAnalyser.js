
import Terminal from './../components/Terminal.js';

export default {
    name: 'RelationshipAnalyser',
    components: {
        Terminal
    },
    data() {
        return {
            port: 8543,
            controller: null,
            output: '·',
            isSubmitting: false,
            percentage: '0',
            ra_schema: '',
            ra_table: '',
            ra_columns: ''
        }
    },
    methods: {
        getPort(){

            const formData = new FormData();
            formData.append('sql', this.sql);

            return fetch('/service/get-free-port', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(response => {

                this.port = response.ports[0]
                return this.port;
            })
            .catch(err => {

            });
        },
        raFetch(){

            this.output = '';
            this.percentage = 0;
            this.isSubmitting = true;

            this.getPort()
            .then(port => {
                console.log(port);
                if (!port) {
                    throw new Error('Nenhuma porta disponível');
                }

                this.controller = new AbortController();
                const signal = this.controller.signal;

                const formData = new FormData();
                formData.append('ra_schema', this.ra_schema);
                formData.append('ra_table', this.ra_table);
                formData.append('ra_columns', this.ra_columns);

                return fetch('http://localhost:'+this.port+'/relationship-analyser', {
                    method: 'POST',
                    body: formData,
                    signal
                });
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
        },
        stopFetch() {
            if (this.controller) {
                this.controller.abort();
            }
            this.isSubmitting = false;
        }
    },
    template: `
        <div>
            <div class="px-4 py-[2px] bg-zinc-900 flex items-center">
                <button type="button" class="flex items-center bg-zinc-900 text-xs p-2">
                    <svg class="w-[10px] h-[10px] fill-[#ffffff]" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                        <path d="M448 80v48c0 44.2-100.3 80-224 80S0 172.2 0 128V80C0 35.8 100.3 0 224 0S448 35.8 448 80zM393.2 214.7c20.8-7.4 39.9-16.9 54.8-28.6V288c0 44.2-100.3 80-224 80S0 332.2 0 288V186.1c14.9 11.8 34 21.2 54.8 28.6C99.7 230.7 159.5 240 224 240s124.3-9.3 169.2-25.3zM0 346.1c14.9 11.8 34 21.2 54.8 28.6C99.7 390.7 159.5 400 224 400s124.3-9.3 169.2-25.3c20.8-7.4 39.9-16.9 54.8-28.6V432c0 44.2-100.3 80-224 80S0 476.2 0 432V346.1z"></path>
                    </svg>
                    <span>&nbsp;name</span>
                </button>
                <button type="button" class="flex items-center bg-zinc-900 text-xs p-2">
                    <svg class="w-[10px] h-[10px] fill-[#ffffff]" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                    <path d="M64 256V160H224v96H64zm0 64H224v96H64V320zm224 96V320H448v96H288zM448 256H288V160H448v96zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64z"></path>
                    </svg>
                    <span>&nbsp;public@name</span>
                </button>
            </div>
            <div class="p-4">
                <div class="flex gap-6 items-top w-full">
                    <div class="flex-none w-1/4">
                        <div class="relative p-4 rounded-lg bg-zinc-900">
                            <h2 class="font-extrabold text-xl">RELATIONSHIP FINDER</h2>
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
                            <form class="max-w-sm" @submit.prevent="raFetch" autocomplete="off">
                                <label for="for_ra_schema" class="block mt-4 text-xs">SCHEMA</label>
                                <input id="for_ra_schema" v-model="ra_schema" type="text" spellcheck="false" placeholder="public" class="bg-zinc-900 border border-zinc-800 caret-white text-white focus:text-white hover:text-white text-sm rounded-sm focus:ring-2 focus:ring-zinc-800 focus:border-zinc-800 focus:bg-zinc-900 focus:outline-none block w-full p-2">

                                <label for="for_ra_table" class="block mt-4 text-sm">TABLE</label>
                                <input id="for_ra_table" v-model="ra_table" type="text" spellcheck="false" placeholder="table" class="bg-zinc-900 border border-zinc-800 caret-white text-white focus:text-white hover:text-white text-sm rounded-sm focus:ring-2 focus:ring-zinc-800 focus:border-zinc-800 focus:bg-zinc-900 focus:outline-none block w-full p-2">

                                <label for="for_ra_columns" class="block mt-4 text-sm">COLUMNS</label>
                                <input id="for_ra_columns" v-model="ra_columns" type="text" spellcheck="false" placeholder="id" class="bg-zinc-900 border border-zinc-800 caret-white text-white focus:text-white hover:text-white text-sm rounded-sm focus:ring-2 focus:ring-zinc-800 focus:border-zinc-800 focus:bg-zinc-900 focus:outline-none block w-full p-2">
                                <div class="block mt-4">
                                    <button type="submit" class="flex itens-center bg-zinc-900 border border-zinc-800 text-white text-sm rounded-sm focus:ring-2 focus:ring-zinc-800 focus:border-zinc-800 focus:bg-zinc-900 focus:outline-none block p-2">
                                        <svg class="w-[15px] h-[15px] fill-[#ffffff]" viewBox="0 0 576 512" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9.4 86.6C-3.1 74.1-3.1 53.9 9.4 41.4s32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L178.7 256 9.4 86.6zM256 416H544c17.7 0 32 14.3 32 32s-14.3 32-32 32H256c-17.7 0-32-14.3-32-32s14.3-32 32-32z"></path>
                                        </svg>
                                        <span>&nbsp;RUN</span>
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
        </div>
    `
}