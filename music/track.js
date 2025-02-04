import ytdlCore from "@distube/ytdl-core";
import { createAudioResource, demuxProbe } from "@discordjs/voice";
import youtubeDlExec from "youtube-dl-exec";
import ytsr from "@distube/ytsr";

const { getInfo, validateURL } = ytdlCore;
const { exec: ytdl } = youtubeDlExec;

export class Track {
  constructor({ url, title, onStart, onFinish, onError }) {
    this.url = url;
    this.title = title;
    this.onStart = onStart;
    this.onFinish = onFinish;
    this.onError = onError;
  }

  createAudioResource() {
    return new Promise((resolve, reject) => {
      /* use ytdl exec to get the audio stream for the video requested,
        note that the "f" flag used to get "bestaudio[ext=webm+acodec=opus+asr=48000]/bestaudio"
        passed as the value, this for some reason no longer works as ytdl will return nothing if used,
        instead I now use only "bestaudio" as the value and this seems to work just fine */
      this.process = ytdl(
        this.url,
        {
          o: "-",
          q: "",
          f: "bestaudio",
          r: "1M",
        },
        { stdio: ["ignore", "pipe", "ignore"] },
      );
      if (!this.process.stdout) {
        reject(new Error("No stdout"));
        return;
      }
      this.stream = this.process.stdout;
      const onError = (error) => {
        if (this.process.connected) this.process.disconnect();
        this.stream.destroy();
        reject(error);
        return;
      };
      this.process.once("spawn", async () => {
        try {
          const probe = await demuxProbe(this.stream);
          resolve(
            createAudioResource(probe.stream, {
              metadata: this,
              inputType: probe.type,
            }),
          );
        } catch (error) {
          onError(error);
        }
      });
      this.process.catch((error) => {
        onError(error);
      });
    });
  }

  static async from(song, methods) {
    let info;
    let url;
    if (validateURL(song)) {
      info = await getInfo(song);
      url = song;
    } else {
      const searchResults = await ytsr(song, { pages: 1, type: "video" });
      info = await getInfo(searchResults.items[0].url);
      url = searchResults.items[0].url;
    }

    const wrappedMethods = {
      onStart() {
        methods.onStart();
      },
      onFinish() {
        methods.onFinish();
      },
      onError(error) {
        methods.onError(error);
      },
    };

    return new Track({
      title: info.videoDetails.title,
      url,
      ...wrappedMethods,
    });
  }
}
