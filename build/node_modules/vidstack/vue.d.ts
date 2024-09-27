import type { HTMLAttributes, Ref, ReservedProps } from 'vue';
import type { MediaAnnouncerElement, MediaAirPlayButtonElement, MediaCaptionButtonElement, MediaFullscreenButtonElement, MediaGoogleCastButtonElement, MediaLiveButtonElement, MediaMuteButtonElement, MediaPIPButtonElement, MediaPlayButtonElement, MediaSeekButtonElement, MediaToggleButtonElement, MediaCaptionsElement, MediaChapterTitleElement, MediaControlsElement, MediaControlsGroupElement, MediaGestureElement, MediaAudioLayoutElement, MediaVideoLayoutElement, MediaLayoutElement, MediaPlyrLayoutElement, MediaAudioGainRadioGroupElement, MediaAudioRadioGroupElement, MediaCaptionsRadioGroupElement, MediaChaptersRadioGroupElement, MediaMenuButtonElement, MediaMenuElement, MediaMenuItemElement, MediaMenuItemsElement, MediaMenuPortalElement, MediaQualityRadioGroupElement, MediaRadioElement, MediaRadioGroupElement, MediaSpeedRadioGroupElement, MediaPlayerElement, MediaPosterElement, MediaProviderElement, MediaAudioGainSliderElement, MediaQualitySliderElement, MediaSliderChaptersElement, MediaSliderElement, MediaSliderPreviewElement, MediaSliderStepsElement, MediaSliderThumbnailElement, MediaSliderValueElement, MediaSliderVideoElement, MediaSpeedSliderElement, MediaTimeSliderElement, MediaVolumeSliderElement, MediaSpinnerElement, MediaThumbnailElement, MediaTimeElement, MediaTitleElement, MediaTooltipContentElement, MediaTooltipElement, MediaTooltipTriggerElement } from './elements';
import type { MediaAnnouncerProps, MediaAnnouncerEvents, AirPlayButtonProps, AirPlayButtonEvents, CaptionButtonProps, CaptionButtonEvents, FullscreenButtonProps, FullscreenButtonEvents, GoogleCastButtonProps, GoogleCastButtonEvents, LiveButtonProps, LiveButtonEvents, MuteButtonProps, MuteButtonEvents, PIPButtonProps, PIPButtonEvents, PlayButtonProps, PlayButtonEvents, SeekButtonProps, SeekButtonEvents, ToggleButtonProps, CaptionsProps, ChapterTitleProps, ControlsProps, ControlsEvents, GestureProps, GestureEvents, DefaultLayoutProps, MediaLayoutProps, PlyrLayoutProps, AudioGainRadioGroupProps, AudioGainRadioGroupEvents, AudioRadioGroupProps, AudioRadioGroupEvents, CaptionsRadioGroupProps, CaptionsRadioGroupEvents, ChapterRadioGroupProps, ChaptersRadioGroupEvents, MenuButtonProps, MenuButtonEvents, MenuProps, MenuEvents, MenuItemsProps, MenuPortalProps, QualityRadioGroupProps, QualityRadioGroupEvents, RadioProps, RadioEvents, RadioGroupProps, RadioGroupEvents, SpeedRadioGroupProps, SpeedRadioGroupEvents, MediaPlayerProps, MediaPlayerEvents, PosterProps, MediaProviderProps, AudioGainSliderProps, AudioGainSliderEvents, QualitySliderProps, QualitySliderEvents, SliderChaptersProps, SliderChaptersCSSVars, SliderProps, SliderEvents, SliderPreviewProps, ThumbnailProps, SliderValueProps, SliderVideoProps, SliderVideoEvents, SpeedSliderProps, SpeedSliderEvents, TimeSliderProps, TimeSliderEvents, VolumeSliderProps, VolumeSliderEvents, SpinnerProps, TimeProps, TooltipContentProps, TooltipProps } from './index';
import type { IconType } from "./icons";

declare module 'vue' {
  export interface GlobalComponents {
    "media-announcer": MediaAnnouncerComponent;
    "media-airplay-button": MediaAirPlayButtonComponent;
    "media-caption-button": MediaCaptionButtonComponent;
    "media-fullscreen-button": MediaFullscreenButtonComponent;
    "media-google-cast-button": MediaGoogleCastButtonComponent;
    "media-live-button": MediaLiveButtonComponent;
    "media-mute-button": MediaMuteButtonComponent;
    "media-pip-button": MediaPIPButtonComponent;
    "media-play-button": MediaPlayButtonComponent;
    "media-seek-button": MediaSeekButtonComponent;
    "media-toggle-button": MediaToggleButtonComponent;
    "media-captions": MediaCaptionsComponent;
    "media-chapter-title": MediaChapterTitleComponent;
    "media-controls": MediaControlsComponent;
    "media-controls-group": MediaControlsGroupComponent;
    "media-gesture": MediaGestureComponent;
    "media-audio-layout": MediaAudioLayoutComponent;
    "media-video-layout": MediaVideoLayoutComponent;
    "media-layout": MediaLayoutComponent;
    "media-plyr-layout": MediaPlyrLayoutComponent;
    "media-audio-gain-radio-group": MediaAudioGainRadioGroupComponent;
    "media-audio-radio-group": MediaAudioRadioGroupComponent;
    "media-captions-radio-group": MediaCaptionsRadioGroupComponent;
    "media-chapters-radio-group": MediaChaptersRadioGroupComponent;
    "media-menu-button": MediaMenuButtonComponent;
    "media-menu": MediaMenuComponent;
    "media-menu-item": MediaMenuItemComponent;
    "media-menu-items": MediaMenuItemsComponent;
    "media-menu-portal": MediaMenuPortalComponent;
    "media-quality-radio-group": MediaQualityRadioGroupComponent;
    "media-radio": MediaRadioComponent;
    "media-radio-group": MediaRadioGroupComponent;
    "media-speed-radio-group": MediaSpeedRadioGroupComponent;
    "media-player": MediaPlayerComponent;
    "media-poster": MediaPosterComponent;
    "media-provider": MediaProviderComponent;
    "media-audio-gain-slider": MediaAudioGainSliderComponent;
    "media-quality-slider": MediaQualitySliderComponent;
    "media-slider-chapters": MediaSliderChaptersComponent;
    "media-slider": MediaSliderComponent;
    "media-slider-preview": MediaSliderPreviewComponent;
    "media-slider-steps": MediaSliderStepsComponent;
    "media-slider-thumbnail": MediaSliderThumbnailComponent;
    "media-slider-value": MediaSliderValueComponent;
    "media-slider-video": MediaSliderVideoComponent;
    "media-speed-slider": MediaSpeedSliderComponent;
    "media-time-slider": MediaTimeSliderComponent;
    "media-volume-slider": MediaVolumeSliderComponent;
    "media-spinner": MediaSpinnerComponent;
    "media-thumbnail": MediaThumbnailComponent;
    "media-time": MediaTimeComponent;
    "media-title": MediaTitleComponent;
    "media-tooltip-content": MediaTooltipContentComponent;
    "media-tooltip": MediaTooltipComponent;
    "media-tooltip-trigger": MediaTooltipTriggerComponent;
    "media-icon": HTMLAttributes & { type: IconType }
  }
}

export type ElementRef<T> = string | Ref<T> | ((el: T | null) => void);

export interface EventHandler<T> {
  (event: T): void;
}
/**********************************************************************************************
* MediaAnnouncer
/**********************************************************************************************/

export interface MediaAnnouncerComponent {
  (props: MediaAnnouncerAttributes): MediaAnnouncerElement;
}

export interface MediaAnnouncerAttributes extends Partial<MediaAnnouncerProps>, MediaAnnouncerEventAttributes, Omit<HTMLAttributes, keyof MediaAnnouncerProps | keyof MediaAnnouncerEventAttributes | "is">, Omit<ReservedProps, 'ref'> {
  'keep-alive'?: boolean;
  ref?: ElementRef<MediaAnnouncerElement>;
}

export interface MediaAnnouncerEventAttributes {
  onChange?: EventHandler<MediaAnnouncerEvents['change']>;
}

/**********************************************************************************************
* MediaAirPlayButton
/**********************************************************************************************/

export interface MediaAirPlayButtonComponent {
  (props: MediaAirPlayButtonAttributes): MediaAirPlayButtonElement;
}

export interface MediaAirPlayButtonAttributes extends Partial<AirPlayButtonProps>, MediaAirPlayButtonEventAttributes, Omit<HTMLAttributes, keyof AirPlayButtonProps | keyof MediaAirPlayButtonEventAttributes | "is">, Omit<ReservedProps, 'ref'> {
  'keep-alive'?: boolean;
  ref?: ElementRef<MediaAirPlayButtonElement>;
}

export interface MediaAirPlayButtonEventAttributes {
  onMediaAirplayRequest?: EventHandler<AirPlayButtonEvents['media-airplay-request']>;
}

