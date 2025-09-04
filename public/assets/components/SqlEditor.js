export default {
    name: 'SqlEditor',
    components: {

    },
    data() {
        return {
            query: ''
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
            let out = escapeHtml(this.query);

            // 2) strings (não queremos colorir nada dentro delas depois)
            //   - aspas simples: suporta escapes \' simples
            out = safeReplaceOutsideTags(
                out,
                /'([^'\\]|\\.)*'/g,
                (m) => `<span class="text-green-400">${m}</span>`
            );

            //   - aspas duplas (identificadores entre "")
            out = safeReplaceOutsideTags(
                out,
                /"([^"\\]|\\.)*"/g,
                (m) => `<span class="text-green-400">${m}</span>`
            );

            //   - PostgreSQL $$ ... $$ simples
            out = safeReplaceOutsideTags(
                out,
                /\$\$[\s\S]*?\$\$/g,
                (m) => `<span class="text-green-400">${m}</span>`
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
                (m) => `<span class="text-yellow-300">${m}</span>`
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
                'WITH','RECURSIVE','UNION','ALL','EXCEPT','INTERSECT'
            ];
            const kwRegex = new RegExp(`\\b(?:${keywords.join('|')})\\b`, 'gi');

            out = safeReplaceOutsideTags(
                out,
                kwRegex,
                (m) => `<span class="text-blue-400 font-bold">${m}</span>`
            );

            return out;
        }
    },
    template: `
        <div class="relative" style="width: inherit; height: inherit;">
            <pre 
                ref="highlighted" 
                class="z-0 outline-none focus:outline-none text-white text-xs font-mono resize-none overflow-auto whitespace-pre break-keep" 
                style="max-height: calc(100vh - 67px); width: inherit; height: inherit; scrollbar-width: thin; scrollbar-color: #18181b #000000;"
                v-html="highlighted"
            ></pre>
            <div 
                class="z-1 absolute top-[0px] right-[0px] left-[0px]" style="width: inherit; height: inherit;">
                <textarea 
                    spellcheck="false" 
                    v-model="query"
                    @scroll="syncScroll" 
                    class="outline-none border-none focus:border-none focus:outline-none active:border-none text-transparent caret-white text-xs font-mono resize-none overflow-auto whitespace-pre break-keep"
                    style="max-height: calc(100vh - 67px); width: inherit; height: inherit; scrollbar-width: thin; scrollbar-color: #18181b #000000;"
                ></textarea>
            </div>
        </div>
    `
}