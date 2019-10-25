var mongoose = require("mongoose")
var productSchema = mongoose.Schema({
    productId: String,
    productName: String,
    salePrice: Number,
    productImg: String,
    productNum: String,
    checked: String
})
module.exports = mongoose.model("Good", productSchema)