/**********************************************************************************************
* MediaCaptionButton
/**********************************************************************************************/

export interface MediaCaptionButtonComponent {
  (props: MediaCaptionButtonAttributes): MediaCaptionButtonElement;
}

export interface MediaCaptionButtonAttributes extends Partial<CaptionButtonProps>, MediaCaptionButtonEventAttributes, Omit<HTMLAttributes, keyof CaptionButtonProps | keyof MediaCaptionButtonEventAttributes | "is">, Omit<ReservedProps, 'ref'> {
  'keep-alive'?: boolean;
  ref?: ElementRef<MediaCaptionButtonElement>;
}

export interface MediaCaptionButtonEventAttributes {
  onMediaTextTrackChangeRequest?: EventHandler<CaptionButtonEvents['media-text-track-change-request']>;
}

/**********************************************************************************************
* MediaFullscreenButton
/**********************************************************************************************/

export interface MediaFullscreenButtonComponent {
  (props: MediaFullscreenButtonAttributes): MediaFullscreenButtonElement;
}

export interface MediaFullscreenButtonAttributes extends Partial<FullscreenButtonProps>, MediaFullscreenButtonEventAttributes, Omit<HTMLAttributes, keyof FullscreenButtonProps | keyof MediaFullscreenButtonEventAttributes | "is">, Omit<ReservedProps, 'ref'> {
  'keep-alive'?: boolean;
  ref?: ElementRef<MediaFullscreenButtonElement>;
}

export interface MediaFullscreenButtonEventAttributes {
  onMediaEnterFullscreenRequest?: EventHandler<FullscreenButtonEvents['media-enter-fullscreen-request']>;
  onMediaExitFullscreenRequest?: EventHandler<FullscreenButtonEvents['media-exit-fullscreen-request']>;
}

/**********************************************************************************************
* MediaGoogleCastButton
/**********************************************************************************************/

export interface MediaGoogleCastButtonComponent {
  (props: MediaGoogleCastButtonAttributes): MediaGoogleCastButtonElement;
}

export interface MediaGoogleCastButtonAttributes extends Partial<GoogleCastButtonProps>, MediaGoogleCastButtonEventAttributes, Omit<HTMLAttributes, keyof GoogleCastButtonProps | keyof MediaGoogleCastButtonEventAttributes | "is">, Omit<ReservedProps, 'ref'> {
  'keep-alive'?: boolean;
  ref?: ElementRef<MediaGoogleCastButtonElement>;
}

export interface MediaGoogleCastButtonEventAttributes {
  onMediaGoogleCastRequest?: EventHandler<GoogleCastButtonEvents['media-google-cast-request']>;
}

/**********************************************************************************************
* MediaLiveButton
/**********************************************************************************************/

export interface MediaLiveButtonComponent {
  (props: MediaLiveButtonAttributes): MediaLiveButtonElement;
}

export interface MediaLiveButtonAttributes extends Partial<LiveButtonProps>, MediaLiveButtonEventAttributes, Omit<HTMLAttributes, keyof LiveButtonProps | keyof MediaLiveButtonEventAttributes | "is">, Omit<ReservedProps, 'ref'> {
  'keep-alive'?: boolean;
  ref?: ElementRef<MediaLiveButtonElement>;
}

export interface MediaLiveButtonEventAttributes {
  onMediaLiveEdgeRequest?: EventHandler<LiveButtonEvents['media-live-edge-request']>;
}

/**********************************************************************************************
* MediaMuteButton
/**********************************************************************************************/

export interface MediaMuteButtonComponent {
  (props: MediaMuteButtonAttributes): MediaMuteButtonElement;
}

export interface MediaMuteButtonAttributes extends Partial<MuteButtonProps>, MediaMuteButtonEventAttributes, Omit<HTMLAttributes, keyof MuteButtonProps | keyof MediaMuteButtonEventAttributes | "is">, Omit<ReservedProps, 'ref'> {
  'keep-alive'?: boolean;
  ref?: ElementRef<MediaMuteButtonElement>;
}

export interface MediaMuteButtonEventAttributes {
  onMediaMuteRequest?: EventHandler<MuteButtonEvents['media-mute-request']>;
  onMediaUnmuteRequest?: EventHandler<MuteButtonEvents['media-unmute-request']>;
}

/**********************************************************************************************
* MediaPIPButton
/**********************************************************************************************/

export interface MediaPIPButtonComponent {
  (props: MediaPIPButtonAttributes): MediaPIPButtonElement;
}

export interface MediaPIPButtonAttributes extends Partial<PIPButtonProps>, MediaPIPButtonEventAttributes, Omit<HTMLAttributes, keyof PIPButtonProps | keyof MediaPIPButtonEventAttributes | "is">, Omit<ReservedProps, 'ref'> {
  'keep-alive'?: boolean;
  ref?: ElementRef<MediaPIPButtonElement>;
}

export interface MediaPIPButtonEventAttributes {
  onMediaEnterPipRequest?: EventHandler<PIPButtonEvents['media-enter-pip-request']>;
  onMediaExitPipRequest?: EventHandler<PIPButtonEvents['media-exit-pip-request']>;
}

/**********************************************************************************************
* MediaPlayButton
/**********************************************************************************************/

export interface MediaPlayButtonComponent {
  (props: MediaPlayButtonAttributes): MediaPlayButtonElement;
}

export interface MediaPlayButtonAttributes extends Partial<PlayButtonProps>, MediaPlayButtonEventAttributes, Omit<HTMLAttributes, keyof PlayButtonProps | keyof MediaPlayButtonEventAttributes | "is">, Omit<ReservedProps, 'ref'> {
  'keep-alive'?: boolean;
  ref?: ElementRef<MediaPlayButtonElement>;
}

export interface MediaPlayButtonEventAttributes {
  onMediaPlayRequest?: EventHandler<PlayButtonEvents['media-play-request']>;
  onMediaPauseRequest?: EventHandler<PlayButtonEvents['media-pause-request']>;
}

/**********************************************************************************************
* MediaSeekButton
/**********************************************************************************************/

export interface MediaSeekButtonComponent {
  (props: MediaSeekButtonAttributes): MediaSeekButtonElement;
}

export interface MediaSeekButtonAttributes extends Partial<SeekButtonProps>, MediaSeekButtonEventAttributes, Omit<HTMLAttributes, keyof SeekButtonProps | keyof MediaSeekButtonEventAttributes | "is">, Omit<ReservedProps, 'ref'> {
  'keep-alive'?: boolean;
  ref?: ElementRef<MediaSeekButtonElement>;
}

export interface MediaSeekButtonEventAttributes {
  onMediaSeekRequest?: EventHandler<SeekButtonEvents['media-seek-request']>;
}

/**********************************************************************************************
* MediaToggleButton
/**********************************************************************************************/

export interface MediaToggleButtonComponent {
  (props: MediaToggleButtonAttributes): MediaToggleButtonElement;
}

export interface MediaToggleButtonAttributes extends Partial<ToggleButtonProps>, Omit<HTMLAttributes, keyof ToggleButtonProps | "is">, Omit<ReservedProps, 'ref'> {
  'keep-alive'?: boolean;
  ref?: ElementRef<MediaToggleButtonElement>;
}


/**********************************************************************************************
* MediaCaptions
/**********************************************************************************************/

export interface MediaCaptionsComponent {
  (props: MediaCaptionsAttributes): MediaCaptionsElement;
}

export interface MediaCaptionsAttributes extends Partial<CaptionsProps>, Omit<HTMLAttributes, keyof CaptionsProps | "is">, Omit<ReservedProps, 'ref'> {
  'keep-alive'?: boolean;
  ref?: ElementRef<MediaCaptionsElement>;
}


/**********************************************************************************************
* MediaChapterTitle
/**********************************************************************************************/

export interface MediaChapterTitleComponent {
  (props: MediaChapterTitleAttributes): MediaChapterTitleElement;
}

export interface MediaChapterTitleAttributes extends Partial<ChapterTitleProps>, Omit<HTMLAttributes, keyof ChapterTitleProps | "is">, Omit<ReservedProps, 'ref'> {
  'keep-alive'?: boolean;
  ref?: ElementRef<MediaChapterTitleElement>;
}


/**********************************************************************************************
* MediaControls
/**********************************************************************************************/

export interface MediaControlsComponent {
  (props: MediaControlsAttributes): MediaControlsElement;
}

export interface MediaControlsAttributes extends Partial<ControlsProps>, MediaControlsEventAttributes, Omit<HTMLAttributes, keyof ControlsProps | keyof MediaControlsEventAttributes | "is">, Omit<ReservedProps, 'ref'> {
  'keep-alive'?: boolean;
  ref?: ElementRef<MediaControlsElement>;
}

export interface MediaControlsEventAttributes {
  onChange?: EventHandler<ControlsEvents['change']>;
}

/**********************************************************************************************
* MediaControlsGroup
/**********************************************************************************************/

