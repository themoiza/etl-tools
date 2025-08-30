const { createApp, ref } = Vue

createApp({
    data() {
        return {
            page: 'relationship-analyser',
            columns: '',
            schemas: '',
            raResponse: ''
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
        },
        relationshipAnalyser(){

            const formData = new FormData();
            formData.append('ra_table', this.columns);
            formData.append('ra_columns', this.schemas);

            fetch('/relationship-analyser', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                this.raResponse = data.result;
            })
            .catch(err => {
                this.raResponse = 'Error: ' + err;
            });

        }
    }
}).mount('#app')