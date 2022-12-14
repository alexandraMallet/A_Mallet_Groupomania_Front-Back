const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const validEmail = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;        //regex pour l'email. Normalement pris en charge par le front, mais mieux vaux double sécurité
const validPassword = /^[^\s]{8,}$/;                           //regex pour le password. idem email.
const fs = require("fs");
const Post = require("../models/Post");

exports.signup = (req, res, next) => {
    if (!req.body.email.match(validEmail)) {                                                             //regex évitent d'appeler inutilement la BDD en cas d'erreur de saisie
        return res.status(400).json({ message: "email incorrect" });
    }
    if (!req.body.password.match(validPassword)) {
        return res.status(400).json({ message: "le mot de passe doit contenir au moins 8 caracères" });
    }

    User.findOne({ email: req.body.email })                                                                  //recherche si l'email correspond déjà à un compte
        .then(user => {
            if (user) {                                                                                      //sécurité : impossible de créer 2 comptes avec le même email
                return res.status(409).json({ message: "impossible de créer un compte avec cet email" });    //le message ne dévoile pas explicitement qu'un compte existe déjà avec cet email
            }
            bcrypt.hash(req.body.password, 10)                                                              // hachage du mot de passe
                .then(hash => {
                    const user = new User({
                        email: req.body.email,
                        pseudo: req.body.pseudo,
                        password: hash,
                        isAdmin: false,
                        avatarUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
                    });
                    user.save()                                                                                        // enregistrement du nouvel user dans la BDD, après toutes les vérifications
                        .then(() => res.status(200).json({
                            userId: user._id,
                            isAdmin: user.isAdmin,
                            pseudo: user.pseudo,
                            token: jwt.sign(                                                                         //création et attribution d'un jeton de connextion JSON web token
                                {
                                    userId: user._id,
                                    isAdmin: user.isAdmin
                                },
                                process.env.SECRET_TOKEN,
                                { expiresIn: "24h" }
                            )
                        }))
                        .catch(error => res.status(500).json({ error }));
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};


exports.login = (req, res, next) => {
    if (!req.body.email.match(validEmail)) {                                                                //regex évitent appel BDD dans le cas d'erreur de saisie
        return res.status(400).json({ message: "email incorrect" });
    }
    if (!req.body.password.match(validPassword)) {
        return res.status(400).json({ message: "le mot de passe doit contenir au moins 8 caractères" });
    }
    User.findOne({ email: req.body.email })                                                                  //recherche de l'user dans la BDD
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: "paire identifiant - mot de passe incorrecte - A" });      //si l'user n'est pas dans la BDD, le message ne le révèle pas explicitement
            } else {
                bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        if (!valid) {                                                                                       //gestion erreur password
                            return res.status(401).json({ message: "paire identifiant - mot de passe incorrecte - B" });
                        } else {
                            res.status(200).json({
                                userId: user._id,
                                isAdmin: user.isAdmin,
                                pseudo: user.pseudo,
                                token: jwt.sign(                                                                         //création et attribution d'un jeton de connextion JSON web token
                                    {
                                        userId: user._id,
                                        isAdmin: user.isAdmin
                                    },
                                    process.env.SECRET_TOKEN,
                                    { expiresIn: "48h" }
                                )
                            });
                        }
                    })
                 .catch(error => res.status(500).json({ error }));
            }
        })
     .catch(error => res.status(500).json({ error }));
};


exports.getOneUser = (req, res, next) => {
    User.findOne({ _id: req.params.id }).populate("posts")
        .then((user) => res.status(200).json(user))
    .catch((error) => res.status(404).json({error}));
};

exports.modifyUser = (req, res, next) => {

    User.findOne({ _id: req.params.id })
        .then(user => {

            if (user._id != req.auth.userId) {
                return res.status(403).json({ message: "ce compte n'est pas le vôtre, vous ne pouvez pas le modifier" });
            }

            if (req.body.password) {
                bcrypt.hash(req.body.password, 10)
                    .then(hash => {
                        if (req.file) {
                            fs.unlink(`images/${user.avatarUrl.split("/images/")[1]}`, () => {
                                user.avatarUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
                                User.updateOne({ _id: req.params.id }, {
                                    ...req.body,
                                    password: hash,
                                    avatarUrl: user.avatarUrl,
                                    isAdmin: !req.auth.isAdmin ? false : req.body.isAdmin
                                })
                                    .then(() => res.status(200).json({ message: "compte modifié" }))
                                    .catch((error) => res.status(500).json({ error }));
                            })
                        } else {
                            User.updateOne({ _id: req.params.id }, {
                                ...req.body,
                                password: hash,
                                isAdmin: !req.auth.isAdmin ? false : req.body.isAdmin
                            })
                                .then(() => res.status(200).json({ message: "compte modifié" }))
                             .catch((error) => res.status(500).json({error}));
                        }
                    })
            } else {
                if (req.file) {
                    fs.unlink(`images/${user.avatarUrl.split("/images/")[1]}`, () => {
                        user.avatarUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
                        User.updateOne({ _id: req.params.id }, {
                            ...req.body,
                            avatarUrl: user.avatarUrl,
                            isAdmin: !req.auth.isAdmin ? false : req.body.isAdmin
                        })
                            .then(() => res.status(200).json({ message: "compte modifié" }))
                          .catch((error) => res.status(500).json({error}));
                    })
                } else {
                    User.updateOne({ _id: req.params.id }, {
                        ...req.body,
                        isAdmin: !req.auth.isAdmin ? false : req.body.isAdmin
                    })
                        .then(() => res.status(200).json({ message: "compte modifié" }))
                     .catch((error) => res.status(500).json({error}));
                }
            }
        })
    .catch((error) => res.status(400).json({error}));

};

exports.deleteUser = (req, res, next) => {

    User.findOne({ _id: req.params.id })
        .then(user => {
            if (user._id != req.auth.userId && !req.auth.isAdmin) {
                return res.status(409).json({ message: "Vous n'avez pas les droits pour supprimer ce compte" });
            }
            fs.unlink(`images/${user.avatarUrl.split("/images/")[1]}`, () => {
                User.deleteOne({ _id: req.params.id })
                    .then(() => Post.deleteMany({ userId: req.params.id }))
                    .then(() => res.status(200).json({ message: `compte ${user._id} attaché au mail ${user.email}, et au pseudo ${user.pseudo} supprimé` }))
                    .catch((error) => res.status(400).json({ error }));
            })
        })
        .catch((error) => res.status(500).json({ error }));
};





exports.getAllUser = (req, res, next) => {
    if (!req.auth.isAdmin) {
        return res.status(409).json({ message: "Requête impossible" })
    }
    else {
        User.find()
            .then(users => res.status(200).json(users))
    }

};