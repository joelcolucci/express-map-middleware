# express-map-middleware
> Write functions instead of middleware

## Why express-map-middleware?
The Express framework features the ability to assign multiple "middleware like" callback functions to a route. This ability allows you to compose your routes as sequences of middleware rather than a single thick controller.

**However** this can lead to writing many small pieces of middleware or sneaking logic into places it doesn't belong.

express-map-middleware allows you to write single purpose functions that set or transform values on Express's request and response objects.

This allows us to write lean decoupled controllers that can easily be re-used in different route handlers.

[Jump to example use cases](#example-use-cases)

## Installation
```
# Via NPM
npm install express-map-middleware --save

# Via Yarn
yarn add express-map-middleware
```

## Example Use Cases
### Setting res.locals template values
The snippet below sets two properties on res.locals:
* `res.locals.pageTitle`
* `res.locals.pageHeading`

By using mapResponse we separate setting template data from our controllers. 

```javascript
const {mapResponse} = require('express-map-middleware');

route.get('/', [
  mapRespone({
    locals: {
      pageTitle: 'Home | My App',
      pageHeading: 'Welcome to my app!'
    }
  })
],
(req, res) => {
  res.render('readAllNotes');
});
```

### Normalizing query strings values
The snippet below normalizes query string values.

By using `mapRequest` we can separate this logic from our controllers.

```javascript
const {mapRequest} = require('express-map-middleware');

route.get('/pets?type=dog', [
  mapRequest({
    query: {
      dog: (value, req, res) => {
        if (value === 'dog') {
          return value
        }
        
        return '';
      }
    }
  })
],
(req, res) => {
  res.render('readAllNotes');
});
```

### Configuring request data
In the snippet below we want to re-use our noteController. 

By using `mapRequest` we leverage the pagination logic already in place and simply set the desired query string values on the request object as opposed to modifying the controller code to handle this corner case for the `/dashboard` route.

```javascript
const {mapRequest} = require('express-map-middleware');

router.get('/dashboard', [
  mapRequest({
    query: {
      limit: 15,
      since: utilities.normalizeSinceDate
    }
  }),
  noteController.readAll
],
(req, res) => {
  res.render('readAllNotes');
});
```

## API Reference
### mapRequest([options])
The following table describes the properties of the options argument.

| Property | Description | Type |
| -------- | ----------- | ---- |
| Coming soon.. | |

### mapResponse([options])
The following table describes the properties of the options argument.

| Property | Description | Type |
| -------- | ----------- | ---- |
| Coming soon.. | |

## Contributing
Coming soon..

## License
MIT (See LICENSE)

