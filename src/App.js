import React, { useState,useEffect } from "react";
import Axios from "axios";
import styled from "styled-components";

const RecipeContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  width: 300px;
  box-shadow: 0 3px 10px 0 #aaa;
`;
const CoverImage = styled.img`
  object-fit: cover;
  height: 200px;
`;
const RecipeName = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: black;
  margin: 10px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CreatedAtContainer = styled.div`
  color: green;
  border: solid 1px green;
  margin-bottom: 12px;
  font-size: 18px;
  text-align: center;
  border-radius: 3px;
  padding: 10px 15px;
  cursor: pointer;
  display : flex;
  justify-content:center;
    gap:10px;

`;


const RecipeComponent = (props) => {
  const { created_at, thumbnail_url, name, thumbnail_alt_text } = props.recipe;
  const conversion = (created)=>{
    var date = new Date(created);
    return date.toLocaleDateString();;
  }
  return (
    <RecipeContainer>
      
      <CoverImage src={thumbnail_url} alt={thumbnail_alt_text} />
      <RecipeName>{name}</RecipeName>
      <CreatedAtContainer> 
      <span>
        Created At 
      </span>
      <span>
      {conversion(created_at)}</span>
      </CreatedAtContainer>
    </RecipeContainer>
  );
};
const Container = styled.div`
  display: flex;
  flex-direction: column;
`;
const AppName = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const Header = styled.div`
  background-color: black;
  color: white;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  padding: 20px;
  font-size: 25px;
  font-weight: bold;
  box-shadow: 0 3px 6px 0 #555;
`;
const SearchBox = styled.div`
  display: flex;
  flex-direction: row;
  padding: 10px 10px;
  border-radius: 6px;
  margin-left: 20px;
  width: 50%;
  background-color: white;
`;
const SearchIcon = styled.img`
  width: 32px;
  height: 32px;
`;
const RecipeImage = styled.img`
  width: 36px;
  height: 36px;
  margin: 15px;
`;
const Placeholder = styled.img`
  width: 120px;
  height: 120px;
  margin: 200px;
  opacity: 50%;
`;
const SearchInput = styled.input`
  color: black;
  font-size: 16px;
  font-weight: bold;
  border: none;
  outline: none;
  margin-left: 15px;
`;
const RecipeListContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 30px;
  gap: 20px;
  justify-content: space-evenly;
`;

const PaginationButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 28px;
`;

const PrevPage = styled.button`
  color: blue;
  font-weight: bold;
  background: none;
  border: none;
  margin-bottom: 10px;
  cursor: pointer;
  :disabled {
    opacity: 0.4;
  }
  :hover {
    text-decoration : underline;
  }
`;
const NextPage = styled(PrevPage)``;
function AppComponent() {
  const [searchQuery, updateSearchQuery] = useState("");
  const [recipeList, updateRecipeList] = useState([]);
  const [timeoutId, updateTimeoutId] = useState();
  const [fromValue, setFromValue] = useState(0);
  const [count , setCount] = useState();
  useEffect(() => {
    fetchData(searchQuery,fromValue);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromValue])
  
  

  const fetchData = async (searchString,fromVal) => {
    if (searchString !== "") {
      const options = {
        method: "GET",
        url: "https://tasty.p.rapidapi.com/recipes/list",
        params: { from: fromVal, size: "10", q: searchString },
        headers: {
          "X-RapidAPI-Host": "tasty.p.rapidapi.com",
          "X-RapidAPI-Key":
            "9798f019d8msha50e04671a5732ap12eb9ejsnd94c3821a1a3",
        },
      };
      const response = await Axios.request(options);
      console.log(response);
      setCount(response.data.count);
      updateRecipeList(response.data.results);
    }
  };

  const increaseFromValue =  () => {
  setFromValue(fromValue + 10);
  };
  const decreaseFromValue = () => {
    setFromValue(fromValue - 10);
  };
  const onTextChange = (e) => {
    clearTimeout(timeoutId);
    updateSearchQuery(e.target.value);
    const timeout = setTimeout(() => fetchData(e.target.value , fromValue), 500);
    updateTimeoutId(timeout);
  };

  return (
    <Container>
      <Header>
        <AppName>
          <RecipeImage src="/react-recipe-finder/hamburger.svg" />
          Recipe Finder
        </AppName>
        <SearchBox>
          <SearchIcon src="/react-recipe-finder/search-icon.svg" />
          <SearchInput
            placeholder="Search Recipe"
            value={searchQuery}
            onChange={onTextChange}
          />
        </SearchBox>
      </Header>
      <RecipeListContainer>
        {recipeList?.length ? (
          recipeList.map((recipe, index) => (
            <RecipeComponent key={index} recipe={recipe} />
          ))
        ) : (
          <Placeholder src="/react-recipe-finder/hamburger.svg" />
        )}
      </RecipeListContainer>

      <PaginationButtons>
       {fromValue <=0 ?  <PrevPage disabled={true}>Prev Page</PrevPage>
       : <PrevPage onClick={decreaseFromValue}>Prev Page</PrevPage>}
       { fromValue + 10 > count ? <NextPage disabled={true}>Next Page</NextPage> 
       : <NextPage onClick={increaseFromValue}>Next Page</NextPage>}
      </PaginationButtons>
    </Container>
  );
}

export default AppComponent;
