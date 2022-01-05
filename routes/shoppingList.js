const express = require("express");
const router = new express.Router();
const items = require("../fakeDb")
const ExpressError=require('../expressError')


/** GET /items: get list of items */

router.get("/", function(req, res) {
  return res.json(items);
});

/** GET /items by name: get list of items */

router.get("/:name", function(req, res) {

    const foundItem=items.find(item=>item.name===req.params.name)
    if(foundItem === undefined){
        throw new ExpressError("Item not found", 404)
    }
    return res.json(foundItem);
  });


/** POST /items: add an item to the list*/

router.post("/", function(req, res) {

    const item=req.body
    items.push(item)
    return res.status(201).json({'added': item})

});

/** PATCH /items: update an item in the list*/

router.patch("/:name", function(req, res) {

    const foundItem=items.find(item=>item.name===req.params.name)
    if (foundItem === undefined) {
        throw new ExpressError("Item not found", 404)
    }
    foundItem.name=req.body.name || foundItem.name
    foundItem.price=+req.body.price || foundItem.price
    
    return res.json({'updated': foundItem})

});


/** DELETE /items/name: delete item, return status */

router.delete("/:name", function(req, res) {
  const idx = items.findIndex(item=> item.name === req.params.name);
  if (idx === -1) {
    throw new ExpressError("Item not found", 404)
  }
  items.splice(idx, 1);
  return res.json({ message: "Deleted" });
});


module.exports = router;