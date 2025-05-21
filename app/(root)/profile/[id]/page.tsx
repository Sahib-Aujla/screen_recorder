import Header from "@/components/Header";
import VideoCard from "@/components/VideoCard";
import React from "react";

const page = async ({ params }: ParamsWithSearch) => {
  const { id } = await params;
  return (
    <div className="wrapper page">
      <Header
        subHeader="Jatt@jatt.com"
        title="Jatt | The OG Jatt"
        userImg="/assets/images/dummy.jpg"
      />
      <h1 className="text-2xl font-karla"> USER ID: {id}</h1>
      <section className="video-grid">
        <VideoCard
          id="1"
          title="anc"
          thumbnail="/assets/samples/thumbnail1.png"
          userImg="/assets/images/jason.png"
          createdAt={new Date()}
          username="jatt"
          views={10}
          visibility="public"
          duration={156}
        />
      </section>
    </div>
  );
};

export default page;
