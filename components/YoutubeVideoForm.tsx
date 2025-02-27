import Form from "next/form";
import AnalyseButton from "./AnalyseButton";
import { analyseYoutubeVideo } from "@/actions/analyseYoutubeVideo";

function YoutubeVideoForm() {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <Form
        action={analyseYoutubeVideo}
        className="flex flex-col gap-4 sm:flex-row sm:gap-8 items-center"
      >
        <input
          name="url"
          type="text"
          placeholder="Enter YouTube video URL"
          className="flex-1 w-full px-4 py-2 text-md rounded-lg 
            bg-white text-gray-900 
            dark:bg-gray-800 dark:text-gray-100 
            border border-gray-300 dark:border-gray-700
            placeholder-gray-500 dark:placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-blue-600 
            focus:border-transparent transition-all duration-200
            dark:focus:ring-blue-400"
        />

        <AnalyseButton />
      </Form>
    </div>
  );
}

export default YoutubeVideoForm;
