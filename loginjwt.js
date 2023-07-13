--------------app.js-------------------
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const express = require('express');
const multer = require('multer')
const cookieParser = require('cookie-parser')
var parseurl = require('parseurl')
var session = require('express-session')
const path = require('path');
const passport = require('passport');
const passportConfig = require('./src/config/passport_555')
const cors = require('cors')
const http = require('http')
const bodyParser = require("body-parser");
const { ErrorHandler } = require('./src/middlewares/ErrorHandler');
const app = express();
const authCheck = require('./src/middlewares/Authenticate')
const os = require("os");
app.use("/public", express.static("public"));


const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    // cookie: { maxAge: oneDay },
    cookie: {
        httpOnly: true,
        secure: true,
        sameSite: true,
        // Session expires after 1 min of inactivity.
        maxAge: 24 * 60 * 60 * 1000
    }
}))
// console.log("app session", session)
app.use(cors())
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(passport.initialize())
app.use(passport.session())
// passportConfig(passport)
// require('dotenv').config();
require('./src/middlewares/Jwt')(passport)
const port = process.env.PORT;
const databae = process.env.DATABASE_URL;
const hostname = process.env.HOST_NAME;
app.get('/api/profile', authCheck, (req, res, next) => {
    console.log("ddd", req.user)
    res.json({ success: true, "message": "Show successfully" })
})

/* image uplod*/
// SET STORAGE
const prisma = require('./prisma/index')
const generateRandomNumber = Math.floor(Math.random() * 10000000000);
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public')
    },
    filename: function (req, file, cb) {
        // const fileName = Date.now() + '-' + file.originalname;
        // let target_file = req.files;
        // const generateRandomNumber = Math.floor(Math.random() * 10000000000);
        var fileName = file.originalname
        // const fileName = generateRandomNumber +'_'+new Date().getTime() + generateRandomNumber +'_'+file.originalname;
        // console.log('destination', destination)
        cb(null, +"-" + fileName);
    }
})

var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype == "image/png" ||
            file.mimetype == "image/jpg" ||
            file.mimetype == "image/jpeg"
        ) {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
        }
    },
})
A                                                                                                                                                                      p                                                                                                               p.post("/api/createPres", authCheck, upload.array('uploadImage', 10), async (req, res, next) => {
    try {


        L                                                                                 
                                              e                                                                                              t { empOldId, empName, requestFor, deliveryDate, relationReqEmp, rxDate, ageYear, ageMonth, ageDay, realtionDateOfBirth, prescriptionGenDate, presImageList, medicineDeliveryDate, presGenerateChildList } = req.body;
        const url = req.protocol + "://" + req.get("host");
        // console.log("image outside", Math.floor(Math.random() * 10000000000))
        // console.log(" req.file.path", __dirname)
        // console.log("bbod", medicineDeliveryDate)
        // console.log("a", empName)
        let result = await prisma.presGenerateParent.create({
            data: {
                empOldId,
                empName,
                requestFor,
                relationReqEmp,
                deliveryDate,
                rxDate,
                ageYear,
                ageMonth,
                ageDay,
                realtionDateOfBirth,
                prescriptionGenDate: new Date().toLocaleDateString(),
                prescriptionGenTime: new Date().toLocaleTimeString(),
                medicineDeliveryDate: new Date(medicineDeliveryDate).toLocaleDateString(),
                // prescriptionImage: url+"/public/"+req.file.filename,
                facilitiesType: 1,
                prescriptionStatus: 0,
                presGenUrlStatus: 1,
                orgId: req.user.orgId,
                presImage: {
                    create: JSON.parse(presImageList)
                },
                presGenerateChild: {
                    create: JSON.parse(presGenerateChildList)
                }
            }
        })
        res.json({ success: true, "message": "Save Successfully", result })
    } catch (error) {
        next(error)
    }
})

const router = require('./src/routes/indexRoute');
app.use('/api', router)
app.use(ErrorHandler)
app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
----------------------user - controoller.js-------------
const prisma = require('../../prisma/index.js')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const generateTokens = require('../utils/generateTokens')
const passport = require('passport')
const initializePassport = require('../../passport-config')
// const { user } = require('../../prisma/index.js')
const generateToken = require('../utils/generateTokens')
exports.getAll = async (req, res) => {
    try {
        const result = await prisma.user.findMany();
        res.send(result);
    } catch (error) {
        res.send(error)
    }
}
exports.signup = async (req, res, next) => {
    try {
        const { name, userName, password, email, roles, orgId } = req.body
        const findUser = await prisma.user.findFirst({
            where: {
                userName: userName
            }
        })



        if (findUser) {
            res.json({ success: true, "message": "User Already Exist", findUser });
        }
        const salt = await bcrypt.genSalt(Number(process.env.SALT))
        const hashPassword = await bcrypt.hash(password, salt)
        const user = await prisma.user.create({
            data: {
                name,
                userName,
                password: hashPassword,
                email,
                roles,
                orgId,
                activeStatus: 1
            }
        })
        res.json({ success: true, "message": "Save Successfully", user });
    } catch (err) {
        next(err)
    }
}

