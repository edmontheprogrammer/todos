// import logo from './logo.svg';
import './App.css';

// Importing "React" and "Component" into the App.js file
import React, { Component } from "react"; 
import axios from "axios"; 

import Modal from "./components/Modal"; 

// Creating a placeholder dataset for the frontend app. This dataset is an Array of objects. 
// This code includes hardcoded values for four items. 
// This will be replaced with the data from the backend, database. 
const todoItems = [
  {
    id: 1, 
    title: "Go to Market", 
    description: "Buy ingredients to prepare dinner", 
    completed: true, 
  }, 
  {
    id:1, 
    title: "Study", 
    description: "Read Algebra and History textbook for the upcoming test", 
    completed: false, 
  }, 
  {
    id:3, 
    title: "Sammy's books", 
    description: "Go to library to return Sammy's books", 
    completed: true, 
  }, 
  {
    id:4, 
    title: "Article", 
    description: "Write article on how to use Django with React", 
    completed: false, 
  },
]; 

class App extends Component {
  constructor(props) {
    super(props); 
    this.state ={
      viewCompleted: false, 
      //todoList: todoItems, // the hardcoded dataset above, "todoItems"
      todoList: [], // data from the requests to the backend server, PostgreSQL database
      modal: false, 
      activeItem: {
        title: "", 
        description: "", 
        completed: false, 
      }, 
    };
  }

  componentDidMount() {
    this.refreshList(); 
  }

  // The "refreshList()" function is a reusable method that is called each time an API request is completed. 
  // It updates the Todo list to display the most recent list of added items 
  refreshList = () => {
    axios
      .get("/api/todos/")
      .then((res) => this.setState({ todoList: res.data }))
      .catch((err) => console.log(err)); 
  }; 

  toggle = () => {
    this.setState({ modal: !this.state.modal }); 
  }; 

  // The "handleSubmit()" function takes care of both the create and update operations. 
  // If the item passed as the parameter doesn't have an "id", then it has probably not been created, so the 
  // the function creates it. 
  handleSubmit = (item) => {
    this.toggle(); 

    if (item.id) {
      axios
        .put(`/api/todos/${item.id}/`, item)
        .then((res) => this.refreshList()); 
      return; 
    }
    axios
      .post("/api/todos/", item)
      .then((res) => this.refreshList()); 
    //alert("save" + JSON.stringify(item)); 
  }; 

  handleDelete = (item) => {
   // alert("delete" + JSON.stringify(item)); 
   axios
      .delete(`/api/todos/${item.id}/`)
      .then((res) => this.refreshList()); 
  }; 

  createItem = () => {
    const item = { title: "", description: "", completed: false }; 

    this.setState({ activeItem: item, modal: !this.state.modal }); 
  }; 

  editItem = (item) => {
    this.setState({ activeItem: item, modal: !this.state.modal}); 
  }; 

  displayCompleted = (status) => {
    if (status) {
      return this.setState({ viewCompleted: true });
    }
    return this.setState({ viewCompleted: false }); 
  }; 

  // The "renderTabList()" function renders two spans that help control which set of items are displayed. 
  // Clicking on the "Completed" tab will diplsay the completed tasks. Clicking on the "Incomplete" tab will 
  // display the incomplete tasks. 
  renderTabList = () => {
    return (
      <div className='nav nav-tabs'>
        <span
          className={this.state.viewCompleted ? "nav-link active" : "nav-link"}
          onClick={() => this.displayCompleted(true)}
        >
          Complete
        </span>
        <span
          className={this.state.viewCompleted ? "nav-link" : "nav-link active"}
          onClick={() => this.displayCompleted(false)}
        >
          Incomplete
        </span>
      </div>
    );
  };

  renderItems = () => {
    const { viewCompleted } = this.state; 
    const newItems = this.state.todoList.filter(
      (item) => item.completed == viewCompleted
    ); 
    
    return newItems.map((item) => (
      <li
        key={item.id}
        className='list-group-item d-flex justify-content-between algin-items-center'
      >
        <span
          className={`todo-title mr-2 ${
            this.state.viewCompleted ? "completed-todo" : ""
          }`}
          title={item.description}
        >
          {item.title}
        </span>
        <span>
          <button
            className='btn btn-secondary mr-2'
            onClick={() => this.editItem(item)}
          >
            Edit
          </button>
          <button
            className='btn btn-danger'
            onClick={() => this.handleDelete(item)}
          >
            Delete
          </button>
        </span>
      </li>
    ));
  }; 

  render() {
    return (
      <main className='container'>
        <h1 className='text-white text-uppercase text-center my-4'>Todo app</h1>
        <div className='row'>
          <div className='col-md-6 col-sm-10 mx-auto p-0'>
              <div className='card p-3'>
                  <div className='mb-4'>
                    <button
                      className='btn btn-primary'
                      onClick={this.createItem}
                    >
                       Add task
                    </button>
                  </div>
                  {this.renderTabList()}
                  <ul className='list-group list-group-flush border-top-0'>
                    {this.renderItems()}
                  </ul>
              </div>
          </div>
        </div>
        {this.state.modal ? (
          <Modal 
            activeItem={this.state.activeItem}
            toggle={this.toggle}
            onSave={this.handleSubmit}
          />
          ) : null}
      </main>
    );
  }
}

export default App;

// Note 1: To handle actions such as adding and editing tasks, you will need to create a modal component. 
// First, create a "components" folder in the "src" directory and then create a "Modal.js" file 
//
// Note 2: The proxy will help in tunneling API requests to "http://localhost:8000" where the Django application
// will handle them. Without this "proxy", you would need to specify the full paths: 
//
// " axios.get("http://localhost:8000/api/todos") "
// 
// With "proxy" you can provide relative paths: 
// " axios.get("/api/todos/") "  
//
// Note 3: Now when you visit "http://localhost:3000" with your web browser, your application will allow you 
// to perform "CRUD", CREATE, READ, UPDATE and DELETE tasks. 