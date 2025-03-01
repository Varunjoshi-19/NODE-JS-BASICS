const mongoose = require("mongoose");


const uploadSchema = mongoose.Schema({
     
    ImageName : { 
        type : String,
        required : true
    },

    actualImage : {
         data : Buffer, 
         contentType : String
    }
})



module.exports = mongoose.model("images" , uploadSchema);