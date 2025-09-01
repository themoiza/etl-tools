
import Terminal from "./../components/Terminal.js";

export default {
    name: "relationshipanalyser",
    components: {
        Terminal
    },
    data() {
        return {
            output: '·',
            ra_schema: '',
            ra_table: '',
            ra_columns: ''
        }
    },
    props: {
        output: {
            type: String,
            default: ""
        }
    },
    methods: {
        clearTerminal(){
            this.output = '';
        },
        raFetch(){

            const formData = new FormData();
            formData.append('ra_schema', this.ra_schema);
            formData.append('ra_table', this.ra_table);
            formData.append('ra_columns', this.ra_columns);

            this.output = '';

            fetch('/relationship-analyser', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                const reader = response.body.getReader();
                const decoder = new TextDecoder('utf-8');

                const readChunk = () => {
                    reader.read().then(({ done, value }) => {

                        if (done) {
                            return;
                        }

                        const chunk = decoder.decode(value, { stream: true });
                        this.output = chunk.split('<br/>').join('\n');

                        readChunk();
                    });
                };

                readChunk();
            })
            .catch(err => {
                this.output = 'Erro: ' + err;
            });
        }
    },
    watch: {
        output(newVal){
            this.output = newVal;

            this.$nextTick(() => {
                const el = this.$refs.logOutput;
                if (el) {
                    el.scrollTop = el.scrollHeight;
                }
            });
        }
    },
    template: `
        <div class="flex gap-4 items-top w-full">
            <div class="flex-none w-1/4">
                <h2>Relationship Analyser</h2>
                <form class="max-w-sm" @submit.prevent="raFetch">
                    <label for="racoon" class="block mt-4 text-sm">Table</label>
                    <select id="racoon" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:ring-4 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option selected>Connection</option>
                        <option value="1">Connection 1</option>
                    </select>
                    <label for="for_ra_schema" class="block mt-4 text-sm">Schema</label>
                    <input id="for_ra_schema" v-model="ra_schema" type="text" placeholder="public" class="bg-gray-50 outline-none focus:outline-none text-white text-sm block w-full p-2 bg-gray-700 placeholder-gray-400 text-white">

                    <label for="for_ra_table" class="block mt-4 text-sm">Table</label>
                    <input id="for_ra_table" v-model="ra_table" type="text" placeholder="table" class="bg-gray-50 outline-none focus:outline-none text-white text-sm block w-full p-2 bg-gray-700 placeholder-gray-400 text-white">

                    <label for="for_ra_columns" class="block mt-4 text-sm">columns</label>
                    <input id="for_ra_columns" v-model="ra_columns" type="text" placeholder="id" class="bg-gray-50 outline-none focus:outline-none text-white text-sm block w-full p-2 bg-gray-700 placeholder-gray-400 text-white">
                    <div class="block mt-4">
                        <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            RUN
                        </button>
                    </div>
                </form>
            </div>
            <div class="flex-1">
                <terminal :output="output"></terminal>
            </div>
        </div>
    `
}