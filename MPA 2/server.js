
// pour charger notre application 
var express = require('express');

var mongojs = require('mongojs');

// utilisation body-paser 
var bodyParser = require('body-parser');

// utilisation de notre base de données des serveur
var db= mongojs('items', ['items']); 

var app = express();

app.use(express.static(__dirname+"/public"));

app.use(bodyParser.json());

app.get('/items', function(req, res){

    console.log("I received request from controller ! ")

    db.items.find(function(err, docs){
        console.log(docs);
        res.json(docs);
        console.log("===> find")
    })
/*     var items = [{
		id: 1,
		label: 'http://geoprocessing.demo.52north.org:8080/wps/WebProcessingService',
	},
	{
		id: 2,
		label: 'https://geobretagne.fr/geoserver/ows',
	}
	];
    res.json(items); */
});

// reception ajout serveur 
app.post('/items', function(req, res){
      var str = req.body 
      console.log("coucou!!!!!!!!!"+str);
      db.items.insert(req.body, function(err, doc){
      res.json(doc);
      })
});

//update
//reception ajout serveur 
app.put('/items/:id', function(req, res){
      var id = req.params.id 
      console.log("ppp"+req.body.id);
      db.items.findAndModify({query: {_id: mongojs.ObjectId(id)},
      update: {$push: {process:{name:req.body.process}}},
  new:true}, function(err,doc){
      res.json(doc);
  });

});
// suppression serveur 
app.delete('/items/:id', function(req, res){
    var id = req.params.id;
    console.log(id);
    db.items.remove({_id: mongojs.ObjectId(id)}, function (err, doc){
        res.json(doc);
    })
})

// suppression process en mettant un pull sur lui 
app.post('/items2/:id/:process', function(req, res){
    var id = req.params.id;
    var proc = req.params.process
    console.log("yes"+id);
    db.items.update({_id: mongojs.ObjectId(id)},{ $pull: { process: {name : proc} }}, function (err, doc){
        res.json(doc);
    })
})





// affichage sur le port 8080
app.listen(8080)
console.log("Server is running on port 8080")





