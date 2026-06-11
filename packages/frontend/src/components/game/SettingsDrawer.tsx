import { Drawer, Switch, Button } from '@dmh/ui';
import { useSettings } from '../../store/settingsStore';

/** Top drawer: sound / vibration toggles + a button to open the rules. */
export function SettingsDrawer({
  open,
  onClose,
  onRules,
}: {
  open: boolean;
  onClose: () => void;
  onRules: () => void;
}) {
  const sound = useSettings((s) => s.sound);
  const vibration = useSettings((s) => s.vibration);
  const setSound = useSettings((s) => s.setSound);
  const setVibration = useSettings((s) => s.setVibration);

  return (
    <Drawer open={open} onClose={onClose} side="top" title="Настройки">
      <div className="dm-settings">
        <div className="dm-set-row">
          <span>Звук</span>
          <Switch checked={sound} onChange={setSound} />
        </div>
        <div className="dm-set-row">
          <span>Вибрация</span>
          <Switch checked={vibration} onChange={setVibration} />
        </div>
        <Button block variant="ghost" onClick={onRules}>
          Правила игры
        </Button>
      </div>
    </Drawer>
  );
}
