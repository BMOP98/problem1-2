const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../../modules/dbconect');
var nodemailer = require('nodemailer');
const { ObjectId } = require('mongodb');

router.post('/:item_valueid', async (req, res) =>{
    try {
        const { date, hour } = req.body;
        const { item_valueid } = req.params;
        const db = await connectToDatabase();
        const CosultClient = db.collection("costumers");
        const information = await CosultClient.find({_id: new ObjectId(item_valueid)}).toArray();


        var text = "<h2> RESERVACION EN REATURANTE </h2> <br /> <br />" 
        text += "Estimado: " +  information[0].name + " " + information[0].lastname + "<br /><br />"
        text += "Hemos realizado tu reservacion en nuestro restaurante con la siguiente informacion: " + "<br /><br />"
        text += "Fecha: " + date + "<br />"
        text += "Hora:  " + hour + "<br />"
        text += " ¡Gracias por su reservacion! <br />"
        text += " ¡Por favor estar con 15 minutos de anticipacion! "



        var transporter = nodemailer.createTransport({
            service: 'hotmail',
            auth: {
                user: 'maximo.98@hotmail.com',
                pass: '@BMOPpineda1'
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        var mailOptions = {
            from: 'maximo.98@hotmail.com',
            to: information[0].mail,
            subject: 'Detalle de Reservación',
            html: text
        };
    
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                res.status(500).json({ error: error.message });
            } else {
                res.status(201).json("ok");
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;