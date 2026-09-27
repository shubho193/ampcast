import React, { useId } from 'react';
import appleSettings from '../appleSettings';

export default function AppleGeneralSettings() {
    const id = useId();

    return (
        <fieldset className="apple-general-settings">
            <legend>Radio stations</legend>
            <p>
                <input
                    type="checkbox"
                    id={`${id}-skip-radio`}
                    name="apple-skip-radio"
                    defaultChecked={appleSettings.skipRadioWithMediaButtons}
                />
                <label htmlFor={`${id}-skip-radio`}>
                    Use previous and next buttons to skip radio tracks
                </label>
                <small>Allows the main playback buttons and media keys to switch songs on radio stations.</small>
            </p>
        </fieldset>
    );
}
