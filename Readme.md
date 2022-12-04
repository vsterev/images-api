## Image API

### MYX back-end task

Rest API that organizes work with photos. It has the following main functionalities:

1. uploading photos, during this process is created a thumbnail, the longitude and latitude coordinates of the photo are recognized from EXIP parameters
2. search by specified criteria with the option to download all photos in a zip file or to receive only the paths to them
3. delete photo, the path to it is received as a response from the search method

### Installation and Running

<b>to install</b>

```bash
yarn install
> incase using npm
npm install
mkdir uploads
// if doesn't exists to create folder where it will be saved all uploaded pictures
```

<b>to run </b>

```bash
cd images-api
yarn start
// incase using npm
npm run start
```

start application on port 4000

### Dependencies

- MongoDB json collection to handle information about uploaded pictures
- multer to handle multipart/form-data by uploadinг files
- sharp transforming pictures to thumbnails
- express-zip to make zip archive from pictures and send it back via API
- exifr to read EXIF information from uploaded pictures

### Examples

1.<p><b> upload picture</b></p>
post request to http://localhost:4000/images/upload
use multipart/form data encoding, the key should be named 'image'
![insomnia](screen-upload.png)

successfully response:
status - 200

```json
{
  "error": null,
  "response": {
    "fieldname": "image",
    "originalname": "DJI_0852.JPG",
    "encoding": "7bit",
    "mimetype": "image/jpeg",
    "destination": "/home/vasil/git/image-api/uploads/",
    "filename": "1670155705035-DJI_0852.JPG",
    "path": "/home/vasil/git/image-api/uploads/1670155705035-DJI_0852.JPG",
    "size": 7822267
  }
}
```

2. <p><b>search and retrieve pictures</b></p>
   post request to http://localhost:4000/images/search
   Content-Type - application/json
   <b>parameters in body request:</b>

- latitudeMin - number optional,
- latitudeMax - number optional,
- longitudeMin - number optional,
- longitudeMax - number optional,
  > if you don't send any of the above parameters you will get a response for all records
- archive - boolean if is set true receive zipped file with all images in it, if is set to false, receive an array of images paths

response staus if image doesn't exists - 404
successfully response status - 200

- this request will initialized searching by latitude and will send all founded images as archive in zip format

```json
{
  "latitudeMin": 19.9517,
  "latitudeMax": 19.9518,
  "archive": true
}
```

- this request will searched by latitude and longitude and will return array of paths to images

```json
{
  "latitudeMin": 19.9517,
  "latitudeMax": 19.9518,
  "longitudeMin": 73.9645,
  "longitudeMax": 73.96453,
  "archive": false
}
```

- this request will retun all saved images in zip archive

```json
{
  "archive": true
}
```

3.<p><b> delete picture</b></p>
delete request to http://localhost:4000/images/delete
Content-Type - application/json

- request

```json
{ "name": "1670150531413-DJI_0845.JPG" }
```

successfully response:
status 200

```json
{
  "message": "File 1670150531413-DJI_0845.JPG is deleted."
}
```

successfully response:
status 202

```json
{
  "message": "image 1670150531413-DJI_08451.JPG not exists"
}
```
