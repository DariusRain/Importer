### Importer

###### About:
This repo is for importing JSON data to the database by parsing raw data obtained from various sources, <br />
each element of the raw data must follow the field conditions of a specificly designed [mongoosejs](https://www.npmjs.com/package/mongoose) model. <br />
to be stored on either a local machine "[MongoDB Local](https://www.mongodb.com/try/download/community)" or the cloud "[MongoDB Atlas](https://www.mongodb.com/cloud/atlas)".

###### How it works
Compile > Write new raw data file > Parses/Validates > Write new parsed data file > import new parsed data file
