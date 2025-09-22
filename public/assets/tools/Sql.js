export default {
    name: 'Sql',
    components: {

    },
    data() {
        return {
            editor: ''
        }
    },
    methods: {
        syncScroll(e) {
            const textarea = e.target;
            const pre = this.$refs.highlighted;
            if (pre) {
                pre.scrollTop = textarea.scrollTop;
                pre.scrollLeft = textarea.scrollLeft;
            }
        }
    },
    computed: {
        highlighted() {
            const escapeHtml = (s) =>
                s.replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');

            const splitByTags = (s) => s.split(/(<[^>]+>)/g);
            const safeReplaceOutsideTags = (s, regex, replacer) =>
                splitByTags(s).map(part => (part.startsWith('<') ? part : part.replace(regex, replacer))).join('');

            // 1) texto puro escapado
            let out = escapeHtml(this.editor);

            // 2) strings (não queremos colorir nada dentro delas depois)
            //   - aspas simples: suporta escapes \' simples
            out = safeReplaceOutsideTags(
                out,
                /'([^'\\]|\\.)*'/g,
                (m) => `<span class="text-green-700">${m}</span>`
            );

            //   - aspas duplas (identificadores entre "")
            out = safeReplaceOutsideTags(
                out,
                /"([^"\\]|\\.)*"/g,
                (m) => `<span class="text-green-700">${m}</span>`
            );

            //   - PostgreSQL $$ ... $$ simples
            out = safeReplaceOutsideTags(
                out,
                /\$\$[\s\S]*?\$\$/g,
                (m) => `<span class="text-green-700">${m}</span>`
            );

            // 3) comentários (linha e bloco)
            out = safeReplaceOutsideTags(
                out,
                /--.*$/gm,
                (m) => `<span class="text-gray-400">${m}</span>`
            );
            out = safeReplaceOutsideTags(
                out,
                /\/\*[\s\S]*?\*\//g,
                (m) => `<span class="text-gray-400">${m}</span>`
            );

            // 4) números (fora de tags)
            out = safeReplaceOutsideTags(
                out,
                /\b\d+(\.\d+)?\b/g,
                (m) => `<span class="text-yellow-600">${m}</span>`
            );

            // 5) keywords (fora de tags)
            const keywords = [
                'SELECT','FROM','WHERE','GROUP','BY','HAVING','ORDER','LIMIT','OFFSET',
                'INSERT','INTO','VALUES','UPDATE','SET','DELETE','RETURNING',
                'JOIN','LEFT','RIGHT','FULL','INNER','OUTER','CROSS','ON','USING',
                'CREATE','TABLE','VIEW','INDEX','SEQUENCE','MATERIALIZED','OR','REPLACE',
                'ALTER','ADD','DROP','TRUNCATE','RENAME',
                'PRIMARY','KEY','FOREIGN','REFERENCES','UNIQUE','CHECK','DEFAULT','NULL','NOT',
                'AND','OR','IN','IS','BETWEEN','LIKE','ILIKE','EXISTS','DISTINCT','AS',
                'CASE','WHEN','THEN','ELSE','END',
                'WITH','RECURSIVE','UNION','ALL','EXCEPT','INTERSECT',
                'DECLARE','RECORD','BEGIN', 'FUNCTION', 'RETURNS'
            ];
            const kwRegex = new RegExp(`\\b(?:${keywords.join('|')})\\b`, 'gi');

            out = safeReplaceOutsideTags(
                out,
                kwRegex,
                (m) => `<span class="text-sky-500">${m}</span>`
            );

            return out;
        }
    },
    template: `
    <div>
        <div class="px-4 py-[2px] bg-zinc-900 flex items-center">
            <button type="button" class="flex items-center bg-zinc-900 text-xs p-2">
                <svg class="w-[10px] h-[10px] fill-[#ffffff]" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                    <path d="M448 80v48c0 44.2-100.3 80-224 80S0 172.2 0 128V80C0 35.8 100.3 0 224 0S448 35.8 448 80zM393.2 214.7c20.8-7.4 39.9-16.9 54.8-28.6V288c0 44.2-100.3 80-224 80S0 332.2 0 288V186.1c14.9 11.8 34 21.2 54.8 28.6C99.7 230.7 159.5 240 224 240s124.3-9.3 169.2-25.3zM0 346.1c14.9 11.8 34 21.2 54.8 28.6C99.7 390.7 159.5 400 224 400s124.3-9.3 169.2-25.3c20.8-7.4 39.9-16.9 54.8-28.6V432c0 44.2-100.3 80-224 80S0 476.2 0 432V346.1z"></path>
                </svg>
                <span>&nbsp;name</span>
            </button>
            <button type="button" class="flex items-center bg-zinc-900 text-xs p-2">
                <svg class="w-[10px] h-[10px] fill-[#ffffff]" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                <path d="M64 256V160H224v96H64zm0 64H224v96H64V320zm224 96V320H448v96H288zM448 256H288V160H448v96zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64z"></path>
                </svg>
                <span>&nbsp;public@name</span>
            </button>
            <button type="button" class="flex items-center bg-zinc-800 rounded-sm text-xs p-2">
                <svg class="w-[10px] h-[10px] fill-[#ffffff]" viewBox="0 0 384 512" xmlns="http://www.w3.org/2000/svg">
                <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"></path>
                </svg>
                <span>&nbsp;EXECUTE</span>
            </button>
        </div>
        <div 
            class="block w-full relative p-[20px] pr-[0px]"
            style="height: calc(100vh - 99px)"
        >
            <pre 
                ref="highlighted" 
                class="z-0 outline-none focus:outline-none text-white text-sm w-full h-screen font-mono resize-none overflow-auto whitespace-pre break-keep" 
                style="max-height: calc(100vh - 99px); scrollbar-width: thin; scrollbar-color: #18181b #000000;"
                v-html="highlighted"
            ></pre>
            <div 
                class="z-1 absolute top-[20px] right-[0px] left-[20px]">
                <textarea 
                    spellcheck="false" 
                    v-model="editor"
                    @scroll="syncScroll" 
                    class="outline-none border-none selection:bg-blue-700/20 focus:border-none focus:outline-none active:border-none text-transparent caret-white text-sm w-full h-screen font-mono resize-none overflow-auto whitespace-pre break-keep"
                    style="max-height: calc(100vh - 99px); scrollbar-width: thin; scrollbar-color: #18181b #000000;"
                ></textarea>
            </div>
        </div>
    </div>
    `
}