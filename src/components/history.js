import { Card } from 'react-bootstrap';
import React from 'react';
import axios from 'axios';
import './history.css';
import { useEffect, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';


const History = () => {

    const [history, setHistory] = useState([]);
    const [expandedRow, setExpandedRow] = useState(false);

    // Fetch history from server
    useEffect(() => {
        getHistory()
    }, []);

    // Load the history
    const getHistory = () => {
        axios.get('/api/history')
            .then(response => {
                setHistory(response.data); // Set the history state with the response data
            })
            .catch(error => {
                console.error('There was an error fetching the history!', error);
            });
    }

    // Delete history
    const handleDelete = () => {
        axios.delete('/api/history')
            .then(() => {
                getHistory() // Reload history
            })
            .catch(error => {
                console.error(error)
            })
    }

    const toggleRow = (index) => {
        setExpandedRow(expandedRow === index ? null : index);
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
                                <th>
                                    Date
                                    <button 
                                        className='delete-btn'
                                        onClick={() => handleDelete()}
                                    >
                                        <DeleteIcon />
                                    </button>    
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((item, index) => (
                                <>
                                    <tr 
                                        key={index} 
                                        className='data-entry'
                                        onClick={() => toggleRow(index)}    
                                    >
                                        <td>{item.filename}</td>
                                        <td>{item.prediction}</td>
                                        <td>{item.features.tempo}</td>
                                        <td>{item.features.energy}</td>
                                        <td>{item.features.beats}</td>
                                        <td>{new Date(item.timestamp).toLocaleDateString()}</td>
                                    </tr>
                                    {expandedRow === index && (
                                        <tr>
                                            <td colSpan="6">
                                                <div className="expanded-table">
                                                    <table className="inner-table">
                                                        <thead>
                                                            <tr>
                                                                <th>Waveform</th>
                                                                <th>Spectrogram</th>
                                                                <th>Chromagram</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td><img className="feature-img" src={item.features.waveform_img}/></td>
                                                                <td><img className="feature-img" src={item.features.spectrogram_img}/></td>
                                                                <td><img className="feature-img" src={item.features.chroma_img}/></td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            ))}
                        </tbody>
                    </table>
                </Card.Body>
            </Card>
        </div>
    )
}

export default History;