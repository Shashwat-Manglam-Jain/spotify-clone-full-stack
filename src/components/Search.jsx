import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { IoMdPlay } from 'react-icons/io';
import styled from 'styled-components';

const Search = () => {
  const storedToken = localStorage.getItem('access_token');
  const [playlists, setPlaylists] = useState([]);
  const [searchTerm, setSearchTerm] = useState('top artist');
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
    async function fetchPlaylists(token, offset) {
      setLoading(true);
      try {
        const result = await fetch(
          `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchTerm)}&type=playlist&limit=20&offset=${offset}`,
          {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await result.json();

        if (data.playlists && data.playlists.items) {
          setPlaylists((prevPlaylists) => [...prevPlaylists, ...data.playlists.items]);
          setOffset(offset + data.playlists.items.length);
          setHasMore(data.playlists.items.length > 0);
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error('Error fetching playlists:', error);
      } finally {
        setLoading(false);
      }
    }

    if (storedToken && searchTerm.length > 0) {
      fetchPlaylists(storedToken, offset);
    } else {
      setPlaylists([]);
    }
  }, [storedToken, searchTerm, offset]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setOffset(0);
  };

  const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 500 && !loading && hasMore) {
      fetchPlaylists(storedToken, offset);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Container>
      <StickySearch>
        <SearchInput
          type="text"
          placeholder="Search playlists..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </StickySearch>

      <MainContent ref={containerRef}>
        {playlists.length > 0 ? (
          playlists.map((playlist) => (
            <Playlist key={playlist.id}>
              <StyledLink to={`/playlist/${playlist.id}`} className="playlist-link">
                <PlaylistImage src={playlist.images[0]?.url} alt="Playlist cover" />
                <Overlay>
                  <IoMdPlay className="play-icon" />
                </Overlay>
                <PlaylistDetails>
                  <h3>{playlist.name.slice(0, 50)}...</h3>
                  <p>{playlist.description.slice(0, 150)}...</p>
                </PlaylistDetails>
              </StyledLink>
            </Playlist>
          ))
        ) : (
          <LoadingMessage>No playlists found.</LoadingMessage>
        )}
        {loading && <LoadingMessage>Loading...</LoadingMessage>}
      </MainContent>
    </Container>
  );
};

export default Search;

const Container = styled.div`
  padding: 20px;
  background-color: #121212;
  color: #ffffff;
  min-height: 100vh;
`;

const StickySearch = styled.div`
  position: sticky;
  top: 0;
  z-index: 1000; /* Ensure search input is above other content */
  background-color: #121212;
  padding: 10px 20px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px;
  font-size: 16px;
  background-color: #333333;
  border: none;
  color: #ffffff;
  border-radius: 5px;
  outline: none;

  ::placeholder {
    color: #aaaaaa;
  }

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 10px;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const Playlist = styled.div`
  width: 200px;
  margin: 20px;
  text-align: center;
  background-color: #1e1e1e;
  border-radius: 10px;
  overflow: hidden;
  transition: transform 0.2s ease-in-out;
  position: relative;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.3);
  }
`;

const PlaylistImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 10px 10px 0 0;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.6);
  opacity: 0;
  transition: opacity 0.2s ease;

  ${Playlist}:hover & {
    opacity: 1;
  }
`;

const PlaylistDetails = styled.div`
  padding: 10px;
  text-align: left;

  h3 {
    font-size: 16px;
    margin-bottom: 5px;
    color: #ffffff;
  }

  p {
    font-size: 14px;
    color: #aaaaaa;
  }
`;

const LoadingMessage = styled.p`
  text-align: center;
  color: #aaaaaa;
  font-size: 16px;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: block;
  position: relative;

  &:hover {
    text-decoration: none;
    color: inherit;
  }
`;
