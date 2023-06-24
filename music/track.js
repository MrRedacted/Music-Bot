const { getInfo, validateURL } = require("ytdl-core");
const { createAudioResource, demuxProbe } = require("@discordjs/voice");
const { exec: ytdl } = require("youtube-dl-exec");
const ytsr = require("ytsr");

const noop = () => {};

module.exports = class Track {
  constructor({ url, title, onStart, onFinish, onError }) {
    this.url = url;
    this.title = title;
    this.onStart = onStart;
    this.onFinish = onFinish;
    this.onError = onError;
  }

  createAudioResource() {
    return new Promise((resolve, reject) => {
      /* use ytdl to get the audio stream for the video requested,
        note that the "f" flag used to get "bestaudio[ext=webm+acodec=opus+asr=48000]/bestaudio"
        passed as the value, this for some reason no longer works as ytdl will return nothing if used,
        instead I now use only "bestaudio" as the value and this seems to work just fine */
      const process = ytdl(
        this.url,
        {
          o: "-",
          q: "",
          f: "bestaudio",
          r: "100K",
        },
        { stdio: ["ignore", "pipe", "ignore"] }
      );
      if (!process.stdout) {
        reject(new Error("No stdout"));
        return;
      }
      const stream = process.stdout;
      //console.log(stream);
      const onError = (error) => {
        if (!process.killed) process.kill();
        stream.resume();
        reject(error);
      };
      process
        .once("spawn", () => {
          demuxProbe(stream)
            .then((probe) =>
              resolve(
                createAudioResource(probe.stream, {
                  metadata: this,
                  inputType: probe.type,
                })
              )
            )
            .catch(onError);
        })
        .catch(onError);
    });
  }

  static async from(song, methods) {
    let info;
    let url;
    if (validateURL(song)) {
      info = await getInfo(song);
      url = song;
    } else {
      const filters = await ytsr.getFilters(song);
      const filter = filters.get("Type").get("Video");
      const options = { pages: 1 };
      const searchResults = await ytsr(filter.url, options);
      info = await getInfo(searchResults.items[0].url);
      url = searchResults.items[0].url;
    }

    const wrappedMethods = {
      onStart() {
        wrappedMethods.onStart = noop;
        methods.onStart();
      },
      onFinish() {
        wrappedMethods.onFinish = noop;
        methods.onFinish();
      },
      onError(error) {
        wrappedMethods.onError = noop;
        methods.onError(error);
      },
    };

    return new Track({
      title: info.videoDetails.title,
      url,
      ...wrappedMethods,
    });
  }
};
