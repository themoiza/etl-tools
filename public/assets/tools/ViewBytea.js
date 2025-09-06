import Sqleditor from './../components/SqlEditor.js';

export default {
    name: 'ViewBytea',
    components: {
        Sqleditor
    },
    data() {
        return {
            sql: ''
        }
    },
    watch: {
        sql(newVal) {
            console.log(newVal);
        }
    },
    methods: {
        getBytea() {

            const formData = new FormData();
            formData.append('sql', this.sql);

            console.log(this.sql);

            /*fetch('/search-columns', {
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
            });*/
        }
    },
    computed: {},
    template: `
        <div class="block p-4">
            <h2>View Bytea</h2>
            <div class="flex w-full">
                <div class="flex-none w-[380px]">
                    <form @submit.prevent="getBytea">
                        <div class="block w-[320px] h-[280px] bg-black p-2">
                            <sqleditor :sql="sql" @update:sql="sql = $event"></sqleditor>
                        </div>
                        <div class="pt-2">
                            <button 
                                type="submit"
                                class="
                                    inline-flex
                                    items-center
                                    rounded-sm
                                    p-2
                                    text-white
                                    font-medium
                                    text-xs
                                    text-center
                                    bg-zinc-700
                                    hover:bg-zinc-800
                                    focus:ring-4
                                    focus:outline-none
                                    focus:ring-zinc-300
                                    dark:bg-zinc-600
                                    dark:hover:bg-zinc-700
                                    dark:focus:ring-zinc-800
                                ">
                                EXECUTE
                            </button>
                        </div>
                    </form>
                </div>
                <div class="flex-1">
                    <iframe class="w-full" style="height: calc(100vh - 120px)" src="./assets/pdf.pdf"></iframe>
                </div>
            </div>
        </div>
    `
}