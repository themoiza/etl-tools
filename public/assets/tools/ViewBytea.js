import Sqleditor from './../components/SqlEditor.js';

export default {
    name: 'ViewBytea',
    components: {
        Sqleditor
    },
    data() {
        return {
            query: ''
        }
    },
    methods: {

    },
    computed: {

    },
    template: `
        <div class="block p-4">
            <h2>View Bytea</h2>
            <div class="flex w-full">
                <div class="flex-none w-[380px]">
                    <div class="block w-[320px] h-[280px] bg-black p-2">
                        <sqleditor></sqleditor>
                    </div>
                    <div class="pt-2">
                        <button 
                            type="submit"
                            class="
                                text-white
                                bg-blue-700
                                hover:bg-blue-800
                                focus:ring-4
                                focus:outline-none
                                focus:ring-blue-300
                                font-medium
                                rounded-sm
                                text-xs
                                p-2
                                text-center
                                inline-flex
                                items-center
                                dark:bg-blue-600
                                dark:hover:bg-blue-700
                                dark:focus:ring-blue-800
                            ">
                            EXECUTE
                        </button>
                    </div>
                </div>
                <div class="flex-1">
                    <iframe class="w-full" style="height: calc(100vh - 120px)" src="./assets/pdf.pdf"></iframe>
                </div>
            </div>
        </div>
    `
}