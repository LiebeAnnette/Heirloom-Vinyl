// client/src/utils/queries.js

import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $password: String!) {
    addUser(username: $username, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_RECORD = gql`
  mutation addRecord($artist: String!, $album: String!) {
    addRecord(artist: $artist, album: $album) {
      _id
      artist
      album
    }
  }
`;

export const GET_MY_RECORDS = gql`
  query getMyRecords {
    myRecords {
      _id
      artist
      album
    }
  }
`;

export const SEARCH_RECORDS = gql`
  query searchRecords($query: String!) {
    searchRecords(query: $query) {
      _id
      artist
      album
    }
  }
`;
export const DELETE_RECORD = gql`
  mutation deleteRecord($recordId: ID!) {
    deleteRecord(recordId: $recordId) {
      _id
      artist
      album
    }
  }
`;

export const UPDATE_RECORD = gql`
  mutation updateRecord($recordId: ID!, $artist: String, $album: String) {
    updateRecord(recordId: $recordId, artist: $artist, album: $album) {
      _id
      artist
      album
    }
  }
`;
