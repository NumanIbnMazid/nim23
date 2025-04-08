import yt_dlp

def download_video(video_url):
    with yt_dlp.YoutubeDL() as ydl:
        # Extract video info without downloading
        info_dict = ydl.extract_info(video_url, download=False)
        
        # Filter for video formats (MP4/WebM)
        video_formats = [
            f for f in info_dict['formats']
            if f['ext'] in ['mp4', 'webm'] and f.get('height') is not None
        ]
        
        # Filter for audio formats (M4A/WebM)
        audio_formats = [
            f for f in info_dict['formats']
            if f['ext'] in ['m4a', 'webm'] and f.get('height') is None
        ]
        
        print("Video Formats:")
        for format in video_formats:
            print(f"Format ID: {format.get('format_id')}, Extension: {format.get('ext')}, Height: {format.get('height')}, Protocol: {format.get('protocol')}")
        
        print("\nAudio Formats:")
        for format in audio_formats:
            print(f"Format ID: {format.get('format_id')}, Extension: {format.get('ext')}, Protocol: {format.get('protocol')}")
        
        # Example: Download the best video and audio
        best_video = sorted(video_formats, key=lambda x: x.get('height', 0), reverse=True)[0]  # Highest resolution
        best_audio = sorted(audio_formats, key=lambda x: x.get('ext'), reverse=False)[0]  # First M4A/WebM

        print("\nDownloading Video:", best_video)
        print("Downloading Audio:", best_audio)

        # Proceed to download (optional, can be customized further)
        ydl_opts = {
            'format': f"{best_video['format_id']}+{best_audio['format_id']}",
            'outtmpl': 'downloaded_video.%(ext)s',
        }
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([video_url])

# Example usage
video_url = "https://www.youtube.com/watch?v=dtyhP4gX68E&ab_channel=%D1%95%D1%82%CE%B9%CE%B7gGs"
download_video(video_url)
