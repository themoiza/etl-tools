
import Terminal from './../components/Terminal.js';

export default {
    name: 'Uploadzip',
    components: {
        Terminal
    },
    data() {
        return {
            output: '·',
            zipPath: ''
        }
    },
    methods: {
        runSearch() {

            const formData = new FormData();
            formData.append('zipPath', this.zipPath);

            this.output = '';

            fetch('/upload-zip', {
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
                        this.output = chunk;

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
    template: `
        <div class="block w-full p-4">
            <h2>Upload zip</h2>
            <div class="flex gap-4 items-top w-full">
                <div class="flex-none w-1/4">
                    <form class="max-w-sm" @submit.prevent="runSearch">
                        <label class="block mt-4 text-sm">Zip path</label>
                        <div class="relative">
                            <input v-model="zipPath" type="text" class="bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="">
                        </div>
                        <div class="py-4 w-full">
                            <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                UPLOAD
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