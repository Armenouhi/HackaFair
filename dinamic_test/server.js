var express = require('express');
const bodyParser= require('body-parser');
var path = require('path');
var app = express();

var MongoClient = require('mongodb').MongoClient;
const collOne = 'level_1_questions';
const collTwo = 'level_2_questions';
const collThree = 'level_3_questions';


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var cors = require('cors');
app.use(cors());


app.use(express.static(path.join(__dirname +'')))

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});


    app.post('/student', function (req, res) {



    // console.log(req.body);

        var Errors = {};
    success = true;

    var reg = /[^Ա-Ֆա-ֆ]/;


    if (req.body.name == undefined) {
        Errors.name_error = "Լրացրե՛ք, անվան դաշտը";
        success = false;
    }
    else {
        if (req.body.name.match(reg)) {
            Errors.name_error = "Մուտքագրե՛ք, միայն հայերեն տառեր";
            success = false;
        }
    }
    if(req.body.lastname == undefined){
        Errors.lastname_error = "Լրացրե՛ք, ազգանունը";
        success = false;
    }
    else {
        if (req.body.lastname.match(reg)) {
            Errors.lastname_error = "Մուտքագրե՛ք, միայն հայերեն տառեր";
            success = false;
        }
    }
    if (req.body.email == undefined){
        Errors.email_error = "Լրացրե՛ք, էլ. փոստի դաշտը";
        success = false;
    } else {
        var regEmail = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
        if (!req.body.email.match(regEmail)) {
            Errors.email_error = "Մուտքագրեք ինչպես նշված է օրինակում";
            success = false;
        }
    }
    if (req.body.address == undefined){
        Errors.address_error = "Լրացրե՛ք, հասցեն";
        success = false;
    }

    if (req.body.schoolName == undefined) {
        Errors.schoolName_error = "Լրացրե՛ք,դպրոցի անունը";
        success = false;
    }
    if (req.body.class == undefined) {
        Errors.class_error = "Նշե՛ք դասարանը";
        success = false;
    } else {
        var regclass = /[^0-9]/;
        if (req.body.class.match(regclass)) {
            Errors.class_error = "Մուտքագրե՛ք, միայն թվեր";
            success = false;
        }
    }
    if (req.body.subject == undefined){
        Errors.subject_error = "Ընտրեք առարկան";
        success = false;
    }

    if (success == false)  {
        res.send(Errors);
    } else  {

        var dbHeq = req.body.subject;
        var DBUrl = "mongodb://localhost:27017/" +dbHeq;
        // console.log(DBUrl);
        // console.log(dbHeq);


        app.get('/test_1', function (req, res) {

            MongoClient.connect(DBUrl,  { useNewUrlParser: true },function (err, client) {
                if (err) throw err

                var db = client.db(dbHeq)
                db.collection(collOne).find().toArray(function (err, userData) {
                    if (err) throw err
                    res.send(userData);
                })
            });
        })

        app.get('/test_2', function (req, res) {

            MongoClient.connect(DBUrl,  { useNewUrlParser: true },function (err, client) {
                if (err) throw err

                var db = client.db(dbHeq)
                db.collection(collTwo).find().toArray(function (err, userData) {
                    if (err) throw err
                    res.send(userData);
                })
            });
        })


        app.get('/test_3', function (req, res) {

            MongoClient.connect(DBUrl,  { useNewUrlParser: true },function (err, client) {
                if (err) throw err

                var db = client.db(dbHeq)
                db.collection(collThree).find().toArray(function (err, userData) {
                    if (err) throw err
                    res.send(userData);
                })
            });
        })


        app.post('/account', function (req, res) {




            MongoClient.connect(DBUrl, { useNewUrlParser: true }, function (err, client) {
                console.log(DBUrl);
                if (err) throw err

                var db = client.db(dbHeq)
                var myobj = req.body;
                db.collection("students").insertOne(myobj, function(err, res) {
                    if (err) throw err
                    // console.log("1 document inserted");
                    client.close();
                })
            });
            // console.log(req.body.name);
            // console.log(req.body.lastname);
            // console.log(req.body.email);
             console.log(req.body.count);


            var nodemailer = require('nodemailer');

            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'fornodejstest@gmail.com',
                    pass: 'mxonazul111'
                }
            });

            const mailOptions = {
            // from: 'injyannazik@gmail.com', // sender address
                to: req.body.email, // list of receivers
                subject: 'Examen score', // Subject line
                html: '<p> Dear ' + req.body.name + " " + req.body.lastname + " Your score of " + req.body.subject + " is equal to " + req.body.count + '</p>'// plain text body
            };

            transporter.sendMail(mailOptions, function (err, info) {
                if(err)  {
                    // console.log(err)
                }
                else {
                    // console.log(info);
                }

            });

var resultat ={resultat :"Ձեր քննության արդյունքը հաջողությամբ ուղարկվել է Ձեր էլ-փոստին"};
            res.send(resultat);

        })

    }




    res.end();

})

app.get('/subjectFizica', function (req, res) {

    MongoClient.connect("mongodb://localhost:27017/fizika",  { useNewUrlParser: true },function (err, client) {
        if (err) throw err

        var db = client.db("fizika")
        db.collection('students').find().toArray(function (err, userData) {
            if (err) throw err
            res.send(userData);
        })
    });
})
app.get('/subjectInformatica', function (req, res) {

    MongoClient.connect("mongodb://localhost:27017/informatica",  { useNewUrlParser: true },function (err, client) {
        if (err) throw err

        var db = client.db("informatica")
        db.collection('students').find().toArray(function (err, userData) {
            if (err) throw err
            res.send(userData);
        })
    });
})
app.get('/subjaectMatematica', function (req, res) {

    MongoClient.connect("mongodb://localhost:27017/matematica",  { useNewUrlParser: true },function (err, client) {
        if (err) throw err

        var db = client.db("matematica")
        db.collection('students').find().toArray(function (err, userData) {
            if (err) throw err
            res.send(userData);
        })
    });
})



app.post('/info_questions', function (req, res) {
    console.log(req.body);

    MongoClient.connect("mongodb://localhost:27017/informatica", {useNewUrlParser: true}, function (err, client) {
        console.log("mongodb://localhost:27017/informatica");
        if (err) throw err

        var db = client.db("informatica")
        var myobj = req.body.obj1;
        db.collection(collOne).insertOne(myobj, function (err, res) {
            if (err) throw err
            console.log("1 document inserted col1");
            client.close();
        })
    });

    MongoClient.connect("mongodb://localhost:27017/informatica", {useNewUrlParser: true}, function (err, client) {
        console.log("mongodb://localhost:27017/informatica");
        if (err) throw err

        var db = client.db("informatica")
        var myobj = req.body.obj2;
        db.collection(collTwo).insertOne(myobj, function (err, res) {
            if (err) throw err
            console.log("1 document inserted col2");
            client.close();
        })
    });

    MongoClient.connect("mongodb://localhost:27017/informatica", {useNewUrlParser: true}, function (err, client) {
        console.log("mongodb://localhost:27017/informatica");
        if (err) throw err

        var db = client.db("informatica")
        var myobj = req.body.obj3;
        db.collection(collThree).insertOne(myobj, function (err, res) {
            if (err) throw err
            console.log("1 document inserted col3");
            client.close();
        })
    });



});

var server = app.listen(8081, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
});