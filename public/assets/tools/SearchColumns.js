
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
    `
}