//TASK1
//createdb
use plp_bookstore;
//creatingCollection('books');
db.createCollection('books');

//TASK2
//populated the books collection with sample data
db.books.insertMany( [
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    genre: 'Fiction',
    published_year: 1960,
    price: 12.99,
    in_stock: true,
    pages: 336,
    publisher: 'J. B. Lippincott & Co.'
  },
  {
    title: '1984',
    author: 'George Orwell',
    genre: 'Dystopian',
    published_year: 1949,
    price: 10.99,
    in_stock: true,
    pages: 328,
    publisher: 'Secker & Warburg'
  },
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genre: 'Fiction',
    published_year: 1925,
    price: 9.99,
    in_stock: true,
    pages: 180,
    publisher: 'Charles Scribner\'s Sons'
  },
  {
    title: 'Brave New World',
    author: 'Aldous Huxley',
    genre: 'Dystopian',
    published_year: 1932,
    price: 11.50,
    in_stock: false,
    pages: 311,
    publisher: 'Chatto & Windus'
  },
  {
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    genre: 'Fantasy',
    published_year: 1937,
    price: 14.99,
    in_stock: true,
    pages: 310,
    publisher: 'George Allen & Unwin'
  },
  {
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    genre: 'Fiction',
    published_year: 1951,
    price: 8.99,
    in_stock: true,
    pages: 224,
    publisher: 'Little, Brown and Company'
  },
  {
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    genre: 'Romance',
    published_year: 1813,
    price: 7.99,
    in_stock: true,
    pages: 432,
    publisher: 'T. Egerton, Whitehall'
  },
  {
    title: 'The Lord of the Rings',
    author: 'J.R.R. Tolkien',
    genre: 'Fantasy',
    published_year: 1954,
    price: 19.99,
    in_stock: true,
    pages: 1178,
    publisher: 'Allen & Unwin'
  },
  {
    title: 'Animal Farm',
    author: 'George Orwell',
    genre: 'Political Satire',
    published_year: 1945,
    price: 8.50,
    in_stock: false,
    pages: 112,
    publisher: 'Secker & Warburg'
  },
  {
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    genre: 'Fiction',
    published_year: 1988,
    price: 10.99,
    in_stock: true,
    pages: 197,
    publisher: 'HarperOne'
  },
  {
    title: 'Moby Dick',
    author: 'Herman Melville',
    genre: 'Adventure',
    published_year: 1851,
    price: 12.50,
    in_stock: false,
    pages: 635,
    publisher: 'Harper & Brothers'
  },
  {
    title: 'Wuthering Heights',
    author: 'Emily Brontë',
    genre: 'Gothic Fiction',
    published_year: 1847,
    price: 9.99,
    in_stock: true,
    pages: 342,
    publisher: 'Thomas Cautley Newby'
  }
])

//find books which are fiction
db.books.find({},{genre:"fiction"})
//find books that are fiction and return them with their titles
db.books.find({}, {_id:false, title:true,genre:"fiction"})
//find books written by Jane Austen
db.books.find({author:'Jane Austen'})
//find books published after 1900
db.books.find({published_year:{$gt:1900}})
//updated the price of the alchemist to 12.99
db.books.updateOne({ title: 'The Alchemist'},{$set:{price: 12.99}})
//deleted a book titled the alchemist
db.books.deleteOne({title: 'The Alchemist'})

//TASK3
//find books that are in stock and published after 1950
db.books.find({$and: [{in_stock:true},{published_year:{$gt:1950}}]})
// query that returns only the title, author, and price fields
db.books.find({}, {_id:false, title:true,author: true,price:true})
//sort books by price in ascending order
db.books.find().sort({price:1})
//sort books by price in descending order
db.books.find().sort({price:-1})
//query that returns only the first 5 books in the collection
db.books.find().limit(5)
//query that skips the first documents and returns the next five books in the collection
db.books.find().skip(1).limit(5)

//TASK4
// an aggregation pipeline that calculates the average price of books by genre
db.books.aggregate([{$group: {_id: "$genre", averagePrice: { $avg: "$price" } }},
  {$project: { _id: 0, genre: "$_id",averagePrice: { $round: ["$averagePrice", 2] }}},
  {$sort: { averagePrice: -1 }}
]);
//to find the author with the most books in the collection
db.books.aggregate([ {$group: {_id: "$author", bookCount: { $sum: 1 } }},
  {$sort: { bookCount: -1 }},
  {$limit: 1},
  {$project: { _id: 0,author: "$_id",bookCount: 1 }}
]);

// Group books by publication decade and count them
db.books.aggregate([
  {
    $group: {
      _id: {
        $concat: [
          { $toString: { $multiply: [ { $floor: { $divide: ["$published_year", 10] } }, 10 ] } },
          "s"
        ]
      },
      count: { $sum: 1 }
    }
  },
  {
    $sort: { _id: 1 }
  }
])


//TASK5
//creating an index
db.books.createIndex({title:1})
//creating a compound index
db.books.createIndex({ author: 1, published_year: -1 });
//checking the execution stats
db.books.find({title:"Pride and Prejudice"}).explain("executionStats")


