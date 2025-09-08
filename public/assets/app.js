const { createApp, ref } = Vue

import Relationshipanalyser from "./tools/RelationshipAnalyser.js";
import Confirmdialog from "./components/ConfirmDialog.js";
import Searchcolumns from "./tools/SearchColumns.js";
import Uploadzip from "./tools/UploadZip.js";
import Viewbytea from "./tools/ViewBytea.js";
import Player from "./tools/Player.js";
import Sql from "./tools/Sql.js";

const app = createApp({
    components: {
        Relationshipanalyser,
        Confirmdialog,
        Searchcolumns,
        Uploadzip,
        Viewbytea,
        Player,
        Sql
    },
    data() {
        return {
            tabs: [],
            activeTab: null,
            nextId: 1,
            showDialog: false,
            selectedTabId: null
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
                title: (`${type}`).toUpperCase(),
                component: type,
                props: { instanceId: id },
            };
            this.tabs.push(newTab);
            this.activeTab = id;
        },
        askCloseTab(tabId) {

            console.log(tabId)
            this.selectedTabId = tabId
            this.showDialog = true
        },
        closeTab(id) {

            this.showDialog = false
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