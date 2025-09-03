const { createApp, ref } = Vue

import Relationshipanalyser from "./tools/RelationshipAnalyser.js";
import Searchcolumns from "./tools/SearchColumns.js";
import Sql from "./tools/Sql.js";
import Uploadzip from "./tools/UploadZip.js";

const app = createApp({
    components: {
        Relationshipanalyser,
        Searchcolumns,
        Sql,
        Uploadzip
    },
    data() {
        return {
            page: 'ra',
            tabs: [],
            activeTab: null,
            nextId: 1,
        }
    },
    methods: {
        openPage(newPage) {
            this.page = newPage
        },
        openTab(type) {
            const id = this.nextId++;
            const newTab = {
                id,
                title: `${type} #${id}`,
                component: type,
                props: { instanceId: id }, // você pode passar props únicas
            };
            this.tabs.push(newTab);
            this.activeTab = id;
        },
        closeTab(id) {
            const index = this.tabs.findIndex((t) => t.id === id);
            if (index !== -1) {
                this.tabs.splice(index, 1);
                if (this.activeTab === id && this.tabs.length > 0) {
                this.activeTab = this.tabs[Math.max(0, index - 1)].id;
                } else if (this.tabs.length === 0) {
                this.activeTab = null;
                }
            }
        }
    }
}).mount("#app")