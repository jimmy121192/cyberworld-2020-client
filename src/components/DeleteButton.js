import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { Button, Confirm, Icon} from "semantic-ui-react";

import { FETCH_POSTS_QUERY } from "../actions/graphql";
import MyPopUp from "../actions/MyPopUp";

function DeleteButton({ postId, commentId, callback }) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;
  const [deleteMutation] = useMutation(mutation, {
    update(proxy) {
      setConfirmOpen(false);
      if (!commentId) {
        // TODO: remove post from cache
        const data = proxy.readQuery({
          query: FETCH_POSTS_QUERY,
        });
        proxy.writeQuery({
          query: FETCH_POSTS_QUERY,
          data: { getPosts: data.getPosts.filter((p) => p.id !== postId) },
        });
      }

      if (callback) callback(); //go back to the homepage
    },
    variables: {
      postId,
      commentId,
    },
    onError(err) {
      console.log(err);
    },
  });

  return (
    <>
      <MyPopUp content={commentId ? "Delete this comment" : "Delete this post"}>
        <Button
          as="div"
          color="red"
          floated="right"
          onClick={() => setConfirmOpen(true)}
        >
          <Icon name="trash" style={{ margin: 0 }} />
        </Button>
      </MyPopUp>
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deleteMutation}
      />
    </>
  );
}

const DELETE_POST_MUTATION = gql`
  mutation($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        id
        username
        createdAt
        body
      }
      commentCount
    }
  }
`;
export default DeleteButton;