export interface MediaControlsGroupComponent {
  (props: MediaControlsGroupAttributes): MediaControlsGroupElement;
}

export interface MediaControlsGroupAttributes extends Omit<HTMLAttributes, "is">, Omit<ReservedProps, 'ref'> {
  'keep-alive'?: boolean;
  ref?: ElementRef<MediaControlsGroupElement>;
}


/**********************************************************************************************
* MediaGesture
/**********************************************************************************************/

export interface MediaGestureComponent {
  (props: MediaGestureAttributes): MediaGestureElement;
}

export interface MediaGestureAttributes extends Partial<GestureProps>, MediaGestureEventAttributes, Omit<HTMLAttributes, keyof GestureProps | keyof MediaGestureEventAttributes | "is">, Omit<ReservedProps, 'ref'> {
  'keep-alive'?: boolean;
  ref?: ElementRef<MediaGestureElement>;
}

export interface MediaGestureEventAttributes {
  onWillTrigger?: EventHandler<GestureEvents['will-trigger']>;
  onTrigger?: EventHandler<GestureEvents['trigger']>;
}

/**********************************************************************************************
* MediaAudioLayout
/**********************************************************************************************/

export interface MediaAudioLayoutComponent {
  (props: MediaAudioLayoutAttributes): MediaAudioLayoutElement;
}

export interface MediaAudioLayoutAttributes extends Partial<DefaultLayoutProps>, Omit<HTMLAttributes, keyof DefaultLayoutProps | "is">, Omit<ReservedProps, 'ref'> {
  'keep-alive'?: boolean;
  ref?: ElementRef<MediaAudioLayoutElement>;
}


/**********************************************************************************************
* MediaVideoLayout
/**********************************************************************************************/

export interface MediaVideoLayoutComponent {
  (props: MediaVideoLayoutAttributes): MediaVideoLayoutElement;
}

export interface MediaVideoLayoutAttributes extends Partial<DefaultLayoutProps>, Omit<HTMLAttributes, keyof DefaultLayoutProps | "is">, Omit<ReservedProps, 'ref'> {
  'keep-alive'?: boolean;
  ref?: ElementRef<MediaVideoLayoutElement>;
}


/**********************************************************************************************
* MediaLayout
/**********************************************************************************************/

export interface MediaLayoutComponent {
  (props: MediaLayoutAttributes): MediaLayoutElement;
}

export interface MediaLayoutAttributes extends Partial<MediaLayoutProps>, Omit<HTMLAttributes, keyof MediaLayoutProps | "is">, Omit<ReservedProps, 'ref'> {
  'keep-alive'?: boolean;
  ref?: ElementRef<MediaLayoutElement>;
}


/**********************************************************************************************
* MediaPlyrLayout
/**********************************************************************************************/

export interface MediaPlyrLayoutComponent {
  (props: MediaPlyrLayoutAttributes): MediaPlyrLayoutElement;
}

export interface MediaPlyrLayoutAttributes extends Partial<PlyrLayoutProps>, Omit<HTMLAttributes, keyof PlyrLayoutProps | "is">, Omit<ReservedProps, 'ref'> {
  'keep-alive'?: boolean;
  ref?: ElementRef<MediaPlyrLayoutElement>;
}


/**********************************************************************************************
* MediaAudioGainRadioGroup
/**********************************************************************************************/

export interface MediaAudioGainRadioGroupComponent {
  (props: MediaAudioGainRadioGroupAttributes): MediaAudioGainRadioGroupElement;
}

export interface MediaAudioGainRadioGroupAttributes extends Partial<AudioGainRadioGroupProps>, MediaAudioGainRadioGroupEventAttributes, Omit<HTMLAttributes, keyof AudioGainRadioGroupProps | keyof MediaAudioGainRadioGroupEventAttributes | "is">, Omit<ReservedProps, 'ref'> {
  'keep-alive'?: boolean;
  ref?: ElementRef<MediaAudioGainRadioGroupElement>;
}

export interface MediaAudioGainRadioGroupEventAttributes {
  onChange?: EventHandler<AudioGainRadioGroupEvents['change']>;
}

/**********************************************************************************************
* MediaAudioRadioGroup
/**********************************************************************************************/

export interface MediaAudioRadioGroupComponent {
  (props: MediaAudioRadioGroupAttributes): MediaAudioRadioGroupElement;
}

export interface MediaAudioRadioGroupAttributes extends Partial<AudioRadioGroupProps>, MediaAudioRadioGroupEventAttributes, Omit<HTMLAttributes, keyof AudioRadioGroupProps | keyof MediaAudioRadioGroupEventAttributes | "is">, Omit<ReservedProps, 'ref'> {
  'keep-alive'?: boolean;
  ref?: ElementRef<MediaAudioRadioGroupElement>;
}

export interface MediaAudioRadioGroupEventAttributes {
  onChange?: EventHandler<AudioRadioGroupEvents['change']>;
}

/**********************************************************************************************
* MediaCaptionsRadioGroup
/**********************************************************************************************/

export interface MediaCaptionsRadioGroupComponent {
  (props: MediaCaptionsRadioGroupAttributes): MediaCaptionsRadioGroupElement;
}

export interface MediaCaptionsRadioGroupAttributes extends Partial<CaptionsRadioGroupProps>, MediaCaptionsRadioGroupEventAttributes, Omit<HTMLAttributes, keyof CaptionsRadioGroupProps | keyof MediaCaptionsRadioGroupEventAttributes | "is">, Omit<ReservedProps, 'ref'> {
  'keep-alive'?: boolean;
  ref?: ElementRef<MediaCaptionsRadioGroupElement>;
}

export interface MediaCaptionsRadioGroupEventAttributes {
  onChange?: EventHandler<CaptionsRadioGroupEvents['change']>;
}

/**********************************************************************************************
* MediaChaptersRadioGroup
/**********************************************************************************************/

export interface MediaChaptersRadioGroupComponent {
  (props: MediaChaptersRadioGroupAttributes): MediaChaptersRadioGroupElement;
}

export interface MediaChaptersRadioGroupAttributes extends Partial<ChapterRadioGroupProps>, MediaChaptersRadioGroupEventAttributes, Omit<HTMLAttributes, keyof ChapterRadioGroupProps | keyof MediaChaptersRadioGroupEventAttributes | "is">, Omit<ReservedProps, 'ref'> {
  'keep-alive'?: boolean;
  ref?: ElementRef<MediaChaptersRadioGroupElement>;
}

export interface MediaChaptersRadioGroupEventAttributes {
  onChange?: EventHandler<ChaptersRadioGroupEvents['change']>;
}

/**********************************************************************************************
* MediaMenuButton
/**********************************************************************************************/

export interface MediaMenuButtonComponent {
  (props: MediaMenuButtonAttributes): MediaMenuButtonElement;
}

export interface MediaMenuButtonAttributes extends Partial<MenuButtonProps>, MediaMenuButtonEventAttributes, Omit<HTMLAttributes, keyof MenuButtonProps | keyof MediaMenuButtonEventAttributes | "is">, Omit<ReservedProps, 'ref'> {
  'keep-alive'?: boolean;
  ref?: ElementRef<MediaMenuButtonElement>;
}

export interface MediaMenuButtonEventAttributes {
  onSelect?: EventHandler<MenuButtonEvents['select']>;
}

/**********************************************************************************************
* MediaMenu
/**********************************************************************************************/

export interface MediaMenuComponent {
  (props: MediaMenuAttributes): MediaMenuElement;
}

export interface MediaMenuAttributes extends Partial<MenuProps>, MediaMenuEventAttributes, Omit<HTMLAttributes, keyof MenuProps | keyof MediaMenuEventAttributes | "is">, Omit<ReservedProps, 'ref'> {
  'keep-alive'?: boolean;
  ref?: ElementRef<MediaMenuElement>;
}

export interface MediaMenuEventAttributes {
  onOpen?: EventHandler<MenuEvents['open']>;
  onClose?: EventHandler<MenuEvents['close']>;
  onMediaPauseControlsRequest?: EventHandler<MenuEvents['media-pause-controls-request']>;
  onMediaResumeControlsRequest?: EventHandler<MenuEvents['media-resume-controls-request']>;
}

/**********************************************************************************************
* MediaMenuItem
/**********************************************************************************************/

export interface MediaMenuItemComponent {
  (props: MediaMenuItemAttributes): MediaMenuItemElement;
}

export interface MediaMenuItemAttributes extends Partial<MenuButtonProps>, MediaMenuItemEventAttributes, Omit<HTMLAttributes, keyof MenuButtonProps | keyof MediaMenuItemEventAttributes | "is">, Omit<ReservedProps, 'ref'> {
  'keep-alive'?: boolean;
  ref?: ElementRef<MediaMenuItemElement>;
}

export interface MediaMenuItemEventAttributes {
  onSelect?: EventHandler<MenuButtonEvents['select']>;
}

/**********************************************************************************************
* MediaMenuItems
/**********************************************************************************************/

