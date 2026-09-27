import React, { useCallback, useId, useRef } from 'react';
import MediaService from 'types/MediaService';
import { isSourceVisible, setHiddenSources } from 'services/mediaServices/servicesSettings';
import appleSettings from 'services/apple/appleSettings';
import DialogButtons from 'components/Dialog/DialogButtons';
import DisconnectButton from './DisconnectButton';
import './MediaServiceSettingsGeneral.scss';

export interface MediaServiceSettingsGeneralProps {
    service: MediaService;
    enableDisconnect?: boolean;
}

export default function MediaServiceSettingsGeneral({
    service,
    enableDisconnect,
}: MediaServiceSettingsGeneralProps) {
    const id = useId();
    const ref = useRef<HTMLFieldSetElement>(null);
    const GeneralSettings = service.Components?.GeneralSettings;

    const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
        const form = e.currentTarget;
        if (ref.current) {
            const inputs = ref.current.elements as HTMLInputElements;
            const settings: Record<string, boolean> = {};
            for (const input of inputs) {
                settings[input.value] = !input.checked;
            }
            setHiddenSources(settings);
        }

        const skipRadioInput = form.elements.namedItem('apple-skip-radio') as HTMLInputElement | null;
        if (skipRadioInput) {
            appleSettings.skipRadioWithMediaButtons = skipRadioInput.checked;
        }
    }, []);

    return (
        <form className="media-service-settings-general" method="dialog" onSubmit={handleSubmit}>
            {service.noAuth || !enableDisconnect ? null : <DisconnectButton service={service} />}
            {enableDisconnect && GeneralSettings ? <GeneralSettings service={service} /> : null}
            <fieldset ref={ref}>
                <legend>Display</legend>
                <ul className="checkbox-list">
                    {service.sources?.map((source) => (
                        <li key={source.id}>
                            <input
                                id={`${id}-${source.id}`}
                                type="checkbox"
                                value={source.id}
                                defaultChecked={isSourceVisible(source)}
                                disabled={source.disabled}
                            />
                            <label htmlFor={`${id}-${source.id}`}>{source.title}</label>
                        </li>
                    ))}
                </ul>
            </fieldset>
            <DialogButtons />
        </form>
    );
}
