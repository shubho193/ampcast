import React, { useCallback } from 'react';
import { clamp } from 'utils';
import { MAX_DURATION } from 'services/constants';
import appleSettings, { observeSkipRadioWithMediaButtons } from 'services/apple/appleSettings';
import mediaPlayback, { pause, play, stop } from 'services/mediaPlayback';
import mediaPlayer from 'services/mediaPlayback/mediaPlayer';
import { observeCurrentIndex, observeCurrentItem, observeSize } from 'services/playlist';
import { IconButton } from 'components/Button';
import useObservable from 'hooks/useObservable';
import usePaused from 'hooks/usePaused';
import usePlaybackState from 'hooks/usePlaybackState';
import MediaButton from './MediaButton';
import { MediaControlsProps } from './MediaControls';

const observeCanSkipNext = () => mediaPlayer.observeCanSkipNext();
const observeCanSkipPrev = () => mediaPlayer.observeCanSkipPrev();

export default function MediaButtons({ overlay, playlistRef }: MediaControlsProps) {
    const Button = overlay ? IconButton : MediaButton;
    const currentIndex = useObservable(observeCurrentIndex, -1);
    const currentItem = useObservable(observeCurrentItem, null);
    const size = useObservable(observeSize, 0);
    const { duration } = usePlaybackState();
    const paused = usePaused();
    const isInfiniteStream = duration === MAX_DURATION;
    const unpausable = currentItem?.isLivePlayback || isInfiniteStream;
    const tabIndex = overlay ? -1 : undefined;

    const skipRadioWithMediaButtons = useObservable(
        observeSkipRadioWithMediaButtons,
        appleSettings.skipRadioWithMediaButtons
    );
    const canSkipNext = useObservable(observeCanSkipNext, false);
    const canSkipPrev = useObservable(observeCanSkipPrev, false);

    const isAppleRadioSkipping = Boolean(
        skipRadioWithMediaButtons &&
        currentItem?.apple &&
        currentItem?.skippable &&
        !currentItem?.isLivePlayback
    );

    const handlePrevClick = useCallback(async () => {
        if (!isAppleRadioSkipping) {
            const playlist = playlistRef?.current;
            const index = clamp(0, currentIndex - 1, size - 1);
            playlist?.scrollIntoView(index);
            playlist?.focus();
        }
        mediaPlayback.prev();
    }, [playlistRef, currentIndex, size, isAppleRadioSkipping]);

    const handleNextClick = useCallback(async () => {
        if (!isAppleRadioSkipping) {
            const playlist = playlistRef?.current;
            const index = clamp(0, currentIndex + 1, size - 1);
            playlist?.scrollIntoView(index);
            playlist?.focus();
        }
        mediaPlayback.next();
    }, [playlistRef, currentIndex, size, isAppleRadioSkipping]);

    return (
        <>
            <Button
                aria-label={isAppleRadioSkipping ? 'Previous radio track' : 'Previous track'}
                title={isAppleRadioSkipping ? 'Previous radio track' : undefined}
                icon="prev"
                tabIndex={tabIndex}
                onClick={handlePrevClick}
                disabled={isAppleRadioSkipping ? !canSkipPrev : undefined}
            />
            <Button
                aria-label={paused ? 'Play' : 'Pause'}
                icon={paused ? 'play' : 'pause'}
                tabIndex={tabIndex}
                onClick={paused ? play : pause}
                disabled={unpausable && !paused}
            />
            <Button aria-label="Stop" icon="stop" tabIndex={tabIndex} onClick={stop} />
            <Button
                aria-label={isAppleRadioSkipping ? 'Next radio track' : 'Next track'}
                title={isAppleRadioSkipping ? 'Next radio track' : undefined}
                icon="next"
                tabIndex={tabIndex}
                onClick={handleNextClick}
                disabled={isAppleRadioSkipping ? !canSkipNext : undefined}
            />
        </>
    );
}
