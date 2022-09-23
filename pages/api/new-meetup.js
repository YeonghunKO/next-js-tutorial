import { MongoClient } from 'mongodb';
// api/new-meetup
// POST

export async function meetUpCollection() {
  const client = await MongoClient.connect(
    'mongodb+srv://sinkyo:qoyo3364@cluster0.hlch8ak.mongodb.net/?retryWrites=true&w=majority'
  );
  await client.connect();
  const database = client.db();
  const meetUpCollection = database.collection('meetups');
  return meetUpCollection;
}

async function handler(req, res) {
  if (req.method === 'POST') {
    const data = req.body;
    try {
      // create a document to be inserted
      const collection = await meetUpCollection();
      const result = await collection.insertOne(data);
      console.log(
        `${result.insertedCount} documents were inserted with the _id: ${result.insertedId}`
      );
      res.status(201).json({ message: 'successfully added new meetup!' });
      await client.close();
    } catch (err) {
      console.log(err);
    }
  }
}

export default handler;
