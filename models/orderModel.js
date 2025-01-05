const mongoose = require('mongoose');


const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: [true,'A User must have an id'],
        select: false,
    },
    customerName: {
        type: String,
        required: [true,'A User must have a name'],
        select: false,
    },
    contactNo: {
        type: Number,
        required: [true, 'A User must have a phone number'],
        select: false,
    },
    deliveryAddress: {
        type: Object,
        required: true,
    },
    deliveryStatus: {
        type: String,
        default: 'pending',
        required: false,
    },
    couponApplied: {
         type: String,
        required: false,
     },
    itemsOrdered: {
        type: Array,
        required: false,
    },
    subTotal: {
        type: String,
        required: true,
    },
    grandTotal: {
        type: String,
        required: true,
    },
    date:{
        type: Object,
        default: new Date()
    }

})

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;