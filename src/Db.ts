import * as mongoose from 'mongoose';

class Db {
    public mongoose = mongoose;
    public db;

    constructor() {
        this.mongoose.connect(process.env.MONGO_CONNECTION_STRING);
       
        this.db = this.mongoose.connection;
        this.init();
    }

    init() {
        this.db.on('error', console.error.bind(console, 'MongoDB connection error:'));
        this.db.once('open', function (){
            console.log("Connexion à la base OK"); 
        }); 
    }
}

export default new Db();