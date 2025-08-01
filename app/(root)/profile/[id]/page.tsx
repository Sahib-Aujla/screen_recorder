import EmptyState from "@/components/EmptyState";
import Header from "@/components/Header";
import VideoCard from "@/components/VideoCard";
import { getAllVideosByUser } from "@/lib/actions/video";
import { redirect } from "next/navigation";
import React from "react";

const page = async ({ params, searchParams }: ParamsWithSearch) => {
  const { id } = await params;
  const { query, filter } = await searchParams;

  const { user, videos } = await getAllVideosByUser(id, query, filter);
  if (!user) redirect("/404");
  return (
    <div className="wrapper page">
      <Header
        subHeader={user?.email ||''}
        title={user?.name ||''}
        userImg={user.image ||"/assets/images/dummy.jpg"}
      />
      <h1 className="text-2xl font-karla"> USER ID: {id}</h1>
      {videos?.length > 0 ? (
        <section className="video-grid">
          {videos.map(({ video }) => (
            <VideoCard
              key={video.id}
              id={video.videoId}
              title={video.title}
              thumbnail={video.thumbnailUrl}
              createdAt={video.createdAt}
              userImg={user.image ?? ""}
              username={user.name ?? "Guest"}
              views={video.views}
              visibility={video.visibility}
              duration={video.duration}
            />
          ))}
        </section>
      ) : (
        <EmptyState
          icon="/assets/icons/video.svg"
          title="No Videos Available Yet"
          description="Video will show up here once you upload them."
        />
      )}
    </div>
  );
};

export default page;
