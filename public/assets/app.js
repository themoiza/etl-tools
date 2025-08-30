const { createApp, ref } = Vue

createApp({
    data() {
        return {
            page: 'home',
            message: 'ETL Tools!',
            columns: '',
            schemas: ''
        }
    },
    mounted() {

    },
    methods: {
        openPage(newPage) {
            this.page = newPage
        },
        submitForm() {

            const formData = new FormData();
            formData.append('columns', this.columns);
            formData.append('schemas', this.schemas);

            fetch('/search-columns', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                this.columns = '';
                this.schemas = '';
            })
            .catch(err => {
                this.response = 'Erro ao enviar: ' + err;
            });
        }
    }
}).mount('#app')