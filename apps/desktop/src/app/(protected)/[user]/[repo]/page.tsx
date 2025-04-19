import React from "react";

const page = async ({
  params,
}: {
  params: Promise<{ user: string; repo: string }>;
}) => {
  const { user, repo } = await params;

  return (
    <div>
      <h1>
        {user}/{repo}
      </h1>
    </div>
  );
};

export default page;
