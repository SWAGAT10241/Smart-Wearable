import { Cpu, Power, Trash2, Edit2, Check, X } from "lucide-react";
import { useState } from "react";
import { formatTimeAgo } from "../../utils/formatters";

export function DeviceCard({
  device,
  isSelected,
  onSelect,
  onRename,
  onToggleStatus,
  onRemove,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(device.deviceName || "");
  const [saving, setSaving] = useState(false);

  const handleSaveName = async (e) => {
    e.stopPropagation();
    if (!newName.trim() || newName.trim() === device.deviceName) {
      setIsEditing(false);
      return;
    }
    setSaving(true);
    try {
      await onRename?.(device.deviceId, newName.trim());
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to rename device:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = (e) => {
    e.stopPropagation();
    setNewName(device.deviceName || "");
    setIsEditing(false);
  };

  const isActive = device.status === "active";

  return (
    <div
      onClick={() => onSelect?.(device.deviceId)}
      className={`p-5 rounded-2xl border transition-all cursor-pointer relative ${
        isSelected
          ? "bg-slate-900 border-emerald-500/50 shadow-lg shadow-emerald-500/5 ring-1 ring-emerald-500/30"
          : "bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80"
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`p-2.5 rounded-xl shrink-0 ${
              isActive
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-slate-800 text-slate-500"
            }`}
          >
            <Cpu className="w-5 h-5" />
          </div>

          <div className="min-w-0">
            {isEditing ? (
              <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  maxLength={50}
                  className="bg-slate-950 border border-slate-700 rounded px-2 py-0.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  autoFocus
                />
                <button
                  disabled={saving}
                  onClick={handleSaveName}
                  className="p-1 hover:bg-emerald-500/20 text-emerald-400 rounded"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="p-1 hover:bg-slate-700 text-slate-400 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-white truncate text-base">
                  {device.deviceName || "TrailGuard Wearable"}
                </h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                  }}
                  className="p-1 text-slate-500 hover:text-slate-300 transition-colors rounded"
                  title="Rename device"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            <p className="text-xs font-mono text-slate-400 truncate mt-0.5">
              ID: {device.deviceId}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onToggleStatus?.(device.deviceId, isActive ? "inactive" : "active")}
            className={`p-2 rounded-lg transition-colors ${
              isActive
                ? "text-emerald-400 hover:bg-emerald-500/15"
                : "text-slate-500 hover:bg-slate-800"
            }`}
            title={isActive ? "Deactivate device" : "Activate device"}
          >
            <Power className="w-4 h-4" />
          </button>
          <button
            onClick={() => onRemove?.(device.deviceId)}
            className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            title="Unpair device"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-800/80">
        <span className="flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full ${
              isActive ? "bg-emerald-500 animate-pulse" : "bg-slate-600"
            }`}
          />
          {isActive ? "Active Monitoring" : "Inactive"}
        </span>
        <span>Last seen: {formatTimeAgo(device.lastSeen)}</span>
      </div>
    </div>
  );
}

export default DeviceCard;

