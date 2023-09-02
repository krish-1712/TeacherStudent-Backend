var express = require('express');
const mongoose = require('mongoose')
const { dbUrl } = require('../Common/dbConfig');

const { detailsModel } = require('../Schemas/DetailsSchemas');
const { teacherModel } = require('../Schemas/TeacherSchemas');
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')
const { hashPassword, hashCompare, createToken, validate } = require('../Common/auth');
const { userModel } = require('../Schemas/UserSchemas');




mongoose.connect(dbUrl)

var router = express.Router();







router.post("/", async (req, res) => {
    try {
        const newUser = req.body;

        const createdUser = await detailsModel.create(newUser);

        res.status(201).json({ createdUser });
    } catch (error) {
        res.status(500).json({
            error,
            message: "User creation failed",
            statusCode: 500,
        });
    }
});



router.put("/users/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const updatedData = req.body;

        const updatedUser = await detailsModel.findOneAndUpdate(
            { _id: userId },
            updatedData,
            { new: true }
        );

        if (updatedUser) {
            res.status(200).json(updatedUser);
        } else {
            res.status(404).json({
                message: "User not found",
                statusCode: 404,
            });
        }
    } catch (error) {
        res.status(500).json({
            error,
            message: "Error updating user details",
            statusCode: 500,
        });
    }
});



router.delete("/users/:userId", async (req, res) => {
    console.log("jj")
    try {
        const userId = req.params.userId;
        console.log(userId);

        const deletedUser = await detailsModel.findByIdAndDelete(userId);

        if (deletedUser) {
            res.status(200).json({
                message: "User deleted successfully",
                statusCode: 200,
            });
        } else {
            res.status(404).json({
                message: "User not found",
                statusCode: 404,
            });
        }
    } catch (error) {
        res.status(500).json({
            error,
            message: "Error deleting user",
            statusCode: 500,
        });
    }
});




router.get("/users/:userId", async (req, res) => {
    console.log("kik")
    try {
        const userId = req.params.userId;
        console.log(userId);

        const user = await detailsModel.findById(userId);
        console.log(user)

        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({
                message: "User not found",
                statusCode: 404,
            });
        }
    } catch (error) {
        res.status(500).json({
            error,
            message: "Error fetching user details",
            statusCode: 500,
        });
    }
});



router.get("/users", async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log(userId)

        const user = await detailsModel.findById(userId);

        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({
                message: "User not found",
                statusCode: 404,
            });
        }
    } catch (error) {
        res.status(500).json({
            error,
            message: "Error fetching user details",
            statusCode: 500,
        });
    }
});

router.post("/teacher", async (req, res) => {
    console.log('tet')
    try {
        const newTeacherData = req.body;
        console.log(newTeacherData)
        const newTeacher = await teacherModel.create(newTeacherData);

        res.status(201).json(newTeacher);
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error,
            message: "Error adding new teacher",
            statusCode: 500,
        });
    }
});


router.put("/teacher/:teacherId", async (req, res) => {
    console.log("wef")
    try {
        const teacherId = req.params.teacherId;
        console.log(teacherId)
        const updatedData = req.body;

        const updatedTeacher = await teacherModel.findOneAndUpdate(
            { _id: teacherId },
            updatedData,
            { new: true }
        );

        if (updatedTeacher) {
            res.status(200).json(updatedTeacher);
        } else {
            res.status(404).json({
                message: "Teacher not found",
                statusCode: 404,
            });
        }
    } catch (error) {
        res.status(500).json({
            error,
            message: "Error updating teacher details",
            statusCode: 500,
        });
    }
});


router.delete("/teacher/:teacherId", async (req, res) => {
    try {
        const teacherId = req.params.teacherId;

        const deletedTeacher = await teacherModel.findByIdAndDelete(teacherId);

        if (deletedTeacher) {
            res.status(200).json({
                message: "Teacher deleted successfully",
                statusCode: 200,
            });
        } else {
            res.status(404).json({
                message: "Teacher not found",
                statusCode: 404,
            });
        }
    } catch (error) {
        res.status(500).json({
            error,
            message: "Error deleting teacher",
            statusCode: 500,
        });
    }
});


