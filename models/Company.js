// const mongoose = require('mongoose');

// const companySchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     industry: { type: String, required: true },
//     address: { type: String },
//     phone: { type: String },
//     location: { type: String },
//     founded: { type: String },
//     employees: { type: Number, default: 0 },
//     rating: { type: Number, min: 0, max: 5, default: 0 },
//     openings: { type: Number, default: 0 },
//     image: { type: String, default: null },
//     createdAt: { type: Date, default: Date.now },
//     createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//     about: { type: String },
//     jobs: [{
//         title: { type: String, required: true },
//         description: { type: String, required: true },
//         requirements: { type: String, required: true },
//         location: { type: String, required: true },
//         salary: { type: Number, required: true },
//         type: {
//           type: String,
//           enum: ['Part-Time', 'Full-Time', 'Internship', 'Contract'], 
//           required: true,
//         },
//         date: { type: Date, default: Date.now }, // New date field with default value
//       }],
//       reviews: [{
//         author: { type: String, required: true },
//         designation: { type: String, required: true },
//         text: { type: String, required: true },
//         rating: { type: Number, min: 0, max: 5, required: true },
//         date: { type: Date, default: Date.now }, // New date field with default value
//       }],
//     gallery: [{
//       url: String,
//     }]
//   });
  
const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        trim: true 
    },
    logo: { 
        type: String, 
        default: null 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    description: { 
        type: String,
        trim: true 
    },
    industry: { 
        type: String, 
        required: true,
        trim: true 
    },
    address: { 
        type: String,
        trim: true 
    },
    phone: { 
        type: String,
        trim: true,
        match: [/^\+?(\d{10,14})$/, 'Please fill a valid phone number']
    },
    location: { 
        type: String,
        trim: true 
    },
    foundedYear: { 
        type: Number,
        min: [1800, 'Founded year must be after 1800'],
        max: [new Date().getFullYear(), 'Founded year cannot be in the future']
    },
    headquarters: { 
        type: String,
        trim: true 
    },
    employees: { 
        type: Number, 
        default: 0,
        min: [0, 'Employee count cannot be negative']
    },
    rating: { 
        type: Number, 
        min: [0, 'Rating cannot be negative'], 
        max: [5, 'Rating cannot be more than 5'], 
        default: 0 
    },
    openings: { 
        type: Number, 
        default: 0,
        min: [0, 'Job openings cannot be negative']
    },
    website: { 
        type: String,
        trim: true,
        validate: {
            validator: function(v) {
                return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(v);
            },
            message: props => `${props.value} is not a valid website URL!`
        }
    },
    socialLinks: {
        linkedin: { 
            type: String,
            trim: true 
        },
        twitter: { 
            type: String,
            trim: true 
        },
        facebook: { 
            type: String,
            trim: true 
        }
    },
    certifications: [{
        type: String,
        trim: true
    }],
    image: { 
        type: String, 
        default: null 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    about: { 
        type: String,
        trim: true 
    },
    jobs: [{
        title: { 
            type: String, 
            required: true,
            trim: true 
        },
        description: { 
            type: String, 
            required: true,
            trim: true 
        },
        requirements: { 
            type: String, 
            required: true,
            trim: true 
        },
        location: { 
            type: String, 
            required: true,
            trim: true 
        },
        salary: { 
            type: Number, 
            required: true,
            min: [0, 'Salary cannot be negative']
        },
        type: {
            type: String,
            enum: ['Part-Time', 'Full-Time', 'Internship', 'Contract'], 
            required: true,
        },
        skills: [{
            type: String,
            trim: true
        }],
        date: { 
            type: Date, 
            default: Date.now 
        },
        applicationDeadline: {
            type: Date
        }
    }],
    reviews: [{
        author: { 
            type: String, 
            required: true,
            trim: true 
        },
        designation: { 
            type: String, 
            required: true,
            trim: true 
        },
        text: { 
            type: String, 
            required: true,
            trim: true 
        },
        rating: { 
            type: Number, 
            min: [0, 'Rating cannot be negative'], 
            max: [5, 'Rating cannot be more than 5'], 
            required: true 
        },
        date: { 
            type: Date, 
            default: Date.now 
        }
    }],
    gallery: [{
        url: { 
            type: String,
            trim: true 
        },
        caption: { 
            type: String,
            trim: true 
        }
    }]
}, {
    timestamps: true // This adds createdAt and updatedAt fields automatically
});
module.exports = mongoose.model('Company', companySchema);
