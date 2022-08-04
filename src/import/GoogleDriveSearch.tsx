import {
  Flex,
  Box,
  Input,
  Button,
  Spinner,
  Text,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { faAirFreshener, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { Card } from "../common/Card";
import { searchDrive, setSelectedSearchResult } from "../controllers/actions";
import { useAppStateContext, useDispatchContext } from "../controllers/context";
import { useImportStateContext, useImportStateDispatch } from "../controllers/importContext";
import GoogleAdditionalScopesButton, { GoogleLogo } from "../common/buttons/GoogleAdditionalScopesButton";
import useAction from "../hooks/useAction";
import useTextInput from "../hooks/useTextInput";

export function GoogleDriveSearch() {

  // PROPS AND VARIABLES DERIVED FROM PROPS
  // CONTEXT AND DISPATCH

  const { userGoogleRequiredScopes, token } = useAppStateContext();
  const dispatch = useDispatchContext();


  const {gDrive} = useImportStateContext();
  const importDispatch = useImportStateDispatch();

  // STATE
  const [searchQuery, setSearchQuery] = useTextInput("");
  const [selected, setSelected] = useState([] as boolean[]);

  // STATE MANAGEMENT
  const handleSelect = (i: number) => {
    let newSelected = [...selected];

    newSelected = newSelected.map((val, index) => (index === i ? !val : false));

    setSelected(newSelected);
    setSelectedSearchResult(importDispatch, gDrive.searchResults, newSelected);
  };

  const handleSubmit = (event: React.FormEvent<HTMLDivElement>) => {
    event.preventDefault();
    setLoadingTrue();
  }

  // ASYNC DATA UPDATES
  const { loading, setLoadingTrue } = useAction(async () => {
    await searchDrive(token, dispatch, importDispatch, searchQuery);
    const newSelectedSearchResult = new Array(gDrive.searchResults.length).fill(
      false
    );
    setSelected(newSelectedSearchResult);
  }, dispatch);

  // JSX VARIABLES
  const renderedSearchResults = gDrive.searchResults.map((file, index) => (
    <>
      <SearchResult
        name={file.name}
        key={`search-result-${file.id}`}
        isSelected={selected[index]}
        handleSelect={() => handleSelect(index)}
      />
    </>
  ))

  return (
    <>
      <Flex alignItems="flex-end" width="100%" marginBottom="2em" direction="column">
        <FormControl
          as="form"
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="flex-end"
          onSubmit={handleSubmit}
          marginBottom="1.5rem"
        >
          <Box width="80%">
            <FormLabel htmlFor="input-import" marginBottom="0.5em">
              {" "}
              Search Google Drive:{" "}
            </FormLabel>
            <Input
              id="input-import"
              focusBorderColor="accent.500"
              value={searchQuery}
              onChange={setSearchQuery}
              width="100%"
              height="3em"
              disabled={!userGoogleRequiredScopes}
            />
          </Box>
          <Box width="17%">
            <Button
              variant="outline"
              type="submit"
              width="100%"
              height="3em"
              isLoading={loading}
              disabled={!userGoogleRequiredScopes}
            >
              <FontAwesomeIcon icon={faSearch} />
            </Button>
          </Box>
        </FormControl>

        {userGoogleRequiredScopes ? null : <NoRequiredScopes />}
      </Flex>
      <Flex direction="column" maxHeight="20em" overflowY="auto">
        {renderedSearchResults}
      </Flex>
    </>
  );
}

function SearchResult(props: {
  name: string;
  handleSelect: () => void;
  isSelected: boolean;
}) {
  const { name, handleSelect, isSelected } = props;

  return (
    <Card
      variant={isSelected ? "solid" : "outline"}
      cardColor="accent"
      padding="0.75em"
      cursor="pointer"
      onClick={handleSelect}
      marginBottom="0.5em"
    >
      <Text>{name}</Text>
    </Card>
  );
}

function NoRequiredScopes() {
  
  const authorizeButtonText = (
    <Text>
      Authorize?{" "}
    </Text>
  );

  return (
    <Card
      variant="solid"
      cardColor="primary"
      width="100%"
      direction="column"
      padding="1rem"
    >
      <Text marginBottom="1rem">You haven't authorized Gradezpr to access Google Drive and Google Sheets. Use the file upload option or authorize below.</Text>

      <Flex width="100%" justifyContent="center">
      <GoogleAdditionalScopesButton colorScheme="secondary" variant="solid">
        {authorizeButtonText}
      </GoogleAdditionalScopesButton>
      </Flex>
      
    </Card>
  );
}
