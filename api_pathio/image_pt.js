const axios = require("axios");
const path = require("path");
const fs = require("fs-extra");
const sharp = require("sharp");
const db = require("./db_pt");

const DOWNLOAD_DIR = path.join(__dirname, "downloaded_images");
const CONVERT_DIR = path.join(__dirname, "converted_images");

fs.ensureDirSync(DOWNLOAD_DIR);
fs.ensureDirSync(CONVERT_DIR);

async function dowload_convertImage(imageUrl) {
    try {
        const filename = path.basename(imageUrl, path.extname(imageUrl)) + ".jpg";
        const dowloadPath = path.join(DOWNLOAD_DIR, filename);
        const convertPath = path.join(CONVERT_DIR, filename);

        if (fs.existsSync(convertPath)) {
            return convertPath;
        }

        const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
        await fs.writeFile(dowloadPath, response.data);

        await sharp(dowloadPath).jpeg({ quality: 90 }).toFile(convertPath);

        db.query(
            "INSERT INTO images (filename, path) VALUES (?, ?)",
            [filename, convertPath],
            (err) => {
                if (err) {
                    console.error("บันทึกลง MySQL ไม่สำเร็จ:", err);
                } else {
                    console.log("บันทึก path ลง MySQL แล้ว:", filename);
                }
            }
        );
        return convertPath;
    } catch (err) {
        console.error("Error processing image:", err);
        return null;
    }
}

function getConvertedImages() {
    return fs.readdirSync(CONVERT_DIR).filter((file) => file.endsWith(".jpg"));
}

module.exports = {
    dowload_convertImage,
    getConvertedImages,
};