
import Terminal from './../components/Terminal.js';

export default {
    name: 'SearchColumns',
    components: {
        Terminal
    },
    data() {
        return {
            output: '·',
            columns: '',
            schemas: ''
        }
    },
    methods: {
        runSearch() {

            const formData = new FormData();
            formData.append('columns', this.columns);
            formData.append('schemas', this.schemas);

            fetch('/search-columns', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json(
                this.output = JSON.stringify(res)
            ))
            .then(data => {
                this.columns = '';
                this.schemas = '';
            })
            .catch(err => {
                this.response = 'Erro ao enviar: ' + err;
            });
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
                <h2>Procurar colunas</h2>
                <div class="flex gap-4 items-top w-full">
                    <div class="flex-none w-1/4">
                        <form class="max-w-sm" @submit.prevent="runSearch">
                            <label class="block mt-4 text-sm">Colunas</label>
                            <div class="relative">
                                <input v-model="columns" type="text" class="bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="">
                            </div>
                            <label class="block mb-2 mt-2 text-sm font-medium text-gray-900 dark:text-white">Schemas</label>
                            <div class="relative">
                                <input v-model="schemas" type="text" class="bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="">
                            </div>
                            <div class="py-4 w-full">
                                <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    BUSCAR
                                </button>
                            </div>
                        </form>
                    </div>
                    <div class="flex-1">
                        <terminal :output="output"></terminal>
                    </div>
                </div>
            </div>
        </div>
    `
}