const express = require('express');
const app = express();
const redis = require('redis')

app.use(express.static("public"))
app.set("view engine", "ejs");
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())

const client = redis.createClient({host: 'https://0.0.0.0', port: 6379})


client.on('error', (err) => console.log('Redis Client Error', err));

client.connect();


const PORT = process.env.PORT || 3000;

app.get("/", function(req,res){
    res.render("home", {});
})

app.get("/admin", async function(req,res){
    console.log("route hit")

    let past_orders = await retrieve_order()
    console.log(past_orders)
    res.render("admin", {past_orders: past_orders})
})

app.post("/books", function(req, res) {
    console.log("route hit!")
    let data = req.body.books_ordered
    //console.log(data.books_ordered[0])
    const timestamp = Date.now()
    for(let book of data) {
        insert_to_redis(timestamp, book)
    }
    res.redirect('/')
});

app.listen(PORT, function(){
    console.log("A2 App Online");
})

async function insert_to_redis(timestamp, book) {
    await client.rPush(String(timestamp), book)
    //const value = await client.lRange(String(timestamp), 0,1)
}


async function retrieve_order() {
    const order_history = {}
    const all_keys = await client.keys('*')
    //console.log(typeof(all_keys))
    for(let i = 0; i < all_keys.length; i++) {
        if(all_keys[i].match(/^[0-9]+$/) != null) {
            console.log(all_keys[i])
            let order = await client.lRange(String(all_keys[i]), 0, -1) 
            order_history[all_keys[i]] = order
        } 
    }
    //console.log(order_history)
    return order_history
}   
