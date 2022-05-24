import React, { useState, useEffect } from 'react'
import List from './List'
import Alert from './Alert'

const getLocalStorage = () => {
    let list = localStorage.getItem('list');
    if (list) {
        return JSON.parse(localStorage.getItem('list'));
    }
    else {
        return [];
    }
}

function App() {
    const [name, setName] = useState('');
    const [list, setList] = useState(getLocalStorage());
    const [isEditing, setIsEditing] = useState(false);
    const [editID, setEditID] = useState(null);
    const [alert, setAlert] = useState({
        show:false,
        msg:'',
        type:''
    });

    const showAlert = (show=false,type='',msg='') => {
        setAlert({show:show, type:type, msg:msg})
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('hello');
        if (!name) {
            // Display alert
            showAlert(true,'danger','please enter the value');
        }
        else if (name && isEditing){
            // Deal with Edit
            showAlert(true,'success','edit successfully');
            setList(list.map((item) => {
                if (item.id === editID)
                    item.title = name
                return item;
            }))
            setEditID(null);
            setName('');
            setIsEditing(false);
        }
        else {
            showAlert(true,'success','item added to the list')
            // Show Alert
            const newItem = {id: new Date().getTime().toString(), title:name};
            setList([...list, newItem]);
            setName('');
            if (alert.show) {
                alert.show = false;
            }
        }
    }

    const handleClear = () => {
        setList([]);
        setName('');
        showAlert(true,'danger','empty list');
    }

    const removeItem = (id) => {
        showAlert(true,'danger','item removed');
        const newList = list.filter(item => item.id !== id);
        setList(newList);
    }

    const editItem = (id) => {
        const specificItem = list.find((item)=> item.id === id);
        setIsEditing(true);
        setEditID(id);
        setName(specificItem.title);
    }

    useEffect(() => {
        localStorage.setItem('list', JSON.stringify(list)); 
    }, [list])

    return <section className='section-center'>
        <form className='grocery-form' onSubmit={handleSubmit}>
            {alert.show && <Alert {...alert} removeAlert={showAlert} list={list}/>}
            <h3>grocery bud</h3>
            <div className='form-control'>
                <input type='text' 
                    className='grocery' 
                    placeholder='e.g. eggs' 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}>
                </input>
                <button type='submit' className='submit-btn'>
                    {isEditing? 'edit' : 'submit'}
                </button>
            </div>
        </form>
        {
            list.length > 0 && (
                <div className='grocery-container'>
                    <List items={list} removeItem={removeItem} editItem={editItem} />
                    <button className='clear-btn' onClick={handleClear}>
                        clear items
                    </button>
                </div>
            )
        }
    </section>
}

export default App
