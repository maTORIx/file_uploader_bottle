const API_PATH = '/api'
const LOAD_FILES_PAGE_SIZE = 3

function parse_filename(filename) {
    return {
        download_url: API_PATH + '/files/' + filename,
        display_name: filename.split('_').slice(1).join('_')
    }
}

document.addEventListener('DOMContentLoaded', function() {
    let app = new Vue({
        el: '#app',
        delimiters: ["[[", "]]"],
        data: () => {
            return {
                files: null,
                selected_filename: '',
                uploading: false,
            }
        },
        methods: {
            loadFiles: function(start=0, size=10){
                let self = this
                let endpoint = API_PATH + `/files?start=${start}&size=${size}`

                return fetch(endpoint).then((resp) => {
                    return resp.text()
                }).then((text) => {
                    let filenames = JSON.parse(text)['files']
                    let files = filenames.map(parse_filename)
                    return files
                })
            },
            loadFilesMore: function() {
                let start = this.files == null ? 0 : this.files.length
                let self = this
                this.loadFiles(start, LOAD_FILES_PAGE_SIZE).then((files) => {
                    if (self.files == null) {
                        self.files = files
                    } else {
                        self.files = self.files.concat(files)
                    }
                })
            },

            uploadFile: async function(e) {
                e.preventDefault()
                let formdata = new FormData(e.target)
                let resp = await fetch(API_PATH + '/files', {
                    'method': 'POST',
                    'body': formdata
                })

                if (!resp.ok) {
                    let error_text = await resp.text()
                    throw Error(`Upload Failed. error: ${text}`)
                } else {
                    let json = await resp.json()
                    self.files.unshift(parse_filename(json['uploaded_file']))
                }
            },
            onUploadFileChange: function(e) {
                this.selected_filename = e.target.files[0].name
            }
        },
    })

    setTimeout(app.loadFilesMore, 1000)
    
})