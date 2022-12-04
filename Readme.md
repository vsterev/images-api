## Image API

### MYX back-end task

Rest API that organizes work with photos. It has the following main functionalities:

1. uploading photos, during this process is created a thumbnail, the longitude and latitude coordinates of the photo are recognized from EXIP parameters
2. search by specified criteria with the option to download all photos in a zip file or to receive only the paths to them
3. delete photo, the path to it is received as a response from the search method

### Installation and Runnin

Depends from package manager
<b>to install</b>

1. yarn

```bash
yarn install
```
2. npm 

```bash
npm install
```
 <b>to run </b>
```bash
cd images-api
yarn start
<!-- incase if using npm-->
npm run start
```

### Dependencies

- MongoDB json collection to handle information about uploaded pictures
- multer to handle multipart/form-data by uploadin files
- sharp to make thumbnails
- express-zip to make archive and send it
- exifr to read EXIF information from uploaded pictures

### Examples

upload picture
post request http://localhost:4000/images/upload
use multipart/form data encoding, the key should be named 'image'
