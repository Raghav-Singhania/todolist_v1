const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// const date = require(__dirname+'/date.js');

const app = express();

// const items = ["buy food", "cook food", "eat food"];
// const workItems = [];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true});

const itemsSchema = new mongoose.Schema ({
    name: String
});

const Item = mongoose.model('item',itemsSchema);

const item1 = new Item({
    name: "Welcome to todoList"
});

const item2 = new Item({
    name: "Hit the + button to add items to list"
});

const item3 = new Item({
    name: "<-- hit this to delete the item"
});

const defaultArray = [item1, item2, item3];

const listSchema = new mongoose.Schema({
    name: String,
    items: [itemsSchema]
});

const List = mongoose.model("List",listSchema); 

app.get("/",(req,res)=>{
    Item.find({},function(err,foundItems){

        if(foundItems.length === 0){
            Item.insertMany(defaultArray, function(err){
                if(!err){
                    console.log("successfully added all the items to Item Model...");
                }else{
                    console.log(err);
                }
            });
            res.render("/");
        }else{
            res.render("list", { listTitle: "Today", newListItems: foundItems});
        }
    });
    
});

app.get("/:customListName",function(req,res){
    const customListName = req.params.customListName;
    List.findOne({name:customListName}, function(err,foundList){
        if(!err){
            if(!foundList){
                // Creating a new list here
                const list = new List({
                    name: customListName,
                    items: defaultArray
                });
                list.save();
                res.redirect("/"+customListName);
            }
            else{
                //Showing an existing List
                res.render("list",{listTitle: customListName, newListItems: foundList.items});
            }
        }
    });
    
});



app.post("/",(req,res)=>{
    const itemName = req.body.newItem;
    const listName = req.body.list;

    const nextItem = new Item({
        name: itemName
    });

    if(listName === "Today"){
        nextItem.save();
        res.redirect("/");    
    }else{
        List.findOne({name: listName}, function(err, foundList){
            foundList.items.push(nextItem);
            foundList.save();
            res.redirect("/"+listName);
        });
    }
});

app.post("/delete",(req,res)=>{
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;
    console.log(listName);

    if(listName === "Today"){
        Item.findByIdAndRemove(checkedItemId, function(err){
            if(!err){
                console.log("Seccessfully deleted the item.....");
                res.redirect("/");
            }    
            else console.log(err);
        });
    }else{
        List.findOneAndUpdate({name:listName}, {$pull : {items: {_id: checkedItemId}}}, function(err,foundList){
            if(!err){
                console.log("Seccessfully deleted the item.....");
                res.redirect("/"+listName);
                
            }else{
                console.log(err);
            }
        });
    }
});

app.listen(5000, () => {
    console.log('Server is listning on port 5000')
});