const { createApp, ref } = Vue

import Terminal from "./components/Terminal.js";

const app = createApp({
    data() {
        return {
            page: 'relationship-analyser',
            columns: '',
            schemas: '',
            raResponse: '',
            ra_schema: '',
            ra_table: '',
            ra_columns: ''
        }
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
            formData.append('ra_schema', this.ra_schema);
            formData.append('ra_table', this.ra_table);
            formData.append('ra_columns', this.ra_columns);

            this.raResponse = '';

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
                        this.raResponse = chunk.split('<br/>').join('\n');

                        readChunk();
                    });
                };

                readChunk();
            })
            .catch(err => {
                this.raResponse = 'Erro: ' + err;
            });
        }
    }
})

app.component("Terminal", Terminal)

app.mount("#app")