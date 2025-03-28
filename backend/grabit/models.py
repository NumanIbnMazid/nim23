from django.db import models
from django.utils.translation import gettext_lazy as _
from utils.snippets import autoSlugFromUUID


@autoSlugFromUUID()
class DownloadRequest(models.Model):
    """
    Model for handling video/audio download requests.
    """

    class MediaType(models.TextChoices):
        VIDEO = "video", _("Video")
        AUDIO = "audio", _("Audio")

    class Status(models.TextChoices):
        PENDING = "pending", _("Pending")
        COMPLETED = "completed", _("Completed")
        FAILED = "failed", _("Failed")

    class VideoFormat(models.TextChoices):
        MP4 = "mp4", _("MP4")
        MKV = "mkv", _("MKV")
        AVI = "avi", _("AVI")
        WEBM = "webm", _("WEBM")
        FLV = "flv", _("FLV")
        MOV = "mov", _("MOV")
        WMV = "wmv", _("WMV")
        OGV = "ogv", _("OGV")

    class AudioFormat(models.TextChoices):
        MP3 = "mp3", _("MP3")
        WAV = "wav", _("WAV")
        M4A = "m4a", _("M4A")
        OGG = "ogg", _("OGG")
        FLAC = "flac", _("FLAC")
        AAC = "aac", _("AAC")
        OPUS = "opus", _("OPUS")

    class Quality(models.TextChoices):
        P_144P = "144p", _("144p")
        P_240P = "240p", _("240p")
        P_360P = "360p", _("360p")
        P_480P = "480p", _("480p")
        P_720P = "720p", _("720p")
        P_1080P = "1080p", _("1080p")
        P_1440P = "1440p", _("1440p")
        P_2160P = "2160p", _("4K")
        P_4320P = "4320p", _("8K")
        K_320K = "320kbps", _("320kbps")  # Audio quality
        K_256K = "256kbps", _("256kbps")  # Audio quality
        K_128K = "128kbps", _("128kbps")  # Audio quality

    slug = models.SlugField(max_length=255, unique=True, blank=True)
    url = models.URLField(_("Video URL"))
    media_type = models.CharField(_("Media Type"), max_length=10, choices=MediaType.choices)
    media_format = models.CharField(_("Media Format"), max_length=10, blank=True, null=True, choices=VideoFormat.choices + AudioFormat.choices)
    quality = models.CharField(_("Quality"), max_length=20, blank=True, null=True, choices=Quality.choices)
    status = models.CharField(_("Status"), max_length=20, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(_("Created At"), auto_now_add=True)
    updated_at = models.DateTimeField(_("Updated At"), auto_now=True)

    class Meta:
        db_table = "grabit_download_requests"
        verbose_name = _("Download Request")
        verbose_name_plural = _("Download Requests")
        ordering = ("-created_at",)

    def __str__(self):
        return f"{self.url[:100]} - {self.format} - {self.status}"
