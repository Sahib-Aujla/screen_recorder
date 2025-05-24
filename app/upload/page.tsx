"use client";
import FileInput from "@/components/FileInput";
import FormField from "@/components/FormField";
import { MAX_THUMBNAIL_SIZE, MAX_VIDEO_SIZE } from "@/constants";
import { getThumbnailUploadUrl, getVideoUploadUrl, saveVideoDetails } from "@/lib/actions/video";
import { useFileInput } from "@/lib/hooks/useFieldInput";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";

const uploadFileToBunny=async(file:File,uploadUrl:string,accessKey:string):Promise<void>=>{
    return fetch(uploadUrl,{
        method:'PUT',
        headers:{
            'Content-Type':file.type,
            AccessKey:accessKey,
           
        },
        body:file
    }).then(res=>{
        if(!res.ok){
            throw new Error('Failed to upload file');
        }
    })
}

const Page = () => {
    const router=useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const video = useFileInput(MAX_VIDEO_SIZE);
  const thumbnail = useFileInput(MAX_THUMBNAIL_SIZE);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    visibility: "public" as "public" | "private",
  });
  const [duration, setDuration] = useState<number>(0);

  useEffect(()=>{
    if(video.duration!==null || video.duration!==0){
        setDuration(video.duration);
    }
  },[video.duration])
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log('here')
    setIsSubmitting(true);
    try {
        if(!video.file || !thumbnail.file) {
            setError("Please select a video and a thumbnail.");
            return;
        }
        if(!formData.title || !formData.description) {
            setError("Please fill in all fields.");
            return;
        }
        const {videoId,uploadUrl:videoUploadUrl,accessKey:videoAccessKey}=await getVideoUploadUrl();
        if(!videoUploadUrl || !videoAccessKey){
            throw new Error('Failed to get video upload credentials');
        }
        uploadFileToBunny(video.file,videoUploadUrl,videoAccessKey);

        const {
            uploadUrl:thumbnailUploadUrl,
            cdnUrl:thumbnailCdnUrl,
            accessKey:thumbnailAccessKey
        }=await getThumbnailUploadUrl(videoId);

        if(!thumbnailUploadUrl || !thumbnailAccessKey || !thumbnailCdnUrl){
            throw new Error('Failed to get thumbnail upload credentials');
        }
        await uploadFileToBunny(thumbnail.file,thumbnailUploadUrl,thumbnailAccessKey);
        await saveVideoDetails({
            videoId,
            ...formData,
            thumbnailUrl:thumbnailCdnUrl,
            duration
        })
        router.push(`/video/${videoId}`);
    } catch (err) {
      console.error(err);
      setError("An error occurred while uploading the video.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="upload-page wrapper-md">
      <h1>Upload a Video</h1>
      {error && <div className="error-field">{error}</div>}
      <form
        onSubmit={handleSubmit}
        className="rounded-20 shadow-10 gap-6 w-full flex flex-col px-5 py-7.5"
      >
        <FormField
          id="title"
          label="Title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Enter a clear and concise video title"
        />

        <FormField
          id="description"
          label="Description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Briefly describe what this video is about"
          as="textarea"
        />

        <FileInput
          id="video"
          label="Video"
          accept="video/*"
          file={video.file}
          previewUrl={video.previewUrl}
          inputRef={video.inputRef}
          onChange={video.handleFileChange}
          onReset={video.resetFile}
          type="video"
        />

        <FileInput
          id="thumbnail"
          label="Thumbnail"
          accept="image/*"
          file={thumbnail.file}
          previewUrl={thumbnail.previewUrl}
          inputRef={thumbnail.inputRef}
          onChange={thumbnail.handleFileChange}
          onReset={thumbnail.resetFile}
          type="image"
        />

        <FormField
          id="visibility"
          label="Visibility"
          value={formData.visibility}
          onChange={handleInputChange}
          as="select"
          options={[
            { value: "public", label: "Public" },
            { value: "private", label: "Private" },
          ]}
        />

        <button type="submit" className="submit-button">
          {isSubmitting ? "Uploading..." : "Upload Video"}
        </button>
      </form>
    </div>
  );
};

export default Page;
