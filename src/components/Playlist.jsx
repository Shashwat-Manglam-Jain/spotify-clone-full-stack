import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { IoMdPlay } from "react-icons/io";
const Playlist = () => {
  const { state } = useLocation();
  const data = state?.data || [];
  console.log(data);

  return (
    <Container>
           <div className="playl">
        {data.length > 0 ? (
          data.map((playlist) => (
            <Link to={`/playlist/${playlist.id}`} key={playlist.id} style={{textDecoration:'none'}}>
              <div className="play">
                <img
                  src={playlist.images[0]?.url}
                  alt="Playlist cover"
                  className="pimg"
                />
                <IoMdPlay className="plic" style={{color:'black'}}/>
                <h3 className="pname">{playlist.name}</h3>
                <p className="pname" style={{ color: "gray" }}>
                  {playlist.description}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <div style={{width:'100%',height:'100vh',display:'flex',alignItems:'center',justifyContent:'center',backgroundColor:'black',overflow:'hidden'
          }}
        >
          <img src={image} alt="Loading"width={200}/>
      </div>
        )}
      </div>
    </Container>
  )
}

export default Playlist

const Container = styled.div`
.play {
     height: 440px;
    &:hover {
      background: #121212;
    }
&:hover .plic {
      display: inline;
    }
  

   
  }
     .plic {
      background: #22c95c;
      border-radius: 50%;
      padding: 15px;
      position: absolute;
      padding-left: -18px;
      font-size: 30px;
      margin-left: -70px;
      margin-top: 210px;
    display:none
     
    }
.playl {
    background: #1e1e1e;
    width: 100vw;
    display: flex;
       flex-wrap: wrap;
    gap: 20px;
    padding: 10px;
  }
  .play{
     margin-bottom:50px ;
      cursor:pointer}

  .pimg {
    background: #1e1e1e;
    width: 280px;
    height: 280px;
    border-radius: 10px;
    margin-bottom: -16px;
    padding-left: 10px;
  
  }
  .pname {
    color: white;
    margin-bottom: -10px;
    width: 280px;
    font-weight: 500;
    padding-left: 10px;

  }
`