export interface MediaMenuItemsComponent {
  (props: MediaMenuItemsAttributes): MediaMenuItemsElement;
}

export interface MediaMenuItemsAttributes extends Partial<MenuItemsProps>, Omit<HTMLAttributes, keyof MenuItemsProps | "is">, Omit<ReservedProps, 'ref'> {
  'keep-alive'?: boolean;
  ref?: ElementRef<MediaMenuItemsElement>;
}


/**********************************************************************************************
* MediaMenuPortal
/**********************************************************************************************/

export interface MediaMenuPortalComponent {
  (props: MediaMenuPortalAttributes): MediaMenuPortalElement;
}

export interface MediaMenuPortalAttributes extends Partial<MenuPortalProps>, Omit<HTMLAttributes, keyof MenuPortalProps | "is">, Omit<ReservedProps, 'ref'> {
  'keep-alive'?: boolean;
  ref?: ElementRef<MediaMenuPortalElement>;
}


/**********************************************************************************************
* MediaQualityRadioGroup
/**********************************************************************************************/

export interface MediaQualityRadioGroupComponent {
  (props: MediaQualityRadioGroupAttributes): MediaQualityRadioGroupElement;
}

export interface MediaQualityRadioGroupAttributes extends Partial<QualityRadioGroupProps>, MediaQualityRadioGroupEventAttributes, Omit<HTMLAttributes, keyof QualityRadioGroupProps | keyof MediaQualityRadioGroupEventAttributes | "is">, Omit<ReservedProps, 'ref'> {
  'keep-alive'?: boolean;
  ref?: ElementRef<MediaQualityRadioGroupElement>;
}

export interface MediaQualityRadioGroupEventAttributes {
  onChange?: EventHandler<QualityRadioGroupEvents['change']>;
}

/**********************************************************************************************
* MediaRadio
/**********************************************************************************************/

export interface MediaRadioComponent {
  (props: MediaRadioAttributes): MediaRadioElement;
}

export interface MediaRadioAttributes extends Partial<RadioProps>, MediaRadioEventAttributes, Omit<HTMLAttributes, keyof RadioProps | keyof MediaRadioEventAttributes | "is">, Omit<ReservedProps, 'ref'> {
  'keep-alive'?: boolean;
  ref?: ElementRef<MediaRadioElement>;
}

export interface MediaRadioEventAttributes {
  onChange?: EventHandler<RadioEvents['change']>;
  onSelect?: EventHandler<RadioEvents['select']>;
}

/**********************************************************************************************
* MediaRadioGroup
/**********************************************************************************************/

export interface MediaRadioGroupComponent {
  (props: MediaRadioGroupAttributes): MediaRadioGroupElement;
}

export interface MediaRadioGroupAttributes extends Partial<RadioGroupProps>, MediaRadioGroupEventAttributes, Omit<HTMLAttributes, keyof RadioGroupProps | keyof MediaRadioGroupEventAttributes | "is">, Omit<ReservedProps, 'ref'> {
  'keep-alive'?: boolean;
  ref?: ElementRef<MediaRadioGroupElement>;
}

export interface MediaRadioGroupEventAttributes {
  onChange?: EventHandler<RadioGroupEvents['change']>;
}

/**********************************************************************************************
* MediaSpeedRadioGroup
/**********************************************************************************************/

export interface MediaSpeedRadioGroupComponent {
  (props: MediaSpeedRadioGroupAttributes): MediaSpeedRadioGroupElement;
}

export interface MediaSpeedRadioGroupAttributes extends Partial<SpeedRadioGroupProps>, MediaSpeedRadioGroupEventAttributes, Omit<HTMLAttributes, keyof SpeedRadioGroupProps | keyof MediaSpeedRadioGroupEventAttributes | "is">, Omit<ReservedProps, 'ref'> {
  'keep-alive'?: boolean;
  ref?: ElementRef<MediaSpeedRadioGroupElement>;
}

export interface MediaSpeedRadioGroupEventAttributes {
  onChange?: EventHandler<SpeedRadioGroupEvents['change']>;
}

/**********************************************************************************************
* MediaPlayer
/**********************************************************************************************/

export interface MediaPlayerComponent {
  (props: MediaPlayerAttributes): MediaPlayerElement;
}

export interface MediaPlayerAttributes extends Partial<MediaPlayerProps>, MediaPlayerEventAttributes, Omit<HTMLAttributes, keyof MediaPlayerProps | keyof MediaPlayerEventAttributes | "is">, Omit<ReservedProps, 'ref'> {
  'keep-alive'?: boolean;
  ref?: ElementRef<MediaPlayerElement>;
}

