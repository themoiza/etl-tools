

export default {
    name: 'SearchColumns',
    components: {},
    data() {
        return {
            controller: null,
            output: [],
            isSubmitting: false,
            focusFetch: false,
            percentage: '0',
            schemas: '',
            tables: '',
            column: '',
            fetchSchemas: []
        }
    },
    methods: {
        runSearch() {

            this.controller = new AbortController();
            const signal = this.controller.signal;

            const formData = new FormData();
            formData.append('schemas', this.schemas);
            formData.append('tables', this.tables);
            formData.append('column', this.column);

            this.output = [];
            this.percentage = 0;
            this.isSubmitting = true;

            fetch('/search-columns', {
                method: 'POST',
                body: formData,
                signal
            })
            .then(response => response.json())
            .then(response => {

                this.isSubmitting = false;
                this.output = response;
            })
            .catch(err => {
                this.isSubmitting = false;
            });
        },
        stopFetch() {
            if (this.controller) {
                this.controller.abort();
            }
            this.isSubmitting = false;
        },
        getSchemas(){

            const formData = new FormData();

            fetch('/search-columns/getschemas', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(response => {

                this.focusFetch = true;

                this.fetchSchemas = response.schemas;
            })
            .catch(err => {

            });
        },
        closeSchemas(event){

            const focusInside = event.relatedTarget && this.$el.contains(event.relatedTarget);
            if (!focusInside) {
                this.focusFetch = false;
            }
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
                <div class="flex gap-4 items-top w-full">
                    <div class="flex-none w-1/4">
                        <div class="relative p-4 rounded-lg bg-zinc-900">
                            <h2 class="font-extrabold text-xl">SEARCH COLUMNS</h2>
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
                            <form class="max-w-sm" @submit.prevent="runSearch" autocomplete="off">
                                <label class="block mt-4 text-xs">SCHEMAS</label>
                                <div 
                                    class="relative focus:ring-2 focus:ring-zinc-800 focus:border-zinc-800 focus:bg-zinc-900 focus:outline-none"
                                    @focusout="closeSchemas"
                                    tabindex="0"
                                    style="scrollbar-width: thin; scrollbar-color: #18181b #000000; max-height: calc(100vh - 120px)"
                                >
                                    <input
                                        tabindex="-1"
                                        v-model="schemas"
                                        type="text"
                                        spellcheck="false"
                                        placeholder="public"
                                        @focus="getSchemas"
                                        class="bg-zinc-900 border border-zinc-800 caret-white text-white focus:text-white hover:text-white text-xs rounded-sm focus:ring-2 focus:ring-zinc-800 focus:border-zinc-800 focus:bg-zinc-900 focus:outline-none block w-full p-2">
                                    <div v-if="focusFetch"
                                        class="absolute top-[40px] left-0 z-1
                                        bg-zinc-900 border border-zinc-800 caret-white text-white text-xs rounded-sm block w-full overflow-y-auto h-[500px]
                                    ">
                                        <div v-for="(schema, index) in fetchSchemas" class="hover:bg-black/80 flex">
                                            <input :id="'for'+index" type="checkbox" tabindex="-1" class="ml-2" />
                                            <label :for="'for'+index" class="block w-full p-2 text-xs cursor-pointer">{{schema}}</label>
                                        </div>
                                    </div>
                                </div>
                                <label class="block mt-4 text-xs">TABLES</label>
                                <div class="relative">
                                    <input v-model="tables" type="text" spellcheck="false" placeholder="public" class="bg-zinc-900 border border-zinc-800 caret-white text-white focus:text-white hover:text-white text-xs rounded-sm focus:ring-2 focus:ring-zinc-800 focus:border-zinc-800 focus:bg-zinc-900 focus:outline-none block w-full p-2">
                                </div>
                                <label class="block mt-4 text-xs">COLUM</label>
                                <div class="relative">
                                    <input v-model="column" type="text" spellcheck="false" placeholder="public" class="bg-zinc-900 border border-zinc-800 caret-white text-white focus:text-white hover:text-white text-xs rounded-sm focus:ring-2 focus:ring-zinc-800 focus:border-zinc-800 focus:bg-zinc-900 focus:outline-none block w-full p-2">
                                </div>
                                <div class="py-4 w-full">
                                    <button type="submit" class="bg-zinc-900 border border-zinc-800 text-white text-sm rounded-sm focus:ring-2 focus:ring-zinc-800 focus:border-zinc-800 focus:bg-zinc-900 focus:outline-none block p-2">
                                        BUSCAR
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div class="flex-1">
                        <div class="grid grid-cols-4 gap-2 text-sm text-white bg-zinc-900 rounded-t-lg">
                            <div class="font-bold px-2 py-1">SCHEMA</div>
                            <div class="font-bold px-2 py-1">TABLE</div>
                            <div class="font-bold px-2 py-1">COLUMN</div>
                            <div class="font-bold px-2 py-1">TYPE</div>
                        </div>
                        <div v-for="(line, index) in output" 
                            :key="index" 
                            class="grid grid-cols-4 hover:bg-black/50 bg-zinc-900
                        ">
                            <div class="px-2 py-1 text-sm">{{ line.table_schema }}</div>
                            <div class="px-2 py-1 text-sm">{{ line.table_name }}</div>
                            <div class="px-2 py-1 text-sm">{{ line.column_name }}</div>
                            <div class="px-2 py-1 text-sm">{{ line.data_type }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
}