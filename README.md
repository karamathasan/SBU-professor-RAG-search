# Demo
Watch the demo here: https://youtu.be/Htf6oyCVDuQ

# Details
This project was built with NextJS, OpenAI API, and Pinecone vector database. 

Teacher data is scraped from ratemyprofessors.com, and ratings and reviews are extracted with Cheerio and then embedded with OpenAI. After embedding the professor data into vectors in the Pinecone database, user messages are used as queries to the database, after which the OpenAI API is used to generate a response based on the query response from Pinecone