export interface MediaPlayerEventAttributes {
  onMediaPlayerConnect?: EventHandler<MediaPlayerEvents['media-player-connect']>;
  onFindMediaPlayer?: EventHandler<MediaPlayerEvents['find-media-player']>;
  onVdsFontChange?: EventHandler<MediaPlayerEvents['vds-font-change']>;
  onAudioTracksChange?: EventHandler<MediaPlayerEvents['audio-tracks-change']>;
  onAudioTrackChange?: EventHandler<MediaPlayerEvents['audio-track-change']>;
  onAudioGainChange?: EventHandler<MediaPlayerEvents['audio-gain-change']>;
  onAutoPlayChange?: EventHandler<MediaPlayerEvents['auto-play-change']>;
  onAutoPlayFail?: EventHandler<MediaPlayerEvents['auto-play-fail']>;
  onCanLoad?: EventHandler<MediaPlayerEvents['can-load']>;
  onCanLoadPoster?: EventHandler<MediaPlayerEvents['can-load-poster']>;
  onCanPlayThrough?: EventHandler<MediaPlayerEvents['can-play-through']>;
  onCanPlay?: EventHandler<MediaPlayerEvents['can-play']>;
  onControlsChange?: EventHandler<MediaPlayerEvents['controls-change']>;
  onDurationChange?: EventHandler<MediaPlayerEvents['duration-change']>;
  onFullscreenChange?: EventHandler<MediaPlayerEvents['fullscreen-change']>;
  onFullscreenError?: EventHandler<MediaPlayerEvents['fullscreen-error']>;
  onLiveChange?: EventHandler<MediaPlayerEvents['live-change']>;
  onLiveEdgeChange?: EventHandler<MediaPlayerEvents['live-edge-change']>;
  onLoadStart?: EventHandler<MediaPlayerEvents['load-start']>;
  onLoadedData?: EventHandler<MediaPlayerEvents['loaded-data']>;
  onLoadedMetadata?: EventHandler<MediaPlayerEvents['loaded-metadata']>;
  onLoopChange?: EventHandler<MediaPlayerEvents['loop-change']>;
  onMediaTypeChange?: EventHandler<MediaPlayerEvents['media-type-change']>;
  onOrientationChange?: EventHandler<MediaPlayerEvents['orientation-change']>;
  onPlayFail?: EventHandler<MediaPlayerEvents['play-fail']>;
  onPlaysInlineChange?: EventHandler<MediaPlayerEvents['plays-inline-change']>;
  onPosterChange?: EventHandler<MediaPlayerEvents['poster-change']>;
  onProviderChange?: EventHandler<MediaPlayerEvents['provider-change']>;
  onProviderLoaderChange?: EventHandler<MediaPlayerEvents['provider-loader-change']>;
  onProviderSetup?: EventHandler<MediaPlayerEvents['provider-setup']>;
  onPictureInPictureChange?: EventHandler<MediaPlayerEvents['picture-in-picture-change']>;
  onPictureInPictureError?: EventHandler<MediaPlayerEvents['picture-in-picture-error']>;
  onQualitiesChange?: EventHandler<MediaPlayerEvents['qualities-change']>;
  onQualityChange?: EventHandler<MediaPlayerEvents['quality-change']>;
  onRateChange?: EventHandler<MediaPlayerEvents['rate-change']>;
  onRemotePlaybackChange?: EventHandler<MediaPlayerEvents['remote-playback-change']>;
  onSourceChange?: EventHandler<MediaPlayerEvents['source-change']>;
  onSourcesChange?: EventHandler<MediaPlayerEvents['sources-change']>;
  onTimeChange?: EventHandler<MediaPlayerEvents['time-change']>;
  onTimeUpdate?: EventHandler<MediaPlayerEvents['time-update']>;
  onTitleChange?: EventHandler<MediaPlayerEvents['title-change']>;
  onStreamTypeChange?: EventHandler<MediaPlayerEvents['stream-type-change']>;
  onTextTracksChange?: EventHandler<MediaPlayerEvents['text-tracks-change']>;
  onTextTrackChange?: EventHandler<MediaPlayerEvents['text-track-change']>;
  onViewTypeChange?: EventHandler<MediaPlayerEvents['view-type-change']>;
  onVolumeChange?: EventHandler<MediaPlayerEvents['volume-change']>;
  onAbort?: EventHandler<MediaPlayerEvents['abort']>;
  onAutoPlay?: EventHandler<MediaPlayerEvents['auto-play']>;
  onDestroy?: EventHandler<MediaPlayerEvents['destroy']>;
  onEmptied?: EventHandler<MediaPlayerEvents['emptied']>;
  onEnd?: EventHandler<MediaPlayerEvents['end']>;
  onEnded?: EventHandler<MediaPlayerEvents['ended']>;
  onError?: EventHandler<MediaPlayerEvents['error']>;
  onPause?: EventHandler<MediaPlayerEvents['pause']>;
  onPlay?: EventHandler<MediaPlayerEvents['play']>;
  onPlaying?: EventHandler<MediaPlayerEvents['playing']>;
  onProgress?: EventHandler<MediaPlayerEvents['progress']>;
  onReplay?: EventHandler<MediaPlayerEvents['replay']>;
  onSeeked?: EventHandler<MediaPlayerEvents['seeked']>;
  onSeeking?: EventHandler<MediaPlayerEvents['seeking']>;
  onStalled?: EventHandler<MediaPlayerEvents['stalled']>;
  onStarted?: EventHandler<MediaPlayerEvents['started']>;
  onSuspend?: EventHandler<MediaPlayerEvents['suspend']>;
  onWaiting?: EventHandler<MediaPlayerEvents['waiting']>;
  onMediaAirplayRequest?: EventHandler<MediaPlayerEvents['media-airplay-request']>;
  onMediaAudioTrackChangeRequest?: EventHandler<MediaPlayerEvents['media-audio-track-change-request']>;
  onMediaClipStartChangeRequest?: EventHandler<MediaPlayerEvents['media-clip-start-change-request']>;
  onMediaClipEndChangeRequest?: EventHandler<MediaPlayerEvents['media-clip-end-change-request']>;
  onMediaDurationChangeRequest?: EventHandler<MediaPlayerEvents['media-duration-change-request']>;
  onMediaEnterFullscreenRequest?: EventHandler<MediaPlayerEvents['media-enter-fullscreen-request']>;
  onMediaExitFullscreenRequest?: EventHandler<MediaPlayerEvents['media-exit-fullscreen-request']>;
  onMediaEnterPipRequest?: EventHandler<MediaPlayerEvents['media-enter-pip-request']>;
  onMediaExitPipRequest?: EventHandler<MediaPlayerEvents['media-exit-pip-request']>;
  onMediaGoogleCastRequest?: EventHandler<MediaPlayerEvents['media-google-cast-request']>;
  onMediaLiveEdgeRequest?: EventHandler<MediaPlayerEvents['media-live-edge-request']>;
  onMediaLoopRequest?: EventHandler<MediaPlayerEvents['media-loop-request']>;
  onMediaUserLoopChangeRequest?: EventHandler<MediaPlayerEvents['media-user-loop-change-request']>;
  onMediaOrientationLockRequest?: EventHandler<MediaPlayerEvents['media-orientation-lock-request']>;
  onMediaOrientationUnlockRequest?: EventHandler<MediaPlayerEvents['media-orientation-unlock-request']>;
  onMediaMuteRequest?: EventHandler<MediaPlayerEvents['media-mute-request']>;
  onMediaPauseRequest?: EventHandler<MediaPlayerEvents['media-pause-request']>;
  onMediaPauseControlsRequest?: EventHandler<MediaPlayerEvents['media-pause-controls-request']>;
  onMediaPlayRequest?: EventHandler<MediaPlayerEvents['media-play-request']>;
  onMediaQualityChangeRequest?: EventHandler<MediaPlayerEvents['media-quality-change-request']>;
  onMediaRateChangeRequest?: EventHandler<MediaPlayerEvents['media-rate-change-request']>;
  onMediaAudioGainChangeRequest?: EventHandler<MediaPlayerEvents['media-audio-gain-change-request']>;
  onMediaResumeControlsRequest?: EventHandler<MediaPlayerEvents['media-resume-controls-request']>;
  onMediaSeekRequest?: EventHandler<MediaPlayerEvents['media-seek-request']>;
  onMediaSeekingRequest?: EventHandler<MediaPlayerEvents['media-seeking-request']>;
  onMediaStartLoading?: EventHandler<MediaPlayerEvents['media-start-loading']>;
  onMediaPosterStartLoading?: EventHandler<MediaPlayerEvents['media-poster-start-loading']>;
  onMediaTextTrackChangeRequest?: EventHandler<MediaPlayerEvents['media-text-track-change-request']>;
  onMediaUnmuteRequest?: EventHandler<MediaPlayerEvents['media-unmute-request']>;
  onMediaVolumeChangeRequest?: EventHandler<MediaPlayerEvents['media-volume-change-request']>;
  onVdsLog?: EventHandler<MediaPlayerEvents['vds-log']>;
  onVideoPresentationChange?: EventHandler<MediaPlayerEvents['video-presentation-change']>;
  onHlsLibLoadStart?: EventHandler<MediaPlayerEvents['hls-lib-load-start']>;
  onHlsLibLoaded?: EventHandler<MediaPlayerEvents['hls-lib-loaded']>;
  onHlsLibLoadError?: EventHandler<MediaPlayerEvents['hls-lib-load-error']>;
  onHlsInstance?: EventHandler<MediaPlayerEvents['hls-instance']>;
  onHlsUnsupported?: EventHandler<MediaPlayerEvents['hls-unsupported']>;
  onHlsMediaAttaching?: EventHandler<MediaPlayerEvents['hls-media-attaching']>;
  onHlsMediaAttached?: EventHandler<MediaPlayerEvents['hls-media-attached']>;
  onHlsMediaDetaching?: EventHandler<MediaPlayerEvents['hls-media-detaching']>;
  onHlsMediaDetached?: EventHandler<MediaPlayerEvents['hls-media-detached']>;
  onHlsBufferReset?: EventHandler<MediaPlayerEvents['hls-buffer-reset']>;
  onHlsBufferCodecs?: EventHandler<MediaPlayerEvents['hls-buffer-codecs']>;
  onHlsBufferCreated?: EventHandler<MediaPlayerEvents['hls-buffer-created']>;
  onHlsBufferAppending?: EventHandler<MediaPlayerEvents['hls-buffer-appending']>;
  onHlsBufferAppended?: EventHandler<MediaPlayerEvents['hls-buffer-appended']>;
  onHlsBufferEos?: EventHandler<MediaPlayerEvents['hls-buffer-eos']>;
  onHlsBufferFlushing?: EventHandler<MediaPlayerEvents['hls-buffer-flushing']>;
  onHlsBufferFlushed?: EventHandler<MediaPlayerEvents['hls-buffer-flushed']>;
  onHlsManifestLoading?: EventHandler<MediaPlayerEvents['hls-manifest-loading']>;
  onHlsManifestLoaded?: EventHandler<MediaPlayerEvents['hls-manifest-loaded']>;
  onHlsManifestParsed?: EventHandler<MediaPlayerEvents['hls-manifest-parsed']>;
  onHlsLevelSwitching?: EventHandler<MediaPlayerEvents['hls-level-switching']>;
  onHlsLevelSwitched?: EventHandler<MediaPlayerEvents['hls-level-switched']>;
  onHlsLevelLoading?: EventHandler<MediaPlayerEvents['hls-level-loading']>;
  onHlsLevelLoaded?: EventHandler<MediaPlayerEvents['hls-level-loaded']>;
  onHlsLevelUpdated?: EventHandler<MediaPlayerEvents['hls-level-updated']>;
  onHlsLevelPtsUpdated?: EventHandler<MediaPlayerEvents['hls-level-pts-updated']>;
  onHlsLevelsUpdated?: EventHandler<MediaPlayerEvents['hls-levels-updated']>;
  onHlsAudioTracksUpdated?: EventHandler<MediaPlayerEvents['hls-audio-tracks-updated']>;
  onHlsAudioTrackSwitching?: EventHandler<MediaPlayerEvents['hls-audio-track-switching']>;
  onHlsAudioTrackSwitched?: EventHandler<MediaPlayerEvents['hls-audio-track-switched']>;
  onHlsAudioTrackLoading?: EventHandler<MediaPlayerEvents['hls-audio-track-loading']>;
  onHlsAudioTrackLoaded?: EventHandler<MediaPlayerEvents['hls-audio-track-loaded']>;
  onHlsSubtitleTracksUpdated?: EventHandler<MediaPlayerEvents['hls-subtitle-tracks-updated']>;
  onHlsSubtitleTracksCleared?: EventHandler<MediaPlayerEvents['hls-subtitle-tracks-cleared']>;
  onHlsSubtitleTrackSwitch?: EventHandler<MediaPlayerEvents['hls-subtitle-track-switch']>;
  onHlsSubtitleTrackLoading?: EventHandler<MediaPlayerEvents['hls-subtitle-track-loading']>;
  onHlsSubtitleTrackLoaded?: EventHandler<MediaPlayerEvents['hls-subtitle-track-loaded']>;
  onHlsSubtitleFragProcessed?: EventHandler<MediaPlayerEvents['hls-subtitle-frag-processed']>;
  onHlsCuesParsed?: EventHandler<MediaPlayerEvents['hls-cues-parsed']>;
  onHlsNonNativeTextTracksFound?: EventHandler<MediaPlayerEvents['hls-non-native-text-tracks-found']>;
  onHlsInitPtsFound?: EventHandler<MediaPlayerEvents['hls-init-pts-found']>;
  onHlsFragLoading?: EventHandler<MediaPlayerEvents['hls-frag-loading']>;
  onHlsFragLoadEmergencyAborted?: EventHandler<MediaPlayerEvents['hls-frag-load-emergency-aborted']>;
  onHlsFragLoaded?: EventHandler<MediaPlayerEvents['hls-frag-loaded']>;
  onHlsFragDecrypted?: EventHandler<MediaPlayerEvents['hls-frag-decrypted']>;
  onHlsFragParsingInitSegment?: EventHandler<MediaPlayerEvents['hls-frag-parsing-init-segment']>;
  onHlsFragParsingUserdata?: EventHandler<MediaPlayerEvents['hls-frag-parsing-userdata']>;
  onHlsFragParsingMetadata?: EventHandler<MediaPlayerEvents['hls-frag-parsing-metadata']>;
  onHlsFragParsed?: EventHandler<MediaPlayerEvents['hls-frag-parsed']>;
  onHlsFragBufferedData?: EventHandler<MediaPlayerEvents['hls-frag-buffered-data']>;
  onHlsFragChanged?: EventHandler<MediaPlayerEvents['hls-frag-changed']>;
  onHlsFpsDrop?: EventHandler<MediaPlayerEvents['hls-fps-drop']>;
  onHlsFpsDropLevelCapping?: EventHandler<MediaPlayerEvents['hls-fps-drop-level-capping']>;
  onHlsError?: EventHandler<MediaPlayerEvents['hls-error']>;
  onHlsDestroying?: EventHandler<MediaPlayerEvents['hls-destroying']>;
  onHlsKeyLoading?: EventHandler<MediaPlayerEvents['hls-key-loading']>;
  onHlsKeyLoaded?: EventHandler<MediaPlayerEvents['hls-key-loaded']>;
  onHlsBackBufferReached?: EventHandler<MediaPlayerEvents['hls-back-buffer-reached']>;
  onDashLibLoadStart?: EventHandler<MediaPlayerEvents['dash-lib-load-start']>;
  onDashLibLoaded?: EventHandler<MediaPlayerEvents['dash-lib-loaded']>;
  onDashLibLoadError?: EventHandler<MediaPlayerEvents['dash-lib-load-error']>;
  onDashInstance?: EventHandler<MediaPlayerEvents['dash-instance']>;
  onDashUnsupported?: EventHandler<MediaPlayerEvents['dash-unsupported']>;
  onDashAstInFuture?: EventHandler<MediaPlayerEvents['dash-ast-in-future']>;
  onDashBaseUrlsUpdated?: EventHandler<MediaPlayerEvents['dash-base-urls-updated']>;
  onDashBufferEmpty?: EventHandler<MediaPlayerEvents['dash-buffer-empty']>;
  onDashBufferLoaded?: EventHandler<MediaPlayerEvents['dash-buffer-loaded']>;
  onDashBufferLevelStateChanged?: EventHandler<MediaPlayerEvents['dash-buffer-level-state-changed']>;
  onDashBufferLevelUpdated?: EventHandler<MediaPlayerEvents['dash-buffer-level-updated']>;
  onDashDvbFontDownloadAdded?: EventHandler<MediaPlayerEvents['dash-dvb-font-download-added']>;
  onDashDvbFontDownloadComplete?: EventHandler<MediaPlayerEvents['dash-dvb-font-download-complete']>;
  onDashDvbFontDownloadFailed?: EventHandler<MediaPlayerEvents['dash-dvb-font-download-failed']>;
  onDashDynamicToStatic?: EventHandler<MediaPlayerEvents['dash-dynamic-to-static']>;
  onDashError?: EventHandler<MediaPlayerEvents['dash-error']>;
  onDashFragmentLoadingCompleted?: EventHandler<MediaPlayerEvents['dash-fragment-loading-completed']>;
  onDashFragmentLoadingProgress?: EventHandler<MediaPlayerEvents['dash-fragment-loading-progress']>;
  onDashFragmentLoadingStarted?: EventHandler<MediaPlayerEvents['dash-fragment-loading-started']>;
  onDashFragmentLoadingAbandoned?: EventHandler<MediaPlayerEvents['dash-fragment-loading-abandoned']>;
  onDashLog?: EventHandler<MediaPlayerEvents['dash-log']>;
  onDashManifestLoadingStarted?: EventHandler<MediaPlayerEvents['dash-manifest-loading-started']>;
  onDashManifestLoadingFinished?: EventHandler<MediaPlayerEvents['dash-manifest-loading-finished']>;
  onDashManifestLoaded?: EventHandler<MediaPlayerEvents['dash-manifest-loaded']>;
  onDashMetricsChanged?: EventHandler<MediaPlayerEvents['dash-metrics-changed']>;
  onDashMetricChanged?: EventHandler<MediaPlayerEvents['dash-metric-changed']>;
  onDashMetricAdded?: EventHandler<MediaPlayerEvents['dash-metric-added']>;
  onDashMetricUpdated?: EventHandler<MediaPlayerEvents['dash-metric-updated']>;
  onDashPeriodSwitchStarted?: EventHandler<MediaPlayerEvents['dash-period-switch-started']>;
  onDashPeriodSwitchCompleted?: EventHandler<MediaPlayerEvents['dash-period-switch-completed']>;
  onDashQualityChangeRequested?: EventHandler<MediaPlayerEvents['dash-quality-change-requested']>;
  onDashQualityChangeRendered?: EventHandler<MediaPlayerEvents['dash-quality-change-rendered']>;
  onDashTrackChangeRendered?: EventHandler<MediaPlayerEvents['dash-track-change-rendered']>;
  onDashStreamInitializing?: EventHandler<MediaPlayerEvents['dash-stream-initializing']>;
  onDashStreamUpdated?: EventHandler<MediaPlayerEvents['dash-stream-updated']>;
  onDashStreamActivated?: EventHandler<MediaPlayerEvents['dash-stream-activated']>;
  onDashStreamDeactivated?: EventHandler<MediaPlayerEvents['dash-stream-deactivated']>;
  onDashStreamInitialized?: EventHandler<MediaPlayerEvents['dash-stream-initialized']>;
  onDashStreamTeardownComplete?: EventHandler<MediaPlayerEvents['dash-stream-teardown-complete']>;
  onDashTextTracksAdded?: EventHandler<MediaPlayerEvents['dash-text-tracks-added']>;
  onDashTextTrackAdded?: EventHandler<MediaPlayerEvents['dash-text-track-added']>;
  onDashCueEnter?: EventHandler<MediaPlayerEvents['dash-cue-enter']>;
  onDashCueExit?: EventHandler<MediaPlayerEvents['dash-cue-exit']>;
  onDashThroughputMeasurementStored?: EventHandler<MediaPlayerEvents['dash-throughput-measurement-stored']>;
  onDashTtmlParsed?: EventHandler<MediaPlayerEvents['dash-ttml-parsed']>;
  onDashTtmlToParse?: EventHandler<MediaPlayerEvents['dash-ttml-to-parse']>;
  onDashCaptionRendered?: EventHandler<MediaPlayerEvents['dash-caption-rendered']>;
  onDashCaptionContainerResize?: EventHandler<MediaPlayerEvents['dash-caption-container-resize']>;
  onDashCanPlay?: EventHandler<MediaPlayerEvents['dash-can-play']>;
  onDashCanPlayThrough?: EventHandler<MediaPlayerEvents['dash-can-play-through']>;
  onDashPlaybackEnded?: EventHandler<MediaPlayerEvents['dash-playback-ended']>;
  onDashPlaybackError?: EventHandler<MediaPlayerEvents['dash-playback-error']>;
  onDashPlaybackNotAllowed?: EventHandler<MediaPlayerEvents['dash-playback-not-allowed']>;
  onDashPlaybackMetadataLoaded?: EventHandler<MediaPlayerEvents['dash-playback-metadata-loaded']>;
  onDashPlaybackLoadedData?: EventHandler<MediaPlayerEvents['dash-playback-loaded-data']>;
  onDashPlaybackPaused?: EventHandler<MediaPlayerEvents['dash-playback-paused']>;
  onDashPlaybackPlaying?: EventHandler<MediaPlayerEvents['dash-playback-playing']>;
  onDashPlaybackProgress?: EventHandler<MediaPlayerEvents['dash-playback-progress']>;
  onDashPlaybackRateChanged?: EventHandler<MediaPlayerEvents['dash-playback-rate-changed']>;
  onDashPlaybackSeeked?: EventHandler<MediaPlayerEvents['dash-playback-seeked']>;
  onDashPlaybackSeeking?: EventHandler<MediaPlayerEvents['dash-playback-seeking']>;
  onDashPlaybackStalled?: EventHandler<MediaPlayerEvents['dash-playback-stalled']>;
  onDashPlaybackStarted?: EventHandler<MediaPlayerEvents['dash-playback-started']>;
  onDashPlaybackTimeUpdated?: EventHandler<MediaPlayerEvents['dash-playback-time-updated']>;
  onDashPlaybackVolumeChanged?: EventHandler<MediaPlayerEvents['dash-playback-volume-changed']>;
  onDashPlaybackWaiting?: EventHandler<MediaPlayerEvents['dash-playback-waiting']>;
  onDashManifestValidityChanged?: EventHandler<MediaPlayerEvents['dash-manifest-validity-changed']>;
  onDashEventModeOnStart?: EventHandler<MediaPlayerEvents['dash-event-mode-on-start']>;
  onDashEventModeOnReceive?: EventHandler<MediaPlayerEvents['dash-event-mode-on-receive']>;
  onDashConformanceViolation?: EventHandler<MediaPlayerEvents['dash-conformance-violation']>;
  onDashRepresentationSwitch?: EventHandler<MediaPlayerEvents['dash-representation-switch']>;
  onDashAdaptationSetRemovedNoCapabilities?: EventHandler<MediaPlayerEvents['dash-adaptation-set-removed-no-capabilities']>;
  onDashContentSteeringRequestCompleted?: EventHandler<MediaPlayerEvents['dash-content-steering-request-completed']>;
  onDashInbandPrft?: EventHandler<MediaPlayerEvents['dash-inband-prft']>;
  onDashManagedMediaSourceStartStreaming?: EventHandler<MediaPlayerEvents['dash-managed-media-source-start-streaming']>;
  onDashManagedMediaSourceEndStreaming?: EventHandler<MediaPlayerEvents['dash-managed-media-source-end-streaming']>;
  onGoogleCastLoadStart?: EventHandler<MediaPlayerEvents['google-cast-load-start']>;
  onGoogleCastLoaded?: EventHandler<MediaPlayerEvents['google-cast-loaded']>;
  onGoogleCastPromptOpen?: EventHandler<MediaPlayerEvents['google-cast-prompt-open']>;
  onGoogleCastPromptClose?: EventHandler<MediaPlayerEvents['google-cast-prompt-close']>;
  onGoogleCastPromptError?: EventHandler<MediaPlayerEvents['google-cast-prompt-error']>;
}

