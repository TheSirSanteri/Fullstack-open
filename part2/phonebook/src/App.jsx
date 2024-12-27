import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid'; //Need to install UUID
import personsService from './Services/personsService'
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';


const App = () => {
  const [persons, setPersons] = useState([]); 
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    console.log('effect')
    personsService
      .getAll()
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response || []); // Debugging so persons are always an array
      })
      .catch(error => {
        console.error('Failed to fetch persons:', error);
        setPersons([]); // Set to empty array on error
      });
  }, [])


  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  }

  const handleFiltering = (event) => {
    setFilter(event.target.value);
  }

  const addPerson = (event) => {
    event.preventDefault();

    const personObject = {
      name: newName,
      number: newNumber,
    };

    const existingPerson = persons.find(person => person.name === newName); //Checks if person already exists
    if (existingPerson) {
      if (window.confirm(`${existingPerson.name} is already added to phonebook, replace the old number with new one?`)) {
        console.log(`Change confirmed id: ${existingPerson.id}`);
        personsService
        .update(existingPerson.id, personObject)
        .then(updatedPerson => {
          console.log('updated succesfully')
          setPersons(persons.map(person => person.id !== existingPerson.id ? person : updatedPerson))
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          console.error('Failed to update person:', error);
      });
      }
    } else {

    personObject.id = uuidv4(); //Person doesn't exist so new ID is made.

    personsService
    .create(personObject)
    .then(response => {
      setPersons(persons.concat(response));
      setNewName('');
      setNewNumber('');
    })
    .catch(error => {
      console.error('Failed to add person:', error);
    });
    }
  };

  const removePerson = (name, id) => {
    console.log(`Attempting to remove ${name} with id ${id}`);
    if (window.confirm(`Delete ${name}?`)) {
      console.log(`Confirmed deletion for ${name}`);
      console.log(`ID being sent to remove: ${id}`);
      personsService
        .remove(id)
        .then(() => {
          console.log(`${name} deleted successfully`);
          setPersons((prevPersons) => (prevPersons || []).filter(n => n.id !== id));
        })
        .catch(error => {
          console.error("Failed to delete person:", error);
        });
      } else {
        console.log(`Deletion cancelled for ${name}`);
      }
  };
  
  const personsToShow = (persons || []).filter(person => // Safeguard for filter
    person.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter filter={filter} handleFiltering={handleFiltering}/>

      <h2>Add a new</h2>

      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h2>Numbers</h2>

      <Persons persons={personsToShow} removePerson={removePerson}/>

    </div>
  );
}

export default App;
