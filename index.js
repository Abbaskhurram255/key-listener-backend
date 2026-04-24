const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const helmet = require("helmet");
const { Resend } = require("resend");
const resend = new Resend(process.env.API_Key);

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.status(400).json({ error: "Missing request id", code: 400 });
});

app.get("/:id", (req, res) => {
    let { id } = req.params;
    id = id.trim();
    if (!/^\w+$/.test(id)) {
        res.status(400).json({ error: "Invalid request id", code: 400 });
        return;
    }
    const params = req.query || {};
    console.log(`Processing request for ID: ${id}`);
    resend.emails.send({
        from: "onboarding@resend.dev",
        to: "abbaskhurram255@gmail.com",
        subject: "The backend is ready",
        html: `<p>User pressed key: '${id}'</p>`,
    });
    res.status(200).json({
        message: `Request for ID ${id} processed successfully`,
        code: 200,
    });
});

app.use((req, res) => {
    res.status(404).json({ error: "404 Page Not Found", code: 404 });
});

app.use((req, res) => {
    res.status(500).json({ error: "Internal Server Error", code: 500 });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

module.exports = app;
