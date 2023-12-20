const express = require("express");

const Cryptr = require('cryptr');
const random = require("random-string-generator");

const { urlModel } = require("../model/url.model")
const { auth } = require("../middleware/auth")

const cryptr = new Cryptr('myTotallySecretKey');

const urlRouter = express.Router()

urlRouter.post("/shortUrl", auth, async (req, res) => {
    const { url, length, alias } = req.body;
    const encryptedUrl = cryptr.encrypt(url)
    let shortenUrl;
    if (alias) {
        const existingUrl = await urlModel.findOne({ shortenUrl: alias });
        if (existingUrl) {
            return res.status(409).send({ msg: "Alias already in use" });
        }
        shortenUrl = alias;
        const url_constructor = new urlModel({ url: encryptedUrl, shortenUrl });
        await url_constructor.save();
        return res.status(201).send({ short_url: shortenUrl });
    } else {
        if (length) {
            shortenUrl = random(length, "lower");
            const existingUrl = await urlModel.findOne({ shortenUrl: alias });
            if (existingUrl) {
                shortenUrl = random(length, "lower");
            }
        } else {
            shortenUrl = random(6, "lower");
            const existingUrl = await urlModel.findOne({ shortenUrl: alias });
            if (existingUrl) {
                shortenUrl = random(6, "lower");
            }
        }
    }

    try {
        const url_constructor = new urlModel({ url: encryptedUrl, shortenUrl });
        await url_constructor.save();
        res.status(201).send({ short_url: shortenUrl });
    } catch (error) {
        console.log(error);
        res.status(500).send({ msg: "server error" });
    }
});

urlRouter.get("/:shortenUrl", auth, async (req, res) => {
    const { shortenUrl } = req.params;

    let find_shorten = await urlModel.findOne({ shortenUrl });

    if (find_shorten) {
        const decryptedUrl = cryptr.decrypt(find_shorten.url);
        return res.redirect(decryptedUrl);
    } else {
        res.send("no link asociated with this  link please check again");
    }
});


module.exports = { urlRouter }


