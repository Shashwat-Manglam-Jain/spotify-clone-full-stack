import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IoSearchOutline } from "react-icons/io5";
import { IoMdPlay } from "react-icons/io";
import {
  faLessThan,
  faBell,
  faGreaterThan,
} from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import { GoHomeFill } from "react-icons/go";
import { Link, useNavigate } from "react-router-dom";
import { BiLibrary } from "react-icons/bi";
import { BsArrowRight } from "react-icons/bs";
import { FaPlus } from "react-icons/fa6";

const Home = () => {
  const navigate = useNavigate();
  const [play, setplay] = useState("");
  const [title, setTitle] = useState(false);
  const [first, setFirst] = useState("");
  const clientId = "985f75e1c7464f97b9e03d426fcb1594";
  const redirectUri = "http://localhost:5173/home";
  const codeVerifier = localStorage.getItem("code_verifier");

  useEffect(() => {
    async function getToken(code) {
      const url = "https://accounts.spotify.com/api/token";
      const payload = {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: clientId,
          grant_type: "authorization_code",
          code,
          redirect_uri: redirectUri,
          code_verifier: codeVerifier,
        }),
      };

      try {
        const response = await fetch(url, payload);
        if (!response.ok) {
          throw new Error("Failed to fetch token");
        }
        const data = await response.json();
        localStorage.setItem("access_token", data.access_token);
        return data.access_token;
      } catch (error) {
        console.error("Error fetching token:", error);
        return null;
      }
    }

    async function getProfile(token) {
      const accessToken = token || localStorage.getItem("access_token");

      if (accessToken) {
        const response = await fetch("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: "Bearer " + accessToken,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setFirst(data);
        } else {
          console.error("Error fetching profile:", response.statusText);
        }
      } else {
        console.error("Access token not found");
      }
    }

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code) {
      getToken(code).then(getProfile);
    } else {
      getProfile();
    }
  }, [codeVerifier, redirectUri]);

  useEffect(() => {
    async function fetchnew(token) {
      try {
        const result = await fetch(
          "https://api.spotify.com/v1/browse/featured-playlists?limit=50",
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await result.json();
        setplay(data.playlists.items);
      } catch (error) {
        console.error("Error fetching playlist:", error);
      }
    }

    const token = localStorage.getItem("access_token");
    if (token) {
      fetchnew(token);
    }
  }, []); // Empty dependency array ensures this runs only once
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    const fetchThrowbackPlaylists = async (token) => {
      try {
        const result = await fetch(
          `https://api.spotify.com/v1/search?q=All%20Out%20Hindi&type=playlist&limit=50`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await result.json();
        setPlaylists(data.playlists.items);
      } catch (error) {
        console.error("Error fetching throwback playlists:", error);
      }
    };

    const token = localStorage.getItem("access_token");
    if (token) {
      fetchThrowbackPlaylists(token);
    }
  }, []);
  const goForward = (path) => {
    navigate(path);
  };
  const [podcast, setpodcast] = useState("");
  useEffect(() => {
    const fetchPodcast = async (token) => {
      try {
        const result = await fetch(
          `https://api.spotify.com/v1/search?q=Podcasts&type=playlist&limit=50`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await result.json();
        setpodcast(data.playlists.items);
      } catch (error) {
        console.error("Error fetching throwback playlists:", error);
      }
    };

    const token = localStorage.getItem("access_token");
    if (token) {
      fetchPodcast(token);
    }
  }, []);

  const [liked, setliked] = useState("");

  useEffect(() => {
    const fetchliked = async (token) => {
      try {
        const result = await fetch(
          `https://api.spotify.com/v1/search?q=Top%20Track%20Bollywood%20Hindi&type=playlist&limit=50`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await result.json();
        setliked(data.playlists.items);
      } catch (error) {
        console.error("Error fetching throwback playlists:", error);
      }
    };

    const token = localStorage.getItem("access_token");
    if (token) {
      fetchliked(token);
    }
  }, []);

  const [Chart, setChart] = useState("");

  useEffect(() => {
    const fetchChart = async (token) => {
      try {
        const result = await fetch(
          `https://api.spotify.com/v1/search?q=Featured%20Charts&type=playlist&limit=50`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await result.json();
        setChart(data.playlists.items);
      } catch (error) {
        console.error("Error fetching throwback playlists:", error);
      }
    };

    const token = localStorage.getItem("access_token");
    if (token) {
      fetchChart(token);
    }
  }, []);

  const [Instrumental, setInstrumental] = useState("");

  useEffect(() => {
    const fetchsetInstrumental = async (token) => {
      try {
        const result = await fetch(
          `https://api.spotify.com/v1/search?q=Instrumental&type=playlist&limit=50`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await result.json();
        setInstrumental(data.playlists.items);
      } catch (error) {
        console.error("Error fetching throwback playlists:", error);
      }
    };

    const token = localStorage.getItem("access_token");
    if (token) {
      fetchsetInstrumental(token);
    }
  }, []);
  const s = localStorage.getItem("library");
  const initialLib = s ? JSON.parse(s) : []; // Parse the JSON string or initialize with an empty array

  const [lib, setLib] = useState(initialLib);

  console.log("lib:", lib);

  return (
    <Container>
      <div className="divide">
        <div className="scrollable">
          <div style={{ height: "auto", background: " #1e1e1e" }}>
            <div className="home">
              <GoHomeFill className="ho1" />
              <span>Home</span>
            </div>
            <div className="home">
              <IoSearchOutline
                className="ho1 inh"
                style={{ color: "#D0D0D0" }}
              />
              <span className="inh">Search</span>
            </div>
          </div>
          <br />
          <br />
          <div className="lib">
            <BiLibrary style={{ fontSize: "32px" }} />
            <h3 style={{ fontSize: "19px" }}>Your Liabrary </h3>
            <div style={{ paddingTop: "5px" }}>
              <FaPlus />
              <BsArrowRight style={{ fontSize: "22px", paddingLeft: "10px" }} />
            </div>
            <div></div>
          </div>

          <div style={{ background: "#1e1e1e" }}>
            {lib.length > 0 ? (
              lib.map((item, index) => (
                <Link
                  to={`/playlist/${item.id}`}
                  key={lib.id}
                  style={{ textDecoration: "none" }}
                >
                  {" "}
                  <div className="dflex" key={index}>
                    <img
                      className="limg"
                      src={item?.images[0]?.url}
                      alt={item.name}
                    />
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <p
                        style={{
                          color: "white",
                          margin: "0px",
                          fontSize: "17px",
                        }}
                      >
                        {item?.name.slice(0, 20)}...
                      </p>
                      <p
                        style={{
                          color: "gray",
                          margin: "0px",
                          fontSize: "12px",
                        }}
                      >
                        {item?.description.slice(0, 100)}...
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div
                style={{
                  fontWeight: "500",
                  color: "gray",
                  fontSize: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingBottom: "20px",
                }}
              >
                Loading....
              </div>
            )}
          </div>
        </div>

        <div className="width2">
          <div className="home_body">
            <div style={{ display: "flex", gap: "20px" }}>
              <button
                className="home_btn"
                onClick={() => {
                  navigate(-1);
                }}
              >
                <FontAwesomeIcon
                  icon={faLessThan}
                  size="1x"
                  style={{ color: "#414141" }}
                />
              </button>
              <button
                className="home_btn"
                onClick={() => {
                  goForward("/");
                }}
              >
                <FontAwesomeIcon
                  icon={faGreaterThan}
                  size="1x"
                  style={{ color: "#414141" }}
                />
              </button>
            </div>

            <div className="btn1">Welcome !! {first.display_name}</div>

            <div style={{ display: "flex", gap: "20px" }}>
              <button className="home_btn">
                <FontAwesomeIcon
                  icon={faBell}
                  size="1x"
                  style={{ color: "#414141" }}
                />
              </button>
              {title ? (
                <div
                  className="profile-info"
                  onClick={() => {
                    setTitle(!title);
                    setTimeout(() => {
                      setTitle(title);
                    }, 3000);
                  }}
                >
                  <img
                    src={
                      first?.images?.[0]?.url ||
                      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWXzCSPkpN-TPug9XIsssvBxZQHkZEhjoGfg&s"
                    }
                    alt="Profile"
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      background: "#0f0f0f",
                      border: "none",
                      cursor: "pointer",
                    }}
                  />
                  <div>
                    <h3 style={{ color: "white" }}>{first.email}</h3>
                    <h3 style={{ color: "white" }}>
                      Followers: {first.followers?.total}
                    </h3>
                  </div>
                </div>
              ) : (
                <img
                  src={
                    first?.images?.[0]?.url ||
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWXzCSPkpN-TPug9XIsssvBxZQHkZEhjoGfg&s"
                  }
                  alt="Profile"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "#0f0f0f",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setTitle(!title);
                    setTimeout(() => {
                      setTitle(title);
                    }, 3000);
                  }}
                />
              )}
            </div>
          </div>

          <div className="footer">
            <button style={{ color: "black", background: "white" }}>All</button>
            <button>Music</button>
            <button>Podcast</button>
          </div>

          <div className="try-something-else">
            Today's biggest hits
            <span>
              <Link
                 to="/allshow"
                style={{
                  fontWeight: "500",
                  color: "gray",
                  textDecoration: "none",
                  marginRight:'50px',
                   whiteSpace: 'nowrap'
                }}
                 
                state={{ data: play }}
              >
               Show  all
              </Link>
            </span>
          </div>

          <div className="playl">
            {play.length > 0 ? (
              play.map((playlist) => (
                <Link
                  to={`/playlist/${playlist.id}`}
                  key={playlist.id}
                  style={{ textDecoration: "none" }}
                >
                  <div className="play">
                    <img
                      src={playlist.images[0]?.url}
                      alt="Playlist cover"
                      className="pimg"
                    />
                    <IoMdPlay className="plic" style={{ color: "black" }} />
                    <h3 className="pname">{playlist.name.slice(0, 50)}...</h3>
                    <p className="pname" style={{ color: "gray" }}>
                      {playlist.description.slice(0, 150)}...
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <p
                className="try-something-else"
                style={{ fontWeight: "500", color: "gray", fontSize: "20px" }}
              >
                Loading...
              </p>
            )}
          </div>

          <div className="try-something-else">
            Throwback
            <span>
              <Link
                 to="/allshow"
                style={{
                  fontWeight: "500",
                  color: "gray",
                  textDecoration: "none",
                  marginRight:'10px', whiteSpace: 'nowrap'
                }}
                 
                 
                state={{ data: playlists }}
              >
                Show all
              </Link>
            </span>
          </div>

          <div className="playl">
            {playlists.length > 0 ? (
              playlists.map((playlist) => (
                <Link
                  to={`/playlist/${playlist.id}`}
                  key={playlist.id}
                  style={{ textDecoration: "none" }}
                >
                  <div className="play">
                    <img
                      src={playlist.images[0]?.url}
                      alt="Playlist cover"
                      className="pimg"
                    />
                    <IoMdPlay className="plic" style={{ color: "black" }} />
                    <h3 className="pname">{playlist.name.slice(0, 50)}...</h3>
                    <p className="pname" style={{ color: "gray" }}>
                      {playlist.description.slice(0, 150)}...
                    </p>
                  </div>

                  <br />
                  <br />
                  <br />
                  <br />
                </Link>
              ))
            ) : (
              <p
                className="try-something-else"
                style={{ fontWeight: "500", color: "gray", fontSize: "20px" }}
              >
                Loading...
              </p>
            )}
          </div>

          <div className="try-something-else">
            Spotify  Podcasts
            <span>
              <Link
                 to="/allshow"
                style={{
                  fontWeight: "500",
                  color: "gray",
                  textDecoration: "none",
                  marginRight:'10px', whiteSpace: 'nowrap'
                }}
                 
                 
                state={{ data: podcast }}
              >
                Show all
              </Link>
            </span>
          </div>

          <div className="playl">
            {podcast.length > 0 ? (
              podcast.map((playlist) => (
                <Link
                  to={`/playlist/${playlist.id}`}
                  key={playlist.id}
                  style={{ textDecoration: "none" }}
                >
                  <div className="play">
                    <img
                      src={playlist.images[0]?.url}
                      alt="Playlist cover"
                      className="pimg"
                    />
                    <IoMdPlay className="plic" style={{ color: "black" }} />
                    <h3 className="pname">{playlist.name.slice(0, 50)}...</h3>
                    <p className="pname" style={{ color: "gray" }}>
                      {playlist.description.slice(0, 150)}...
                    </p>
                  </div>

                  <br />
                  <br />
                  <br />
                  <br />
                </Link>
              ))
            ) : (
              <p
                className="try-something-else"
                style={{ fontWeight: "500", color: "gray", fontSize: "20px" }}
              >
                Loading...
              </p>
            )}
          </div>

          <div className="try-something-else">
            More like Jasleen 
            <span>
              <Link
                 to="/allshow"
                style={{
                  fontWeight: "500",
                  color: "gray",
                  textDecoration: "none",
                  marginRight:'10px', whiteSpace: 'nowrap'
                }}
                 
                 
                state={{ data: liked }}
              >
                Show all
              </Link>
            </span>
          </div>

          <div className="playl">
            {liked.length > 0 ? (
              liked.map((playlist) => (
                <Link
                  to={`/playlist/${playlist.id}`}
                  key={playlist.id}
                  style={{ textDecoration: "none" }}
                >
                  <div className="play">
                    <img
                      src={playlist.images[0]?.url}
                      alt="Playlist cover"
                      className="pimg"
                    />
                    <IoMdPlay className="plic" style={{ color: "black" }} />
                    <h3 className="pname">{playlist.name.slice(0, 50)}...</h3>
                    <p className="pname" style={{ color: "gray" }}>
                      {playlist.description.slice(0, 150)}...
                    </p>
                  </div>

                  <br />
                  <br />
                  <br />
                  <br />
                </Link>
              ))
            ) : (
              <p
                className="try-something-else"
                style={{ fontWeight: "500", color: "gray", fontSize: "20px" }}
              >
                Loading...
              </p>
            )}
          </div>

          <div className="try-something-else">
            Featured Charts
            <span>
              <Link
                 to="/allshow"
                style={{
                  fontWeight: "500",
                  color: "gray",
                  textDecoration: "none",
                  marginRight:'10px', whiteSpace: 'nowrap'
                }}
                 
                 
                state={{ data: Chart }}
              >
                Show all
              </Link>
            </span>
          </div>

          <div className="playl">
            {Chart.length > 0 ? (
              Chart.map((playlist) => (
                <Link
                  to={`/playlist/${playlist.id}`}
                  key={playlist.id}
                  style={{ textDecoration: "none" }}
                >
                  <div className="play">
                    <img
                      src={playlist.images[0]?.url}
                      alt="Playlist cover"
                      className="pimg"
                    />
                    <IoMdPlay className="plic" style={{ color: "black" }} />
                    <h3 className="pname">{playlist.name.slice(0, 50)}...</h3>
                    <p className="pname" style={{ color: "gray" }}>
                      {playlist.description.slice(0, 150)}...
                    </p>
                  </div>

                  <br />
                  <br />
                  <br />
                  <br />
                </Link>
              ))
            ) : (
              <p
                className="try-something-else"
                style={{ fontWeight: "500", color: "gray", fontSize: "20px" }}
              >
                Loading...
              </p>
            )}
          </div>

          <div className="try-something-else">
            Instrumental
            <span>
              <Link
                 to="/allshow"
                style={{
                  fontWeight: "500",
                  color: "gray",
                  textDecoration: "none",
                  marginRight:'10px', whiteSpace: 'nowrap'
                }}
                 
                 
                state={{ data: Instrumental }}
                
              >
                Show all
              </Link>
            </span>
          </div>

          <div className="playl">
            {Instrumental.length > 0 ? (
              Instrumental.map((playlist) => (
                <Link
                  to={`/playlist/${playlist.id}`}
                  key={playlist.id}
                  style={{ textDecoration: "none" }}
                >
                  <div className="play">
                    <img
                      src={playlist.images[0]?.url}
                      alt="Playlist cover"
                      className="pimg"
                    />
                    <IoMdPlay className="plic" style={{ color: "black" }} />
                    <h3 className="pname">{playlist.name.slice(0, 50)}...</h3>
                    <p className="pname" style={{ color: "gray" }}>
                      {playlist.description.slice(0, 150)}...
                    </p>
                  </div>

                  <br />
                  <br />
                  <br />
                  <br />
                </Link>
              ))
            ) : (
              <p
                className="try-something-else"
                style={{ fontWeight: "500", color: "gray", fontSize: "20px" }}
              >
                Loading...
              </p>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Home;

const Container = styled.div`
  .limg {
    width: 50px;
    height: 50px;
    border-radius: 5px;
  }

  .dflex {
    display: flex;
    flex-direction: row;
    padding: 10px;
    gap: 10px;
    cursor:pointer
  }

  .dflex:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  .divide {
    display: flex;
    flex-direction: row;
   
   
   
  }

  .lib {
    &:hover {
      color: white;
    }
  }

  .scrollable {position:sticky;
    width: 16%;
    height:100vh;
    overflow-y: scroll;
    background-color: black;
    padding: 10px;
   overflow: auto;
left:5px;
    top: 0;

    &::-webkit-scrollbar {
      width: 10px;
    }

    &::-webkit-scrollbar-track {
      box-shadow: inset 0 0 1px grey;
    }

    &::-webkit-scrollbar-thumb {
      background: #d0d0d0;
      border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: gray;
    }
  }
  .home {
    background: #1e1e1e;

    display: flex;
    align-item: center;

    span {
      color: white;
      font-size: 20px;
      text-align: center;
      padding: 10px;
      padding-top: 15px;
    }

    &:hover {
      span {
        cursor: all-scroll;
      }
    }

    .inh {
      color: #d0d0d0;
      cursor: pointer;
      &:hover {
        color: white;
      }
    }
  }
  .lib {
    height: auto;
    background: #1e1e1e;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 19px;
    color: gray;
    cursor: pointer;

    &:hover {
      color: white;
    }
  }
  .ho1 {
    color: white;
    font-size: 30px;
    padding: 10px;
  }

  .home_btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(90deg, #0f0f0f, #000000);
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    cursor: pointer;
  }

  .width2 {  
    background: black;
    
position:relative;

    z-index:100px;
    padding: 3px;
    flex: 1; /* Fill remaining space */
    display: flex;
    flex-direction: column;
  }

  .home_body {
    background: #1e1e1e;
    width: 80vw;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    padding: 10px;
  }

  .btn1 {
    background: #1e1e1e;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    padding: 10px;
    gap: 20px;
    font-size: 30px;
    font-weight: 600;
    color: #ffffff;
    justify-content: center;
  }

  .profile-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .footer {
    background: #1e1e1e;
    width: 80vw;
    display: flex;
    align-items: center;
    padding: 10px;
    gap: 20px;
  }

  .footer button {
    width: auto;
    height: 40px;
    border-radius: 10%;
    background: #2e2e2e;
    border: none;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 17px;
    cursor: pointer;
  }

  .try-something-else {
    background: #1e1e1e;
    width: 80vw;
    height: 8%;
    display: flex;
    align-items: center;
    padding: 10px;
    gap: 20px;
    font-size: 30px;
    font-weight: 600;
    color: #ffffff;
    justify-content: space-between;

    span {
      font-size: 18px;
      color: gray;
      flex: 0.1;
      text-decoration: none;
    }
  }
  .playl {
    background: #1e1e1e;
    width: 80vw;
    height: 60%;
    display: flex;
    gap: 20px;
    padding: 10px;
    overflow-x: scroll;
        overflow-y: hidden;
    scrollbar-width: none;
  }
    .playl::-webkit-scrollbar {
  display: none;
}
  .pimg {
    background: #1e1e1e;
    width: 280px;
    height: 280px;
    border-radius: 10px;
    margin-bottom: -16px;
    padding-left: 10px;
    overflow: hidden;
  }
  .pname {
    color: white;
    margin-bottom: -10px;
    width: 280px;
    font-weight: 500;
    padding-left: 10px;
    overflow: hidden;
  }
  .play {
    border-radius: 10px;

    height: 440px;
    cursor: all-scroll;
    &:hover {
      background: #121212;
    }
    &:hover .plic {
      display: inline;
    }
  }
  .plic {
    background: #18d860;
    border-radius: 50%;
    padding: 15px;
    position: absolute;
    padding-left: -18px;
    font-size: 30px;
    margin-left: -70px;
    margin-top: 210px;
    display: none;
  }









 @media (max-width: 768px) {
 
  .scrollable {display:none;
 
 
 }
  .btn1{display:none;
  
  }
   .width2 {  
     background: black;
position:relative;

  }

  


.home_body{
width:93vw;
justify-content:space-between
}



.footer{
width:93vw
}
.try-something-else{
width:93vw;
    font-size: 24px;
    white-space: nowrap;
}
.playl {width:93vw;
gap:77px;
padding:27px
 overflow: scroll;

}
`;