exports.login = async (req, res, next) => {
    try {
        let { userName, password } = req.body;
        // console.log("userInfo ccc", password)
        // user name required validation
        if (!userName) {
            res.json({ success: false, "message": "Please provide username" });
        }
        //password required validation
        if (!password) {
            res.json({ success: false, "message": "Please provide password" });
        }
        const userInfo = await prisma.user.findFirst({
            where: {
                userName: userName
            }
        })
        // console.log("userInfo ccc", userInfo)
        const usInfo = await prisma.user.findFirst({
            where: {
                userName: userName
            }
        })
        // console.log("userInfo", userInfo)
        //verify password
        const verifiedPassword = await bcrypt.compare(password, userInfo.password)
        if (!verifiedPassword) {
            res.send({ error: true, "message": "Invalied Password" })
        }
        const { accessToekn } = await generateTokens(userInfo)
        // req.session.save();
        const { id, roles, orgId } = userInfo
        Res.send({ error: false, "message": "Login Successfully", token: 'bearer ' + a            ccessToekn, id, roles, orgId })
    } catch (error) {
        next(error)
    }




}

exports.authenticateToken = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    if (token == null) return res.sendStatus(4001)
    jwt.verify(token, process.env.ACCESS_TOKEN_PRIVATE_KEY, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}
exports.userLogOut = async (req, res, next) => {
    try {
        // console.log('rrr', res)
        res.clearCookie('jwt');
        res.json({ success: true, "message": "Logout Successfully" });
    } catch (error) {
        next(error)
    }
}




function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
}


--------auth---------
const jwt = require('jsonwebtoken')
const config = process.env
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    console.log("new token", token)
    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, config.ACCESS_TOKEN_PRIVATE_KEY, function (err, decoded) {
            if (err) {
                return res.status(401).json({ "error": true, "message": 'Unauthorized access.' });
            }
            req.decoded = decoded;
            next();
        });



    } else {
        // if there is no token
        // return an error
        return res.status(403).send({
            "error": true,
            "message": 'No token provided.'
        });
    }



};
module.exports = verifyToken;

--------------- Authertication.js--------------
const passport = require("passport");
module.exports = (req, res, next) => {
    passport.authenticate('jwt', function (err, user, info) {
        if (err) return next(err);
        if (!user) {
            if (info.name === 'TokenExpiredError') {
                return res.json({ success: true, "message": "Jwt Token Expired!" });
            }
            if (info.name === 'JsonWebTokenError') {
                return res.json({ success: true, "message": "Invalid Token!" });
            }
            return res.json({ success: true, "message": "Unauthorized Access - No Token Provided!" });
        }
        req.user = user;
        next();
    })(req, res, next);
};

--------------- islogged.js--------------
const jwt = require('jsonwebtoken')
const isLoggedIn = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            return res.status(403).send('A token is required for authentication');
        }
        try {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_PRIVATE_KEY);
            // const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_PRIVATE_KEY);
            const userInfo = await prisma.user.findFirst({
                where: {
                    id: decoded.id
                },
                include: {
                    userToken: true
                }
            })
            if (!userInfo) {
                return res.status(401).send('Token Invalid');
                // res.json({ success: false, "message": "Token Invalied"})
                // return res.status(401).send('Not');
            }
            req.userInfo = userInfo
            // req.token = token
            // next()
            // req.userName = userInfo;
        } catch (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(401).send('Session timed out,please login again');
                // res.json({ success: false, "message": "Session timed out,please login again"})
            } else if (err.name === "JsonWebTokenError") {
                return res.status(401).send('User Inter Invalid Token');
                // res.json({ success: false, "message": "User Inter Invalid Token"})
            }
            return next();
            // return res.status(401).send('Not Authorized User Invalid Token');
        }
        req.user = userInfo;
        return next();
    } catch (error) {
        return next(error)
    }
}
module.exports = isLoggedIn

------------------jwt.js----------

const prisma = require('../../prisma/index')
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
// const User = require('../models/user');
const passport = require('passport')
const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.ACCESS_TOKEN_PRIVATE_KEY
};
module.exports = passport => {
    passport.use(
        new JwtStrategy(opts, (jwt_payload, done) => {
            try {
                prisma.user.findFirst({
                    where: {
                        userName: jwt_payload.userName
                    },
                }).then(user => {
                    if (user) {
                        // console.log('user found in db in passport');
                        done(null, user);
                    } else {
                        // console.log('user not found in db');
                        done(null, false);
                    }
                });
            } catch (err) {
                done(err);
            }


        })
    );
};

----------upload------------------
const multer = require('multer')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/upload')
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname + '-' + Date.now();
        cb(null, +"-" + fileName);
    }
})
var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype == "image/png" ||
            file.mimetype == "image/jpg" ||
            file.mimetype == "image/jpeg"
        ) {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
        }
    },
}).single("file")
// var uploadFiles = multer({ storage: storage }).single("file");
// var uploadFilesMiddleware = promisify(upload);
module.exports = upload;

--------------- jenerate token.js--------------
const prisma = require('../../prisma/index')
const jwt = require('jsonwebtoken')
const generateTokens = async (userInfo) => {
    try {
        const uId = userInfo.id
        const payload = {
            id: userInfo.id,
            roles: userInfo.roles,
            userName: userInfo.userName,
            email: userInfo.email,
            orgId: userInfo.orgId
        }
        // console.log("payload user", payload)
        const accessToekn = jwt.sign(
            payload,
            process.env.ACCESS_TOKEN_PRIVATE_KEY,
            { expiresIn: "60m" }
        )
        const refreshToken = jwt.sign(
            payload,
            process.env.REFRESH_TOKEN_PRIVATE_KEY,
            { expiresIn: "30d" }
        )
        // const saveToken =
        return Promise.resolve({ accessToekn, refreshToken })
    } catch (error) {
        return Promise.reject(error)
    }
}
module.exports = generateTokens
----------- distribution.js---------
const prisma = require('../../prisma/index')


