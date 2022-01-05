process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("../app");
let items = require("../fakeDb");

let popsicle = { name: "Popsicle",price : 1.45 };

beforeEach(function() {
  items.push(popsicle);
});

afterEach(function() {
  // make sure this *mutates*, not redefines, `cats`
  items.length = 0;
});
// end afterEach


/** GET /items - returns `[{ name: "Popsicle",price : 1.45 }]` */

describe("GET /items", function() {
    test("Gets a list of items", async function() {
      const resp = await request(app).get(`/items`);
      expect(resp.statusCode).toBe(200);
  
      expect(resp.body).toEqual([popsicle]);
    });

    test("Responds with 404 if can't find item",async function() {
      const resp=await request(app).get('/items/somethingNotExist');
      expect(resp.statusCode).toBe(404);
    })
  });
  // end

/**POST /items - create item from data */

describe("POST /items", function() {
  test("Creates a new item", async function() {
    const resp = await request(app)
      .post(`/items`)
      .send({
        name: "Cheerios",
        price:2.99
      });
    expect(resp.statusCode).toBe(201);
    expect(resp.body).toEqual({'added':{
      name: "Cheerios",
      price:2.99
    }});
  });
});

//end

/** PATCH /items/[name] - update item; return `{'updated': item}` */

describe("PATCH /items/:name", function() {
  test("Updates a single item", async function() {
    const resp = await request(app)
      .patch(`/items/${popsicle.name}`)
      .send({
        price: 0.99
      });
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({
      'updated':{name:'Popsicle',price:0.99}
    });
  });

  test("Responds with 404 if item invalid", async function() {
    const resp = await request(app).patch(`/items/blablabla`);
    expect(resp.statusCode).toBe(404);
  });
});
// end

/** DELETE /items/[name] - delete item,
 *  return `{message: Deleted"}` */

 describe("DELETE /items/:name", function() {
  test("Deletes a single a item", async function() {
    const resp = await request(app).delete(`/items/${popsicle.name}`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ message: "Deleted" });
  });
});
// end