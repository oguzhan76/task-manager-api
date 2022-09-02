const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        default: 0
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value))
                throw new Error("Invalid email")
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
        validate(value) {
            if(value.toLowerCase().includes('password'))
                throw new Error('A password should not include the word password');
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
});

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner' 
})

// res.send() calls JSON.stringify before sending the data. We manipulate it with this
// so that sensitive and unnecessary data is not exposed to client.
userSchema.methods.toJSON = function() {
    const userObject = this.toObject();
    delete userObject.tokens;
    delete userObject.password;
    delete userObject.avatar;
    return userObject;
}

// this = the instance of user
userSchema.methods.generateAuthToken = async function() {
    const token = await jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET);
    
    this.tokens = this.tokens.concat({ token: token });
    await this.save();

    return token;
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });
    if(!user)
        throw new Error('Unable to login');

    isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch)
        throw new Error('Unable to login');

    return user;
}


// Hash the plain text password before saving
userSchema.pre('save', async function(next) {
    const user = this;

    if (user.isModified('password'))
        user.password = await bcrypt.hash(user.password, 8);

    next();
});

// Delete user tasks when user is removed
userSchema.pre('remove', async function(next) {
    await Task.deleteMany({ owner: this._id });
    next();
});


const User = mongoose.model('User', userSchema);

module.exports = User;