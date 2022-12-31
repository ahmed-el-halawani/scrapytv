export const epFromVideoLink = (videoLink) => ({
  pssid: videoLink.first.pssid,
  stream: videoLink.first.href,
  videoLink: Object.fromEntries(
    videoLink.playList.map((e) => [
      e.resolution.width,
      {
        src: e.uri,
        type: e.codecs,
        size: e.resolution.width,
        downloadLink: e.downloadLink,
      },
    ])
  ),
});
