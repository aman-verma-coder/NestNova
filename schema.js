const joi = require("joi");

module.exports.listingSchema = joi.object({
    title: joi.string().required(),
    description: joi.string().required(),
    image: joi.string().allow("", null),
    price: joi.number().required().min(0),
    location: joi.string().required(),
    country: joi.string().required(),
    review: [joi.string()],
    status: joi.string().valid("pending", "approved", "rejected").default("pending")
});

module.exports.reviewSchema = joi.object({
    id: joi.string(),
    review: joi.object({
        comment: joi.string().required(),
        rating: joi.number().required().min(1).max(5)
    }).required()
})