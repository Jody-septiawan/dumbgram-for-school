async function getCommentsById(id) {
  let comments = document.getElementById("comments");

  comments.innerHTML = "";

  const { data, error } = await kontenbaseClient.service("Comments").find({
    where: { Feeds: [`${id}`] },
  });

  if (data.length == 0) {
    comments.innerHTML = `<div class="text-center text-secondary" style="font-size: 12px">No Comment</div>`;
  }

  data.forEach((comment) => {
    comments.innerHTML += `<div class="d-flex align-items-start gap-2">
      <img
      class="rounded-circle"
      style="width: 25px; height: 25px"
      src=${
        comment.Owner.image
          ? comment.Owner.image[0]?.url
          : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
      }
      alt=""
      />
      <div>
      <span style="font-size: 12px">${comment.Owner.firstName}</span>
      <p style="font-size: 12px; color: #c9c9c9" class="mt-1">
      ${comment.content}
      </p>
      </div>
      </div>`;
  });
}

async function handleCreateComment(e) {
  let content = document.getElementById("input-comment");
  let feedId = document.getElementById("input-feed-id").value;
  if (e.key == "Enter") {
    const { data, error } = await kontenbaseClient.service("Comments").create({
      content: content.value,
      Feeds: [`${feedId}`],
    });
    content.value = "";

    getCommentsById(feedId);
  }
}
