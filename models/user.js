import mongoose from "mongoose"
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { notDeepStrictEqual } from "assert"

const UserSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: [true, 'Please include a name!']
    },
    email: {
        type: String,
        required: [true, 'Please include n email!'],
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          'Please add a valid email'
        ],
        unique: [true, 'Email already taken!']
    },
    role: {
        type: String,
        enum: ['user'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Please add a password!'],
        minlength: [6, 'Password must be at least 6 characters!'],
        select: false
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpire: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next()
    }

    const salt = await bcryptjs.genSalt(10)
    this.password = await bcryptjs.hash(this.password, salt)

    next()
})

UserSchema.methods.getSignedJwt = function () {
    return jwt.sign(
        { id: this._id },
        process.env.JWT_SECRET
     )
}

UserSchema.methods.checkPassword = async function (password) {
    return await bcryptjs.compare(password, this.password) 
}

UserSchema.methods.getResetPasswordToken = function () {
    const token = crypto.randomBytes(20).toString('hex')
    
    this.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex')
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000

    return token
}

const User = mongoose.model('User', UserSchema)

export { User }