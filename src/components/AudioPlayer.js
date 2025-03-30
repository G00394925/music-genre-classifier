import React, { useState, useRef, useEffect} from 'react';
import { Checkbox } from '@mui/material';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import { Card } from 'react-bootstrap';
import placeholderImg from '../placeholder.jpg';
import './AudioPlayer.css';

const AudioPlayer = ({ audioFile, prediction }) => {
    const [isPlaying, setIsPlaying] = useState(false)
    const [audioUrl, setAudioUrl] = useState(null)
    const audioRef = useRef(null)

    useEffect(() => {
        // Remove previous audio URL
        if(audioUrl) {
            URL.revokeObjectURL(audioUrl)
        }
        
        if (audioFile) {
            // Create URL for audio file
            const url = URL.createObjectURL(audioFile)
            setAudioUrl(url)
        }

        return () => {
            // Remove URL when component unmounts
            if (audioUrl) {
                URL.revokeObjectURL(audioUrl)
            }
        }
    }, [audioFile])

    // Playback controls
    const handlePlayPause = () => {
        if(audioRef.current) { // Check that audio file is loaded
            if(isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
        }
        setIsPlaying(!isPlaying)  // Toggle play/pause state
    };

    return (
        <Card className="bg-dark text-white media-player" style={{ width: '100%', height: '100%', maxWidth: '18rem', maxHeight: '20rem', display: 'flex'}}>
        <Card.Title style={{ marginTop: '10px', textAlign: 'center'}}>
            {prediction ? 'Ready to play' : 'No track uploaded'}   
        </Card.Title>

        <Card.Body style={{ paddingTop: '5px'}}>
            <Card.Img src={placeholderImg} alt="Card image" />

            {/* Play button -- Decided on a customised checkbox to toggle playback */}
            <Checkbox 
                sx={{
                    color: "#4B77D1",
                    '& .MuiSvgIcon-root': { fontSize: 70 }
                }} 
                
                style={{
                    position: 'absolute',
                    top: '65%',
                    left: '63%',
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