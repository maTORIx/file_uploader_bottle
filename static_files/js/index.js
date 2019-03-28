const api_path = '/api'

function parse_filenames(filenames) {
    files = []
    for (filename of filenames) {
        files.push({
            download_url: api_path + '/files/' + filename,
            display_name: filename.split('_').slice(1).join('_')
        })
    }
    return files
}

document.addEventListener('DOMContentLoaded', function() {
    let app = new Vue({
        el: '#app',
        delimiters: ["[[", "]]"],
        data: () => {
            return {
                files: null
            }
        },
        methods: {
            loadFiles: function(start=0, size=10){
                self = this
                return fetch(api_path + '/files').then((resp) => {
                    return resp.text()
                }).then((text) => {
                    filenames = JSON.parse(text)['files']
                    files = parse_filenames(filenames)
                    console.log(files)
                    self.files = files
                })
            },
            uploadFiles: function(e) {
                e.preventDefault()
                print(e)
            }
        },
    })

    setTimeout(app.loadFiles, 2000)
    
})