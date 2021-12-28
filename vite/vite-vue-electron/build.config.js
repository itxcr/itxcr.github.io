const options = {
    config: {
        productName: 'vit-vue-eelectron',
        appId: 'com.example.yourapp',
        directories: {
            output: 'build'
        },
        files: [
            'dist/renderer/**/*',
            'dist/main/**/*'
        ],
        dmg: {
            contents: [
                {
                    x: 410,
                    y: 150,
                    type: 'link',
                    path: '/Applications'
                },
                {
                    x: 130,
                    y: 150,
                    type: 'file'
                }
            ]
        },
        mac: {
            icon: 'public/icons/icon.icns'
        },
        win: {
            icon: 'public/icons/icon.ico'
        },
        linux: {
            icon: 'public/icons'
        }
    }
}

module.exports = options