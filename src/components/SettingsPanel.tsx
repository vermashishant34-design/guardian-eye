import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Settings, Volume2, VolumeX, Eye, Camera } from "lucide-react";
import type { AppSettings } from "@/types/detection";

interface Props {
  settings: AppSettings;
  onChange: (s: AppSettings) => void;
}

export default function SettingsPanel({ settings, onChange }: Props) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-5">
      <div className="flex items-center gap-2">
        <Settings className="h-4 w-4 text-primary" />
        <h3 className="font-semibold text-sm">Settings</h3>
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">
          Detection Sensitivity: {settings.sensitivity}
        </Label>
        <Slider
          value={[settings.sensitivity]}
          min={1}
          max={5}
          step={1}
          onValueChange={([v]) =>
            onChange({ ...settings, sensitivity: v })
          }
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {settings.soundEnabled ? (
            <Volume2 className="h-4 w-4 text-primary" />
          ) : (
            <VolumeX className="h-4 w-4 text-muted-foreground" />
          )}
          <Label className="text-xs">Sound Alerts</Label>
        </div>
        <Switch
          checked={settings.soundEnabled}
          onCheckedChange={(v) =>
            onChange({ ...settings, soundEnabled: v })
          }
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-primary" />
          <Label className="text-xs">Privacy Mode</Label>
        </div>
        <Switch
          checked={settings.privacyMode}
          onCheckedChange={(v) =>
            onChange({ ...settings, privacyMode: v })
          }
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Camera className="h-4 w-4 text-primary" />
          <Label className="text-xs">Auto Screenshot</Label>
        </div>
        <Switch
          checked={settings.autoScreenshot}
          onCheckedChange={(v) =>
            onChange({ ...settings, autoScreenshot: v })
          }
        />
      </div>
    </div>
  );
}
