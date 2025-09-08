export default {
    name: "Confirmdialog",
    data() {
        return {
        }
    },
    props: {
        visible: { type: Boolean, default: false },
        title: { type: String, default: "Confirmar ação" },
        message: { type: String, default: "Você tem certeza?" },
        tabId: [String, Number] 
    },
    methods: {
        onConfirm() {
            this.$emit("confirm", this.tabId)
        },
        onCancel() {
            this.$emit("cancel")
        },
    },
    template: `
        <div>
            <div v-if="visible" class="fixed inset-0 flex items-center justify-center z-50">

                <div class="absolute inset-0 bg-black opacity-50" @click="onCancel"></div>

                <div class="relative bg-white dark:bg-zinc-800 rounded-lg shadow-lg w-[320px] p-4 z-10">
                <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {{ title }}
                </h2>
                <p class="text-gray-700 dark:text-gray-300 mb-4">
                    {{ message }}
                </p>

                <div class="flex justify-end space-x-2">
                    <button 
                    class="px-3 py-1 rounded bg-gray-300 dark:bg-gray-600 text-black dark:text-white hover:bg-gray-400 dark:hover:bg-gray-500"
                    @click="onCancel"
                    >
                    Cancelar
                    </button>
                    <button focus
                        class="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                        @click="onConfirm"
                        >
                        Confirmar
                    </button>
                </div>
                </div>
            </div>
        </div>
    `
}