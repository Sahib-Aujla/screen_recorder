import Header from "@/components/Header";
import VideoCard from "@/components/VideoCard";
import React from "react";

const Page = () => {
  return (
    <main className="wrapper page">
      <Header subHeader="Public Library" title="All Videos" />
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
    </main>
  );
};

export default Page;
