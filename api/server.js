const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const User = require('./models/User');
const UserInformation = require('./models/UserInformations');
const Sale = require('./models/Sale');
const Product = require('./models/Product');


const app = express();

const {
    faker
} = require('@faker-js/faker');
const UserInformations = require('./models/UserInformations');

app.use(cors());
app.use(express.json());

app.post('/add-user', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
            username: req.body.username,
            password: hashedPassword,
            isAdmin: req.body.isAdmin
        });
        const savedUser = await newUser.save();


        const newUserInfo = new UserInformation({
            userId: savedUser._id,
            username: req.body.username,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address,
            postalcode: req.body.postalcode,
            city: req.body.city,
            country: req.body.country,
            isAdmin: req.body.isAdmin
        });

        await newUserInfo.save();

        res.status(201).send('Utilisateur créé');
    } catch (error) {
        res.status(500).send('Erreur lors de la création de l’utilisateur');
    }
});

app.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
            username: req.body.username,
            password: hashedPassword,
            isAdmin: false
        });
        const savedUser = await newUser.save();


        const newUserInfo = new UserInformation({
            userId: savedUser._id,
            username: req.body.username,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address,
            postalcode: req.body.postalcode,
            city: req.body.city,
            country: req.body.country,
            isAdmin: false
        });

        await newUserInfo.save();

        let accessToken = jwt.sign({
                username: req.body.username,
                userId: savedUser._id,
                isAdmin: false
            },
            '1234', {
                expiresIn: '1h'
            }
        );

        res.json({
            accessToken: accessToken
        });

    } catch (error) {
        res.status(500).send('Erreur lors de la création de l’utilisateur');
    }
});
app.post('/generate-users', async (req, res) => {
    try {
        const numUsers = 20;

        for (let i = 0; i < numUsers; i++) {
            const hashedPassword = await bcrypt.hash(faker.internet.password(), 10);

            const newUser = new User({
                username: faker.internet.userName(),
                password: hashedPassword,
                isAdmin: faker.datatype.boolean({
                    probability: 0.01
                })
            });
            const savedUser = await newUser.save();


            const newUserInfo = new UserInformation({
                userId: savedUser._id,
                username: savedUser.username,
                firstname: faker.person.firstName(),
                lastname: faker.person.lastName(),
                email: faker.internet.email({
                    firstName: savedUser.username,
                    provider: "lyceedelasalle.fr"
                }),
                phone: faker.phone.number(),
                address: faker.location.streetAddress(),
                postalcode: faker.location.zipCode(),
                city: faker.location.city(),
                country: faker.location.country(),
                isAdmin: savedUser.isAdmin
            });
            await newUserInfo.save();
        }

        res.json({
            message: 'Utilisateurs générés avec succès'
        });
    } catch (error) {
        res.status(500).send('Erreur lors de la génération des utilisateurs');
    }
});
app.post('/generate-products', async (req, res) => {
    try {
        const numProducts = 50;

        for (let i = 0; i < numProducts; i++) {
            console.log(i)
            console.log(faker.commerce.productName())
            const product = new Product({
                name: faker.commerce.productName(),
                price: faker.number.int({
                    min: 1,
                    max: 10000
                }),
                description: faker.lorem.sentence(),
            });
            console.log(product)
            await product.save();
        }

        res.json({
            message: 'Products generated successfully'
        });
    } catch (error) {
        res.status(500).send('Error generating products');
    }
});

app.get('/get-users', authenticateToken, async (req, res) => {
    try {
        const usersWithInfo = await User.find();

        res.json(usersWithInfo);
    } catch (error) {
        res.status(500).send('Erreur du serveur');
    }
});

app.get('/search-users', authenticateToken, async (req, res) => {
    try {
        let json = `[{"$match": {"username": "${req.query.search}"}}]`
        console.log(json)
        let searchText = JSON.parse(json);
        const usersWithInfo = await User.aggregate(searchText);
        console.log("Result : ", usersWithInfo)
        res.json(usersWithInfo);
    } catch (error) {
        return
    }
});

app.post('/generate-data', async (req, res) => {
    try {
        const products = await Product.find();
        const users = await User.find();
        const numSales = 600;
        const currentYear = new Date().getFullYear();

        if (users.length === 0) {
            throw new Error('Aucun utilisateur trouvé');
        }

        for (let i = 0; i < numSales; i++) {
            const randomProduct = products[Math.floor(Math.random() * products.length)];
            const randomUser = users[Math.floor(Math.random() * users.length)];

            const month = Math.floor(Math.random() * 12);
            const day = Math.floor(Math.random() * 28) + 1;
            const date = new Date(currentYear, month, day);

            const sale = new Sale({
                date: date,
                amount: faker.number.int({
                    min: 1,
                    max: 50
                }),
                productId: randomProduct._id,
                userId: randomUser._id
            });
            await sale.save();
        }

        res.json({
            message: 'Données fictives générées avec succès'
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la génération de données fictives');
    }
});

app.get('/user-info', authenticateToken, async (req, res) => {
    console.log("REQ !", req.user);
    try {
        const userInfo = await UserInformation.findOne({
            userId: req.user.userId
        });
        console.log("USER INFO !", userInfo)
        if (!userInfo) {
            return res.status(404).send('Informations non trouvées');
        }
        res.json(userInfo);

    } catch (error) {
        res.status(500).send('Erreur du serveur');
    }
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, '1234', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}


app.post('/login', async (req, res) => {
    try {
        const {
            username,
            password
        } = req.body;

        // Ici, nous utilisons directement les valeurs de l'utilisateur dans la requête MongoDB
        // sans les valider ni les nettoyer.
        const user = await User.findOne({
            username: username
        });

        // Si aucun utilisateur n'est trouvé, retourner une erreur
        if (!user) {
            return res.status(400).send('Utilisateur non trouvé');
        }

        // Ici, nous ignorons la vérification du mot de passe pour simuler la vulnérabilité
        let accessToken = jwt.sign({
                username: user.username,
                userId: user._id,
                isAdmin: user.isAdmin
            },
            '1234', {
                expiresIn: '1h'
            }
        );

        res.json({
            accessToken: accessToken
        });
    } catch (error) {
        res.status(500).send('Erreur du serveur');
    }
});

app.get('/sales', async (req, res) => {
    try {
        const sales = await Sale.find().populate({
            path: 'userId',
            select: 'username'
        }).populate('productId');
        res.json(sales);
    } catch (error) {
        res.status(500).send('Erreur du serveur');
    }
});

app.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).send('Erreur du serveur');
    }
});

app.listen(3000);