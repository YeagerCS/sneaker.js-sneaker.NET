# Documentation

## Table of Contents
- [What is sneaker.js](#sneakerjs)
- [How to run](#how-to-run)
- [Components](#components)
- [Rendering Components](#rendering-components)
- [Multirender](#multirender)
- [Routing](#routing)
- [Form Input](#form-input)
- [Button Clicks](#button-clicks)
- [Emitting Data](#emitting-data)
- [Display Table Data](#display-table-data)
- [asLocalStorage](#aslocalstorage)
- [Examinable](#examinable)
- [Navigation](#navigation)
- [Utilities](#utilities)


## <p id="sneakerjs">What is sneaker.js</p>
Sneaker.js is a JavaScript library which inspires features from JavaScript frameworks like React or Angular. It's a light-weight vanilla JavaScript library which allows the use of things like rendering multiple components or routing. The use of the library is very easy and the main features are documented. Each component is a class, which gives it a similar feeling to Angular but it still just is vanilla js. The app is bundled with webpack. Alternatively, you can start it with an express server that serves index.html at every route (SPA), which with the current configuration isn't functional. Webpack is recommended: `npm start`  

### Is it really Vanilla JS?
Defining "vanilla JavaScript" can be a bit elusive. While sneaker.js is indeed a framework and utilizes npm packages, it maintains a commitment to the purity of JavaScript syntax and functionality. In essence, it's a vanilla configuration of JavaScript, without JSX or any syntactic modifications. Despite being a sort of framework, sneaker.js embodies the essence of vanilla JavaScript by staying closely to its core principles. While it does utilize npm packages and offers advanced features, the code you write remains the traditional JavaScript syntax. Acknowledging the technicalities, it's fair to say that sneaker.js offers a balance between the simplicity of vanilla JavaScript and the functionality of a framework. By retaining the purity of JavaScript while offering enhanced capabilities, sneaker.js provides a powerful yet familiar and light-weight environment for building web applications. 



## How to run
1. Clone this repository  
   `git clone https://github.com/YeagerCS/sneaker.js.git`
2. Run
   ```
   npm i
   npm start
   ```
3. Go to http://127.0.0.1:8080 (or your env port)

## Components
To start editting the application, you can go to `src/components/App/App.snkr` and modify the routes. In order to have routes, you'll need to generate components.

- Generate components with `npm run gc Componentname`

This will create a component with a css, html and js file. The js file gets generated with it's base structure:

```js
import { initCss, render, TheComponent } from "sneakerlib";

class ComponentnameComponent extends TheComponent {
    constructor(){
        super();
    }

    name = "Componentname.html";

    async init(){
        await initCss("Componentname.css");
        // Your initialization logic
    }
}

export { ComponentnameComponent };

```
Lets break it down:
- ```js
  class ComponentnameComponent extends TheComponent
  ```
  This is the class that you will use as your component. Every component extends from the TheComponent class which requires this base structure.
- `constructor()`: The super constructor needs to be called in order to bind the methods to 'this'. So for any component, leave the super() call.
- The `name` is simply the name of the html file of the component.
- `async init()`: Use this method to write any logic that should happen at initialization. That might include:
  - Rendering Components
  - Binding Buttons
  - Binding Input
  - Initializing the Css file (is generated)
  - etc.  

## Rendering Components
You can render components inside of other components. Here's how:
Let's take an example. Imagine you have a dashboard and you want a form and a table in that dashboard.

Dashboard.html
```html
<div class="dashboard">
  <div id="form"></div>
  <div id="table"></div>
</div>
```
The elements in which you want to render, require an id. You use the elements `id` to render in the element. Now lets say you have your FormComponent and TableComponent:  
`npm run gc Form`    
`npm run gc Table`

Form.snkr
```js
class FormComponent extends TheComponent {
  // Default structure
}
```

Form.html   
```html
<p>Form Html</p>
```

Table.snkr
```js
class TableComponent extends TheComponent {
  // Default structure
}
```

Table.html  
```html
<p>Table Html</p>
```


Once you have those components, you want to render them in the DashboardComponent. For that, go to Dashboard.snkr:

Dashboard.snkr
```js
import { initCss, render } from "sneakerlib";
import { FormComponent } from "../Form/Form.snkr";
import { TableComponent } from "../Table/Table.snkr";

...
// In the init method
async init(){
  await initCss("Dashboard.css")

  await render(FormComponent, "form")
  await render(TableComponent, "table")
}
```
This will render the FormComponent in the 'form' div and the TableComponent in the 'table' div.  
You successfully rendered two components inside another! Now you just have to display that dashboard on your site. In order for that to work, you'll need to configure your Dashboard with [Routing](#routing). **Attention:** Rendering components only works for files that are placed in /src/components, other html files will not render. Each component has to be it's own folder inside of the components folder. 

## Multirender
Multirender allows to render a list with a html template for each object.  
First, you create your Template. I'm going to call mine 'MovieList' with an example.
MovieList.html
```html
<section class="movie-section" id="movie-section">
    <div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
        <img src="" id="poster">
    </div>
    <h3 id="title" style="text-align: center;"></h3>
    <div class="movie-details">
        <p id="year"></p>
        <p>•</p>
        <p id="genre"></p>
        <p>•</p>
        <div style="display: flex;">
            <p id="duration"></p>
            <p>min</p>
        </div>
    </div>
</section>
```
Before we write code in the MovieList, we'll render the list multiple times in another component. For that I'll create a component DisplayMovies:
```html
<div class="wrapper">
    <h1>All Movies</h1>
    <div id="list"></div>
</div>
```
In this component we can fetch data and then render it into the component that we created before multiple times. Let's say I have some movies that i fetch and want to render them in the fashion of my template. For that we can use the method 'multiRender'.
```js
async init(){
        await initCss("DisplayMovies.css");
        const response = await fetch("/api/movie")
        const movies = await response.json();
        movies.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
        
        await multiRender(MovieListComponent, "list", movies)
}
```
The first parameter is the template component, the second is into which you want to render it, the third is the list of object to render. This now renders every object in the list in one template and displays it on the page. Of course, you can design your template with css, and also your list to display the objects.
In the template you have to write the data to the html elements.
MovieList.js
```js
 async init(){
        await initCss("MovieList.css");
        console.log(this.state);

        multiRenderWriteText(this.state, "title")
        multiRenderWriteText(this.state, "year")
        multiRenderWriteText(this.state, "genre")
        multiRenderWriteText(this.state, "duration")
        multiRenderWriteImageSrc(this.state, "poster")

        multiRenderClick(this.state, "movie-section",  () => {
            if(!this.state.mrItem.tmdb){
                navigate("/display", { state: this.state.mrItem.id })
            } else{
                navigate("/displayTMDB", { state: this.state.mrItem })
            }
        })
    }
```
You can use the multiRenderWriteText function to write text easily. The object key and the id specified have to match exactly for this to write data. With multiRenderWriteImageSrc, you can write a src to an image that you're trying to render. multiRenderClick is a click event for the rendered item. When the item is clicked, you can call your callback in that method. You can access the current objects state with this.state.mrItem. This is always true for a multirender. With the { state: ... } in the navigate I pass the current movie like that into state.

In conclusion, multiRender is a very useful function allowing you to render an array of objects with specific keys. The render commences by creating a div for each and every object and specifying a class with a random uuid() for that div.

## Routing
The router is placed in `App.snkr` and you need to configure your routes there. The default structure of the AppComponent is as follows:

```js
// imports

const routes = {
   "/": WelcomeComponent
}

class AppComponent extends TheComponent{
    constructor(){
        super()
    }

    name = "App.html";

    async init(){
        await initCss("App.css")

        this.routes();
        enableRoutes(routes, this.routes)
    }


    async routes(){
        const path = window.location.pathname;
          
        await render(routes[path] ?? NotFoundComponent, "router")
    }
}
export { AppComponent }
```
You'll only need to consider the `routes()` method. Lets display the Dashboard at the '/dashboard' route.

```js
const routes = {
   "/": WelcomeComponent,
   "/dashboard": DashboardComponent
}       
```
By simply adding the route "/dashboard" with the value of the component, the given component is rendered dependent on the route. If the route that you're trying to access is undefined, on default the NotFoundComponent will be rendered. Replace that with any component you want.  
Great! Now you're rendering the Dashboard on the page. You're still missing some logic though. Learn how to handle inputs in a form [Here](#form-input)


## Form Input
Lets go and accept input from our form. For that, go to Form.snkr. Lets say we have to input a name and an email.

Form.html
```html
<input type="name" id="name" name="name" required>
<input type="email" id="email" name="email" required>
```

Form.snkr
```js
import { InputBind } from "sneakerlib";
// Other imports

class FormComponent extends TheComponent {
  constructor(){
    super()
  }

  // ...
  // Set your input variables
  nameInput;
  emailInput;

  async init(){
    // ...
    this.nameInput = new InputBind("name")
    this.emailInput = new InputBind("email")
  }
  // ...
}
```
Now the variables nameInput and emailInput are bound to the element with the given id. In order to access the value of the inputs, you'll need to access `this.nameInput.value` and `this.emailInput.value`.
You have bound your input, now lets print the input on [click of a button](#button-clicks) to check. For larger forms you may want a different approach for reading form data. Read the following if you want an alternative.

### Better Form Input
It can be annoying to define every InputBind individually, that's why sneaker.js has some handy methods for it.

Form.snkr
```js
class FormComponent extends TheComponent {
import { bindButton, bindInputs, TheComponent, validate, values, ... } from "sneakerlib";

   // Define an object for the form data as the following: (The keys have to match the id's in the html input elements)
   formData = {
      firstname: null,
      lastname: null,
      email: null,
      dateOfBirth: null,
      password: null
   } 

   async init() {
      // ...
      bindInputs(this.formData) //Binds each element in the object to the respective input element
      bindButton("button", (e) => {
         e.preventDefault();
         if(validate(this.formData)){ // use validate function to validate the form data
            const formValues = values(this.formData); // reads out the values from the object and returns an object with the values only
            // Handle valid form data
         } else{
            // Handle invalid form data
         }
      })
   }

   // ...
}
```
- `validate` function definition:
```js
const validate = (inputObj, 
  pwRegex = /^(?=.[a-z])(?=.[A-Z])(?=.\d)(?=.[@$!%?&])[A-Za-z\d@$!%?&]{8,}$/g,
  pwKey = "password", emailKey = "email"
) 
```
Predefined password Regular Expression and the email gets checked aswell. You can define the pwRegex yourself, this one checks for:
- at least 8 characters
- at least one capital letter
- at least one number
- at least one special symbol
  
Don't forget to modify the pwKey or emailKey if you have different id's in your input elements.
If say you want to change the emailkey but not the pwRegex or key, call the function like `validate(formData, undefined, undefined, myEmailKey)`

## Button Clicks
Button clicks can be configured quite easily. Lets take the form again and add a button with the id 'btn':

Form.html
```html
<input type="name" id="name" name="name" required>
<input type="email" id="email" name="email" required>
<button id="btn">Submit</button>
```
We know want to bind that button to an action. Lets say we just want to console.log or inputs. Here's how you can do it:

Form.snkr
```js
import { bindButton, ... } from "sneakerlib";

// ...

submitForm(e){
  e.preventDefault()
  console.log(this.nameInput.value + " " + this.emailInput.value)
}

async init(){
  // ...
  this.nameInput = new InputBind("name")
  this.emailInput = new InputBind("email")
  bindButton("btn", submitForm)
}
```
Now when the button is pressed, the method 'submitForm' will get executed.  
Instead of logging to the console, lets try and [display our added person in the TableComponent](#emitting-data).

## Emitting Data
You can emit data as an event in order to access it in another component. Let's say we want to emit the person with name and email and receive it within the TableComponent.

Form.snkr
```js
import { bindButton, emit, ... } from "sneakerlib";

// ...

submitForm(e){
  e.preventDefault()

  emit("emitEventName", {
    name: this.nameInput.value,
    email: this.emailInput.value
  })
}

// ...
```
Now it emitted the object under the name 'emitEventName'. In the table component, you can receive it.

Table.snkr
```js
import { receive, ... } from "sneakerlib";

// ...
tableData = [];

async init() {
  receive("emitEventName", (e) => {
    const data = e.detail;

    this.tableData.push(data)
    console.log(tableData)
  })
}
```
Now we receive the data in our TableComponent. Only thing that's missing is to [display the data in the table](#display-table-data).

## Display table data
For this to work properly, you'll need to have a table structure like this:

Table.html
```html
<table id="table">
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
      </tr>
    </thead>
    <tbody>

    </tbody>
</table>
```
Define the headers that you need, but leave the tbody blank. Here's how you display the data:

Table.snkr
```js
import { receive, populateTable, ... } from "sneakerlib";

// ...
tableData = [];

updateTable(){
  populateTable("table", this.tableData)
}

async init() {
  this.updateTable()

  receive("emitEventName", (e) => {
    const data = e.detail;

    this.tableData.push(data)
    this.updateTable()
  })
}

// ...
```
Just like that you are displaying the data that gets emitted into the table. If you want to store the added data, you can define your data [asLocalStorage](#aslocalstorage), which will store and load the data out of localStorage.

## asLocalStorage
Serialize your 'tableData' in localStorage with one simple change:

Table.snkr
```js
import { asLocalStorage, populateTable, ... } from "sneakerlib";

// ...

tableData = asLocalStorage([], "uniqueIdentifier")

updateTable(){
  populateTable("table", this.tableData)
}

// ...
```
The first parameter is the inital value for the variable, which is just an empty array here and the second parameter requires a unique identifier with which it is saved in localstorage. Just like that your data persists between sessions locally.

## Services & Examinables
### Services
The examinable is supposed to have similar functionality as an [Observable](https://angular.io/guide/observables) in angular, although it's heavily simplified. You can use examinables in context of services, like in angular. Generate a service with  
```
npm run gs serviceName
```
The simple structure of such a service is the following: 

src/services/EmployeeService.js
```js
import { TheService } from "sneakerlib";
class EmployeeService extends TheService{
    static instance = null;

    constructor(){
        super();

        if(!EmployeeService.instance){
            Employee.Service.instance = this;

            // Initialization logic here
        }

        return EmployeeService.instance;
    }

}

export default new EmployeeService();
```
This structure exports a service instance and makes it available in any file. In this services you can define your examinables.
### Examinable
```js
class EmployeeService extends TheService{
    static instance = null;
    employeeExaminable; // declare an examinable

    constructor(){
        super();

        if(!EmployeeService.instance){
            Employee.Service.instance = this;

            this.employeeExaminable = new Examinable(); // instantiate it
        }

        return EmployeeService.instance;
    }

   updateEmployee(employee){
      this.employeeExaminable.enter(employee);
   }

}
```
With this structure you can now manage an employee through the EmployeeService by updating the examinable. But how do you read the data?  
You read the data by subscribing to the examinable. You can do that in the init method of a component as an example.  
```js
import EmployeeService from "../services/EmployeeService.js"
// ...
async init(){
   EmployeeService.employeeExaminable.sneak(
      (data) => {
         // ... handle data
      },
      (error) => {
         // ... handle error
      }
   )
}
```
The sneak method is the equivalent to subscribe. It takes two callback functions, one for when the gathering of data was successful and the other for handling errors. The error callback is optional though.  
Now when you want to update the examinable `EmployeeService.updateEmployee(someEmployeeObject)`, the 'enter' methods gets called, which triggers every callback function that was subscribed to the examinable. As long as nothing goes wrong, the enter function will simply deliever the data and no error will occur.  
There's high potential for error in for example a fetch. Each examinable allows you to fetch data directly from it and you can handle the data in the callback.  
Example GET Request:
```js
testExaminable.sneak(
   (data) => {
      console.log(data)
   }
)

testExaminable.fetch("https://dummyjson.com/products")
```
Now if this GET request is successful, the data will be logged to the console as shown in the callback function. If the fetch fails and throws any error, you can handle that with an error callback in the subscriber:
```js
testExaminable.sneak(
   (data) => {
      console.log(data)
   },
   (error) => {
      console.log("An error occured " + error)
   }
)
```
It's pretty similar to a try catch, just a little more encapsulated.  
Additionally to fetching data, you can open websocket connections. Here's an example:
```js
testExaminable.sneak(
   (data) => {
      // Receive data from the websocket here
   }
)

testExaminable.socket("ws://localhost:8080", onOpenCallback?, onCloseCallback?)
```
You can open a websocket connection with an url. Optionally, you can put in callback functions that happen onOpen or onClose of the websocket connection. Then just receive the data sent by the websocket in your subscriber.  

If you want to dispose of your examinable, you can easily unsubscribe it:
```js
const unsub = testExaminable.sneak(..)

unsub(); // Call the subscriber to unsubscribe.
```
And remember to subscribe to an examinable first, before completing operations with it.  

## Navigation
In order to build functional applications you'll need to have the ability to navigate to other routes. For that, the `navigate` function was implemented. Here's and example use case.
```js
// Some button click
bindButton("btn", () => {
   navigate("/dashboard");
})
```
This will simply route to the /dashboard route which you specified in App.snkr. If you need to pass state from the initial component to the one you're navigating to, you can easily do that with the navigate function, which takes state as an optional parameter. Let's say you share data from a Login component to a dashboard.  

Login.snkr
```js
navigate("/dashboard", {
   user: this.user.value // An example InputBind in the Component
})
```
You can now receive the state in the dashboard component like this:  

Dashboard.snkr
```js
import { getNavigateState, ... } from "sneakerlib"

class DashboardComponent extends TheComponent {
   // ...
   navigationState = getNavigateState()

   async init() {
      // Access the user that was given by the state
      console.log(navigationState.user)
   }

}
```
And that's how you can navigate and share state within the navigation process.

## Utilities
### capitalize
**Description:** Capitalizes the first letter of a string.

**Parameters:**
- `str` (string): The input string.

**Returns:**
- (string): The input string with the first letter capitalized.

### flatten
**Description:** Flattens a nested array structure into a single-level array.

**Parameters:**
- `arr` (array): The nested array structure.

**Returns:**
- (array): The flattened array.

### formatDate
**Description:** Formats a date object into a string based on the provided format.

**Parameters:**
- `date` (Date): The date object to format.
- `format` (string): The format string. It can contain placeholders like "yyyy" for year, "mm" for month, "dd" for day, "hh" for hours, "ii" for minutes, and "ss" for seconds.

**Returns:**
- (string): The formatted date string.

### formatCurrency
**Description:** Formats a number as currency.

**Parameters:**
- `number` (number): The number to format.
- `currency` (string, optional): The currency code. Default is "USD".

**Returns:**
- (string): The formatted currency string.

### roundDecimals
**Description:** Rounds a number to a specified number of decimal places.

**Parameters:**
- `number` (number): The number to round.
- `decimal` (number): The number of decimal places to round to.

**Returns:**
- (number): The rounded number.

### isEmpty
**Description:** Checks if an object is empty (has no own enumerable properties).

**Parameters:**
- `obj` (object): The object to check.

**Returns:**
- (boolean): `true` if the object is empty, `false` otherwise.

### mergeObjects
**Description:** Merges two objects into a new object.

**Parameters:**
- `obj1` (object): The first object to merge.
- `obj2` (object): The second object to merge.

**Returns:**
- (object): The merged object containing properties from both input objects. If there are overlapping keys, the values from `obj2` will overwrite those from `obj1`.


## Conclusion
This documentation is not entirely finished, some functions are not yet documented. You can check out the source code of the library with some new functions [here](https://github.com/YeagerCS/sneakerlib).
