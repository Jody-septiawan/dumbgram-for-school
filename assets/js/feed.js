async function getFeeds() {
  const { data, error } = await kontenbaseClient.service("Feeds").find({
    sort: { CreatedAt: -1 },
  });

  if (error) {
    return console.log(error.message);
  }

  let feeds = document.getElementById("feeds");

  feeds.innerHTML = "";
  data.forEach((feed, idx) => {
    console.log(feed);
    console.log(idx);
    let imgFeed = feed.attechment[0].url;
    let imgUser = `<img
    class="rounded-circle"
    style="width: 25px; height: 25px"
    src=${
      !feed.Owner.image || feed.Owner.image.length == 0
        ? "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
        : feed.Owner.image[0].url
    }
    alt=""
  />`;

    feeds.innerHTML += `<div class="col-4 mb-4">
    <img
      src=${imgFeed}
      alt=""
      class="rounded cursor-pointer"
      style="height: 500px; width: 100%; object-fit: cover"
      data-bs-toggle="modal"
      data-bs-target="#FeedModal"
      onclick="getFeedById('${feed._id}')"
    />
    <div class="mt-2 d-flex justify-content-between">
      <div class="d-flex align-items-center gap-2">
        ${imgUser}
        <span style="font-size: 12px">${feed.Owner.firstName}</span>
      </div>
      <div class="d-flex gap-2 align-items-center">
      <!-- <i class="fa-regular fa-heart hover-action-feed"></i> -->
        <i class="fa-regular fa-comment hover-action-feed" data-bs-toggle="modal"
        data-bs-target="#FeedModal" onclick="getFeedById('${feed._id}')"></i>
      </div>
    </div>
    <!-- <div class="text-end" style="font-size: 12px; color: #cecece">
      ${feed.like ? feed.like : 0} Like
    </div> -->
  </div>`;
  });
}

getFeeds();

async function getFeedById(id) {
  let feedImg = document.getElementById("feed-img");
  let feedUserImg = document.getElementById("feed-user-img");
  let feedUserName = document.getElementById("feed-user-name");
  let feedUserCaption = document.getElementById("feed-user-caption");

  if (document.getElementById("input-feed-id")) {
    document.getElementById("input-feed-id").value = id;
  }

  const { data, error } = await kontenbaseClient.service("Feeds").getById(id, {
    lookup: ["Comments"],
  });

  feedImg.setAttribute("src", data.attechment[0].url);
  feedUserName.innerText = data.Owner.firstName;
  feedUserCaption.innerText = data.caption;
  feedUserImg.setAttribute(
    "src",
    data.Owner.image
      ? data.Owner.image[0]?.url
      : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
  );

  getCommentsById(id);
}

function onChangePreview(e) {
  let preview = document.getElementById("preview-file-post");
  let file = document.getElementById("input-file-post").files;

  let url = URL.createObjectURL(file[0]);

  preview.innerHTML = ` <img
                          src=${url}
                          alt=""
                          class="rounded"
                          style="height: 200px; width: 100%; object-fit: cover"
                        />`;
}

async function createPost(e) {
  e.preventDefault();

  let file = document.getElementById("input-file-post").files[0];
  let caption = document.getElementById("input-caption-post").value;

  let btnCloseModal = document.getElementById("btn-close-create-post-modal");

  const { data: dataFile, error: errorFile } =
    await kontenbaseClient.storage.upload(file);

  if (errorFile) {
    return console.error(errorFile.message);
  }

  let data = {
    caption,
    attechment: [{ fileName: dataFile.fileName, url: dataFile.url }],
  };

  const { error: errorFeeds } = await kontenbaseClient
    .service("Feeds")
    .create(data);

  if (errorFeeds) {
    return console.error(errorFeeds.message);
  }

  btnCloseModal.click();
  getFeeds();
}
