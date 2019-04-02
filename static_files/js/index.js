const api_path = '/api'

function parse_filename(filename) {
    return {
        download_url: api_path + '/files/' + filename,
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
                self = this
                endpoint = api_path + `/files?start=${start}&size=${size}`

                return fetch(endpoint).then((resp) => {
                    return resp.text()
                }).then((text) => {
                    filenames = JSON.parse(text)['files']
                    files = filenames.map(parse_filename)
                    self.files = files
                })
            },
            uploadFile: async function(e) {
                e.preventDefault()
                formdata = new FormData(e.target)
                resp = await fetch(api_path + '/files', {
                    'method': 'POST',
                    'body': formdata
                })

                if (!resp.ok) {
                    error_text = await resp.text()
                    throw Error(`Upload Failed. error: ${text}`)
                } else {
                    json = await resp.json()
                    self.files.unshift(parse_filename(json['uploaded_file']))
                }
            },
            onUploadFileChange: function(e) {
                this.selected_filename = e.target.files[0].name
            }
        },
    })

    setTimeout(app.loadFiles, 1000)
    
})