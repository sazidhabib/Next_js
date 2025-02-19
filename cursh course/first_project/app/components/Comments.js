import React from "react";

export default async function Comments({ promise }) {
  const comments = await promise;
  return (
    <div className="mt-4">
      <h3>comments</h3>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            <p className="text-gray-600">
              Parson {comment.id} comment ({comment.email}) :{" "}
            </p>
            {comment.body}
          </li>
        ))}
      </ul>
    </div>
  );
}
