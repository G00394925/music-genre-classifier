import React, { useState, useRef, useEffect} from 'react';
import { Checkbox } from '@mui/material';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import { Card } from 'react-bootstrap';
import placeholderImg from '../placeholder.jpg';

const AudioPlayer = ({ audioFile, prediction }) => {
    const [isPlaying, setIsPlaying] = useState(false)
    const [audioUrl, setAudioUrl] = useState(null)
    const audioRef = useRef(null)

    useEffect(() => {
        if(audioUrl) {
            URL.revokeObjectURL(audioUrl)
        }
        
        if (audioFile) {
            const url = URL.createObjectURL(audioFile)
            setAudioUrl(url)
        }

        return () => {
            if (audioUrl) {
                URL.revokeObjectURL(audioUrl)
            }
        }
    }, [audioFile])

    // Playback controls
    const handlePlayPause = () => {
        if(audioRef.current) {      // Check that audio file is loaded
            if(isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
        }
        setIsPlaying(!isPlaying)  // Toggle play/pause state
    };

    return (
        <Card className="bg-dark text-white" style={{ width: '18rem', height: '20rem', display: 'flex'}}>
        <Card.Title style={{ marginTop: '10px', textAlign: 'center'}}>
            {prediction ? 'Ready to play' : 'No track uploaded'}   
        </Card.Title>

        <Card.Body className='media-player'>
            <Card.Img src={placeholderImg} alt="Card image" />
            <Checkbox 
                sx={{
                    color: "#4B77D1",
                    '& .MuiSvgIcon-root': { fontSize: 70 }
                }} 
                
                style={{
                    position: 'absolute',
                    top: '65%',
                    left: '65%',
                }}
                
                size='large' 
                icon={<PlayCircleIcon />} 
                checkedIcon={<PauseCircleIcon />}
                checked={isPlaying}
                onChange={handlePlayPause}
                disabled={prediction ? false : true}
            />
            <audio ref={audioRef} src={audioUrl} />
        </Card.Body>
    </Card>
    )
}

export default AudioPlayer;