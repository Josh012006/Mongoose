// Importation du module mongoose
const mongoose = require('mongoose');
require('dotenv').config({ path: './private.env' });

// Importation de l'uri
const uri = process.env.MONGO_URI;



// Création d'une fonction asynchrone dans laquelle toutes les opérations CRUD se réaliseront
const main = async function () {
    try {
        // Connection à la base de donnée MongoDB
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })


        // Création d'un nouveau schéma de personnes
        const personSchema = new mongoose.Schema({
            name: {
                type:String,
                required: true
            },
            age: Number,
            favoriteFoods: [String]
        });



        // Création de la classe de model de personnes
        const personModel = mongoose.model('test', personSchema, 'test');



        // Création d'un nouveau document
        let document = await new personModel({
            name: "Josué Mongan",
            age: 18,
            favoriteFoods: ["Riz", "Alloco"]
        });



        // Enregistrement du document dans la base de données
        let savedFile = await document.save();

        console.log("Fichier enregistré avec succès:", savedFile);



        // Un tableau d'éléments personnes
        const arrayOfPeople = [
            {
                name: "John Riehman",
                age: 24,
                favoriteFoods: ["Igname frite", "Riz"]
            },
            {
                name: "Grâce Akpo",
                age: 30,
                favoriteFoods: ["Pâte de maïs", "Spaghetti"]
            }
        ]


        // On insère maintenant cet ensemble de personnes avec la méthode create
        let result = await personModel.create(arrayOfPeople);
        console.log("Ensemble de documents enregistré avec succès:", result);




        // Chercher pour toutes les personnes qui ont le nom John Riehman
        let searchResult = await personModel.find({name: "John Riehman"});
        console.log("Les personnes avec pour nom John Riehman:", searchResult);



        // Chercher la première personne qui a le Riz parmi ses plats préférés
        let riceLover = await personModel.findOne({favoriteFoods: "Riz"});
        console.log("La première personne qui a le Riz parmi ses plats préférés:", riceLover);



        // Chercher la personne par son _id
        let personId = new mongoose.Types.ObjectId('662d372eb14487247f1b9986');
        let searchedPerson = await personModel.findById(personId);
        console.log("Les informations de la personne avec l'id sélectionné sont:", searchedPerson);



        // Chercher une personne et ajouter hamburger dans son tableau de repas préférés
        let modifiedPerson = await personModel.findById(personId);

        modifiedPerson.favoriteFoods.push("Hamburger");

        let savedModifiedPerson = await modifiedPerson.save();

        console.log("Opération réalisée avec succès:", savedModifiedPerson);



        // Modifier une personne avec findOneAndUpdate
        let personName = "Peter Parker";
        let modification = await personModel.findOneAndUpdate({name: personName}, {$set:{age: 20}}, {new:true});

        console.log("Deuxième opération de modification réussie:", modification);


        // Supprimer une personne grâce à son id
        let removedPerson = await personModel.findByIdAndDelete(personId);
        console.log("La personne supprimée est:", removedPerson);



        // Utiliser model.deleteMany pour supprimer tout ceux qui ont pour nom Mary
        let removeResults = await personModel.deleteMany({name: "Mary"});
        console.log("Les résultats de la suppression des individus nommés Mary:", removeResults);


        // Recherche avec les aides à la recherche
        let queryResults = await personModel.find({favoriteFoods: "Burritos"}).sort({name: 1}).limit(2).select({age: false}).exec();
        console.log("Les résultats de la recherche sont:", queryResults);



    } catch (error) {
        console.log("Une erreur s'est produite au cours du processus:", error);
    } finally {
        // On ferme la connection
        mongoose.connection.close();
        console.log("Connection arrêtée correctement.");
    }
};

main();

