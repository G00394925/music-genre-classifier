import { Card } from 'react-bootstrap';
import axios from 'axios';
import './history.css';
import { useEffect, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';


const History = () => {

    const [history, setHistory] = useState([]);

    // Fetch history from server
    useEffect(() => {
        getHistory()
    }, []);

    const getHistory = () => {
        axios.get('/api/history')
            .then(response => {
                setHistory(response.data); // Set the history state with the response data
            })
            .catch(error => {
                console.error('There was an error fetching the history!', error);
            });
    }

    const handleDelete = (id) => {
        axios.delete(`/api/history/${id}`)
            .then(() => {
                getHistory()
            })
            .catch(error => {
                console.error(error)
            })
    }
    
    return (
        <div id="main-div">
            <Card id="history-table">
                <Card.Body>
                    <table>
                        <thead>
                            <tr>
                                <th>File Name</th>
                                <th>Genre</th>
                                <th>Tempo</th>
                                <th>Energy</th>
                                <th>Beats</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.filename}</td>
                                    <td>{item.prediction}</td>
                                    <td>{item.features.tempo}</td>
                                    <td>{item.features.energy}</td>
                                    <td>{item.features.beats}</td>
                                    <td>{new Date(item.timestamp).toLocaleDateString()}</td>
                                    <button 
                                        className='delete-btn'
                                        onClick={handleDelete}
                                    >
                                        <DeleteIcon />
                                    </button>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card.Body>
            </Card>
        </div>
    )
}

export default History;