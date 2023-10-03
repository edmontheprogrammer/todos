// Creating the Modal component to handle the "add" and "edit" tasks operations
import React, { Component } from "react"; 

// Here importing all of the different components needed for creating the "Modal" compoent.
import {
    Button,
    Modal, 
    ModalHeader, 
    ModalBody, 
    ModalFooter, 
    Form, 
    FormGroup, 
    Input, 
    Label,
} from "reactstrap"; 

// Note 1: This "Modal" compoent is like a basic HTML web page with "Header", "Body" and "Footer" section. 
// The Contents of the Modal component are three "FormGroup" items with "Inputs" that accepts "Title", 
// "Description" and "Checkbox" that determines whether the task has been completed or not.  
// These are the same fields that we defined as properties on the Todo model in the backend. 
export default class CustomModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeItem: this.props.activeItem, 
        };
    }

    handleChange = (e) => {
        let {name, value} = e.target; 
        
        if (e.target.type === "checkbox") {
            value = e.target.checked; 
        }

        const activeItem = {...this.state.activeItem, [name]: value}; 

        this.setState({ activeItem });
    };

    render() {
        const { toggle, onSave } = this.props; 

        return (
            <Modal isOpen={true} toggle={toggle}>
                <ModalHeader toggle={toggle}> Todo Item</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label for="todo-title">Title</Label>
                            <Input 
                                type="text"
                                id="todo-title"
                                name="title"
                                value={this.state.activeItem.title}
                                onChange={this.handleChange}
                                placeholder="Enter Todo Title"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="todo-description"> Description</Label>
                            <Input 
                                type="text"
                                id="todo-description"
                                name="description"
                                value={this.state.activeItem.description}
                                onChange={this.handleChange}
                                placeholder="Enter Todo description"
                            />
                        </FormGroup>
                        <FormGroup check>
                            <Label check>
                                <Input 
                                    type="checkbox"
                                    name="completed"
                                    checked={this.state.activeItem.completed}
                                    onChange={this.handleChange}
                                />
                                Completed
                            </Label>
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="success"
                        onClick={() => onSave(this.state.activeItem)}
                    >
                        Save
                    </Button>
                </ModalFooter>
            </Modal>
        ); 
    }
}



