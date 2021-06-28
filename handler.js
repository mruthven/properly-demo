const AWS = require("aws-sdk");
const express = require("express");
const serverless = require("serverless-http");

const app = express();

const USERS_TABLE = process.env.USERS_TABLE;
const PROPERTY_TABLE = process.env.PROPERTY_TABLE;
const dynamoDbClient = new AWS.DynamoDB.DocumentClient();

app.use(express.json());

app.get("/users/:userId", async function (req, res) {
  const params = {
    TableName: USERS_TABLE,
    Key: {
      userId: req.params.userId,
    },
  };

  try {
    const { Item } = await dynamoDbClient.get(params).promise();
    if (Item) {
      const { userId, name } = Item;
      res.json({ userId, name });
    } else {
      res
        .status(404)
        .json({ error: 'Could not find user with provided "userId"' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not retrieve user" });
  }
});

app.get("/users", async function(req, res) {
  const params = {
    TableName: USERS_TABLE
  };

  try {
    const scanResults = [];
    let items;
    do {
        items =  await dynamoDbClient.scan(params).promise();
        items.Items.forEach((item) => scanResults.push(item));
        params.ExclusiveStartKey  = items.LastEvaluatedKey;
    } while (typeof items.LastEvaluatedKey !== "undefined");

    res.json(scanResults);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not retrieve users" });
  }
});

app.delete("/users/:userId", async function(req, res) {
  const params = {
    TableName: USERS_TABLE,
    Key: {
      userId: req.params.userId,
    }
  }

  try {
    await dynamoDbClient.delete(params).promise();
    const scanResults = [];
    let items;
    do {
        items =  await dynamoDbClient.scan(params).promise();
        items.Items.forEach((item) => scanResults.push(item));
        params.ExclusiveStartKey  = items.LastEvaluatedKey;
    } while (typeof items.LastEvaluatedKey !== "undefined");

    res.json(scanResults);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not delete user"});
  }
});

app.post("/users", async function (req, res) {
  const { userId, name } = req.body;
  if (typeof userId !== "string") {
    res.status(400).json({ error: '"userId" must be a string' });
  } else if (typeof name !== "string") {
    res.status(400).json({ error: '"name" must be a string' });
  }

  const params = {
    TableName: USERS_TABLE,
    Item: {
      userId: userId,
      name: name,
    },
  };

  try {
    await dynamoDbClient.put(params).promise();
    res.json({ userId, name });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not create user" });
  }
});

app.get("/properties/active", async function (req, res) {
  const params = {
    TableName: PROPERTY_TABLE,
    IndexName: "propertyIsActive",
    KeyConditionExpression: "isActive = :active",
    ExpressionAttributeValues: {
        ":active": 1
    }
  };

  try {
    const results = [];
    let items = await dynamoDbClient.query(params).promise();
    console.log(items);

    items.Items.forEach(item => results.push(item));
    console.log(results);
    
    res.json(results);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not retrieve active properties" });
  }
});

app.post("/properties", async function (req, res) {
  const { propertyId, location, isActive } = req.body;
  if (typeof propertyId !== "number") {
    res.status(400).json({ error: '"propertyID" must be a number' });
  } else if (typeof location !== "string") {
    res.status(400).json({ error: '"location" must be a string' });
  } else if (typeof isActive !== "string" || (isActive !== "true" && isActive !== "false")) {
    res.status(400).json({ error: '"isActive" must be a "true" or "false"'});
  }

  const activeBin = (isActive == "true") ? 1 : 0;

  const params = {
    TableName: PROPERTY_TABLE,
    Item: {
      propertyId: propertyId,
      location: location,
      isActive: activeBin
    }
  };

  try {
    await dynamoDbClient.put(params).promise();
    res.json({ propertyId, location, isActive });
  } catch (error) {
    console.log(params.Item)
    console.log(error);
    res.status(500).json({ error: "Could not create property" });
  }
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
