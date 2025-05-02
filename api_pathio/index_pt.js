const express = require('express');
const path = require('path');
const { dowload_convertImage , getConvertedImages} = require('./image_pt');

const app = express();
const port = 9000;

app.use(express.static('./template_pt'));
app.use('/converted_images' , express.static('converted_images'));
app.set('views' , 'template_pt');
app.set('view engine' , 'ejs');

app.get('/' , async (req , res) => {
    const apiUrl = "https://file.royalrain.go.th/opendata/radar_data/cappi/api.php?station=pathio";

    try {
        const response = await require('axios').get(apiUrl);
        const result = response.data;
        const imageUrls = result.data.map(item => 
            `https://file.royalrain.go.th/opendata/radar_data/cappi/pathio/${item.url.split('/').pop()}`
        );

        const convertedFiles = [];
        for (const url of imageUrls) {
            const converted = await dowload_convertImage(url);
            if (converted) convertedFiles.push(path.basename(converted));
        }

        res.render('index_pathio.ejs' , { convertedFiles});
    } catch (error) {
        console.error("API error:", error);
        res.send("Error:" + error.message);
    }
});

app.listen(port , () => {
    console.log(`Server running at http://localhost:${port}`);
});