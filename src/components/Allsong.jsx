import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import analyze from "rgbaster";
import image from "../assets/1.webp";
import { IoMdPlay } from "react-icons/io";
import { CiCirclePlus } from "react-icons/ci";
import { BsThreeDots } from "react-icons/bs";
import { MdAccessTime } from "react-icons/md";
import { Context } from "../../UseContext";
import { SiTicktick } from "react-icons/si";
import { FaBackwardStep } from "react-icons/fa6";
import { FaForwardStep } from "react-icons/fa6";
import { CiRepeat } from "react-icons/ci";
import { IoShuffleOutline } from "react-icons/io5";
import { IoPauseSharp } from "react-icons/io5";
const Allsong = () => {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bgGradient, setBgGradient] = useState(
    "linear-gradient(to top, #000000, #000001, #000111)"
  );
  const isDarkColor = (color) => {
    const rgb = color.match(/\d+/g);
    const brightness =
      (parseInt(rgb[0]) * 299 +
        parseInt(rgb[1]) * 587 +
        parseInt(rgb[2]) * 114) /
      1000;
    return brightness < 200;
  };
  const { lib, setLib } = useContext(Context);
  const [tickStates, setTickStates] = useState({});

  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [src, setsrc] = useState(null);
  const [mimg, setmimg] = useState([]);
  const [mname, setmname] = useState([]);
  const [mdes, setmdes] = useState([]);
  const [keyy, setkey] = useState([]);
  const [bgs, setbgs] = useState([]);

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
    setDuration(audioRef.current.duration);
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const prevplay = (i) => {
    audioRef.current.pause();
    setkey(i - 1);

    setsrc(playlist.tracks?.items[i - 1]?.track?.preview_url);
    setmname(playlist.tracks?.items[i - 1]?.track?.name);
    setmimg(playlist.tracks?.items[i - 1]?.track?.album?.images);
    setmdes(
      playlist.tracks?.items[i - 1]?.track?.album?.artists.map(
        (artist) => artist.name
      )
    );
    setbgs(playlist.tracks?.items[i - 1]?.track.id);
    setIsPlaying(false);
    setTimeout(() => {
      audioRef.current.play();
      setIsPlaying(true);
    }, 1000);
  };

  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;

    const handleEnded = () => {
      futureplay(keyy);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [keyy, playlist]);

  const selfrepeat = (i) => {
    setkey(i - 1);
  };

  const futureplay = (i) => {
    audioRef.current.pause();
    setkey(i + 1);
    setsrc(playlist.tracks?.items[i + 1]?.track?.preview_url);
    setmname(playlist.tracks?.items[i + 1]?.track?.name);
    setmimg(playlist.tracks?.items[i + 1]?.track?.album?.images);
    setmdes(
      playlist.tracks?.items[i + 1]?.track?.album?.artists.map(
        (artist) => artist.name
      )
    );
    setbgs(playlist.tracks?.items[i + 1]?.track.id);
    setIsPlaying(false);
    setTimeout(() => {
      audioRef.current.play();
      setIsPlaying(true);
    }, 1000);
  };

  useEffect(() => {
    const fetchPlaylist = async (token) => {
      try {
        const result = await fetch(
          `https://api.spotify.com/v1/playlists/${id}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!result.ok) {
          throw new Error(`Error fetching playlist: ${result.statusText}`);
        }
        const data = await result.json();
        setPlaylist(data);
        setsrc(data.tracks?.items[0]?.track?.preview_url);
        setbgs(data.tracks?.items[0]?.track.id);
        setmname(data.tracks?.items[0]?.track?.name);
        setmimg(data.tracks?.items[0]?.track?.album?.images);
        setmdes(
          data.tracks?.items[0]?.track?.album?.artists.map(
            (artist) => artist.name
          )
        );
        setkey(0);
        if (data.images[0]?.url) {
          analyze(data.images[0].url, { scale: 0.1 })
            .then((colors) => {
              const topColors = colors
                .slice(0, 5)
                .map((color) => color.color)
                .filter(isDarkColor);
              const gradient = `linear-gradient(to top, #000000, ${topColors.join(
                ", "
              )})`;
              setBgGradient(gradient);
            })
            .catch((err) => console.error("Error analyzing image color:", err));
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const token = localStorage.getItem("access_token");
    if (token) {
      fetchPlaylist(token);
    } else {
      setError("No access token found");
      setLoading(false);
    }
  }, [id]);

  const addItem = (playlist) => {
    setLib((prev) => {
      const updatedLib = [...prev, playlist];
      localStorage.setItem('library', JSON.stringify(updatedLib));
      return updatedLib;
    });



    setTickStates((prev) => ({ ...prev, [playlist.id]: true }));
  };

  const isTicked = (playlistId) => tickStates[playlistId] === true;

  if (loading) {
    return (
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "black",
          overflow:'hidden'
        }}
      >
        <img src={image} alt="Loading"width={200}/>
      </div>
    );
  }

  if (error) {
    return <div className="allsong-container">Error: {error}</div>;
  }
  console.log(playlist);

  return (
    <Container $bgGradient={bgGradient}>
      <div className="allsong-container">
        <div className="playlist-header">
          <img
            src={playlist.images[0]?.url}
            alt={playlist.name}
            className="playlist-image"
          />
          <div className="playlist-details">
            <div className="playlist-name">{playlist.name}</div>
            <div className="playlist-description">{playlist.description}</div>
            <div className="playlist-stats">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Spotify_icon.svg/1982px-Spotify_icon.svg.png"
                alt="Spotify Icon"
                width={30}
              />
              {playlist.followers.total} likes • {playlist.tracks.total} songs,
              about{" "}
              {Math.floor(
                playlist.tracks.items.reduce(
                  (total, item) => total + item.track.duration_ms,
                  0
                ) / 60000
              )}{" "}
              min
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            onClick={() => {
              futureplay(keyy);
              togglePlayPause;
            }}
            style={{ color: "black", cursor: "pointer" }}
          >
            {isPlaying ? (
              <IoPauseSharp
                className="plic"
                style={{
                  color: "black",
                  background: "#18d860;",
                }}
              />
            ) : (
              <IoMdPlay
                className="plic"
                style={{
                  color: "black",
                  background: "#18d860;",
                }}
              />
            )}
          </div>

          {isTicked(playlist.id) ? (
            <SiTicktick className="plus" style={{ color: "white" }} />
          ) : (
            <CiCirclePlus
              className="plus"
              onClick={() => {
                addItem(playlist);
                alert("Successfully saved the playlist!");
              }}
              style={{ color: "white" }}
            />
          )}
          <BsThreeDots className="plus" style={{ color: "white" }} />
        </div>

        <div className="dflex" key={playlist.id}>
          <img className="limg" src={mimg[2]?.url} alt={mname} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <p
              style={{
                color: "white",
                margin: "0px",
                fontSize: "17px",
              }}
            >
              {mname.slice(0, 20)}...
            </p>
            <p
              style={{
                color: "gray",
                margin: "0px",
                fontSize: "12px",
                width: "200px",
              }}
            >
              {mdes?.join(", ")}
            </p>
          </div>
          <div style={{ color: "white", fontSize: "25px", marginTop: "10px" }}>
            {" "}
            {isTicked(playlist.id) ? (
              <SiTicktick
                className="plus"
                style={{ color: "white", fontSize: "25px" }}
              />
            ) : (
              <CiCirclePlus
                className="plus"
                onClick={() => {
                  addItem(playlist);
                  alert("Successfully saved the playlist!");
                }}
                style={{ color: "white", fontSize: "25px" }}
              />
            )}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
            className="playwhole"
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <IoShuffleOutline
                className="plic"
                style={{
                  background: "gray",
                  fontSize: "20px",
                  color: "white",
                }}
              />
              <FaBackwardStep
                className="plic"
                style={{
                  background: "gray",
                  fontSize: "20px",
                  color: "white",
                }}
                onClick={() => prevplay(keyy)}
              />
              <div onClick={togglePlayPause}>
                {isPlaying ? (
                  <IoPauseSharp
                    className="plic"
                    style={{
                      color: "black",
                      background: "white",
                      fontSize: "20px",
                    }}
                  />
                ) : (
                  <IoMdPlay
                    className="plic"
                    style={{
                      color: "black",
                      background: "white",
                      fontSize: "20px",
                    }}
                  />
                )}
              </div>

              <FaForwardStep
                className="plic"
                style={{
                  background: "gray",
                  fontSize: "20px",
                  color: "white",
                }}
                onClick={() => futureplay(keyy)}
              />
              <CiRepeat
                className="plic"
                style={{
                  background: "gray",
                  fontSize: "20px",
                  color: "white",
                }}
                onClick={() => selfrepeat(keyy)}
              />
            </div>
            <div className="audio-player-container">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                  marginTop: "10px",
                }}
              >
                <p style={{ color: "white", fontSize: "15px" }}>
                  {formatTime(currentTime)}
                </p>
                <input
                  type="range"
                  className="inpt"
                  min={0}
                  max={duration}
                  value={currentTime}
                  onChange={(e) => {
                    audioRef.current.currentTime = e.target.value;
                    setCurrentTime(e.target.value);
                  }}
                />
                <p style={{ color: "white", fontSize: "15px" }}>
                  {formatTime(duration)}
                </p>
              </div>
              <audio
                ref={audioRef}
                src={src}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleTimeUpdate}
                onEnded={() => setIsPlaying(false)}
                style={{ display: "none" }}
              />
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            justifyContent: "space-between",
          }}
        >
          <h3 style={{ flex: "0.1" }}>#</h3>
          <h3 style={{ flex: "0.3" }}>Title</h3>
          <h3 style={{ flex: "0.25" }} className="singer">Singer</h3>
          <h3 style={{ flex: "0.1" }} className="from">From</h3>
          <MdAccessTime className="plus" style={{ fontSize: "25px" }} />
        </div>
        <hr />
        <div className="song-list">
          {playlist.tracks.items.map((trackItem, index) => (
            <div
              key={trackItem.track.id}
              className={bgs == trackItem.track.id ? "bgs" : "song-item"}
              onClick={() => {
                setsrc(trackItem?.track?.preview_url);
                setmname(trackItem?.track?.name);
                setmimg(trackItem?.track?.album?.images);
                setmdes(
                  trackItem?.track?.album?.artists.map((artist) => artist.name)
                );
                setIsPlaying(false);
                setTimeout(() => {
                  audioRef.current.play();
                  setIsPlaying(true);
                }, 1000);
                setbgs(trackItem.track.id);
                setkey(index);
              }}
            >
              <div className="one">{index + 1}</div>
              <IoMdPlay
                className="ply"
                onClick={() => futureplay(keyy)}
                style={{ cursor: "pointer" }}
              />
              <img src={trackItem.track.album.images[2]?.url} alt="" />
              <div className="song-title">{trackItem.track.name}</div>

              <div className="song-artist">
                {trackItem.track.artists
                  .map((artist) => artist.name)
                  .join(", ")}
              </div>
              <div className="song-album">{trackItem.track.album.name}</div>
              <div className="song-duration">
                {Math.floor(trackItem.track.duration_ms / 60000)}:
                {((trackItem.track.duration_ms % 60000) / 1000)
                  .toFixed(0)
                  .padStart(2, "0")}
              </div>
            </div>
          ))}
          <div></div>
        </div>
      </div>
    </Container>
  );
};

export default Allsong;

const Container = styled.div`
  .inpt {
    -webkit-appearance: none;
    width: 30rem;
    height: 2px;
    background: ${({ rangeValue }) =>
    rangeValue < 100 ? "#18d860" : "d3d3d3"};
    outline: none;
    opacity: 0.7;
    transition: opacity 0.2s;
  }

  .inpt:hover {
    opacity: 1;
  }

  .inpt::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    margin-left: 10px;
    height: 20px;
    background: ${({ rangeValue }) =>
    rangeValue < 100 ? "#18d860" : "white"}; /* Change color dynamically */
    cursor: pointer;
    border-radius: 50%;
    transition: background-color 0.2s; /* Smooth transition */
  }

  .inpt::-moz-range-thumb {
    width: 20px;
    height: 20px;
    background: ${({ rangeValue }) =>
    rangeValue < 100 ? "#18d860" : "white"}; /* Change color dynamically */
    cursor: pointer;
    border-radius: 50%;
    transition: background-color 0.2s; /* Smooth transition */
  }

  .limg {
    width: 50px;
    height: 50px;
    border-radius: 5px;
  }

  .dflex {
    top: 83%;
    width: 100vw;
    z-index: 100;
    position: fixed;
    display: flex;
    flex-direction: row;
    padding: 10px;
    padding-left: 30px;
    background: linear-gradient(to top, #000000, #000001, #000111);
    cursor: pointer;
    gap: 20px;
    left: -10px;
  }

  .one {
    display: inline;
  }
  .ply {
    font-size: 26px;
    color: white;
    display: none;
  }
  .plus {
    font-size: 40px;
    color: gray;
    &:hover {
      color: white;
      cursor: pointer;
    }
  }
  .allsong-container {
    background: ${(props) => props.$bgGradient};
    color: white;
    padding: 20px;
    min-height: 100vh;
  }

  .playlist-header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }

  .playlist-image {
    width: 200px;
    height: 200px;
    margin-right: 20px;
  }

  .playlist-details {
    flex-grow: 1;
  }

  .playlist-name {
    font-size: 2.5em;
    font-weight: bold;
  }

  .playlist-description {
    margin-top: 10px;
    font-size: 1.2em;
  }

  .playlist-stats {
    display: flex;
    align-items: center;
    margin-top: 10px;
    font-size: 1em;
  }

  .song-list {
    margin-top: 20px;
  }

  .song-item {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    align-items: center;
    text-align: center;
    gap: 10px;
  }

  .song-item:hover {
    background-color: rgba(255, 255, 255, 0.1);
    &:hover .one {
      display: none;
    }

    &:hover .ply {
      display: inline;
    }
  }

  .bgs {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    align-items: center;
    text-align: center;
    color: green;
    gap: 10px;
    background-color: rgba(255, 255, 255, 0.1);
    & .one {
      display: none;
    }

    & .ply {
      color: green;
      display: inline;
    }
  }

  .song-title {
    font-size: 1.1em;
    flex-grow: 1;
  }

  .song-artist {
    margin-left: 20px;
    flex-grow: 1;
  }

  .song-album {
    flex-grow: 1;
  }

  .song-duration {
    margin-left: 20px;
  }

  .plic {
    background: #18d860;
    border-radius: 50%;
    padding: 15px;
    position: relative;
    font-size: 30px;
  }
 @media (max-width: 930px) {
 
  .playlist-header{
  flex-direction:column}
 
 .playlist-details {
    flex-grow: 1;
    justify-content: center;
    align-items: center;
    display: flex;
    flex-direction: column;
 
 
 }
  
.from{   display: none;}
 .song-album {
    display: none;}


.dflex {top:75%;
   padding-left: 13px;
     gap: 8px; 
    left: 1px;
    justify-content: center;
    height: 50vh;
    }



.playwhole{
    margin-top: 55px;
    margin-bottom: 125px;
display: flex;
    align-items: center;
    justify-content: center;
 
    position: fixed;

}

 .allsong-container {
position:relative;
right:10px;
    width: 93vw;}
    .song-artist {
    display: none;}

    .song-title {
    font-size: 1rem;
    flex-grow: 1;
}

 .inpt {
    width: 12rem 

}
 .bgs{
 gap:0px;
 padding:5px}
 .singer{
 display:none}
`;