/**********************************************************************************************
* MediaPoster
/**********************************************************************************************/

export interface MediaPosterComponent {
  (props: MediaPosterAttributes): MediaPosterElement;
}

export interface MediaPosterAttributes extends Partial<PosterProps>, Omit<HTMLAttributes, keyof PosterProps | "is">, Omit<ReservedProps, 'ref'> {
  'keep-alive'?: boolean;
  ref?: ElementRef<MediaPosterElement>;
}


/**********************************************************************************************
* MediaProvider
/**********************************************************************************************/

export interface MediaProviderComponent {
  (props: MediaProviderAttributes): MediaProviderElement;
}

export interface MediaProviderAttributes extends Partial<MediaProviderProps>, Omit<HTMLAttributes, keyof MediaProviderProps | "is">, Omit<ReservedProps, 'ref'> {
  'keep-alive'?: boolean;
  ref?: ElementRef<MediaProviderElement>;
}


/**********************************************************************************************
* MediaAudioGainSlider
/**********************************************************************************************/

export interface MediaAudioGainSliderComponent {
  (props: MediaAudioGainSliderAttributes): MediaAudioGainSliderElement;
}

export interface MediaAudioGainSliderAttributes extends Partial<AudioGainSliderProps>, MediaAudioGainSliderEventAttributes, Omit<HTMLAttributes, keyof AudioGainSliderProps | keyof MediaAudioGainSliderEventAttributes | "is">, Omit<ReservedProps, 'ref'> {
  'keep-alive'?: boolean;
  ref?: ElementRef<MediaAudioGainSliderElement>;
}

