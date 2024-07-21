const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://walex:5JG0pfx2IW50WUMU@wale.pgyxxwh.mongodb.net/multer')
.then(()=> {
    console.log('Database connected succeddfully')
})
.catch((e) => {
    console.log(e.message);
})