router.get("/getallteacher", async (req, res) => {
    try {
        console.log("getallteacher")
        const teacher = await teacherModel.find();
        console.log(teacher)
        res.status(200).json({
            teacher,
            message: "Teacher Details fetched successfully",
            statusCode: 200,
        });

    } catch (error) {
        res.status(500).json({
            error,
            message: "Error fetching teacher details",
            statusCode: 500,
        });
    }
});

router.get("/getallusers", async (req, res) => {
    console.log('getalluser')
    try {
        const teacher = await detailsModel.find();
        console.log(teacher)
        res.status(200).json({
            teacher,
            message: "User Details fetched successfully",
            statusCode: 200,
        });

    } catch (error) {
        res.status(500).json({
            error,
            message: "Error fetching User details",
            statusCode: 500,
        });
    }
});


router.get("/teacher/:teacherId", async (req, res) => {
    try {
        const teacherId = req.params.teacherId;

        const teacher = await teacherModel.findById(teacherId);

        if (teacher) {
            res.status(200).json(teacher);
        } else {
            res.status(404).json({
                message: "Teacher not found",
                statusCode: 404,
            });
        }
    } catch (error) {
        res.status(500).json({
            error,
            message: "Error fetching teacher details",
            statusCode: 500,
        });
    }
});


router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (user) {
            const passwordMatches = await hashCompare(password, user.password);

            if (passwordMatches) {
                const token = await createToken({
                    email: user.email,
                    userId: user._id
                });

                return res.status(200).send({
                    message: 'User Login Successfully!',
                    token,
                    userId: user._id,
                    role: user.role // Include the user's role in the response
                });
            } else {
                return res.status(401).send({
                    message: 'Invalid Credentials'
                });
            }
        } else {
            return res.status(400).send({
                message: 'User Does Not Exist!'
            });
        }
    } catch (error) {
        console.error('Login Error:', error);
        return res.status(500).send({
            message: 'Internal Server Error',
            error
        });
    }
});



router.post('/signup', async (req, res) => {
    try {
        let user = await userModel.findOne({ email: req.body.email })
        console.log(user)

        if (!user) {
            let hashedPassword = await hashPassword(req.body.password)
            req.body.password = hashedPassword
            let user = await userModel.create({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                password: req.body.password,
                role: req.body.role,

            })
            console.log(user)
            res.status(200).send({
                message: "Users Created Successfully!",
                user,

            })
        }
        else {
            res.status(400).send({
                message: 'Users Already Exists!'
            })
        }

    } catch (error) {
        res.status(500).send({
            message: 'Internal Server Error',
            error
        })
    }
})


router.post("/reset", async (req, res) => {
    try {
        let user = await userModel.findOne({ email: req.body.values.email })
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        const token = jwt.sign({ userId: user.email }, process.env.secretkey, { expiresIn: '1h' });

        let transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.example.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD

            },
        });
        const queryParams = new URLSearchParams();
        queryParams.set('token', token);
        const queryString = queryParams.toString();
        let details = {
            from: "greenpalace1712@gmail.com",
            to: user.email,
            subject: "Hello ✔",
            html: `
        <p>Hello,</p>
        <p>Please click on the following link to reset your password:</p>
        <a href="${process.env.CLIENT_URL}/password?${queryString}">Reset Password</a>
        <p>If you didn't request this, please ignore this email.</p>
      `
        };
        await transporter.sendMail(details)
        res.status(200).send({ message: 'Password reset email sent' })
        console.log(details)


    } catch (error) {
        res.status(500).send({
            message: "Internal Server Error",
            error,
        });
    }
});


router.post('/password-reset', async (req, res, next) => {


    try {
        const users = await userModel.findOne({ email: req.body.email });

        const token = req.body.token;

        let hashedPassword = await hashPassword(req.body.password)


        let decodedToken = jwt.verify(token, process.env.secretkey)

        console.log("decoded : " + decodedToken)
        const userId = decodedToken.userId;

        const filter = { email: userId };
        const update = { password: hashedPassword };

        const doc = await userModel.findOneAndUpdate(filter, update);



        res.status(200).send({
            message: "Password Reset successfully",
        })

    } catch (error) {
        res.status(400).send({
            message: "Some Error Occured",
        })
    }
})




module.exports = router;