import { Card } from 'react-bootstrap';
import axios from 'axios';
import './history.css';


const History = () => {
    return (
        <div id="main-div">
            {/* TODO: Add table here */}
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
                                <th>uh</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                
                            </tr>
                        </tbody>
                    </table>
                </Card.Body>
            </Card>
        </div>
    )
}

export default History;