export interface MediaAudioGainSliderEventAttributes {
  onDragStart?: EventHandler<AudioGainSliderEvents['drag-start']>;
  onDragEnd?: EventHandler<AudioGainSliderEvents['drag-end']>;
  onValueChange?: EventHandler<AudioGainSliderEvents['value-change']>;
  onDragValueChange?: EventHandler<AudioGainSliderEvents['drag-value-change']>;
  onPointerValueChange?: EventHandler<AudioGainSliderEvents['pointer-value-change']>;
  onMediaAudioGainChangeRequest?: EventHandler<AudioGainSliderEvents['media-audio-gain-change-request']>;
}

/**********************************************************************************************
* MediaQualitySlider
/**********************************************************************************************/

export interface MediaQualitySliderComponent {
  (props: MediaQualitySliderAttributes): MediaQualitySliderElement;
}

export interface MediaQualitySliderAttributes extends Partial<QualitySliderProps>, MediaQualitySliderEventAttributes, Omit<HTMLAttributes, keyof QualitySliderProps | keyof MediaQualitySliderEventAttributes | "is">, Omit<ReservedProps, 'ref'> {
  'keep-alive'?: boolean;
  ref?: ElementRef<MediaQualitySliderElement>;
}

export interface MediaQualitySliderEventAttributes {
  onDragStart?: EventHandler<QualitySliderEvents['drag-start']>;
  onDragEnd?: EventHandler<QualitySliderEvents['drag-end']>;
  onValueChange?: EventHandler<QualitySliderEvents['value-change']>;
  onDragValueChange?: EventHandler<QualitySliderEvents['drag-value-change']>;
  onPointerValueChange?: EventHandler<QualitySliderEvents['pointer-value-change']>;
  onMediaQualityChangeRequest?: EventHandler<QualitySliderEvents['media-quality-change-request']>;
}

/**********************************************************************************************
* MediaSliderChapters
/**********************************************************************************************/

export interface MediaSliderChaptersComponent {
  (props: MediaSliderChaptersAttributes): MediaSliderChaptersElement;
}

export interface MediaSliderChaptersAttributes extends Partial<SliderChaptersProps>, MediaSliderChaptersEventAttributes, Omit<HTMLAttributes, keyof SliderChaptersProps | keyof MediaSliderChaptersEventAttributes | "is">, Omit<ReservedProps, 'ref'> {
  'keep-alive'?: boolean;
  ref?: ElementRef<MediaSliderChaptersElement>;
}

export interface MediaSliderChaptersEventAttributes {
  onChapterFill?: EventHandler<SliderChaptersCSSVars['chapter-fill']>;
  onChapterProgress?: EventHandler<SliderChaptersCSSVars['chapter-progress']>;
}

/**********************************************************************************************
* MediaSlider
/**********************************************************************************************/

export interface MediaSliderComponent {
  (props: MediaSliderAttributes): MediaSliderElement;
}

export interface MediaSliderAttributes extends Partial<SliderProps>, MediaSliderEventAttributes, Omit<HTMLAttributes, keyof SliderProps | keyof MediaSliderEventAttributes | "is">, Omit<ReservedProps, 'ref'> {
  'keep-alive'?: boolean;
  ref?: ElementRef<MediaSliderElement>;
}

export interface MediaSliderEventAttributes {
  onDragStart?: EventHandler<SliderEvents['drag-start']>;
  onDragEnd?: EventHandler<SliderEvents['drag-end']>;
  onValueChange?: EventHandler<SliderEvents['value-change']>;
  onDragValueChange?: EventHandler<SliderEvents['drag-value-change']>;
  onPointerValueChange?: EventHandler<SliderEvents['pointer-value-change']>;
}

/**********************************************************************************************
* MediaSliderPreview
/**********************************************************************************************/

export interface MediaSliderPreviewComponent {
  (props: MediaSliderPreviewAttributes): MediaSliderPreviewElement;
}

export interface MediaSliderPreviewAttributes extends Partial<SliderPreviewProps>, Omit<HTMLAttributes, keyof SliderPreviewProps | "is">, Omit<ReservedProps, 'ref'> {
  'keep-alive'?: boolean;
  ref?: ElementRef<MediaSliderPreviewElement>;
}


/**********************************************************************************************
* MediaSliderSteps
/**********************************************************************************************/

export interface MediaSliderStepsComponent {
  (props: MediaSliderStepsAttributes): MediaSliderStepsElement;
}

export interface MediaSliderStepsAttributes extends Omit<HTMLAttributes, "is">, Omit<ReservedProps, 'ref'> {
  'keep-alive'?: boolean;
  ref?: ElementRef<MediaSliderStepsElement>;
}


/**********************************************************************************************
* MediaSliderThumbnail
/**********************************************************************************************/

export interface MediaSliderThumbnailComponent {
  (props: MediaSliderThumbnailAttributes): MediaSliderThumbnailElement;
}

