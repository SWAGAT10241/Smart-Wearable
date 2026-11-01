import { useEffect, useState } from "react";
import Field from "../auth/Field";
import Button from "../auth/Button";

export default function DeviceCard({
  device,
  selected,
  onSelect,
  onRename,
  onStatusChange,
  onRemove,
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(device.deviceName || device.name || "TrailGuard Wearable");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setName(device.deviceName || device.name || "TrailGuard Wearable");
  }, [device.deviceName, device.name]);

  const deviceName = device.deviceName || device.name || "TrailGuard Wearable";
  const isActive = device.status === "active";

  const saveName = async () => {
    const value = name.trim();
    if (!value) return;
    setBusy(true);
    try {
      await onRename(device.deviceId, value);
      setEditing(false);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className={`rounded-2xl border p-4 transition ${
        selected
          ? "border-teal-400/60 bg-teal-400/5 shadow-sm"
          : "border-[var(--color-border)] bg-[var(--color-surface-alt)]"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          {editing ? (
            <div className="space-y-3">
              <Field
                label="Device name"
                name="deviceName"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <div className="flex gap-2">
                <Button onClick={saveName} disabled={busy || !name.trim()}>
                  {busy ? "Saving…" : "Save"}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setName(deviceName);
                    setEditing(false);
                  }}
                  disabled={busy}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <h4 className="truncate text-base font-semibold text-[var(--color-text)]">
                  {deviceName}
                </h4>

                {selected && (
                  <span className="rounded-full border border-teal-400/20 bg-teal-400/10 px-2 py-0.5 text-[9px] font-bold uppercase text-teal-400">
                    Selected
                  </span>
                )}
              </div>

              <p className="mt-1 font-mono text-xs text-[var(--color-text-muted)]">
                {device.deviceId}
              </p>
            </>
          )}
        </div>

        {!editing && (
          <span
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
              isActive
                ? "bg-emerald-400/10 text-emerald-400"
                : "bg-[var(--color-surface)] text-[var(--color-text-muted)]"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isActive ? "bg-emerald-400" : "bg-slate-400"
              }`}
            />
            {isActive ? "Active" : "Inactive"}
          </span>
        )}
      </div>

      {!editing && (
        <div className="mt-4 flex flex-wrap gap-2">
          {isActive && !selected && (
            <Button
              variant="secondary"
              className="!h-11 !w-auto px-5"
              onClick={() => onSelect(device.deviceId)}
            >
              Select
            </Button>
          )}

          <Button
            variant="secondary"
            className="!h-11 !w-auto px-5"
            onClick={() => setEditing(true)}
          >
            Rename
          </Button>

          <Button
            variant="secondary"
            className="!h-11 !w-auto px-5"
            onClick={() => onStatusChange(device.deviceId, device.status)}
          >
            {isActive ? "Deactivate" : "Activate"}
          </Button>

          {onRemove && (
            <Button
              variant="ghost"
              className="!h-11 !w-auto px-5"
              onClick={() => onRemove(device.deviceId)}
            >
              Unpair
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
