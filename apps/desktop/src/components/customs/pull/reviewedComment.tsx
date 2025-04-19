import React from "react";

import type { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";
import { Card } from "@noutify/ui/components/card";

interface ReviewedCommentProps {
  comments: RestEndpointMethodTypes["pulls"]["listReviewComments"]["response"]["data"];
  reviewComment: RestEndpointMethodTypes["pulls"]["listReviewComments"]["response"]["data"][0];
}

const ReviewedComment = ({ comments, reviewComment }: ReviewedCommentProps) => {
  return (
    <Card className="rounded-md overflow-hidden flex flex-col w-full border">
      <div className="w-full p-2 px-4 text-sm text-muted-foreground bg-primary-foreground border-b">
        {reviewComment.path}
      </div>
      <div className="border-b"></div>
      <div>
        {/* sort comments by time */}
        <div className="my-2 bg-red-500/15">{reviewComment.body}</div>
        {comments.map((comment) => (
          <div key={comment.id} className="my-2 bg-red-500/15">
            {comment.body}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ReviewedComment;