export interface MediaSliderThumbnailAttributes extends Partial<ThumbnailProps>, Omit<HTMLAttributes, keyof ThumbnailProps | "is">, Omit<ReservedProps, 'ref'> {
  'keep-alive'?: boolean;
  ref?: ElementRef<MediaSliderThumbnailElement>;
}


/**********************************************************************************************
* MediaSliderValue
/**********************************************************************************************/

export interface MediaSliderValueComponent {
  (props: MediaSliderValueAttributes): MediaSliderValueElement;
}

export interface MediaSliderValueAttributes extends Partial<SliderValueProps>, Omit<HTMLAttributes, keyof SliderValueProps | "is">, Omit<ReservedProps, 'ref'> {
  'keep-alive'?: boolean;
  ref?: ElementRef<MediaSliderValueElement>;
}


/**********************************************************************************************
* MediaSliderVideo
/**********************************************************************************************/

export interface MediaSliderVideoComponent {
  (props: MediaSliderVideoAttributes): MediaSliderVideoElement;
}

export interface MediaSliderVideoAttributes extends Partial<SliderVideoProps>, MediaSliderVideoEventAttributes, Omit<HTMLAttributes, keyof SliderVideoProps | keyof MediaSliderVideoEventAttributes | "is">, Omit<ReservedProps, 'ref'> {
  'keep-alive'?: boolean;
  ref?: ElementRef<MediaSliderVideoElement>;
}

export interface MediaSliderVideoEventAttributes {
  onCanPlay?: EventHandler<SliderVideoEvents['can-play']>;
  onError?: EventHandler<SliderVideoEvents['error']>;
}

/**********************************************************************************************
* MediaSpeedSlider
/**********************************************************************************************/

export interface MediaSpeedSliderComponent {
  (props: MediaSpeedSliderAttributes): MediaSpeedSliderElement;
}

export interface MediaSpeedSliderAttributes extends Partial<SpeedSliderProps>, MediaSpeedSliderEventAttributes, Omit<HTMLAttributes, keyof SpeedSliderProps | keyof MediaSpeedSliderEventAttributes | "is">, Omit<ReservedProps, 'ref'> {
  'keep-alive'?: boolean;
  ref?: ElementRef<MediaSpeedSliderElement>;
}

export interface MediaSpeedSliderEventAttributes {
  onDragStart?: EventHandler<SpeedSliderEvents['drag-start']>;
  onDragEnd?: EventHandler<SpeedSliderEvents['drag-end']>;
  onValueChange?: EventHandler<SpeedSliderEvents['value-change']>;
  onDragValueChange?: EventHandler<SpeedSliderEvents['drag-value-change']>;
  onPointerValueChange?: EventHandler<SpeedSliderEvents['pointer-value-change']>;
  onMediaRateChangeRequest?: EventHandler<SpeedSliderEvents['media-rate-change-request']>;
}

/**********************************************************************************************
* MediaTimeSlider
/**********************************************************************************************/

export interface MediaTimeSliderComponent {
  (props: MediaTimeSliderAttributes): MediaTimeSliderElement;
}

export interface MediaTimeSliderAttributes extends Partial<TimeSliderProps>, MediaTimeSliderEventAttributes, Omit<HTMLAttributes, keyof TimeSliderProps | keyof MediaTimeSliderEventAttributes | "is">, Omit<ReservedProps, 'ref'> {
  'keep-alive'?: boolean;
  ref?: ElementRef<MediaTimeSliderElement>;
}

export interface MediaTimeSliderEventAttributes {
  onDragStart?: EventHandler<TimeSliderEvents['drag-start']>;
  onDragEnd?: EventHandler<TimeSliderEvents['drag-end']>;
  onValueChange?: EventHandler<TimeSliderEvents['value-change']>;
  onDragValueChange?: EventHandler<TimeSliderEvents['drag-value-change']>;
  onPointerValueChange?: EventHandler<TimeSliderEvents['pointer-value-change']>;
  onMediaLiveEdgeRequest?: EventHandler<TimeSliderEvents['media-live-edge-request']>;
  onMediaPlayRequest?: EventHandler<TimeSliderEvents['media-play-request']>;
  onMediaPauseRequest?: EventHandler<TimeSliderEvents['media-pause-request']>;
  onMediaSeekRequest?: EventHandler<TimeSliderEvents['media-seek-request']>;
  onMediaSeekingRequest?: EventHandler<TimeSliderEvents['media-seeking-request']>;
}

/**********************************************************************************************
* MediaVolumeSlider
/**********************************************************************************************/

export interface MediaVolumeSliderComponent {
  (props: MediaVolumeSliderAttributes): MediaVolumeSliderElement;
}

export interface MediaVolumeSliderAttributes extends Partial<VolumeSliderProps>, MediaVolumeSliderEventAttributes, Omit<HTMLAttributes, keyof VolumeSliderProps | keyof MediaVolumeSliderEventAttributes | "is">, Omit<ReservedProps, 'ref'> {
  'keep-alive'?: boolean;
  ref?: ElementRef<MediaVolumeSliderElement>;
}

export interface MediaVolumeSliderEventAttributes {
  onDragStart?: EventHandler<VolumeSliderEvents['drag-start']>;
  onDragEnd?: EventHandler<VolumeSliderEvents['drag-end']>;
  onValueChange?: EventHandler<VolumeSliderEvents['value-change']>;
  onDragValueChange?: EventHandler<VolumeSliderEvents['drag-value-change']>;
  onPointerValueChange?: EventHandler<VolumeSliderEvents['pointer-value-change']>;
  onMediaVolumeChangeRequest?: EventHandler<VolumeSliderEvents['media-volume-change-request']>;
}

/**********************************************************************************************
* MediaSpinner
/**********************************************************************************************/

export interface MediaSpinnerComponent {
  (props: MediaSpinnerAttributes): MediaSpinnerElement;
}

export interface MediaSpinnerAttributes extends Partial<SpinnerProps>, Omit<HTMLAttributes, keyof SpinnerProps | "is">, Omit<ReservedProps, 'ref'> {
  'keep-alive'?: boolean;
  ref?: ElementRef<MediaSpinnerElement>;
}


/**********************************************************************************************
* MediaThumbnail
/**********************************************************************************************/

export interface MediaThumbnailComponent {
  (props: MediaThumbnailAttributes): MediaThumbnailElement;
}

export interface MediaThumbnailAttributes extends Partial<ThumbnailProps>, Omit<HTMLAttributes, keyof ThumbnailProps | "is">, Omit<ReservedProps, 'ref'> {
  'keep-alive'?: boolean;
  ref?: ElementRef<MediaThumbnailElement>;
}


/**********************************************************************************************
* MediaTime
/**********************************************************************************************/

export interface MediaTimeComponent {
  (props: MediaTimeAttributes): MediaTimeElement;
}

export interface MediaTimeAttributes extends Partial<TimeProps>, Omit<HTMLAttributes, keyof TimeProps | "is">, Omit<ReservedProps, 'ref'> {
  'keep-alive'?: boolean;
  ref?: ElementRef<MediaTimeElement>;
}


/**********************************************************************************************
* MediaTitle
/**********************************************************************************************/

export interface MediaTitleComponent {
  (props: MediaTitleAttributes): MediaTitleElement;
}

export interface MediaTitleAttributes extends Omit<HTMLAttributes, "is">, Omit<ReservedProps, 'ref'> {
  'keep-alive'?: boolean;
  ref?: ElementRef<MediaTitleElement>;
}


/**********************************************************************************************
* MediaTooltipContent
/**********************************************************************************************/

export interface MediaTooltipContentComponent {
  (props: MediaTooltipContentAttributes): MediaTooltipContentElement;
}

export interface MediaTooltipContentAttributes extends Partial<TooltipContentProps>, Omit<HTMLAttributes, keyof TooltipContentProps | "is">, Omit<ReservedProps, 'ref'> {
  'keep-alive'?: boolean;
  ref?: ElementRef<MediaTooltipContentElement>;
}


/**********************************************************************************************
* MediaTooltip
/**********************************************************************************************/

export interface MediaTooltipComponent {
  (props: MediaTooltipAttributes): MediaTooltipElement;
}

export interface MediaTooltipAttributes extends Partial<TooltipProps>, Omit<HTMLAttributes, keyof TooltipProps | "is">, Omit<ReservedProps, 'ref'> {
  'keep-alive'?: boolean;
  ref?: ElementRef<MediaTooltipElement>;
}


/**********************************************************************************************
* MediaTooltipTrigger
/**********************************************************************************************/

export interface MediaTooltipTriggerComponent {
  (props: MediaTooltipTriggerAttributes): MediaTooltipTriggerElement;
}

export interface MediaTooltipTriggerAttributes extends Omit<HTMLAttributes, "is">, Omit<ReservedProps, 'ref'> {
  'keep-alive'?: boolean;
  ref?: ElementRef<MediaTooltipTriggerElement>;
}

