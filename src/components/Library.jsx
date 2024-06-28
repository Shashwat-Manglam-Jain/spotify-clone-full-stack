import React, { useState } from 'react';
import { BiLibrary } from 'react-icons/bi';
import { FaPlus } from 'react-icons/fa';
import { BsArrowRight } from 'react-icons/bs';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { SiTicktick } from "react-icons/si";

const Library = () => {
  // Retrieve library from localStorage or initialize empty
  const storedLibrary = localStorage.getItem('library');
  const initialLib = storedLibrary ? JSON.parse(storedLibrary) : [];

  const [lib, setLib] = useState(initialLib);
const navigate=useNavigate()
  return (
    <Container>
      <LibSection>
        <BiLibrary style={{ fontSize: "32px", color: "#1DB954" }} />
        <h3>Your Library</h3>
        <div className="actions">
          <FaPlus />
          <BsArrowRight style={{ fontSize: "22px", paddingLeft: "10px" }} onClick={() => navigate(-1)} />
        </div>
      </LibSection>
      <LibraryList>
        {lib.length > 0 ? (
          lib.map((item) => (
            <StyledLink to={`/playlist/${item.id}`} key={item.id}>
              <Item>
                <ItemImage src={item?.images[0]?.url} alt={item.name} />
                <ItemDetails>
                  <ItemName>{item?.name}</ItemName>
                  <ItemDescription>{item?.description}</ItemDescription>
                </ItemDetails>
                <TickIcon />
              </Item>
            </StyledLink>
          ))
        ) : (
          <Loading>Loading...</Loading>
        )}
      </LibraryList>
    </Container>
  );
};

export default Library;

// Styled components
const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #121212;
  padding: 20px;
  box-sizing: border-box;
`;

const LibSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  font-size: 24px;
  color: white;

  h3 {
    margin-left: 10px;
    font-size: 24px;
  }

  .actions {
    display: flex;
    align-items: center;
    padding-top: 5px;
  }
`;

const LibraryList = styled.div`
  padding: 10px;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  border-radius: 10px;
  background-color: #282828;
  transition: background-color 0.2s ease;
  cursor: pointer;

  &:hover {
    background-color: #333333;
  }
`;

const ItemImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 5px;
`;

const ItemDetails = styled.div`
  margin-left: 15px;
`;

const ItemName = styled.p`
  font-size: 18px;
  font-weight: bold;
  color: white;
  margin-bottom: 5px;
`;

const ItemDescription = styled.p`
  font-size: 14px;
  color: #b3b3b3;
`;

const TickIcon = styled(SiTicktick)`
  margin-left: auto;
  font-size: 24px;
  color: #1DB954;
  opacity: 0;
  transition: opacity 0.3s ease;

  ${Item}:hover & {
    opacity: 1;
  }
`;

const Loading = styled.div`
  font-weight: 500;
  color: gray;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
`;
